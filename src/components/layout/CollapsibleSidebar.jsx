import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CollapsibleSidebar = ({ 
  isOpen, 
  onToggle, 
  children,
  side = 'left',
  width = 'w-80',
  theme
}) => {
  return (
    <div
      className={cn(
        'flex-shrink-0 h-full transition-all duration-300 ease-in-out relative',
        isOpen ? width : 'w-12',
        side === 'left' ? `border-r ${theme.border}` : `border-l ${theme.border}`,
        theme.bgPrimary
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          "absolute top-2 z-20 transition-all duration-300",
          side === 'left' ? 
            (isOpen ? '-right-3' : '-right-3') : 
            (isOpen ? '-left-3' : '-left-3'),
          `h-6 w-6 rounded-full border ${theme.border} ${theme.bgPrimary} shadow-sm 
           flex items-center justify-center hover:${theme.bgHover}`,
        )}
      >
        {side === 'left' ? 
          (isOpen ? <ChevronLeft className={`h-4 w-4 ${theme.icon}`} /> : 
                   <ChevronRight className={`h-4 w-4 ${theme.icon}`} />) :
          (isOpen ? <ChevronRight className={`h-4 w-4 ${theme.icon}`} /> : 
                   <ChevronLeft className={`h-4 w-4 ${theme.icon}`} />)
        }
      </button>

      {/* Content */}
      <div className={cn(
        "h-full transition-all duration-300",
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
        isOpen ? width : 'w-0'
      )}>
        {children}
      </div>
    </div>
  );
};