import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-[#173b5d] text-white py-3.5 px-6 rounded-[10px] shadow-lg text-sm font-semibold z-50 animate-fade-in flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#079669]" />
      <span>{message}</span>
    </div>
  );
};
