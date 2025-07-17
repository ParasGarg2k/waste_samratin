"use client"
import './globals.css';
import AppThemeProvider from './ThemeProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Add Bootstrap JS on the client side
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AppThemeProvider>
          {children}
        </AppThemeProvider>
      </body>
    </html>
  );
}