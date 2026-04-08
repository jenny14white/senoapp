import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial } from '../contexts/TutorialContext';
import { Button } from './ui/button';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export function TutorialOverlay() {
  const { currentStep, isActive, steps, nextStep, prevStep, skipTutorial } = useTutorial();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isActive && steps[currentStep]) {
      const targetElement = document.getElementById(steps[currentStep].targetId);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const stepPosition = steps[currentStep].position || 'bottom';
        
        let top = 0;
        let left = 0;

        switch (stepPosition) {
          case 'top':
            top = rect.top - 120;
            left = rect.left + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 20;
            left = rect.left + rect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - 320;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 20;
            break;
        }

        setPosition({ top, left });

        // Highlight element
        targetElement.style.position = 'relative';
        targetElement.style.zIndex = '1001';
        targetElement.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.5)';
        targetElement.style.borderRadius = '12px';

        return () => {
          targetElement.style.position = '';
          targetElement.style.zIndex = '';
          targetElement.style.boxShadow = '';
        };
      }
    }
  }, [currentStep, isActive, steps]);

  if (!isActive || !steps[currentStep]) return null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]"
          onClick={skipTutorial}
        />
      </AnimatePresence>

      {/* Tutorial Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          position: 'fixed',
          top: position.top,
          left: position.left,
          transform: 'translateX(-50%)',
        }}
        className="z-[1002] w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {steps[currentStep].title}
          </h3>
          <button
            onClick={skipTutorial}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {steps[currentStep].description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep
                    ? 'bg-purple-500'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" size="sm" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <Button size="sm" onClick={nextStep}>
              {currentStep === steps.length - 1 ? 'Zakończ' : 'Dalej'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
