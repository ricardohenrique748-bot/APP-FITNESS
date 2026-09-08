import React, { useEffect, useState } from 'react';
import { getExerciseMedia } from '../data/exerciseMedia';

// How long each still frame holds before dissolving to the next one.
const FRAME_DURATION_MS = 900;
// Focus-pull dissolve length: the outgoing frame blurs out while the
// incoming one blurs in, like a real cut, instead of a flat opacity swap.
const CROSSFADE_MS = 280;

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
      {frames.map((src, idx) => {
        const isActive = idx === activeIndex;
        return (
          <img
            key={src}
            src={src}
            alt="Demonstração do movimento do exercício"
            className="absolute inset-0 w-full h-full object-cover transition-[opacity,filter] ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              filter: isActive ? 'blur(0px)' : 'blur(10px)',
              transitionDuration: `${CROSSFADE_MS}ms`
            }}
          />
        );
      })}
    </div>
  );
};
