import React from 'react';
import { Header } from './Header';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t bg-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with React and FastAPI
        </div>
      </footer>
    </div>
  );
};