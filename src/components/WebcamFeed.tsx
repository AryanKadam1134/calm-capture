import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import { motion } from 'framer-motion';
import { calculateStressScore } from '../utils/stressDetection';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WebcamFeedProps {
  onStressUpdate: (stress: number) => void;
}

const WebcamFeed: React.FC<WebcamFeedProps> = ({ onStressUpdate }) => {
  const webcamRef = useRef<Webcam>(null);
  const modelRef = useRef<faceLandmarksDetection.FaceLandmarksDetector>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const model = await faceLandmarksDetection.createDetector(
          faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
          {
            runtime: 'tfjs',
            refineLandmarks: true,
            maxFaces: 1,
          }
        );
        modelRef.current = model;
      } catch (err) {
        console.error('Error loading model:', err);
        setError('Failed to load face detection model. Please try refreshing the page.');
      }
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
        try {
          const video = webcamRef.current.video;
          const predictions = await modelRef.current.estimateFaces(video);

          if (predictions.length > 0) {
            const landmarks = predictions[0].keypoints;
            const stressScore = calculateStressScore(landmarks);
            onStressUpdate(stressScore);
          }
        } catch (err) {
          console.error('Error detecting face:', err);
          setError('Error detecting face. Please ensure good lighting and that your face is visible.');
        }
      }
    };

    const interval = setInterval(detectFace, 100);
    return () => clearInterval(interval);
  }, [onStressUpdate]);

  const handleUserMediaError = React.useCallback((error: string | DOMException) => {
    console.error('Webcam error:', error);
    setError('Unable to access camera. Please ensure you have granted camera permissions.');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-2xl overflow-hidden glass-panel"
    >
      {error ? (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <Webcam
          ref={webcamRef}
          mirrored
          className="w-full h-full object-cover rounded-2xl"
          videoConstraints={{
            width: 640,
            height: 480,
            facingMode: "user",
          }}
          onUserMediaError={handleUserMediaError}
        />
      )}
    </motion.div>
  );
};

export default WebcamFeed;