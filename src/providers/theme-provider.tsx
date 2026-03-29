'use client';

import { useRestaurant } from '@/providers/restaurant-provider';
import { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';

interface ThemeContextType {
  primary: string;
  secondary: string;
  accent: string;
  font: string;
  headingFont: string;
  radius: string;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeConfig must be used within DynamicTheme');
  return context;
}

export function DynamicTheme({ children }: { children: ReactNode }) {
  const { restaurant } = useRestaurant();
  const theme = restaurant?.landingConfig?.theme;

  const resolvedTheme = useMemo(() => ({
    primary: theme?.primaryColor || restaurant?.primaryColor || '#000000',
    secondary: theme?.secondaryColor || restaurant?.secondaryColor || '#666666',
    accent: theme?.accentColor || theme?.secondaryColor || '#ff0000',
    font: theme?.fontFamily || 'Inter, sans-serif',
    headingFont: theme?.headingFont || theme?.fontFamily || 'Inter, sans-serif',
    radius: {
      none: '0px',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    }[theme?.borderRadius || 'md'] || '0.375rem',
  }), [theme, restaurant]);

  useEffect(() => {
    if (!restaurant) return;
    
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', resolvedTheme.primary);
    root.style.setProperty('--theme-secondary', resolvedTheme.secondary);
    root.style.setProperty('--theme-accent', resolvedTheme.accent);
    root.style.setProperty('--theme-font', resolvedTheme.font);
    root.style.setProperty('--theme-heading-font', resolvedTheme.headingFont);
    root.style.setProperty('--theme-radius', resolvedTheme.radius);
    
    // Compatibility with old code
    root.style.setProperty('--color-primary', resolvedTheme.primary);
    root.style.setProperty('--color-secondary', resolvedTheme.secondary);

    // Dynamic Fonts Loading
    const fontsToLoad = [];
    if (theme?.fontFamily) fontsToLoad.push(theme.fontFamily);
    if (theme?.headingFont && theme.headingFont !== theme.fontFamily) fontsToLoad.push(theme.headingFont);
    
    if (fontsToLoad.length > 0) {
      const linkId = 'dynamic-google-fonts';
      let link = document.getElementById(linkId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      const families = fontsToLoad
        .map(f => `family=${f.trim().replace(/ /g, '+')}:wght@300;400;500;600;700;800;900`)
        .join('&');
      link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    }

    // Dynamic Custom CSS Injection
    if (theme?.customCSS) {
      const styleId = 'dynamic-custom-css';
      let style = document.getElementById(styleId) as HTMLStyleElement;
      if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
      }
      
      // Basic CSS safety sanitization
      const safeCSS = theme.customCSS
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, '')
        .replace(/javascript:/gim, '')
        .replace(/expression\(/gim, '');
        
      style.innerHTML = safeCSS;
    } else {
      document.getElementById('dynamic-custom-css')?.remove();
    }

    return () => {
      // We don't necessarily want to remove fonts on every render, but custom CSS is safer to clear
    }
  }, [resolvedTheme, theme, restaurant]);

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      {children}
    </ThemeContext.Provider>
  );
}
