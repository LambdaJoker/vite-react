import { FC, useEffect, useState } from 'react';
import './index.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  life: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const ClickEffect: FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA']; // Pastel colors

    const updateParticles = () => {
      setParticles(prevParticles => {
        if (prevParticles.length === 0) return [];
        
        return prevParticles
          .map(p => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            velocity: {
              x: p.velocity.x * 0.95, // Friction
              y: p.velocity.y * 0.95 + 0.2 // Gravity
            },
            life: p.life - 0.02,
            size: p.size * 0.96 // Shrink
          }))
          .filter(p => p.life > 0);
      });

      animationFrameId = requestAnimationFrame(updateParticles);
    };

    animationFrameId = requestAnimationFrame(updateParticles);

    const handleClick = (e: MouseEvent) => {
      // Add ripple
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600); // Match animation duration

      // Add particles
      const particleCount = 12; // More particles
      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 3 + Math.random() * 4;
        newParticles.push({
          id: Date.now() + i + Math.random(),
          x: e.clientX,
          y: e.clientY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 6 + Math.random() * 6,
          velocity: {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed - 2 // Initial upward burst
          },
          life: 1.0
        });
      }
      setParticles(prev => [...prev, ...newParticles]);
    };

    window.addEventListener('mousedown', handleClick); // Use mousedown for instant response

    return () => {
      window.removeEventListener('mousedown', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="click-effect-container">
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="click-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          } as React.CSSProperties}
        />
      ))}
      {particles.map(p => (
        <div
          key={p.id}
          className="click-particle"
          style={{
            left: p.x,
            top: p.y,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            opacity: p.life,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

export default ClickEffect;