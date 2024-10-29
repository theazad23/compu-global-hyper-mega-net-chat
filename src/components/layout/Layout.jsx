import React from 'react';
import { Header } from './Header';

export const Layout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header className="flex-none" />
      <main className="flex-1 overflow-hidden container mx-auto px-4 py-4">
        {children}
      </main>
      <footer className="flex-none border-t bg-white py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with React and FastAPI
        </div>
      </footer>
    </div>
  );
};