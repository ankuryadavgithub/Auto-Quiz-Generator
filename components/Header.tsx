
import React from 'react';
import { BrainCircuitIcon } from './icons/Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-900/70 shadow-md backdrop-blur-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-3">
          <BrainCircuitIcon className="w-8 h-8 text-sky-500" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Auto Quiz Generator
          </h1>
        </div>
      </div>
    </header>
  );
};
