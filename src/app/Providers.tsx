"use client";

import { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
    if (savedMode) {
      setMode(savedMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('themeMode', newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2563eb', // matches tailwind blue-600
          },
          ...(mode === 'light'
            ? {
                background: {
                  default: '#f9fafb', // gray-50
                  paper: '#ffffff',
                },
              }
            : {
                background: {
                  default: '#111827', // gray-900
                  paper: '#1f2937', // gray-800
                },
              }),
        },
        typography: {
          fontFamily: 'inherit',
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                ...(mode === 'light'
                  ? {
                      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                      border: '1px solid #e5e7eb',
                    }
                  : {
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)',
                      border: '1px solid #374151',
                    }),
              },
            },
          },
        },
      }),
    [mode],
  );

  // prevent hydration mismatch
  if (!mounted) {
     return <div style={{ visibility: 'hidden' }} />
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
