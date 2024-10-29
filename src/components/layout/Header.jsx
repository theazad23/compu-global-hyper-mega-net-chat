import React from 'react';
import { MessageSquare } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Compu Global Hyper Mega Net Chat</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/theazad23/compu-global-hyper-mega-net-chat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};