// Syntax analysis interfaces

import { ASTNode, ValidationResult } from "../types/index";
import { TokenStream } from "./lexer";

/**
 * Configuration for syntax analysis
 */
export interface ParserConfig {
  grammar: GrammarRule[];
  startSymbol: string;
  errorRecovery?: boolean;
  precedenceRules?: PrecedenceRule[];
}

/**
 * Grammar rule definition with productions and actions
 */
export interface GrammarRule {
  name: string;
  productions: Production[];
  action?: (nodes: ASTNode[]) => ASTNode;
}

/**
 * Production rule with symbols and optional action
 */
export interface Production {
  symbols: string[];
  action?: (nodes: ASTNode[]) => ASTNode;
}

/**
 * Precedence rule for operator precedence parsing
 */
export interface PrecedenceRule {
  operator: string;
  precedence: number;
  associativity: "left" | "right" | "none";
}

/**
 * Abstract Syntax Tree with visitor support
 */
export interface AST {
  root: ASTNode;
  accept<T>(visitor: ASTVisitor<T>): T;
  traverse(callback: (node: ASTNode) => void): void;
  find(predicate: (node: ASTNode) => boolean): ASTNode[];
}

/**
 * Visitor pattern for AST traversal
 */
export interface ASTVisitor<T> {
  visitNode(node: ASTNode): T;
  visitChildren(node: ASTNode): T[];
}

/**
 * Syntax analyzer interface
 */
export interface Parser {
  parse(tokens: TokenStream): AST;
  addGrammarRule(rule: GrammarRule): void;
  validateGrammar(): ValidationResult;
}
