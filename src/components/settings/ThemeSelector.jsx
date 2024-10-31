import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Palette } from 'lucide-react';
import { themes } from '../../config/themes';

const ThemePreview = ({ theme, currentTheme, onClick }) => {
  const colors = themes[theme].preview;
  
  return (
    <button
      onClick={() => onClick(theme)}
      className={`
        p-4 rounded-lg border transition-all duration-200 w-full
        ${currentTheme === theme ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200 dark:border-gray-700'}
      `}
      style={{ backgroundColor: colors.background }}
    >
      <div className="text-left" style={{ color: colors.text }}>
        <div className="font-medium mb-3">{themes[theme].name}</div>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors.primary }} />
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors.accent }} />
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: colors.text }} />
        </div>
        <div className="mt-3 p-2 rounded" style={{ backgroundColor: colors.accent }}>
          <div className="text-xs" style={{ color: colors.text }}>Preview Text</div>
        </div>
      </div>
    </button>
  );
};

export const ThemeSelector = ({ open, onOpenChange, currentTheme, onThemeSelect, theme }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${theme.bgPrimary} ${theme.text} border ${theme.border}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${theme.text}`}>
            <Palette className="h-5 w-5" />
            Appearance
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <h3 className={`text-sm font-medium ${theme.textSecondary}`}>Select Theme</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(themes).map((themeKey) => (
              <ThemePreview
                key={themeKey}
                theme={themeKey}
                currentTheme={currentTheme}
                onClick={onThemeSelect}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};