from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import stt2  # Import your corrected script
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",  # The origin of your React frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Define the structure of the request from the frontend
class ProcessRequest(BaseModel):
    rfid: str

@app.post("/process-video")
async def process_video_endpoint(request: ProcessRequest):
    """
    This endpoint triggers the video processing script.
    It receives an RFID, calls the processing logic, and returns the status.
    """
    try:
        print(f"Received request to process video for RFID: {request.rfid}")
        
        # Call the single entry point function from your stt2 script
        result = stt2.run_full_process(request.rfid)
        
        if result.get("error"):
            # If the script returns an error, send it back to the frontend
            print(f"Error from stt2.py: {result['error']}")
            raise HTTPException(status_code=500, detail=result["error"])
            
        print(f"Successfully processed video for RFID: {request.rfid}")
        return {"status": "success", "message": "Video processed and database updated."}

    except Exception as e:
        # Catch any other unexpected errors in the API layer
        print(f"An exception occurred in the API endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# To run this service: uvicorn analysis_service:app --reload