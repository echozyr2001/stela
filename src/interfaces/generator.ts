// Code generation interfaces

import { ASTNode } from "../types/index";
import { AST } from "./parser";

/**
 * Configuration for code generation
 */
export interface GeneratorConfig {
  target: string;
  templates: GenerationTemplate[];
  outputFormat?: OutputFormat;
  optimizations?: OptimizationRule[];
}

/**
 * Generation template for specific node types
 */
export interface GenerationTemplate {
  nodeType: string;
  template: string | ((node: ASTNode, context: GenerationContext) => string);
  dependencies?: string[];
}

/**
 * Output format specification
 */
export interface OutputFormat {
  extension: string;
  mimeType?: string;
  encoding?: string;
}

/**
 * Optimization rule for code generation
 */
export interface OptimizationRule {
  name: string;
  condition: (node: ASTNode) => boolean;
  transform: (node: ASTNode) => ASTNode;
}

/**
 * Context for code generation with state tracking
 */
export interface GenerationContext {
  currentNode: ASTNode;
  parentNode?: ASTNode;
  depth: number;
  variables: Map<string, any>;
  imports: Set<string>;
}

/**
 * Result of code generation process
 */
export interface GenerationResult {
  success: boolean;
  output: string;
  imports: string[];
  metadata?: Record<string, any>;
}

/**
 * Code generator interface
 */
export interface CodeGenerator {
  generate(ast: AST): GenerationResult;
  addTemplate(template: GenerationTemplate): void;
  setTarget(target: string): void;
}
