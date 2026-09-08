import React, { useEffect, useState } from 'react';
import { getExerciseMedia } from '../data/exerciseMedia';

const FRAME_DURATION_MS = 900;

interface ExerciseAnimationProps {
  exerciseId: string;
  hint?: string;
  className?: string;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({ exerciseId, hint, className = '' }) => {
  const frames = getExerciseMedia(hint ?? exerciseId);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % frames.length);
    }, FRAME_DURATION_MS);
    return () => clearInterval(interval);
  }, [exerciseId, frames.length]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {frames.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt="Demonstração do movimento do exercício"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
          style={{ opacity: idx === activeIndex ? 1 : 0 }}
        />
      ))}
    </div>
  );
};
