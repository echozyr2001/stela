// Main entry point for the Universal Compiler Framework

// Export all types
export * from "./types/index";

// Export interfaces (types)
export type * from "./interfaces/index";

// Export core implementations (classes)
export { Lexer, TokenStream } from "./core/index";

// Framework version
export const VERSION = "1.0.0";

// Main framework class (placeholder for now)
export class UniversalCompilerFramework {
  private static instance: UniversalCompilerFramework;

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): UniversalCompilerFramework {
    if (!UniversalCompilerFramework.instance) {
      UniversalCompilerFramework.instance = new UniversalCompilerFramework();
    }
    return UniversalCompilerFramework.instance;
  }

  public getVersion(): string {
    return VERSION;
  }
}

// Default export
export default UniversalCompilerFramework;
