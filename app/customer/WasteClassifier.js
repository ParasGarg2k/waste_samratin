import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, CheckCircle } from 'lucide-react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import toast from 'react-hot-toast';

// Waste category data based on the provided chart
const wasteChart = {
  organic: {
    label: 'Organic Waste',
    color: 'waste-wet',
    examples: [
      'Vegetable/fruit peels', 'Cooked food/Leftovers', 'Egg shells', 'Chicken/fish bones', 'Rotten fruits/vegetables', 'Tissue paper soiled with food', 'Tea bags/Coffee grinds', 'Leaf plates', 'Garden waste', 'Fallen leaves/twigs', 'Puja flowers/garlands', 'Weeds'
    ],
    tips: 'Do NOT use a plastic liner. Garden waste will be picked up separately.'
  },
  dry: {
    label: 'Dry Waste',
    color: 'waste-dry',
    examples: [
      'Plastic (rinsed if soiled)', 'Plastic covers/bottles/boxes/items', 'Chips/toffee wrappers', 'Plastic cups', 'Milk/Curd packets', 'Paper (rinsed if soiled)', 'Newspaper/Magazines', 'Stationery/Junk mail', 'Cardboard cartons', 'Pizza boxes', 'Tetrapaks', 'Paper cups and plates', 'Metal foil containers/cans', 'Unbroken glass bottles', 'Rubber/Thermocol', 'Old mops/Dusters/Sponges', 'Cosmetics', 'Ceramics, Wooden Chips, Hair, Coconut shells', 'E-waste (batteries, CDs, tapes, thermometers, bulbs, tube lights, CFLs)'],
    tips: 'Use only reusable bags for disposal. Handle glass and e-waste with care. Hand over bulbs/tube lights/CFLs separately.'
  },
  reject: {
    label: 'Reject Waste',
    color: 'waste-red',
    examples: [
      'Sanitary waste (use newspaper for wrapping)', 'Diapers/Sanitary napkins', 'Bandages', 'Condoms', 'Nails', 'Used tissues', 'Medicines', 'Swept dust', 'Sharps (razors, blades, syringes, vials)', 'Construction debris/Inerts (rubble, paints, cement, bricks, broken glass)'],
    tips: 'Do NOT use a plastic liner. Wrap sharps and broken glass in newspaper. Hand over construction debris separately.'
  }
};

// Mapping from AI class names to waste categories
const aiToWasteCategory = {
  // Organic (Wet Waste)
  banana: 'organic', apple: 'organic', orange: 'organic', egg: 'organic', fish: 'organic', chicken: 'organic', vegetable: 'organic', fruit: 'organic', bread: 'organic', leaf: 'organic', flower: 'organic', food: 'organic', tea: 'organic', coffee: 'organic',
  // Add more fruits and leftover food classes
  "granny smith": 'organic', mango: 'organic', grape: 'organic', watermelon: 'organic', pineapple: 'organic', strawberry: 'organic', blueberry: 'organic', raspberry: 'organic', cherry: 'organic', peach: 'organic', pear: 'organic', plum: 'organic', apricot: 'organic', kiwi: 'organic', papaya: 'organic', guava: 'organic', pomegranate: 'organic', lychee: 'organic', jackfruit: 'organic', coconut: 'organic', avocado: 'organic',
  "leftover": 'organic', leftovers: 'organic', "cooked food": 'organic', "rotten food": 'organic', "spoiled food": 'organic', "food waste": 'organic', "fruit peels": 'organic', "vegetable peels": 'organic', "kitchen waste": 'organic',
  // Dry
  bottle: 'dry', can: 'dry', plastic: 'dry', paper: 'dry', magazine: 'dry', newspaper: 'dry', cardboard: 'dry', box: 'dry', carton: 'dry', pizza: 'dry', tetrapak: 'dry', cup: 'dry', plate: 'dry', foil: 'dry', metal: 'dry', glass: 'dry', thermocol: 'dry', rubber: 'dry', mop: 'dry', duster: 'dry', sponge: 'dry', cosmetic: 'dry', ceramic: 'dry', wood: 'dry', hair: 'dry', battery: 'dry', cd: 'dry', tape: 'dry', thermometer: 'dry', bulb: 'dry', cfl: 'dry',
  // Reject
  diaper: 'reject', napkin: 'reject', bandage: 'reject', condom: 'reject', nail: 'reject', tissue: 'reject', medicine: 'reject', dust: 'reject', razor: 'reject', blade: 'reject', syringe: 'reject', vial: 'reject', rubble: 'reject', paint: 'reject', cement: 'reject', brick: 'reject', glass_shard: 'reject', sharp: 'reject', sanitary: 'reject', construction: 'reject'
};

const WasteClassifier = ({ onClassificationComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [classification, setClassification] = useState(null);
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        await tf.ready();
        const mobilenetModel = await mobilenet.load();
        setModel(mobilenetModel);
        toast.success('AI Model loaded successfully!');
      } catch (error) {
        console.error('Error loading model:', error);
        toast.error('Failed to load AI model');
      } finally {
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  // Classify image
  const classifyImage = async (imageElement) => {
    if (!model) {
      toast.error('AI Model not loaded');
      return;
    }
    try {
      setIsLoading(true);
      const predictions = await model.classify(imageElement);
      // Find best match and map to waste category
      let bestCategory = 'reject';
      let bestMatch = null;
      let highestConfidence = 0;
      let matchedExample = '';
      predictions.forEach(prediction => {
        const className = prediction.className.toLowerCase();
        const confidence = prediction.probability;
        const words = className.split(/\s|,|\//);
        words.forEach(word => {
          const mapped = aiToWasteCategory[word];
          if (mapped && confidence > highestConfidence) {
            bestCategory = mapped;
            bestMatch = className;
            highestConfidence = confidence;
            // Try to find a matching example from the chart
            matchedExample = wasteChart[mapped].examples.find(ex => ex.toLowerCase().includes(word)) || '';
          }
        });
      });
      const result = {
        category: bestCategory,
        confidence: (highestConfidence * 100).toFixed(1),
        predictions: predictions.slice(0, 3),
        matchedExample,
        tips: wasteChart[bestCategory].tips,
        label: wasteChart[bestCategory].label,
        color: wasteChart[bestCategory].color,
        timestamp: new Date().toISOString()
      };
      setClassification(result);
      onClassificationComplete && onClassificationComplete(result);
      toast.success(`Classified as ${wasteChart[bestCategory].label}!`);
    } catch (error) {
      console.error('Classification error:', error);
      toast.error('Failed to classify image');
    } finally {
      setIsLoading(false);
    }
  };

  // Camera capture
  const capturePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
      setShowCamera(false);
      const img = new window.Image();
      img.onload = () => classifyImage(img);
      img.src = imageSrc;
    }
  };

  // File upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;
        setImage(imageSrc);
        setShowUpload(false);
        const img = new window.Image();
        img.onload = () => classifyImage(img);
        img.src = imageSrc;
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset
  const resetClassification = () => {
    setClassification(null);
    setImage(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Waste Classifier</h2>
        <p className="text-gray-600">Scan or upload an image to automatically classify waste</p>
      </div>
      {!image && !classification && (
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button onClick={() => setShowCamera(true)} disabled={isLoading} className="btn-primary flex items-center justify-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Scan with Camera</span>
          </button>
          <button onClick={() => setShowUpload(true)} disabled={isLoading} className="btn-secondary flex items-center justify-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Upload Image</span>
          </button>
        </motion.div>
      )}
      <AnimatePresence>
        {showCamera && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Camera Scanner</h3>
                <button onClick={() => setShowCamera(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative rounded-lg overflow-hidden mb-4">
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-64 object-cover" />
                <div className="scan-line"></div>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => setShowCamera(false)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={capturePhoto} className="btn-primary flex-1">Capture</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showUpload && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upload Image</h3>
                <button onClick={() => setShowUpload(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Click to select an image or drag and drop</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="btn-primary">Select Image</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {isLoading && (
        <motion.div className="text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Analyzing image with AI...</p>
        </motion.div>
      )}
      <AnimatePresence>
        {classification && (
          <motion.div className="card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Classification Result</h3>
              <button onClick={resetClassification} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            {image && (
              <div className="mb-4">
                <img src={image} alt="Classified waste" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${classification.color}`}></div>
                <span className="font-semibold text-lg capitalize">{classification.label}</span>
                <span className="text-sm text-gray-500">{classification.confidence}% confidence</span>
              </div>
              {classification.matchedExample && (
                <div className="bg-primary-50 rounded-lg p-4">
                  <h4 className="font-medium mb-1">Matched Example:</h4>
                  <div className="text-gray-800 font-semibold">{classification.matchedExample}</div>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">AI Predictions:</h4>
                <div className="space-y-2">
                  {classification.predictions.map((pred, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="capitalize">{pred.className}</span>
                      <span className="text-gray-600">{(pred.probability * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Classification completed at {new Date(classification.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400">
                <span className="font-semibold text-amber-700">Disposal Tip:</span> {classification.tips}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WasteClassifier; 