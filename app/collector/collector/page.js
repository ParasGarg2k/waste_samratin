"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star.toString())}
          className="focus:outline-none"
        >
          <svg
            className={`w-6 h-6 ${star <= Number(value) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={star <= Number(value) ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.631c.969 0 1.371 1.24.588 1.81l-5.37 3.905a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.54 1.118l-5.37-3.905a1 1 0 00-1.176 0l-5.37 3.905c-.784.57-1.838-.197-1.54-1.118l2.036-6.29a1 1 0 00-.364-1.118L2.342 11.717c-.783-.57-.38-1.81.588-1.81h6.631a1 1 0 00.95-.69l2.036-6.29z"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function CollectorPage() {
  const [showAudioGuide, setShowAudioGuide] = useState(false);
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyData, setVerifyData] = useState(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [activeRfid, setActiveRfid] = useState(null); // <-- Add this line
  const navigator = useRouter();

  const rfid = 'RFID9122222';
  const rfid2 = 'RFID01000'
  // const rfid = detectedRfid; 
  

  // ... existing code ...
  async function verify(rfid) {
    setVerifyLoading(true);
    setActiveRfid(rfid);
    try {
      const res = await fetch(`http://localhost:4000/api/verify/${rfid}`);
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        setVerifyLoading(false);
        return;
      }
      // Set up state with the new nested structure
      setVerifyData({
        dry_waste_details: data.dry_waste_details,
        wet_waste_details: data.wet_waste_details,
        // Assuming you have these other details fields
        red_waste_details: data.red_waste_details, 
        non_segregated_waste_details: data.not_segregated_waste_details
      });
      setShowVerifyModal(true);
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
    setVerifyLoading(false);
  }
  
  // Ensure we're running on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);


  // Detect if we're on mobile or desktop (only after client loads)
  const isMobile = isClient && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Check if camera API is supported
  useEffect(() => {
    if (isClient) {
      const checkSupport = () => {
        console.log("=== Camera Support Check ===");
        console.log("navigator.mediaDevices:", navigator.mediaDevices);
        console.log("getUserMedia function:", navigator.mediaDevices?.getUserMedia);
        console.log("Protocol:", window.location.protocol);
        console.log("Hostname:", window.location.hostname);
        
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("Camera not supported in this browser. Please use Chrome, Firefox, or Safari.");
          return false;
        }
        
        console.log("✅ Camera API supported!");
        setIsSupported(true);
        return true;
      };
      
      checkSupport();
    }
  }, [isClient]);

  // Set up video element when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log("Setting up video element with stream");
      videoRef.current.srcObject = stream;
      
      // Force play the video
      const playVideo = async () => {
        if (!videoRef.current) return;
        try {
          await videoRef.current.play();
          console.log("Video is playing successfully");
          setCameraStarted(true);
        } catch (err) {
          console.error("Error playing video:", err);
          setError("Failed to display video. Please refresh and try again.");
        }
      };
      
      videoRef.current.onloadedmetadata = () => {
        console.log("Video metadata loaded");
        playVideo();
      };
    }

    if (!stream && videoRef.current) {
    videoRef.current.srcObject = null;
  }
  }, [stream]);

  const startCamera = async () => {
    console.log("=== Starting Camera ===");
    console.log("isSupported:", isSupported);
    
    if (!isSupported) {
      alert(error || "Camera not supported");
      return;
    }

    try {
      setError("");
      setCameraStarted(false);
      
      // Double-check if mediaDevices is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not available");
      }

      // For mobile vs desktop constraints
      const constraints = {
        video: {
          ...(isMobile ? { facingMode: facingMode } : {}),
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: true
      };

      console.log("Camera constraints:", constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("✅ Camera stream obtained:", mediaStream);
      console.log("Video tracks:", mediaStream.getVideoTracks());

      setStream(mediaStream);
      
    } catch (error) {
      console.error("❌ Error accessing camera:", error);
      let errorMessage = "Unable to access camera. ";
      
      if (error.name === 'NotAllowedError') {
        errorMessage += "Please allow camera permissions and try again.";
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No camera found on this device.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage += "Camera not supported in this browser.";
      } else {
        errorMessage += `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const switchCamera = async () => {
    if (!isSupported || !isMobile) return;

    console.log("Switching camera...");
    
    // Stop current stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    // Switch facing mode
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    
    // Start camera with new facing mode
    try {
      const constraints = {
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: true
      };

      console.log("Switching to:", newFacingMode, constraints);
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
    } catch (error) {
      console.error("Error switching camera:", error);
      // Fallback to original camera if switch fails
      setFacingMode(facingMode);
      alert("Couldn't switch camera. Using default camera.");
      startCamera();
    }
  };

  const startRecording = () => {
    if (!stream) {
      alert("Please start camera first");
      return;
    }

    try {
      console.log("Starting recording...");
      chunksRef.current = [];
      
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error("Recording not supported in this browser");
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        console.log("Recording data available:", event.data.size);
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("Recording stopped, creating blob...");
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        console.log("Recording URL:", url);
        setVideoURL(url);
        
        // Send as FormData (no base64)
        const formData = new FormData();
        formData.append('video', blob, 'video.webm');
        formData.append('rfid', rfid);

        fetch('http://localhost:4000/api/upload-video', {
            method: 'POST',
            body: formData
        })
        .then(res => {
            if (!res.ok) throw new Error(`Video upload failed: ${res.statusText}`);
            return res.json();
        })
        .then(uploadData => {
            console.log('Upload response:', uploadData);
            
            // STEP 2: Trigger the Python analysis service
            alert('Step 2: Starting video analysis...');
            return fetch('http://localhost:8000/api/upload-video', { // Correct URL for FastAPI
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rfid: rfid }) // Send RFID to Python
            });
        })
        .then(processRes => {
          if (!processRes.ok) {
            // If Python service returns an error, show it
            return processRes.json().then(err => { throw new Error(err.detail || 'Analysis failed') });
          }
          return processRes.json();
        })
        .then(processData => {
            console.log('Processing response:', processData);
            
            // STEP 3: Verify the results to show the modal
            alert('Step 3: Analysis complete! Fetching results...');
            verify(rfid); // Call verify() to get updated data and show modal
        })
        .catch(err => {
          console.error('Full process error:', err);
          alert(`An error occurred: ${err.message}`);
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
      console.log("✅ Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Unable to start recording. Please try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log("Stopping recording...");
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log("Stopping track:", track.kind);
        track.stop();
      });
      setStream(null);
      setVideoURL(null);
      setIsRecording(false);
      setCameraStarted(false);
    }
  };

  const submitVideo = () => {
    if (videoURL) {
      // Here you would upload the video to your server
      console.log("Submitting video:", videoURL);
      alert("Video submitted successfully!");
      // Reset everything
      stopCamera();
    }
  };

  const handleLogout = () => {
    // Clear any stored authentication tokens or session data
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    // Redirect to login page
    router.push('/');
  };

  // Show loading state until client-side is ready
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading camera interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Waste Collector Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Document waste collection activities
          </p>
        </div>

        {/* Navigation Options */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button 
            onClick={() => router.push('/collector/collection_route')}
            className="p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
          >
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm font-medium text-gray-900 dark:text-white">View Routes</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Check collection routes</p>
            </div>
          </button>
          
          <button 
            onClick={() => router.push('/collector/collection_sim')}
            className="p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
          >
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-green-600 dark:text-green-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Collection Simulation</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">See how routes work</p>
            </div>
          </button>
          
          <button 
            onClick={() => router.push('/collector/logs')}
            className="p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md"
          >
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-purple-600 dark:text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Collection Logs</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">View your collection logs</p>
            </div>
          </button>
          
          <button 
            onClick={() => router.push('/collector/collector_onboarding')}
            className="p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-md sm:col-span-2 lg:col-span-3"
          >
            <div className="text-center">
              <svg className="mx-auto h-8 w-8 text-orange-600 dark:text-orange-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Training</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Learn how to use the application</p>
            </div>
          </button>
        </div>

       

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Camera Error
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Support Status */}
        <div className="mb-6 text-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            isSupported 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
          }`}>
            {isSupported ? '✅ Camera Supported' : '❌ Camera Not Available'}
          </span>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          {/* Camera Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Record Collection Activity
              </h2>
              
              {/* Device info and camera switch */}
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {isMobile ? "📱 Mobile" : "💻 Desktop"}
                </span>
                {stream && isMobile && isSupported && (
                  <button
                    onClick={switchCamera}
                    className="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-200 px-3 py-1 rounded transition-colors"
                  >
                    {facingMode === "user" ? "📷 Front" : "📸 Back"}
                  </button>
                )}
              </div>
              
</div>

            </div>
            
            {/* Video Preview - IMPROVED */}
            <div className="relative bg-gray-900 dark:bg-gray-700 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: "16/9" }}>
              {stream && !videoURL ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ 
                    transform: facingMode === "user" ? "scaleX(-1)" : "none" // Mirror front camera
                  }}
                  onLoadedMetadata={() => {
                    console.log("Video loaded, dimensions:", videoRef.current?.videoWidth, "x", videoRef.current?.videoHeight);
                  }}
                  onError={(e) => {
                    console.error("Video error:", e);
                    setError("Video display error. Please try restarting the camera.");
                  }}
                  onCanPlay={() => {
                    console.log("Video can play");
                  }}
                />
              ) : videoURL ? (
                <video
                  src={videoURL}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-white">Camera preview will appear here</p>
                    <p className="text-xs mt-1 text-gray-300">
                      {isMobile ? "📱 Will use mobile cameras" : "💻 Will use laptop webcam"}
                    </p>
                    {!isSupported && (
                      <p className="text-xs mt-2 text-red-400">
                        ⚠️ Camera not supported or permissions denied
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  Recording
                </div>
              )}

              {/* Stream status indicator */}
              {stream && cameraStarted && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded text-xs">
                  🟢 Live
                </div>
              )}
            </div>


            {/* Control Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              {!stream && !videoURL && (
                <button
                  onClick={startCamera}
                  disabled={!isSupported}
                  className={`font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                    isSupported 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {isMobile ? "📱 Start Camera" : "💻 Start Webcam"}
                </button>
              )}

              {stream && !isRecording && !videoURL && (
                <>
                  <button
                    onClick={startRecording}
                    disabled={!cameraStarted}
                    className={`font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                      cameraStarted 
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    {cameraStarted ? "Start Recording" : "Loading Camera..."}
                  </button>
                  {isMobile && (
                    <button
                      onClick={switchCamera}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                    >
                      🔄 Switch Camera
                    </button>
                  )}
                  <button
                    onClick={stopCamera}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  <div className="w-3 h-3 bg-white"></div>
                  Stop Recording
                </button>
              )}

              {videoURL && (
                <>
                  <button
                    onClick={submitVideo}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Submit Video
                  </button>
                  <button
                    onClick={() => {
                      setVideoURL(null);
                      startCamera();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Record Again
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Audio Review Tab */}
<div className="mt-6">
  <button
    onClick={() => setShowAudioGuide(prev => !prev)}
    className="flex items-center justify-between w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 mb-2"
  >
    🎧 Audio Guide for Waste Types
    <span>{showAudioGuide ? "▲" : "▼"}</span>
  </button>

  {showAudioGuide && (
    <div className="bg-white dark:bg-gray-700 border border-yellow-300 dark:border-yellow-600 rounded-lg p-4 space-y-4 shadow-inner">
      <div>
        <p className="font-semibold text-sm text-red-600">🔴 Red Waste (1⭐)</p>
        <audio controls src="/audios/red_waste.mp3" className="w-full mt-1" />
      </div>
      <div>
        <p className="font-semibold text-sm text-yellow-600">🟤 Dry Waste (2⭐)</p>
        <audio controls src="/audios/dry_waste.mp3" className="w-full mt-1" />
      </div>
      <div>
        <p className="font-semibold text-sm text-green-600">🟢 Wet Waste (4⭐)</p>
        <audio controls src="/audios/wet_waste.mp3" className="w-full mt-1" />
      </div>
      <div>
        <p className="font-semibold text-sm text-gray-600">⚫ Mixed Waste (0⭐)</p>
        <audio controls src="/audios/not_seg.mp3" className="w-full mt-1" />
      </div>
    </div>
  )}

        </div>

        {/* Logout Button */}
        <div className="text-center mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>


      {showVerifyModal && verifyData && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Verify & Update Waste Data</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          // Create a smaller payload to avoid "Payload Too Large" errors
          const payload = {
            dry_waste_details: verifyData.dry_waste_details 
              ? { rating: verifyData.dry_waste_details.rating } 
              : undefined,
            wet_waste_details: verifyData.wet_waste_details 
              ? { rating: verifyData.wet_waste_details.rating } 
              : undefined,
            red_waste_details: verifyData.red_waste_details 
              ? { rating: verifyData.red_waste_details.rating } 
              : undefined,
            not_segregated_waste_details: verifyData.non_segregated_waste_details 
              ? { weight: verifyData.non_segregated_waste_details.weight } 
              : undefined,
          };

          try {
            const updateRes = await fetch(`http://localhost:4000/api/verify/${rfid}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            if (!updateRes.ok) {
              const errorText = await updateRes.text();
              throw new Error(`Update failed: ${updateRes.statusText} - ${errorText}`);
            }

            const updateData = await updateRes.json();
            if (updateData.error) {
              alert(updateData.error);
            } else {
              alert('Updated successfully!');
              setShowVerifyModal(false);
            }
          } catch (err) {
            console.error("Error updating ratings:", err);
            alert(err.message);
          }
        }}
        className="space-y-4" // Increased spacing
      >
        
        {/* Star Ratings for Segregated Waste */}
        {Object.entries(verifyData)
          .filter(([key, value]) => key.endsWith('_details') && value && key !== 'non_segregated_waste_details')
          .map(([key, details]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                {key.replace('_details', ' Waste Rating').replace(/_/g, ' ')}
              </label>
              <StarRating
                value={details.rating}
                onChange={newRating => {
                  setVerifyData(prevData => ({
                    ...prevData,
                    [key]: {
                      ...prevData[key],
                      rating: newRating
                    }
                  }));
                }}
              />
            </div>
        ))}

        {/* Radio Button for Non-Segregated Waste */}
        {verifyData.non_segregated_waste_details && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Waste Not Segregated?
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="non_segregated"
                  value="yes"
                  checked={verifyData.non_segregated_waste_details.weight !== 0}
                  onChange={() => setVerifyData(prev => ({
                    ...prev,
                    non_segregated_waste_details: { ...prev.non_segregated_waste_details, weight: 1 }
                  }))}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Yes</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="non_segregated"
                  value="no"
                  checked={verifyData.non_segregated_waste_details.weight === 0}
                  onChange={() => setVerifyData(prev => ({
                    ...prev,
                    non_segregated_waste_details: { ...prev.non_segregated_waste_details, weight: 0 }
                  }))}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">No</span>
              </label>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Save Ratings
          </button>
          <button
            type="button"
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setShowVerifyModal(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}