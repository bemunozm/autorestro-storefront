import { ComponentType, lazy } from 'react';
import { TemplateProps } from './types';

export const templateRegistry: Record<string, ComponentType<TemplateProps>> = {
  'hero-centered': lazy(() => import('./hero-centered')),
  'split-layout': lazy(() => import('./split-layout')),
  'minimal': lazy(() => import('./minimal')),
  'premium-restaurant': lazy(() => import('./premium-restaurant')),
  'custom-shinesushi': lazy(() => import('./custom-shinesushi')),
};

export type TemplateName = keyof typeof templateRegistry;
