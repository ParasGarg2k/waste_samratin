from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from fastapi.responses import JSONResponse
from pydantic import BaseModel
import cv2
import numpy as np
from bson.binary import Binary
from pymongo import MongoClient
import whisper
import tempfile
import os
from typing import Dict, Any, Optional
from parse_comment import parse_comment
from urllib.parse import quote_plus
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

app = FastAPI(
    title="Waste Samaritan Video Processing API",
    description="API for processing waste collection videos and extracting waste category data",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",  # The origin of your frontend app
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class RFIDRequest(BaseModel):
    rfid: str
    model_size: Optional[str] = "base"

class ProcessingResult(BaseModel):
    status: str
    rfid: str
    processing_results: Dict[str, Any]
    warnings: Optional[list] = None

# MongoDB configuration
MONGODB_USERNAME = "jpmc25"
MONGODB_PASSWORD = "jpmc25"
MONGODB_CLUSTER = "demo.vy7ku.mongodb.net"
MONGODB_AUTH_SOURCE = "admin"
MONGODB_AUTH_MECHANISM = "SCRAM-SHA-1"

def get_mongo_client():
    """Create and return a MongoDB client with proper configuration"""
    username = quote_plus(MONGODB_USERNAME)
    password = quote_plus(MONGODB_PASSWORD)
    
    connection_string = (
        f"mongodb+srv://{username}:{password}@{MONGODB_CLUSTER}/"
        f"?retryWrites=true&w=majority"
        f"&authSource={MONGODB_AUTH_SOURCE}"
        f"&authMechanism={MONGODB_AUTH_MECHANISM}"
    )
    
    return MongoClient(
        connection_string,
        serverSelectionTimeoutMS=5000,
        socketTimeoutMS=30000,
        connectTimeoutMS=10000
    )

@app.post("/api/upload-video", response_model=ProcessingResult)
async def process_video(request: RFIDRequest):
    """
    Process video from MongoDB by RFID, including transcription and frame capture
    """
    try:
        # Process the video by fetching from DB and analyzing
        results = await process_video_by_rfid(request.rfid, request.model_size)
        
        # Check for specific errors returned from the processing function
        if results.get("error"):
            error_detail = results["error"]
            status_code = status.HTTP_404_NOT_FOUND if "not found" in error_detail.lower() else status.HTTP_500_INTERNAL_SERVER_ERROR
            raise HTTPException(
                status_code=status_code,
                detail=error_detail
            )
        
        # Update waste details in MongoDB with the new results
        update_success = await update_waste_details(request.rfid, results)
        if not update_success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update waste details in the database"
            )
        
        # Prepare a clean response, removing binary data
        response_results = {
            category: {k: v for k, v in info.items() if k != 'frame_captured'}
            for category, info in results.items()
            if isinstance(info, dict)
        }

        return ProcessingResult(
            status="success",
            rfid=request.rfid,
            processing_results=response_results,
            warnings=results.get("warnings")
        )
        
    except ConnectionFailure:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not connect to the database. Please check the connection."
        )
    except HTTPException as http_exc:
        # Re-raise known HTTP exceptions to let FastAPI handle them
        raise http_exc
    except Exception as e:
        # Catch any other unexpected errors and return a detailed JSON response
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": f"An unexpected error occurred during video processing: {str(e)}"}
        )
    
async def process_video_by_rfid(rfid: str, model_size: str = "base") -> Dict[str, Any]:
    """
    Core video processing function
    """
    client = None
    temp_video_path = None
    cap = None
    
    try:
        # Initialize MongoDB connection
        client = get_mongo_client()
        client.admin.command('ping')  # Test connection
        
        db = client['waste_samaritan']
        collection = db['collector_data']
        
        # Ensure FFmpeg is in PATH
        os.environ["PATH"] += os.pathsep + "C:\\ffmpeg\\bin"
        
        # Load Whisper model
        print(f"Loading Whisper {model_size} model...")
        model = whisper.load_model(model_size)
        print("Model loaded successfully")
        
        # Get video from MongoDB
        video_doc = collection.find_one({'rfid': rfid})
        if not video_doc:
            return {"error": f"Video with RFID {rfid} not found in MongoDB"}
        
        # Create temp video file
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_video:
            temp_video_path = temp_video.name
            temp_video.write(video_doc['data'])
        
        # Transcribe audio
        print(f"\nProcessing video for RFID: {rfid}")
        words = []
        result = model.transcribe(
            temp_video_path,
            task="translate",
            word_timestamps=True,
            language=None
        )
        
        for segment in result["segments"]:
            for word in segment.get("words", []):
                words.append({
                    "start": word["start"],
                    "end": word["end"],
                    "word": word["word"].strip(),
                    "language": result["language"],
                    "confidence": word.get("probability", 0)
                })
        
        # Format transcript
        transcript = [(w["start"], w["end"], w["word"]) for w in words]
        
        # Parse comments to get frame capture data
        data = parse_comment(transcript)
        
        # Capture frames
        result = data.copy()
        cap = cv2.VideoCapture(temp_video_path)
        
        if not cap.isOpened():
            return {"error": "Could not open video file"}
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        
        for category, info in data.items():
            timestamp = info['timestamp']
            
            # Skip if no valid timestamp (0 or False)
            if not timestamp:
                continue
                
            # Calculate frame position
            frame_pos = int(timestamp * fps)
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_pos)
            
            ret, frame = cap.read()
            if ret:
                # Convert frame to JPEG binary data
                _, buffer = cv2.imencode('.jpg', frame)
                frame_binary = Binary(buffer.tobytes())
                
                # Add to result
                result[category]['frame_captured'] = frame_binary
            else:
                result[category]['frame_captured'] = None
        
        return result
        
    except ServerSelectionTimeoutError:
        return {"error": "Could not connect to MongoDB server - timeout"}
    except ConnectionFailure:
        return {"error": "Could not connect to MongoDB server"}
    except Exception as e:
        return {"error": f"Processing error: {str(e)}"}
    finally:
        if cap is not None:
            cap.release()
        if temp_video_path is not None and os.path.exists(temp_video_path):
            os.unlink(temp_video_path)
        if client is not None:
            client.close()

async def update_waste_details(rfid: str, results: Dict[str, Any]) -> bool:
    """
    Update waste details in MongoDB
    """
    client = None
    
    try:
        client = get_mongo_client()
        client.admin.command('ping')  # Test connection
        
        db = client['waste_samaritan']
        collection = db['collector_data']
        
        # Verify document exists first
        existing = collection.count_documents({'rfid': rfid})
        if existing == 0:
            print(f"No documents found with RFID {rfid}")
            return False
        
        # Prepare the update document
        update_operations = {
            '$set': {},
            '$unset': {'data': ""}
        }
        
        # Define expected categories
        expected_categories = [
            'wet_waste',
            'dry_waste', 
            'red_waste',
            'not_segregated_waste'
        ]
        
        # Add waste details for matching categories
        for category in expected_categories:
            if category in results:
                update_operations['$set'][f'{category}_details'] = {
                    'rating': results[category].get('rating', 0),
                    'frame_captured': results[category].get('frame_captured')
                }
        
        update_result = collection.update_one(
            {'rfid': rfid},
            update_operations,
            upsert=False
        )
        
        return update_result.modified_count > 0
        
    except Exception as e:
        print(f"MongoDB Error: {type(e).__name__}: {str(e)}")
        return False
    finally:
        if client is not None:
            client.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=4000)