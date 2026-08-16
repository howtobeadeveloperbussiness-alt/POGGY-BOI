import React, { useEffect, useRef, useState } from 'react';

export const AuroraBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Multi-color particle system
    const particleCount = Math.min(45, Math.floor(width / 35));
    const colors = [
      { r: 0, g: 240, b: 255 },    // Cyan
      { r: 59, g: 130, b: 246 },   // Electric Blue
      { r: 139, g: 92, b: 246 },   // Purple
      { r: 217, g: 70, b: 239 },   // Magenta
    ];

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: { r: number; g: number; b: number };
      pulseSpeed: number;
      pulseVal: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.5 + 0.15,
        color: colors[i % colors.length],
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseVal: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw drifting & pulsing particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.pulseVal += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentOpacity = p.opacity + Math.sin(p.pulseVal) * 0.15;
        const currentSize = p.size + Math.sin(p.pulseVal) * 0.4;

        // Particle glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 2.5);
        gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${Math.max(0, currentOpacity)})`);
        gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentSize * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, currentOpacity * 1.5)})`;
        ctx.fill();

        // Subtle link lines between close particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${(1 - dist / 110) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep Near-Black Base */}
      <div className="absolute inset-0 bg-[#05070d]" />

      {/* Cursor-Reactive Dynamic Spotlight Beam */}
      <div
        className="absolute w-[650px] h-[650px] rounded-full pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${mousePos.x - 325}px, ${mousePos.y - 325}px)`,
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.07) 0%, rgba(139, 92, 246, 0.04) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Animated Aurora Waves & Ambient Blobs */}
      {/* Wave 1: Cyan / Electric Blue */}
      <div className="absolute -top-[20%] left-[5%] w-[65vw] h-[65vw] max-w-[850px] max-h-[850px] rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-600/12 to-transparent blur-[140px] animate-blob-1" />

      {/* Wave 2: Deep Purple */}
      <div className="absolute top-[25%] -right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-purple-600/14 via-indigo-600/10 to-transparent blur-[150px] animate-blob-2" />

      {/* Wave 3: Magenta / Pink Accent */}
      <div className="absolute bottom-[5%] left-[25%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-tr from-fuchsia-600/12 via-pink-600/8 to-transparent blur-[140px] animate-blob-3" />

      {/* Wave 4: Cyan Base Low Glow */}
      <div className="absolute -bottom-[20%] right-[15%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-cyan-600/10 blur-[130px] animate-blob-1" />

      {/* Animated Perspective Mesh / Grid Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      {/* Radial Vignette Mask */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,7,13,0.85)_100%)]" />

      {/* Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-80" />
    </div>
  );
};
