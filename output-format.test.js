import { describe, test, expect } from "vitest";
import { validate, registerSchema } from "./src/index.js";

/**
 * @import { Json } from "./src/jsonast.d.ts"
 */

describe("Output Format", () => {
  describe("Basic Structure", () => {
    test("valid schema returns correct output structure", () => {
      /** @type Json */
      const schema = { type: "string" };
      const instance = "test";
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(true);
      expect(output.absoluteKeywordLocation).toBeDefined();
      expect(output.instanceLocation).toBeDefined();
      expect(output.errors).toBeUndefined();
    });

    test("invalid schema returns errors array", () => {
      /** @type Json */
      const schema = { type: "string" };
      const instance = 42;
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.absoluteKeywordLocation).toBeDefined();
      expect(output.instanceLocation).toBeDefined();
      expect(output.errors).toBeDefined();
      expect(Array.isArray(output.errors)).toBe(true);
    });

    test("keywordLocation is included when available", () => {
      /** @type Json */
      const schema = { 
        $id: "https://example.com/schema",
        type: "string" 
      };
      const instance = 42;
      const output = validate(schema, instance);
      
      expect(output.keywordLocation).toBeDefined();
    });
  });

  describe("Type Validations", () => {
    test("type: string validation", () => {
      /** @type Json */
      const schema = { type: "string" };
      const instance = 42;
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("type: number validation", () => {
      /** @type Json */
      const schema = { type: "number" };
      const instance = "test";
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("type: integer validation", () => {
      /** @type Json */
      const schema = { type: "integer" };
      const instance = 10.5;
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
  });

  describe("String Validations", () => {
    test("minLength validation", () => {
      /** @type Json */
      const schema = { minLength: 5 };
      const instance = "abc";
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("maxLength validation", () => {
      /** @type Json */
      const schema = { maxLength: 3 };
      const instance = "abcde";
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("pattern validation", () => {
      /** @type Json */
      const schema = { pattern: "^[A-Z]+$" };
      const instance = "abc";
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
  });

  describe("Number Validations", () => {
    test("minimum validation", () => {
      /** @type Json */
      const schema = { minimum: 10 };
      const instance = 5;
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("maximum validation", () => {
      /** @type Json */
      const schema = { maximum: 10 };
      const instance = 15;
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("multipleOf validation", () => {
      /** @type Json */
      const schema = { multipleOf: 2 };
      const instance = 5;
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
  });

  describe("Array Validations", () => {
    test("minItems validation", () => {
      /** @type Json */
      const schema = { minItems: 3 };
      const instance = [1, 2];
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("maxItems validation", () => {
      /** @type Json */
      const schema = { maxItems: 2 };
      const instance = [1, 2, 3];
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("uniqueItems validation", () => {
      /** @type Json */
      const schema = { uniqueItems: true };
      const instance = [1, 2, 1];
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
  });

  describe("Object Validations", () => {
    test("required validation", () => {
      /** @type Json */
      const schema = { 
        required: ["name", "email"] 
      };
      const instance = { name: "John" };
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("properties validation", () => {
      /** @type Json */
      const schema = { 
        properties: {
          name: { type: "string" },
          age: { type: "integer" }
        }
      };
      const instance = { name: "John", age: "30" };
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
  });

  describe("Logical Validations", () => {
    test("allOf validation", () => {
      /** @type Json */
      const schema = { 
        allOf: [
          { type: "string" },
          { minLength: 5 }
        ]
      };
      const instance = "abc";
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("anyOf validation", () => {
      /** @type Json */
      const schema = { 
        anyOf: [
          { type: "string" },
          { type: "integer" }
        ]
      };
      const instance = true;
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("oneOf validation", () => {
      /** @type Json */
      const schema = { 
        oneOf: [
          { type: "number" },
          { type: "integer" }
        ]
      };
      const instance = 42;
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("not validation", () => {
      /** @type Json */
      const schema = { 
        not: { type: "string" }
      };
      const instance = "test";
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
  });

  describe("Reference Validations", () => {
    test("local $ref validation", () => {
      /** @type Json */
      const schema = { 
        $ref: "#/$defs/positiveInteger",
        $defs: {
          positiveInteger: {
            type: "integer",
            minimum: 1
          }
        }
      };
      const instance = 0;
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
    
    test("remote $ref validation", () => {
      /** @type Json */
      const remoteSchema = { 
        type: "object",
        required: ["name"]
      };
      registerSchema(remoteSchema, "http://example.org/person");
      
      /** @type Json */
      const schema = { $ref: "http://example.org/person" };
      const instance = "";
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
  });

  describe("Nested Validations", () => {
    test("nested property validation", () => {
      /** @type Json */
      const schema = { 
        type: "object",
        properties: {
          user: {
            type: "object",
            properties: {
              name: { type: "string" }
            }
          }
        }
      };
      const instance = { 
        user: { 
          name: 42
        } 
      };
      const output = validate(schema, instance);
      
      expect(output.valid).toBe(false);
      expect(output.errors).toBeDefined();
    });
  });
});