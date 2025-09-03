
import React from 'react';

const loadingMessages = [
    "Analyzing your document...",
    "Extracting key concepts...",
    "Crafting challenging questions...",
    "Building your unique quiz...",
    "Almost there..."
];

export const Loader: React.FC = () => {
    const [messageIndex, setMessageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2500);

        return () => clearInterval(interval);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-sky-500 rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};
