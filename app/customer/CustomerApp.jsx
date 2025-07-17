"use client";

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";
import Home from "./Home";
import Activity from "./Activity";
import Profile from "./Profile";
import "./styles.css"; // Import the combined styles.css

function App() {
  const [currentTab, setCurrentTab] = useState("home");

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <Router>
      {/* Apply app-container class for background and min-height */}
      <div className="app-container">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#22c55e",
                secondary: "#fff",
              },
            },
          }}
        />

        <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        {/* Apply main-content class for padding */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route
                path="/"
                element={
                  <motion.div
                    key="home"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <Home />
                  </motion.div>
                }
              />
              <Route
                path="/activity"
                element={
                  <motion.div
                    key="activity"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <Activity />
                  </motion.div>
                }
              />
              <Route
                path="/profile"
                element={
                  <motion.div
                    key="profile"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <Profile />
                  </motion.div>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}

export default App;
