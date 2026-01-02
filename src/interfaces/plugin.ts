// Plugin system interfaces

import { CompilerConfig } from "./framework";

/**
 * Plugin definition with hooks and metadata
 */
export interface Plugin {
  name: string;
  version: string;
  hooks: PluginHook[];
  dependencies?: string[];
}

/**
 * Plugin hook for specific compilation stages
 */
export interface PluginHook {
  stage: "lexer" | "parser" | "generator" | "pre-compile" | "post-compile";
  priority: number;
  handler: PluginHandler;
}

/**
 * Plugin handler function type
 */
export type PluginHandler = (context: PluginContext) => PluginResult;

/**
 * Context provided to plugin handlers
 */
export interface PluginContext {
  stage: string;
  data: any;
  config: CompilerConfig;
  metadata: Record<string, any>;
}

/**
 * Result returned by plugin handlers
 */
export interface PluginResult {
  success: boolean;
  data?: any;
  errors?: string[];
  metadata?: Record<string, any>;
}
