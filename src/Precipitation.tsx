import React, { useState, useEffect } from 'react';

// We define types for our "particles"
interface Particle {
  id: number;
  style: React.CSSProperties;
  className: string;
}

// We define props for the component
interface PrecipitationProps {
  condition: string | null;
}

const Precipitation: React.FC<PrecipitationProps> = ({ condition }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // If the weather does not require precipitation, clear the array
    if (!condition || !['rain', 'drizzle', 'thunderstorm', 'snow'].includes(condition)) {
      setParticles([]);
      return;
    }

    // We define the number and type of particles
    const count = condition.includes('rain') || condition === 'thunderstorm' ? 100 : 70;
    const className = condition.includes('snow') ? 'snow-flake' : 'rain-drop';

    // Create an array of new particles with random styles
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => {
      const style: React.CSSProperties = {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 2 + 1}s`,
        animationDelay: `${Math.random() * 2}s`,
      };
      if (className === 'snow-flake') {
        const size = Math.random() * 4 + 4;
        style.width = `${size}px`;
        style.height = `${size}px`;
      }
      return { id: i, style, className };
    });

    setParticles(newParticles);
  }, [condition]); // This effect only re-runs when the weather changes

  // If there are no particles, render nothing
  if (particles.length === 0) {
    return null;
  }

  // Render the container with particles
  return (
    <div className="precipitation-container">
      {particles.map(p => (
        <div key={p.id} className={p.className} style={p.style}></div>
      ))}
    </div>
  );
};

export default Precipitation;
