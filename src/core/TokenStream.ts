// Token stream implementation with lookahead and backtracking support

import { Token } from "../types/index";
import { TokenStream as ITokenStream } from "../interfaces/lexer";

/**
 * TokenStream implementation with lookahead and backtracking capabilities
 */
export class TokenStream implements ITokenStream {
  private tokens: Token[];
  private currentIndex: number;
  private marks: number[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.currentIndex = 0;
    this.marks = [];
  }

  /**
   * Peek at a token ahead without consuming it
   * @param offset - Number of tokens to look ahead (default: 0 for next token)
   * @returns Token at the offset position or null if out of bounds
   */
  peek(offset: number = 0): Token | null {
    const index = this.currentIndex + offset;
    if (index >= 0 && index < this.tokens.length) {
      return this.tokens[index];
    }
    return null;
  }

  /**
   * Consume and return the next token
   * @returns The next token or null if stream is exhausted
   */
  consume(): Token | null {
    if (this.currentIndex < this.tokens.length) {
      return this.tokens[this.currentIndex++];
    }
    return null;
  }

  /**
   * Check if there are more tokens in the stream
   * @returns True if there are more tokens, false otherwise
   */
  hasMore(): boolean {
    return this.currentIndex < this.tokens.length;
  }

  /**
   * Mark the current position for potential backtracking
   * @returns The current position index
   */
  mark(): number {
    this.marks.push(this.currentIndex);
    return this.currentIndex;
  }

  /**
   * Reset the stream position to a previously marked position
   * @param position - The position index to reset to (from mark() call)
   */
  reset(position: number): void {
    if (position >= 0 && position <= this.tokens.length) {
      this.currentIndex = position;
    } else {
      throw new Error(`Invalid reset position: ${position}`);
    }
  }

  /**
   * Get the current position in the token stream
   * @returns Current position index
   */
  getPosition(): number {
    return this.currentIndex;
  }

  /**
   * Get all tokens in the stream
   * @returns Array of all tokens
   */
  getTokens(): Token[] {
    return [...this.tokens];
  }

  /**
   * Clear all marks
   */
  clearMarks(): void {
    this.marks = [];
  }

  /**
   * Get the number of remaining tokens
   * @returns Number of tokens remaining in the stream
   */
  remaining(): number {
    return this.tokens.length - this.currentIndex;
  }
}
