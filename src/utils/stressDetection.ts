// Facial features that indicate stress:
// - Furrowed brows (distance between eyebrows)
// - Tightened jaw (jaw muscle tension)
// - Eye tension (eye openness)
// - Lip compression

interface FacialStressIndicators {
  browTension: number;
  jawTension: number;
  eyeTension: number;
  lipCompression: number;
}

// Adjusted baseline values for better sensitivity
const BASELINE_VALUES = {
  browTension: { min: 0.15, max: 0.6 },    // Reduced range for more sensitivity
  jawTension: { min: 0.2, max: 0.7 },      // Adjusted for better jaw tension detection
  eyeTension: { min: 0.1, max: 0.5 },      // More sensitive to eye changes
  lipCompression: { min: 0.05, max: 0.4 }  // More sensitive to lip compression
};

export const calculateStressScore = (landmarks: any[]): number => {
  if (!landmarks || landmarks.length === 0) {
    console.log('No landmarks detected');
    return 0;
  }

  // Extract relevant facial points
  const leftEyebrow = landmarks[65];  // Left eyebrow point
  const rightEyebrow = landmarks[295]; // Right eyebrow point
  const jawLeft = landmarks[172];      // Left jaw point
  const jawRight = landmarks[397];     // Right jaw point
  const leftEye = landmarks[159];      // Left eye corner
  const rightEye = landmarks[386];     // Right eye corner
  const upperLip = landmarks[13];      // Upper lip point
  const lowerLip = landmarks[14];      // Lower lip point

  // Calculate stress indicators
  const indicators: FacialStressIndicators = {
    browTension: calculateDistance(leftEyebrow, rightEyebrow),
    jawTension: calculateDistance(jawLeft, jawRight),
    eyeTension: (calculateDistance(leftEye, rightEye)) / 2,
    lipCompression: calculateDistance(upperLip, lowerLip)
  };

  // Log individual measurements for debugging
  console.log('Stress Indicators:', {
    browTension: indicators.browTension,
    jawTension: indicators.jawTension,
    eyeTension: indicators.eyeTension,
    lipCompression: indicators.lipCompression
  });

  // Normalize and combine indicators with weighted importance
  let stressScore = 0;
  Object.entries(indicators).forEach(([key, value]) => {
    const baseline = BASELINE_VALUES[key as keyof typeof BASELINE_VALUES];
    const normalizedValue = normalizeValue(value, baseline.min, baseline.max);
    
    // Apply different weights to each indicator
    const weights = {
      browTension: 0.3,     // 30% contribution
      jawTension: 0.3,      // 30% contribution
      eyeTension: 0.2,      // 20% contribution
      lipCompression: 0.2   // 20% contribution
    };
    
    stressScore += normalizedValue * (weights[key as keyof typeof weights] * 100);
  });

  // Ensure score is between 0 and 100
  const finalScore = Math.min(Math.max(stressScore, 0), 100);
  console.log('Final Stress Score:', finalScore);
  
  return finalScore;
};

// Helper function to calculate distance between two points
const calculateDistance = (point1: any, point2: any): number => {
  if (!point1 || !point2) {
    console.log('Missing points for distance calculation');
    return 0;
  }
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
};

// Normalize value between 0 and 1
const normalizeValue = (value: number, min: number, max: number): number => {
  if (value < min) return 0;
  if (value > max) return 1;
  return (value - min) / (max - min);
};