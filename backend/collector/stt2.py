import cv2
import numpy as np
from bson.binary import Binary
from pymongo import MongoClient
import whisper
import tempfile
import os
from typing import List, Dict, Any
from urllib.parse import quote_plus
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

# Assuming 'parse_comment' is in a file named 'parse_comment.py' in the same directory
from parse_comment import parse_comment

# --- 1. Main Video Processing Function ---
def process_video_by_rfid(rfid: str, model_size: str = "base") -> Dict[str, Any]:
    """
    Processes video from MongoDB by RFID, including transcription and frame capture.
    This is your original function.
    """
    # MongoDB Atlas connection configuration
    username = quote_plus('jpmc25')
    password = quote_plus('jpmc25')
    cluster_url = 'demo.vy7ku.mongodb.net'
    auth_source = 'admin'
    auth_mechanism = 'SCRAM-SHA-1'
    
    connection_string = f"mongodb+srv://{username}:{password}@{cluster_url}/?retryWrites=true&w=majority&authSource={auth_source}&authMechanism={auth_mechanism}"
    client = None

    try:
        client = MongoClient(connection_string, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        db = client['waste_samaritan']
        collection = db['collector_data']

        # Note: This line is for Windows and may not be needed on macOS/Linux
        # if ffmpeg is in the system's PATH.
        if os.name == 'nt':
             os.environ["PATH"] += os.pathsep + "C:\\ffmpeg\\bin"
        
        print(f"Loading Whisper {model_size} model...")
        model = whisper.load_model(model_size)
        print("Model loaded successfully.")
        
        video_doc = collection.find_one({'rfid': rfid})
        if not video_doc or 'data' not in video_doc:
            return {"error": f"Video data for RFID {rfid} not found."}
        
        with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_video:
            temp_video_path = temp_video.name
            temp_video.write(video_doc['data'])
        
        try:
            print(f"Transcribing video for RFID: {rfid}")
            transcription_result = model.transcribe(temp_video_path, word_timestamps=True)
            
            words = []
            for segment in transcription_result.get("segments", []):
                for word in segment.get("words", []):
                    words.append((word["start"], word["end"], word["word"].strip()))
            
            parsed_data = parse_comment(words)
            
            print("Capturing frames based on timestamps...")
            cap = cv2.VideoCapture(temp_video_path)
            if not cap.isOpened():
                return {"error": "Could not open temporary video file."}
            
            fps = cap.get(cv2.CAP_PROP_FPS)
            
            for category, info in parsed_data.items():
                timestamp = info.get('timestamp')
                if timestamp:
                    frame_pos = int(timestamp * fps)
                    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_pos)
                    ret, frame = cap.read()
                    if ret:
                        _, buffer = cv2.imencode('.jpg', frame)
                        parsed_data[category]['frame_captured'] = Binary(buffer.tobytes())
                    else:
                        parsed_data[category]['frame_captured'] = None
            
            cap.release()
            return parsed_data

        finally:
            if os.path.exists(temp_video_path):
                os.unlink(temp_video_path)
            
    except (ServerSelectionTimeoutError, ConnectionFailure) as e:
        return {"error": f"MongoDB connection error: {str(e)}"}
    except Exception as e:
        print(f"An unexpected error occurred in process_video_by_rfid: {repr(e)}")
        return {"error": f"An unexpected error occurred: {str(e)}"}
    finally:
        if client:
            client.close()

# --- 2. Database Update Function ---
def update_waste_details(rfid: str, results: Dict[str, Any]) -> str | None:
    """
    Updates the MongoDB document with the processed details and removes the video data.
    Returns an error message on failure, or None on success.
    """
    username = quote_plus('jpmc25')