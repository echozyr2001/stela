// Lexical analysis interfaces

import { Token, Position, ValidationResult } from "../types/index";

/**
 * Configuration for lexical analysis
 */
export interface LexerConfig {
  rules: TokenRule[];
  skipWhitespace?: boolean;
  preserveComments?: boolean;
  caseSensitive?: boolean;
}

/**
 * Token rule definition with pattern and precedence
 */
export interface TokenRule {
  type: string;
  pattern: RegExp | string;
  precedence?: number;
  action?: (match: string, position: Position) => Token | null;
}

/**
 * Token stream with lookahead capabilities
 */
export interface TokenStream {
  peek(offset?: number): Token | null;
  consume(): Token | null;
  hasMore(): boolean;
  mark(): number;
  reset(position: number): void;
  getPosition(): number;
  getTokens(): Token[];
}

/**
 * Lexical analyzer interface
 */
export interface Lexer {
  tokenize(source: string): TokenStream;
  addRule(rule: TokenRule): void;
  removeRule(type: string): void;
  validateRules(): ValidationResult;
}
