import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PROMPT_STRATEGIES, RESPONSE_FORMATS, CONTEXT_MODES } from '../../utils/constants';

export const ChatSettings = ({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
  theme
}) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${theme.bgPrimary} ${theme.border}`}>
        <DialogHeader>
          <DialogTitle className={theme.text}>Chat Settings</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium ${theme.text}`}>
              Prompt Strategy
            </label>
            <Select
              value={settings.strategy}
              onValueChange={(value) => handleSettingChange('strategy', value)}
            >
              <SelectTrigger className={`${theme.bgPrimary} ${theme.border} ${theme.text}`}>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent className={`${theme.bgPrimary} ${theme.border}`}>
                {Object.entries(PROMPT_STRATEGIES).map(([key, value]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className={`${theme.text} hover:${theme.bgHover}`}
                  >
                    {key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${theme.text}`}>
              Response Format
            </label>
            <Select
              value={settings.responseFormat}
              onValueChange={(value) => handleSettingChange('responseFormat', value)}
            >
              <SelectTrigger className={`${theme.bgPrimary} ${theme.border} ${theme.text}`}>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className={`${theme.bgPrimary} ${theme.border}`}>
                {Object.entries(RESPONSE_FORMATS).map(([key, value]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className={`${theme.text} hover:${theme.bgHover}`}
                  >
                    {key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium ${theme.text}`}>
              Context Mode
            </label>
            <Select
              value={settings.contextMode}
              onValueChange={(value) => handleSettingChange('contextMode', value)}
            >
              <SelectTrigger className={`${theme.bgPrimary} ${theme.border} ${theme.text}`}>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className={`${theme.bgPrimary} ${theme.border}`}>
                {Object.entries(CONTEXT_MODES).map(([key, value]) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className={`${theme.text} hover:${theme.bgHover}`}
                  >
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};