"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image'; // Import Image component for Next.js
import "../styles.css"; // Ensure this path is correct

function StarRating({ value, onChange }) {
  return (
    <div className="star-rating-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(star.toString())}
          className="star-rating-button"
        >
          <svg
            className={`star-icon ${star <= Number(value) ? 'filled' : 'empty'}`}
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
  const [activeRfid, setActiveRfid] = useState(null); 

  const rfid = 'RFID9122222';
  // const rfid = detectedRfid; 
  

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
      setVerifyData({
        dry_waste_details: data.dry_waste_details,
        wet_waste_details: data.wet_waste_details,
        red_waste_details: data.red_waste_details, 
        non_segregated_waste_details: data.not_segregated_waste_details
      });
      setShowVerifyModal(true);
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
    setVerifyLoading(false);
  }
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Detect if we're on mobile or desktop (only after client loads)
  const isMobile = isClient && typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);

  // Check if camera API is supported
  useEffect(() => {
    if (isClient) {
      const checkSupport = () => {
        console.log("=== Camera Support Check ===");
        console.log("navigator.mediaDevices:", window.navigator.mediaDevices);
        console.log("getUserMedia function:", window.navigator.mediaDevices?.getUserMedia);
        console.log("Protocol:", window.location.protocol);
        console.log("Hostname:", window.location.hostname);
        
        if (!window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) {
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
      
      if (!window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not available");
      }

      const constraints = {
        video: {
          ...(isMobile ? { facingMode: facingMode } : {}),
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: true
      };

      console.log("Camera constraints:", constraints);
      const mediaStream = await window.navigator.mediaDevices.getUserMedia(constraints);
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
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    
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
      const mediaStream = await window.navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
    } catch (error) {
      console.error("Error switching camera:", error);
      setFacingMode(facingMode); // Fallback
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
            
            alert('Step 2: Starting video analysis...');
            return fetch('http://localhost:8000/api/upload-video', { // Correct URL for FastAPI
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rfid: rfid }) // Send RFID to Python
            });
        })
        .then(processRes => {
          if (!processRes.ok) {
            return processRes.json().then(err => { throw new Error(err.detail || 'Analysis failed') });
          }
          return processRes.json();
        })
        .then(processData => {
            console.log('Processing response:', processData);
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
      console.log("Submitting video:", videoURL);
      alert("Video submitted successfully!");
      stopCamera();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    router.push('/');
  };

  if (!isClient) {
    return (
      <div className="collector-root flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading camera interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="collector-root">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="collector-header">
          <div className="collector-header-content">
            <Image 
              src="/images/logo.svg" // Path to your logo SVG in public folder
              alt="WasteWise Logo" 
              width={150} 
              height={150} 
              className="mb-2" // This class is defined in styles.css now
            />
            <h1>Waste Collector Dashboard</h1>
          </div>
          <p>Document waste collection activities</p>
        </div>

        {/* Navigation Options */}
        <div className="collector-nav">
          <button 
            onClick={() => router.push('/collector/collection_route')}
            className="collector-card"
          >
            <div className="text-center">
              <svg className="mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div className="card-title">View Routes</div>
              <div className="card-desc">Check collection routes</div>
            </div>
          </button>
          <button 
            onClick={() => router.push('/collector/collection_sim')}
            className="collector-card"
          >
            <div className="text-center">
              <svg className="mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              <div className="card-title">Collection Simulation</div>
              <div className="card-desc">See how routes work</div>
            </div>
          </button>
          <button 
            onClick={() => router.push('/collector/logs')}
            className="collector-card"
          >
            <div className="text-center">
              <svg className="mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="card-title">Collection Logs</div>
              <div className="card-desc">View your collection logs</div>
            </div>
          </button>
          <button 
            onClick={() => router.push('/collector/collector_onboarding')}
            className="collector-card"
          >
            <div className="text-center">
              <svg className="mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="card-title">Training</div>
              <div className="card-desc">Learn how to use the application</div>
            </div>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <div className="error-message-content">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="error-message-text">
                <h3>Camera Error</h3>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Support Status */}
        <div className="collector-status">
          {isSupported ? '✅ Camera Supported' : '❌ Camera Not Available'}
        </div>

        {/* Main Content */}
        <div className="collector-main">
          {/* Camera Section */}
          <div className="camera-section">
            <div className="camera-header">
              <h2 className="collector-section-title">Record Collection Activity</h2>
              <div className="camera-info-badges">
                <span>
                  {isMobile ? "📱 Mobile" : "💻 Desktop"}
                </span>
                {stream && isMobile && isSupported && (
                  <button
                    onClick={switchCamera}
                    className="app-button secondary text-xs px-3 py-1"
                  >
                    {facingMode === "user" ? "📷 Front" : "📸 Back"}
                  </button>
                )}
              </div>
            </div>
            {/* Video Preview */}
            <div className="video-preview-container">
              {stream && !videoURL ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="video-preview-container-video"
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
                  className="video-preview-container-video"
                />
              ) : (
                <div className="video-placeholder">
                  <div>
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
                <div className="recording-indicator">
                  Recording
                </div>
              )}

              {/* Stream status indicator */}
              {stream && cameraStarted && (
                <div className="live-indicator">
                  🟢 Live
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="control-buttons">
              {!stream && !videoURL && (
                <button
                  onClick={startCamera}
                  disabled={!isSupported}
                  className={`app-button primary ${!isSupported ? 'disabled' : ''}`}
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
                    className={`app-button danger ${!cameraStarted ? 'disabled' : ''}`}
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    {cameraStarted ? "Start Recording" : "Loading Camera..."}
                  </button>
                  {isMobile && (
                    <button
                      onClick={switchCamera}
                      className="app-button warning"
                    >
                      🔄 Switch Camera
                    </button>
                  )}
                  <button
                    onClick={stopCamera}
                    className="app-button secondary"
                  >
                    Cancel
                  </button>
                </>
              )}

              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="app-button danger"
                >
                  <div className="w-3 h-3 bg-white"></div>
                  Stop Recording
                </button>
              )}

              {videoURL && (
                <>
                  <button
                    onClick={submitVideo}
                    className="app-button primary"
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
                    className="app-button primary"
                  >
                    Record Again
                  </button>
                  <button
                    onClick={stopCamera}
                    className="app-button secondary"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Audio Review Tab */}
          <div className="collector-audio-guide">
            <button
              onClick={() => setShowAudioGuide(prev => !prev)}
              className="audio-guide-button"
            >
              🎧 Audio Guide for Waste Types
              <span>{showAudioGuide ? "▲" : "▼"}</span>
            </button>
            {showAudioGuide && (
              <div>
                <div>
                  <p className="audio-title" style={{ color: '#dc2626' }}>🔴 Red Waste (1⭐)</p>
                  <audio controls src="/audios/red_waste.mp3" />
                </div>
                <div>
                  <p className="audio-title" style={{ color: '#b45309' }}>🟤 Dry Waste (2⭐)</p>
                  <audio controls src="/audios/dry_waste.mp3" />
                </div>
                <div>
                  <p className="audio-title" style={{ color: '#15803d' }}>🟢 Wet Waste (4⭐)</p>
                  <audio controls src="/audios/wet_waste.mp3" />
                </div>
                <div>
                  <p className="audio-title" style={{ color: '#374151' }}>⚫ Mixed Waste (0⭐)</p>
                  <audio controls src="/audios/not_seg.mp3" />
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <div className="logout-section">
            <button
              onClick={handleLogout}
              className="app-button danger"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Modal */}
        {showVerifyModal && verifyData && (
          <div className="modal-overlay">
            <div className="collector-modal">
              <h2>Verify & Update Waste Data</h2>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

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
                className="modal-form-spacing"
              >
                
                {/* Star Ratings for Segregated Waste */}
                {Object.entries(verifyData)
                  .filter(([key, value]) => key.endsWith('_details') && value && key !== 'non_segregated_waste_details')
                  .map(([key, details]) => (
                    <div key={key}>
                      <label className="modal-form-label">
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
                    <label className="modal-form-label">
                      Waste Not Segregated?
                    </label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="non_segregated"
                          value="yes"
                          checked={verifyData.non_segregated_waste_details.weight !== 0}
                          onChange={() => setVerifyData(prev => ({
                            ...prev,
                            non_segregated_waste_details: { ...prev.non_segregated_waste_details, weight: 1 }
                          }))}
                          className="radio-input"
                        />
                        <span className="radio-text">Yes</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="non_segregated"
                          value="no"
                          checked={verifyData.non_segregated_waste_details.weight === 0}
                          onChange={() => setVerifyData(prev => ({
                            ...prev,
                            non_segregated_waste_details: { ...prev.non_segregated_waste_details, weight: 0 }
                          }))}
                          className="radio-input"
                        />
                        <span className="radio-text">No</span>
                      </label>
                    </div>
                  </div>
                )}
                
                <div className="modal-buttons">
                  <button
                    type="submit"
                    className="save-button"
                  >
                    Save Ratings
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
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
    </div>
  );
}
