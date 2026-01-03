// Lexical analyzer implementation

import { Token, Position, ValidationResult } from "../types/index";
import {
  Lexer as ILexer,
  LexerConfig,
  TokenRule,
  TokenStream,
} from "../interfaces/lexer";
import { TokenStream as TokenStreamImpl } from "./TokenStream";

/**
 * Lexer implementation for tokenizing source code based on configurable rules
 */
export class Lexer implements ILexer {
  private rules: TokenRule[];
  private config: {
    skipWhitespace: boolean | RegExp;
    caseSensitive: boolean;
  };

  constructor(config: LexerConfig) {
    this.rules = [...config.rules];

    // Sort rules by precedence (higher precedence first)
    this.rules.sort((a, b) => (b.precedence ?? 0) - (a.precedence ?? 0));

    // Set default configuration (minimal defaults, user controls everything through rules)
    this.config = {
      skipWhitespace: config.skipWhitespace ?? true,
      caseSensitive: config.caseSensitive ?? true,
    };
  }

  /**
   * Tokenize source code into a token stream
   * @param source - Source code to tokenize
   * @returns TokenStream containing all tokens
   */
  tokenize(source: string): TokenStream {
    const tokens: Token[] = [];
    let offset = 0;
    let line = 1;
    let column = 1;

    while (offset < source.length) {
      // Optional convenience: Skip whitespace if configured
      // Users can also handle whitespace through token rules if needed
      const skipWhitespace = this.config.skipWhitespace;
      if (skipWhitespace !== false) {
        let shouldSkip = false;
        const char = source[offset];

        if (skipWhitespace === true) {
          // Skip all whitespace (common default, but user can override with rules)
          shouldSkip = /\s/.test(char);
        } else if (skipWhitespace instanceof RegExp) {
          // Skip whitespace that matches the pattern
          shouldSkip = skipWhitespace.test(char);
        }

        if (shouldSkip) {
          // Update position tracking
          if (char === "\n") {
            line++;
            column = 1;
          } else {
            column++;
          }
          offset++;
          continue; // Skip this character and continue to next iteration
        }
      }

      if (offset >= source.length) {
        break;
      }

      // Try to match each rule (all token recognition is done through user-defined rules)
      let matched = false;
      for (const rule of this.rules) {
        const pattern = this.compilePattern(rule.pattern);
        const remaining = source.slice(offset);
        const match = remaining.match(pattern);

        // match.index is 0 for patterns starting with ^, or undefined for global matches
        // Since we use ^ anchor, we just check if match exists
        if (match && match[0]) {
          const matchedText = match[0];
          const startPosition: Position = {
            line,
            column,
            offset,
          };

          // Handle custom action if provided
          let token: Token | null = null;
          if (rule.action) {
            token = rule.action(matchedText, startPosition);
          } else {
            // Default token creation
            token = {
              type: rule.type,
              value: matchedText,
              position: startPosition,
            };
          }

          // Only add token if action didn't return null (for filtering)
          if (token !== null) {
            tokens.push(token);
          }

          // Update position tracking
          const newlines = (matchedText.match(/\n/g) || []).length;
          if (newlines > 0) {
            line += newlines;
            const lastNewlineIndex = matchedText.lastIndexOf("\n");
            column = matchedText.length - lastNewlineIndex;
          } else {
            column += matchedText.length;
          }

          offset += matchedText.length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        // No rule matched - create an error token
        const position: Position = {
          line,
          column,
          offset,
        };
        const errorToken: Token = {
          type: "ERROR",
          value: source[offset],
          position,
          metadata: {
            error: `Unexpected character: ${source[offset]}`,
          },
        };
        tokens.push(errorToken);
        offset++;
        column++;
      }
    }

    return new TokenStreamImpl(tokens);
  }

  /**
   * Add a new token rule
   * @param rule - Token rule to add
   */
  addRule(rule: TokenRule): void {
    this.rules.push(rule);
    // Re-sort by precedence
    this.rules.sort((a, b) => (b.precedence ?? 0) - (a.precedence ?? 0));
  }

  /**
   * Remove a token rule by type
   * @param type - Type of rule to remove
   */
  removeRule(type: string): void {
    this.rules = this.rules.filter((rule) => rule.type !== type);
  }

  /**
   * Validate the current rule configuration
   * @returns ValidationResult indicating if rules are valid
   */
  validateRules(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (this.rules.length === 0) {
      errors.push("No token rules defined");
    }

    // Check for duplicate rule types
    const ruleTypes = new Map<string, number>();
    for (const rule of this.rules) {
      const count = ruleTypes.get(rule.type) || 0;
      ruleTypes.set(rule.type, count + 1);
    }

    for (const [type, count] of ruleTypes.entries()) {
      if (count > 1) {
        warnings.push(`Multiple rules defined for type "${type}"`);
      }
    }

    // Validate pattern compilation
    for (const rule of this.rules) {
      try {
        this.compilePattern(rule.pattern);
      } catch (error) {
        errors.push(
          `Invalid pattern for rule "${rule.type}": ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Compile a pattern (string or RegExp) into a RegExp with proper flags
   * @param pattern - Pattern to compile (string or RegExp)
   * @returns Compiled RegExp with ^ anchor for start-of-string matching
   */
  private compilePattern(pattern: RegExp | string): RegExp {
    if (pattern instanceof RegExp) {
      // Remove global flag as we match from the start each time
      let flags = pattern.flags.replace("g", "");

      // Adjust case sensitivity based on config
      if (this.config.caseSensitive && flags.includes("i")) {
        flags = flags.replace("i", "");
      }
      if (!this.config.caseSensitive && !flags.includes("i")) {
        flags += "i";
      }

      // Ensure pattern starts with ^ for anchor matching
      const source = pattern.source.startsWith("^")
        ? pattern.source
        : `^${pattern.source}`;

      return new RegExp(source, flags);
    }

    // String pattern - escape special regex characters and compile
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flags = this.config.caseSensitive ? "" : "i";
    return new RegExp(`^${escaped}`, flags);
  }

  /**
   * Get all current rules
   * @returns Copy of all token rules
   */
  getRules(): TokenRule[] {
    return [...this.rules];
  }

  /**
   * Update configuration
   * @param updates - Partial configuration updates
   */
  updateConfig(updates: Partial<Omit<LexerConfig, "rules">>): void {
    if (updates.skipWhitespace !== undefined) {
      this.config.skipWhitespace = updates.skipWhitespace;
    }
    if (updates.caseSensitive !== undefined) {
      this.config.caseSensitive = updates.caseSensitive;
    }
  }
}
