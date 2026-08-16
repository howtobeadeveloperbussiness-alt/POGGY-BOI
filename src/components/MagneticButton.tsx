import React, { useRef, useState, MouseEvent, ButtonHTMLAttributes } from 'react';

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 15,
  className = '',
  variant = 'primary',
  onClick,
  ...rest
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    setPosition({
      x: deltaX * strength,
      y: deltaY * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30';
      case 'secondary':
        return 'bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md shadow-lg shadow-black/40';
      case 'glass':
        return 'bg-slate-900/60 hover:bg-slate-800/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md hover:border-cyan-400 shadow-lg shadow-cyan-950/40';
      case 'ghost':
        return 'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-transparent';
      default:
        return '';
    }
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: 'transform 0.15s ease-out',
      }}
      className={`relative inline-flex items-center justify-center font-display font-medium rounded-full tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${getVariantStyles()} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
