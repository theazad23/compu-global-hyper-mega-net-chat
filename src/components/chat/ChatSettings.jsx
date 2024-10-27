import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PROMPT_STRATEGIES, RESPONSE_FORMATS, CONTEXT_MODES } from '../../utils/constants';

export const ChatSettings = ({ 
  open, 
  onOpenChange, 
  settings, 
  onSettingsChange 
}) => {
  const handleSettingChange = (key, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chat Settings</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt Strategy</label>
            <Select
              value={settings.strategy}
              onValueChange={(value) => handleSettingChange('strategy', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PROMPT_STRATEGIES.STANDARD}>Standard</SelectItem>
                <SelectItem value={PROMPT_STRATEGIES.ACADEMIC}>Academic</SelectItem>
                <SelectItem value={PROMPT_STRATEGIES.CONCISE}>Concise</SelectItem>
                <SelectItem value={PROMPT_STRATEGIES.CREATIVE}>Creative</SelectItem>
                <SelectItem value={PROMPT_STRATEGIES.STEP_BY_STEP}>Step by Step</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Response Format</label>
            <Select
              value={settings.responseFormat}
              onValueChange={(value) => handleSettingChange('responseFormat', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RESPONSE_FORMATS.DEFAULT}>Default</SelectItem>
                <SelectItem value={RESPONSE_FORMATS.JSON}>JSON</SelectItem>
                <SelectItem value={RESPONSE_FORMATS.MARKDOWN}>Markdown</SelectItem>
                <SelectItem value={RESPONSE_FORMATS.BULLET_POINTS}>Bullet Points</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Context Mode</label>
            <Select
              value={settings.contextMode}
              onValueChange={(value) => handleSettingChange('contextMode', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CONTEXT_MODES.STRICT}>Strict</SelectItem>
                <SelectItem value={CONTEXT_MODES.FLEXIBLE}>Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};