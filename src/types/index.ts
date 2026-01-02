// Core framework types and interfaces

/**
 * Position tracking for error reporting and source location
 */
export interface Position {
  line: number;
  column: number;
  offset: number;
  filename?: string;
}

/**
 * Token representation with type, value, and position information
 */
export interface Token {
  type: string;
  value: string;
  position: Position;
  metadata?: Record<string, any>;
}

/**
 * Abstract Syntax Tree node with hierarchical structure
 */
export interface ASTNode {
  type: string;
  children: ASTNode[];
  value?: any;
  position: Position;
  metadata?: Record<string, any>;
}

/**
 * Compilation error with detailed context and suggestions
 */
export interface CompilationError {
  type: "lexical" | "syntax" | "semantic" | "generation" | "configuration";
  message: string;
  position: Position;
  severity: "error" | "warning" | "info";
  suggestions?: string[];
}

/**
 * Compilation warning for non-fatal issues
 */
export interface CompilationWarning {
  message: string;
  position: Position;
  code?: string;
}

/**
 * Performance metrics for compilation stages
 */
export interface CompilationMetrics {
  lexingTime: number;
  parsingTime: number;
  generationTime: number;
  totalTime: number;
  memoryUsage: number;
  tokensGenerated: number;
  nodesCreated: number;
}

/**
 * Result of compilation process with output and diagnostics
 */
export interface CompilationResult {
  success: boolean;
  output?: string;
  errors: CompilationError[];
  warnings: CompilationWarning[];
  ast?: any; // Will be properly typed when AST interface is imported
  metrics?: CompilationMetrics;
}

/**
 * Validation result for configuration and grammar checking
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Performance metrics tracking interface
 */
export interface PerformanceMetrics {
  compilationCount: number;
  averageCompilationTime: number;
  totalMemoryUsage: number;
  cacheHitRate: number;
}
