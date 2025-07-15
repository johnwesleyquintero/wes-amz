import React from "react";

interface AlerionLogoProps {
  className?: string;
}

export const AlerionLogo: React.FC<AlerionLogoProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img src="/logo.svg" alt="Alerion Logo" className="h-full w-full" />
    </div>
  );
};
