"use client";

import { useState,useEffect } from 'react';
import { MapPin, Navigation, CheckCircle, Clock, User, ArrowRight, ArrowLeft, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function CollectorOnboarding() {
    const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  const steps = [
  {
    title: "Sign In",
    icon: <User className="w-12 h-12 text-green-600" />,
    description: "Enter your name and password to start",
    details: "Ask your boss if you don't have a login",
    visual: "👤"
  },
  {
    title: "In the Dashboard",
    icon: <Play className="w-12 h-12 text-indigo-600" />,
    description: "Use the dashboard to start your work",
    details: "Log the wastes collected here by following these instructions, ensure that the video and audio is clear.",
    visual: "🧭"
  },
  {
    title: "Record Red Waste",
    icon: <Play className="w-12 h-12 text-red-600" />,
    description: "Say 'Red waste, 1 star'",
    details: "Clearly state the bin type and rating while filming.",
    visual: "🔴🎙️",
    audio: "/audios/red_waste.mp3",
    stars: "1⭐"
  },
  {
    title: "Record Dry Waste",
    icon: <Play className="w-12 h-12 text-yellow-600" />,
    description: "Say 'Dry waste, 2 stars'",
    details: "Clearly state the bin type and rating while filming.",
    visual: "🟤🎙️",
    audio: "/audios/dry_waste.mp3",
    stars: "2⭐"
  },
  {
    title: "Record Wet Waste",
    icon: <Play className="w-12 h-12 text-green-600" />,
    description: "Say 'Wet waste, 4 stars'",
    details: "Clearly state the bin type and rating while filming.",
    visual: "🟢🎙️",
    audio: "/audios/wet_waste.mp3",
    stars: "4⭐"
  },
  {
    title: "Record Mixed Waste",
    icon: <Play className="w-12 h-12 text-gray-600" />,
    description: "Say 'Non segregated waste'",
    details: "Clearly state the bin type and rating while filming.",
    visual: "⚫🎙️",
    audio: "/audios/not_seg.mp3",
    stars: "0⭐"
  },
  {
    title: "See Your Map",
    icon: <MapPin className="w-12 h-12 text-blue-600" />,
    description: "Look at the map to see where to go",
    details: "Red dots = houses to visit, Green dots = done",
    visual: "🗺️"
  },
  {
    title: "Follow the Blue Dot",
    icon: <Navigation className="w-12 h-12 text-blue-600" />,
    description: "The blue dot shows where you are",
    details: "Move around and watch the dot move with you",
    visual: "📍"
  },
  {
    title: "Go to Next House",
    icon: <ArrowRight className="w-12 h-12 text-orange-600" />,
    description: "App tells you which house is next",
    details: "Follow the directions to get there",
    visual: "🏠"
  },
  {
    title: "Mark Complete",
    icon: <CheckCircle className="w-12 h-12 text-green-600" />,
    description: "When done, mark the house as finished",
    details: "Red dot becomes green when complete",
    visual: "✅"
  },
  {
    title: "Finish Route",
    icon: <Clock className="w-12 h-12 text-purple-600" />,
    description: "When all houses are done, you're finished!",
    details: "App will show 'Route Complete' message",
    visual: "🎉"
  }
];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">
            Welcome! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Learn how to use the Waste Collection App
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-gray-600">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-green-200">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{steps[currentStep].visual}</div>
            <div className="mb-4">{steps[currentStep].icon}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {steps[currentStep].title}
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              {steps[currentStep].description}
            </p>
            <p className="text-lg text-gray-500">
              {steps[currentStep].details}
            </p>
          </div>

          {/* Visual Demo Area */}
<div className="bg-gray-50 rounded-2xl p-6 mb-8 min-h-[200px] flex items-center justify-center">
  {(() => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <div className="bg-white rounded-lg p-6 shadow-md max-w-sm mx-auto">
              <div className="text-2xl mb-4">🔐</div>
              <input className="w-full p-3 border rounded-lg mb-3" placeholder="Your Name" />
              <input className="w-full p-3 border rounded-lg mb-3" placeholder="Password" type="password" />
              <button className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold">
                Sign In
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-6 relative">
              <div className="text-4xl mb-2">🧭</div>
              <div className="flex justify-center space-x-4 mb-2">
                <span className="text-2xl">📋</span>
                <span className="text-2xl">🎥</span>
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-sm text-gray-600">Dashboard: Log, Record, Review</p>
            </div>
          </div>
        );
      case 2:
case 3:
case 4:
case 5:
  return (
    <div className="text-center">
      <div className="bg-red-100 rounded-lg p-6">
        <div className="text-4xl mb-2">{steps[currentStep].visual}</div>
        <div className="text-lg font-semibold mb-2">
          Rating: <span className="font-bold">{steps[currentStep].stars}</span>
        </div>
        <audio controls className="mb-3" src={steps[currentStep].audio} />
        <p className="text-xs text-gray-500">
          🎙️ Press record and clearly say the bin type and its rating as you move the camera.
        </p>
      </div>
    </div>
  );

      case 6:
        return (
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-6">
              <div className="text-4xl mb-2">🗺️</div>
              <div className="flex justify-center space-x-4 mb-2">
                <span className="text-2xl">🔴</span>
                <span className="text-2xl">🔴</span>
                <span className="text-2xl">🟢</span>
              </div>
              <p className="text-sm text-gray-600">Red = To Do, Green = Done</p>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="text-center">
            <div className="bg-blue-100 rounded-lg p-6">
              <div className="text-4xl mb-2">📍</div>
              <div className="text-2xl text-blue-600 animate-pulse">🔵</div>
              <p className="text-sm text-gray-600 mt-2">This blue dot is YOU!</p>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="text-center">
            <div className="bg-orange-100 rounded-lg p-6">
              <div className="text-4xl mb-2">🏠</div>
              <div className="text-lg font-semibold text-orange-600 mb-2">Next Stop: House #123</div>
              <div className="text-sm text-gray-600">Distance: 200 meters</div>
              <div className="text-sm text-gray-600">Direction: Turn right, then straight</div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="text-center">
            <div className="bg-green-100 rounded-lg p-6">
              <div className="text-4xl mb-2">✅</div>
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold text-lg">
                Mark Complete
              </button>
              <p className="text-sm text-gray-600 mt-2">Tap when waste is collected</p>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="text-center">
            <div className="bg-purple-100 rounded-lg p-6">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-xl font-bold text-purple-600 mb-2">Route Complete!</div>
              <p className="text-sm text-gray-600">All houses visited. Great job!</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  })()}
</div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={() => setShowDemo(true)}
                className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Working!
              </button>
            )}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
          <h3 className="text-xl font-bold text-yellow-800 mb-4 text-center">
            💡 Quick Tips
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <p className="text-yellow-700">Keep your phone charged</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🆘</div>
              <p className="text-yellow-700">Call your supervisor if stuck</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">✋</div>
              <p className="text-yellow-700">Take breaks when needed</p>
            </div>
          </div>
        </div>

        {/* Demo Modal */}
        {showDemo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Start!</h3>
              <p className="text-gray-600 mb-6">
                You're all set to begin collecting waste. Remember to follow the steps you just learned!
              </p>
          <button
        onClick={() => router.push('/collector')}
        className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600"
      >
                Let's Go!
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}