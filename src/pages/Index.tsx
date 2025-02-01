import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WebcamFeed from '../components/WebcamFeed';
import StressMeter from '../components/StressMeter';

const Index = () => {
  const [stressLevel, setStressLevel] = useState(0);

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <header className="text-center mb-8">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-2"
          >
            Stress Detection
          </motion.h1>
          <motion.p
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-muted-foreground"
          >
            Real-time stress level monitoring using facial analysis
          </motion.p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <WebcamFeed onStressUpdate={setStressLevel} />
          <div className="space-y-6">
            <StressMeter stress={stressLevel} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl"
            >
              <h3 className="text-lg font-semibold mb-4">Tips</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Maintain good posture</li>
                <li>• Take deep breaths</li>
                <li>• Stay within camera view</li>
                <li>• Ensure good lighting</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;