import React from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative inline-block">
      {children}
      <div className="absolute bg-blue-600 text-white px-2 py-1 rounded whitespace-nowrap bottom-full left-1/2 transform -translate-x-1/2">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
