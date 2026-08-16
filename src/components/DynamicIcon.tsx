import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5' }) => {
  // Normalize icon name
  const IconComponent = (Icons as unknown as Record<string, React.FC<{ className?: string }>>)[name] || Icons.Sparkles;
  return <IconComponent className={className} />;
};
