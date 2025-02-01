import React from 'react';
import { motion } from 'framer-motion';

interface StressMeterProps {
  stress: number;
}

const StressMeter: React.FC<StressMeterProps> = ({ stress }) => {
  const getStressColor = (level: number) => {
    if (level < 30) return 'bg-green-500';
    if (level < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStressLabel = (level: number) => {
    if (level < 30) return 'Low Stress';
    if (level < 70) return 'Moderate Stress';
    return 'High Stress';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl space-y-4"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-foreground">Stress Level</h3>
        <span className="text-sm font-medium text-muted-foreground">
          {Math.round(stress)}%
        </span>
      </div>
      <div className="stress-meter">
        <motion.div
          className={`stress-meter-fill ${getStressColor(stress)}`}
          initial={{ width: '0%' }}
          animate={{ width: `${stress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="text-sm font-medium text-center text-muted-foreground">
        {getStressLabel(stress)}
      </div>
    </motion.div>
  );
};

export default StressMeter;