import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { motion } from 'framer-motion';

interface WebcamFeedProps {
  onStressUpdate: (stress: number) => void;
}

const WebcamFeed: React.FC<WebcamFeedProps> = ({ onStressUpdate }) => {
  const webcamRef = useRef<Webcam>(null);
  const modelRef = useRef<faceLandmarksDetection.FaceLandmarksDetector>();

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      modelRef.current = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );
    };
    loadModel();
  }, []);

  useEffect(() => {
    const detectFace = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        modelRef.current &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const predictions = await modelRef.current.estimateFaces({
          input: video,
        });

        if (predictions.length > 0) {
          // Simple stress detection based on facial landmarks
          // This is a placeholder implementation - you would need to implement
          // your actual stress detection logic here based on your model
          const stressScore = Math.random() * 100; // Replace with actual stress detection
          onStressUpdate(stressScore);
        }
      }
    };

    const interval = setInterval(detectFace, 100);
    return () => clearInterval(interval);
  }, [onStressUpdate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-2xl overflow-hidden glass-panel"
    >
      <Webcam
        ref={webcamRef}
        mirrored
        className="w-full h-full object-cover rounded-2xl"
        videoConstraints={{
          width: 640,
          height: 480,
          facingMode: "user",
        }}
      />
    </motion.div>
  );
};

export default WebcamFeed;