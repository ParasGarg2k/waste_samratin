"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "1rem",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};

const center = {
  lat: 12.933190,
  lng: 77.688760,
};

export default function CollectionRouteTab() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [rfidData, setRfidData] = useState([]);
  const [directions, setDirections] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [completedRfids, setCompletedRfids] = useState([]);
  const [nextStopIndex, setNextStopIndex] = useState(0);
  const [nextLeg, setNextLeg] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [routeProgress, setRouteProgress] = useState(0);
  
  // Simulation state
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(2); // seconds between moves
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [userInitialLocation, setUserInitialLocation] = useState(null);

  const watchIdRef = useRef(null);
  const simulationIntervalRef = useRef(null);

  // Get current location on component mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(userLocation);
          setUserInitialLocation(userLocation);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to a default location if geolocation fails
          const fallbackLocation = {
            lat: 19.0760,
            lng: 72.8777,
          };
          setCurrentLocation(fallbackLocation);
          setUserInitialLocation(fallbackLocation);
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      // Fallback for browsers without geolocation
      const fallbackLocation = {
        lat: 19.0760,
        lng: 72.8777,
      };
      setCurrentLocation(fallbackLocation);
      setUserInitialLocation(fallbackLocation);
      setIsLoadingLocation(false);
    }
  }, []);

  // Fetch RFID data
  useEffect(() => {
    fetch("http://localhost:4000/api/rfid")
      .then((res) => res.json())
      .then((data) => {
        console.log("RFID data:", data);
        setRfidData(data);
      })
      .catch((err) => {
        console.error("Failed to fetch RFID data:", err);
        // Fallback data for testing
        const fallbackData = [
          { epc: "RFID001", latitude: 19.0760, longitude: 72.8777 },
          { epc: "RFID002", latitude: 19.0770, longitude: 72.8787 },
          { epc: "RFID003", latitude: 19.0750, longitude: 72.8767 },
          { epc: "RFID004", latitude: 19.0740, longitude: 72.8797 },
          { epc: "RFID005", latitude: 19.0780, longitude: 72.8757 },
          { epc: "RFID001", latitude: 12.933190, longitude: 77.688760 },
          { epc: "RFID002", latitude: 12.934000, longitude: 77.689500 },
          { epc: "RFID003", latitude: 12.932500, longitude: 77.687900 },
          { epc: "RFID004", latitude: 12.931800, longitude: 77.690200 },
          { epc: "RFID005", latitude: 12.935100, longitude: 77.688300 },
        ];
        setRfidData(fallbackData);
      });
  }, []);

  // Simulation logic
  const startSimulation = useCallback(() => {
    if (!rfidData.length || !userInitialLocation) return;

    setIsSimulationActive(true);
    setCompletedRfids([]);
    setNextStopIndex(0);
    setSimulationProgress(0);
    
    // Reset to starting position
    setCurrentLocation(userInitialLocation);
    
    let currentIndex = 0;
    let totalSteps = rfidData.length * 10; // 10 steps per RFID point
    let currentStep = 0;
    
    simulationIntervalRef.current = setInterval(() => {
      if (currentIndex >= rfidData.length) {
        // Simulation complete
        setIsSimulationActive(false);
        setSimulationProgress(100);
        clearInterval(simulationIntervalRef.current);
        return;
      }
      
      const targetRfid = rfidData[currentIndex];
      const startLat = currentIndex === 0 ? userInitialLocation.lat : rfidData[currentIndex - 1].latitude;
      const startLng = currentIndex === 0 ? userInitialLocation.lng : rfidData[currentIndex - 1].longitude;
      
      // Calculate intermediate position (10 steps to each RFID)
      const stepProgress = (currentStep % 10) / 10;
      const lat = startLat + (targetRfid.latitude - startLat) * stepProgress;
      const lng = startLng + (targetRfid.longitude - startLng) * stepProgress;
      
      setCurrentLocation({ lat, lng });
      
      // Update progress
      const overallProgress = (currentStep / totalSteps) * 100;
      setSimulationProgress(overallProgress);
      
      // Check if we've reached the current RFID (within simulation tolerance)
      if (stepProgress >= 0.9) {
        setCompletedRfids(prev => 
          prev.includes(currentIndex) ? prev : [...prev, currentIndex]
        );
        setNextStopIndex(currentIndex + 1);
        currentIndex++;
        currentStep = currentIndex * 10;
      } else {
        currentStep++;
      }
    }, simulationSpeed * 1000);
  }, [rfidData, userInitialLocation, simulationSpeed]);

  const stopSimulation = useCallback(() => {
    setIsSimulationActive(false);
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
  }, []);

  const resetSimulation = useCallback(() => {
    stopSimulation();
    setCompletedRfids([]);
    setNextStopIndex(0);
    setSimulationProgress(0);
    if (userInitialLocation) {
      setCurrentLocation(userInitialLocation);
    }
  }, [stopSimulation, userInitialLocation]);

  // Calculate route from current location through all RFIDs
  const calculateRoute = useCallback(() => {
    if (!currentLocation || rfidData.length === 0) return;

    const directionsService = new window.google.maps.DirectionsService();

    const origin = currentLocation;
    const destination = {
      lat: rfidData[rfidData.length - 1].latitude,
      lng: rfidData[rfidData.length - 1].longitude,
    };
    const waypoints = rfidData.slice(0, rfidData.length - 1).map((point) => ({
      location: { lat: point.latitude, lng: point.longitude },
      stopover: true,
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Error fetching directions", result);
        }
      }
    );
  }, [currentLocation, rfidData]);

  // Calculate route to next RFID for distance/directions
  const calculateNextLeg = useCallback(
    (origin, destination) => {
      if (!destination) return;

      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination: { lat: destination.latitude, lng: destination.longitude },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setNextLeg(result.routes[0].legs[0]);
          } else {
            setNextLeg(null);
          }
        }
      );
    },
    []
  );

  // Track location and update completed/next RFID
  useEffect(() => {
    if (!isLoaded || !currentLocation || rfidData.length === 0) return;
    
    calculateRoute();

    // Only use real geolocation if simulation is not active
    if (!isSimulationActive && "geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const newLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentLocation(newLoc);

          // Check if close to next RFID (within ~50 meters)
          const nextStop = rfidData[nextStopIndex];
          if (
            nextStop &&
            Math.abs(newLoc.lat - nextStop.latitude) < 0.0005 &&
            Math.abs(newLoc.lng - nextStop.longitude) < 0.0005
          ) {
            setCompletedRfids((prev) =>
              prev.includes(nextStopIndex) ? prev : [...prev, nextStopIndex]
            );
            setNextStopIndex((idx) =>
              idx < rfidData.length - 1 ? idx + 1 : idx
            );
          }

          // Update next leg info
          if (nextStop) {
            calculateNextLeg(newLoc, nextStop);
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true, maximumAge: 30000 }
      );
    }

    // Always update next leg for current location
    const nextStop = rfidData[nextStopIndex];
    if (nextStop) {
      calculateNextLeg(currentLocation, nextStop);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isLoaded, currentLocation, rfidData, nextStopIndex, calculateRoute, calculateNextLeg, isSimulationActive]);

  // Calculate progress
  useEffect(() => {
    if (rfidData.length > 0) {
      const progress = (completedRfids.length / rfidData.length) * 100;
      setRouteProgress(progress);
    }
  }, [completedRfids, rfidData]);

  // Cleanup simulation on unmount
  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  if (!isLoaded || isLoadingLocation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="text-lg font-medium text-gray-900 dark:text-white">
              Loading Map & Location...
            </span>
          </div>
        </div>
      </div>
    );
  }

  const nextStop = rfidData[nextStopIndex];
  const totalStops = rfidData.length;
  const completedStops = completedRfids.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Collection Route
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Navigate through your waste collection points
          </p>
        </div>

        {/* Simulation Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Simulation Controls
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
              <select
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                disabled={isSimulationActive}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                <option value={0.5}>Fast (0.5s)</option>
                <option value={1}>Normal (1s)</option>
                <option value={2}>Slow (2s)</option>
                <option value={3}>Very Slow (3s)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button
                onClick={startSimulation}
                disabled={isSimulationActive}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {isSimulationActive ? 'Simulation Running...' : 'Start Simulation'}
              </button>
              <button
                onClick={stopSimulation}
                disabled={!isSimulationActive}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                Stop
              </button>
              <button
                onClick={resetSimulation}
                disabled={isSimulationActive}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>
            {isSimulationActive && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Simulation Progress:</span>
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${simulationProgress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {simulationProgress.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Route Progress
            </h3>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {completedStops}/{totalStops} stops completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${routeProgress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {routeProgress.toFixed(1)}% complete
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Live Route Map
                {isSimulationActive && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    SIMULATION MODE
                  </span>
                )}
              </h3>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentLocation}
                zoom={15}
                options={{
                  styles: [
                    {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
                }}
              >
                {directions && (
                  <DirectionsRenderer
                    directions={directions}
                    options={{
                      suppressMarkers: true,
                      polylineOptions: {
                        strokeColor: "#10b981",
                        strokeWeight: 4,
                      },
                    }}
                  />
                )}

                {/* Current Location Marker */}
                {currentLocation && (
                  <Marker
                    position={currentLocation}
                    label="You"
                    title="Current Location"
                  />
                )}

                {/* RFID Markers */}
                {rfidData.map((rfid, idx) => (
                  <Marker
                    key={rfid.epc}
                    position={{
                      lat: rfid.latitude,
                      lng: rfid.longitude,
                    }}
                    title={`${rfid.epc} - ${
                      completedRfids.includes(idx)
                        ? "Completed"
                        : idx === nextStopIndex
                        ? "Next Stop"
                        : "Pending"
                    }`}
                  />
                ))}
              </GoogleMap>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Next Stop Card */}
            {nextStop && nextLeg ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Next Stop
                  </h3>
                  <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{nextStop.epc}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{nextLeg.distance.text}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">ETA:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">{nextLeg.duration.text}</span>
                  </div>
                </div>
                {nextLeg.steps && nextLeg.steps[0] && (
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Next Direction:</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {nextLeg.steps[0].instructions.replace(/<[^>]+>/g, "")}
                    </p>
                  </div>
                )}
              </div>
            ) : nextStop ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Next Stop
                </h3>
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                  Calculating route to {nextStop.epc}...
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                    Route Complete!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    All collection points have been visited.
                  </p>
                </div>
              </div>
            )}

            {/* Collection Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Collection Status
              </h3>
              <div className="space-y-2">
                {rfidData.map((rfid, idx) => (
                  <div key={rfid.epc} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {rfid.epc}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      completedRfids.includes(idx)
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : idx === nextStopIndex
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}>
                      {completedRfids.includes(idx) ? 'Completed' : idx === nextStopIndex ? 'Next' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}