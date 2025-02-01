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

// Baseline values based on research studies
const BASELINE_VALUES = {
  browTension: { min: 0.2, max: 0.8 },
  jawTension: { min: 0.3, max: 0.9 },
  eyeTension: { min: 0.2, max: 0.7 },
  lipCompression: { min: 0.1, max: 0.6 }
};

export const calculateStressScore = (landmarks: any[]): number => {
  if (!landmarks || landmarks.length === 0) return 0;

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

  // Normalize and combine indicators
  let stressScore = 0;
  Object.entries(indicators).forEach(([key, value]) => {
    const baseline = BASELINE_VALUES[key as keyof typeof BASELINE_VALUES];
    const normalizedValue = normalizeValue(value, baseline.min, baseline.max);
    stressScore += normalizedValue * 25; // Each indicator contributes 25% to total score
  });

  // Ensure score is between 0 and 100
  return Math.min(Math.max(stressScore, 0), 100);
};

// Helper function to calculate distance between two points
const calculateDistance = (point1: any, point2: any): number => {
  if (!point1 || !point2) return 0;
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + 
    Math.pow(point2.y - point1.y, 2)
  );
};

// Normalize value between 0 and 1
const normalizeValue = (value: number, min: number, max: number): number => {
  return (value - min) / (max - min);
};