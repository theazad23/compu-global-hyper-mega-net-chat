import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const CollapsiblePanel = ({ 
  side = 'left',
  isOpen, 
  onToggle, 
  width = 'w-80',
  children 
}) => {
  return (
    <div
      className={cn(
        'h-full transition-all duration-300 ease-in-out relative',
        isOpen ? width : 'w-12',
        side === 'right' ? 'border-l' : 'border-r'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-2 z-20 transition-all duration-300",
          side === 'right' ? 
            (isOpen ? '-left-3' : '-left-3') : 
            (isOpen ? '-right-3' : '-right-3'),
          "h-6 w-6 rounded-full border bg-background shadow-sm"
        )}
        onClick={onToggle}
      >
        {side === 'right' ? 
          (isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />) :
          (isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)
        }
      </Button>

      <div className={cn(
        "h-full transition-all duration-300",
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
        isOpen ? width : 'w-0',
      )}>
        {children}
      </div>
    </div>
  );
};

const EnhancedLayout = ({ historyPanel, documentsPanel, children }) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(true);

  return (
    <div className="flex h-full">
      {/* History Panel */}
      <CollapsiblePanel
        side="left"
        isOpen={isHistoryOpen}
        onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
      >
        {historyPanel}
      </CollapsiblePanel>

      {/* Main Content */}
      <div className="flex-1 min-w-0 transition-all duration-300">
        {children}
      </div>

      {/* Documents Panel */}
      <CollapsiblePanel
        side="right"
        isOpen={isDocumentsOpen}
        onToggle={() => setIsDocumentsOpen(!isDocumentsOpen)}
      >
        {documentsPanel}
      </CollapsiblePanel>
    </div>
  );
};

export default EnhancedLayout;