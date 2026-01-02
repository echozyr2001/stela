// Framework core interfaces

import {
  CompilationResult,
  PerformanceMetrics,
  ValidationResult,
} from "../types/index";
import { LexerConfig } from "./lexer";
import { ParserConfig } from "./parser";
import { GeneratorConfig } from "./generator";
import { Plugin } from "./plugin";

/**
 * Main compiler framework interface
 */
export interface CompilerFramework {
  createCompiler(config: CompilerConfig): Compiler;
  registerPlugin(plugin: Plugin): void;
  getPerformanceMetrics(): PerformanceMetrics;
}

/**
 * Complete compiler configuration
 */
export interface CompilerConfig {
  lexer: LexerConfig;
  parser: ParserConfig;
  generator: GeneratorConfig;
  errorHandling?: ErrorHandlingConfig;
  performance?: PerformanceConfig;
}

/**
 * Error handling configuration
 */
export interface ErrorHandlingConfig {
  maxErrors?: number;
  stopOnFirstError?: boolean;
  errorRecovery?: boolean;
  customFormatter?: (error: any) => string;
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  enableCaching?: boolean;
  cacheSize?: number;
  enableProfiling?: boolean;
  memoryLimit?: number;
}

/**
 * Compiler instance interface
 */
export interface Compiler {
  compile(source: string): CompilationResult;
  compileAsync(source: string): Promise<CompilationResult>;
  validateConfig(): ValidationResult;
}
