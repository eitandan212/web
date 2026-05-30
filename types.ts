
import React from 'react';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ScriptResponse {
  scene: number;
  description: string;
  visualPrompt: string;
}

export type ToolType = 'video-gen' | 'video-edit' | 'tts' | 'video-animator' | 'visual-creator' | 'social-manager';

export type AIModelType = 
  | 'gemini-3-flash-preview' 
  | 'gemini-3-pro-preview' 
  | 'gemini-3-pro-image-preview'
  | 'gemini-flash-lite-latest'
  | 'gemini-2.5-flash-image';

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface ToolState {
  loading: boolean;
  error: string | null;
  result: any;
}

export interface VisualConfig {
  prompt: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3';
  model: AIModelType;
}

export type SocialPlatform = 'youtube' | 'tiktok' | 'instagram';

export interface ConnectedAccount {
  platform: SocialPlatform;
  username: string;
  isConnected: boolean;
}
