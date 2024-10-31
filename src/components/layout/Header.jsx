import React from 'react';
import { MessageSquare, Palette } from 'lucide-react';
import { ThemedButton } from '../ui/button';

export const Header = ({ onThemeClick, theme }) => (
  <header className={`h-16 border-b ${theme.border} ${theme.bgPrimary} flex items-center justify-between px-6 flex-shrink-0`}>
    <div className="flex items-center gap-2">
      <MessageSquare className={`h-6 w-6 ${theme.accent} text-white rounded-lg p-1`} />
      <h1 className={`text-xl font-semibold ${theme.text}`}>Compu-Global-Hyper-Mega-Net-Chat</h1>
    </div>
    <div className="flex items-center gap-3">
      <ThemedButton 
        variant="ghost"
        size="icon"
        theme={theme}
        onClick={onThemeClick}
        className="rounded-full"
        title="Change theme"
      >
        <Palette className={`h-5 w-5 ${theme.icon}`} />
      </ThemedButton>
    </div>
  </header>
);