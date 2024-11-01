import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronLeft, ChevronRight, MessageSquare, Files } from 'lucide-react';
import { TabSelector } from './TabSelector';
import { ChatSidebar } from './ChatSidebar';
import { DocumentSidebar } from './DocumentSidebar';
import { AnimatePresence, motion } from 'framer-motion';

export const SidebarContainer = () => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  const sidebarVariants = {
    open: {
      width: '320px',
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    closed: {
      width: '48px',
      transition: { duration: 0.2, ease: 'easeIn' }
    }
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.1, duration: 0.2 }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial="open"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
      className={`
        relative h-full border-r flex flex-col
        ${theme.border} ${theme.bgPrimary}
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`
          absolute -right-3 top-2 z-20
          h-6 w-6 rounded-full border
          ${theme.border} ${theme.bgPrimary}
          shadow-sm flex items-center justify-center
          hover:${theme.bgHover}
        `}
      >
        {isOpen ? (
          <ChevronLeft className={`h-4 w-4 ${theme.icon}`} />
        ) : (
          <ChevronRight className={`h-4 w-4 ${theme.icon}`} />
        )}
      </button>

      {/* Header with Tabs */}
      <div className={`h-14 border-b ${theme.border} flex items-center px-2`}>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex items-center gap-4 w-full"
            >
              <TabSelector
                tabs={[
                  { id: 'chat', icon: MessageSquare, label: 'Chats' },
                  { id: 'documents', icon: Files, label: 'Documents' }
                ]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </motion.div>
          ) : (
            <motion.div
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="flex justify-center w-full"
            >
              {activeTab === 'chat' ? (
                <MessageSquare className={`h-5 w-5 ${theme.icon}`} />
              ) : (
                <Files className={`h-5 w-5 ${theme.icon}`} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="h-full"
            >
              {activeTab === 'chat' ? (
                <ChatSidebar />
              ) : (
                <DocumentSidebar />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};