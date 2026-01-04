// Lexical analysis interfaces

import { Token, Position, ValidationResult } from "../types/index";

/**
 * Configuration for lexical analysis
 *
 * The framework provides minimal built-in behavior - all token recognition
 * is done through user-defined rules. Configuration options are just
 * convenience features for common cases.
 */
export interface LexerConfig {
  rules: TokenRule[];
  /**
   * Optional convenience: Skip whitespace characters before matching rules.
   * Can be:
   * - `true`: Skip all whitespace characters (common default)
   * - `false`: Don't skip any whitespace, handle them through token rules
   * - `RegExp`: Skip whitespace characters that match this pattern
   *
   * If not specified, defaults to `true`. Users can also define whitespace
   * tokens through rules if they need fine-grained control.
   */
  skipWhitespace?: boolean | RegExp;
  /**
   * Case sensitivity for pattern matching. Defaults to `true`.
   * Users can also control this per-rule through regex flags.
   */
  caseSensitive?: boolean;
}

/**
 * Pattern matcher function that attempts to match at a given offset
 * @param source - The entire source code string
 * @param offset - The current offset to start matching from
 * @returns The matched text if successful, or null if no match
 */
export type PatternMatcher = (source: string, offset: number) => string | null;

/**
 * Token rule definition with pattern and precedence
 *
 * Pattern can be:
 * - `RegExp`: Regular expression pattern (compiled with ^ anchor)
 * - `string`: Literal string pattern (automatically escaped)
 * - `PatternMatcher`: Function for complex matching logic that cannot be expressed as regex
 */
export interface TokenRule {
  type: string;
  pattern: RegExp | string | PatternMatcher;
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
