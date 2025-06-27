import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setup } from "../setup";

describe("setup", () => {
  let originalBtoa: typeof btoa;
  let originalCurrentScript: Document["currentScript"];
  let originalProcessEnv: typeof process.env;

  beforeEach(() => {
    // Store originals
    originalBtoa = global.btoa;
    originalCurrentScript = document.currentScript;
    originalProcessEnv = process.env;

    // Mock btoa
    global.btoa = vi
      .fn()
      .mockImplementation((str) => Buffer.from(str).toString("base64"));

    // Mock process.env
    process.env = {
      ...originalProcessEnv,
      API_ENDPOINT: "https://test-api.example.com",
    };
  });

  afterEach(() => {
    // Restore originals
    global.btoa = originalBtoa;
    Object.defineProperty(document, "currentScript", {
      value: originalCurrentScript,
      writable: true,
    });
    process.env = originalProcessEnv;
  });

  describe("successful setup", () => {
    it("should return endpoint and base64 encoded client key", () => {
      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "test-client-key");

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      const result = setup();

      expect(result).toEqual({
        endpoint: "https://test-api.example.com",
        bSixtyFour: "dGVzdC1jbGllbnQta2V5", // base64 of 'test-client-key'
      });
    });

    it("should call btoa with the client key", () => {
      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "my-secret-key");

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      setup();

      expect(global.btoa).toHaveBeenCalledWith("my-secret-key");
    });

    it("should use API_ENDPOINT from process.env", () => {
      process.env.API_ENDPOINT = "https://custom-endpoint.com";

      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "test-key");

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      const result = setup();

      expect(result.endpoint).toBe("https://custom-endpoint.com");
    });
  });

  describe("error cases", () => {
    it("should throw error when currentScript is null", () => {
      Object.defineProperty(document, "currentScript", {
        value: null,
        writable: true,
      });

      expect(() => setup()).toThrow(
        "[Flag Engine]: [data-client-key] attribute should be set on the script tag."
      );
    });

    it("should throw error when currentScript is undefined", () => {
      Object.defineProperty(document, "currentScript", {
        value: undefined,
        writable: true,
      });

      expect(() => setup()).toThrow(
        "[Flag Engine]: [data-client-key] attribute should be set on the script tag."
      );
    });

    it("should throw error when data-client-key attribute is missing", () => {
      const mockScript = document.createElement("script");
      // No data-client-key attribute

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      expect(() => setup()).toThrow(
        "[Flag Engine]: [data-client-key] attribute should be set on the script tag."
      );
    });

    it("should throw error when data-client-key attribute is empty string", () => {
      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "");

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      expect(() => setup()).toThrow(
        "[Flag Engine]: [data-client-key] attribute should be set on the script tag."
      );
    });

    it("should throw error when data-client-key attribute is null", () => {
      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "test-key");

      // Mock getAttribute to return null
      const originalGetAttribute = mockScript.getAttribute;
      mockScript.getAttribute = vi.fn().mockImplementation((attr) => {
        if (attr === "data-client-key") return null;
        return originalGetAttribute.call(mockScript, attr);
      });

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      expect(() => setup()).toThrow(
        "[Flag Engine]: [data-client-key] attribute should be set on the script tag."
      );
    });
  });

  describe("edge cases", () => {
    it("should handle special characters in client key", () => {
      const specialKey = "key-with-special-chars!@#$%^&*()_+-=[]{}|;:,.<>?";

      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", specialKey);

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      const result = setup();

      expect(global.btoa).toHaveBeenCalledWith(specialKey);
      expect(result.bSixtyFour).toBeTruthy();
    });

    it("should handle unicode characters in client key", () => {
      const unicodeKey = "key-with-unicode-🔑-🌟";

      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", unicodeKey);

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      const result = setup();

      expect(global.btoa).toHaveBeenCalledWith(unicodeKey);
      expect(result.bSixtyFour).toBeTruthy();
    });

    it("should handle very long client key", () => {
      const longKey = "a".repeat(1000);

      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", longKey);

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      const result = setup();

      expect(global.btoa).toHaveBeenCalledWith(longKey);
      expect(result.bSixtyFour).toBeTruthy();
    });

    it("should handle whitespace in client key", () => {
      const keyWithWhitespace = "  key-with-spaces  ";

      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", keyWithWhitespace);

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      const result = setup();

      expect(global.btoa).toHaveBeenCalledWith(keyWithWhitespace);
      expect(result.bSixtyFour).toBeTruthy();
    });

    it("should handle script with multiple attributes", () => {
      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "test-key");
      mockScript.setAttribute("src", "https://example.com/script.js");
      mockScript.setAttribute("async", "true");
      mockScript.setAttribute("defer", "true");
      mockScript.setAttribute("data-other-attr", "other-value");

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      const result = setup();

      expect(result).toEqual({
        endpoint: "https://test-api.example.com",
        bSixtyFour: "dGVzdC1rZXk=",
      });
    });
  });

  describe("btoa error handling", () => {
    it("should handle btoa throwing error", () => {
      global.btoa = vi.fn().mockImplementation(() => {
        throw new Error("btoa failed");
      });

      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "test-key");

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      expect(() => setup()).toThrow("btoa failed");
    });

    it("should handle btoa with invalid input", () => {
      // Some browsers might fail btoa with certain characters
      global.btoa = vi.fn().mockImplementation((str) => {
        if (str.includes("💀")) {
          throw new Error("Invalid character");
        }
        return Buffer.from(str).toString("base64");
      });

      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "key-with-💀-emoji");

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      expect(() => setup()).toThrow("Invalid character");
    });
  });

  describe("integration scenarios", () => {
    it("should work with real script element", () => {
      // Create a real script element and add it to the document
      const script = document.createElement("script");
      script.setAttribute("data-client-key", "integration-test-key");
      document.head.appendChild(script);

      Object.defineProperty(document, "currentScript", {
        value: script,
        writable: true,
      });

      const result = setup();

      expect(result).toEqual({
        endpoint: "https://test-api.example.com",
        bSixtyFour: "aW50ZWdyYXRpb24tdGVzdC1rZXk=",
      });

      // Cleanup
      document.head.removeChild(script);
    });

    it("should handle multiple setup calls", () => {
      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "test-key");

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      const result1 = setup();
      const result2 = setup();

      expect(result1).toEqual(result2);
      expect(global.btoa).toHaveBeenCalledTimes(2);
    });

    it("should handle different environments", () => {
      const environments = [
        "https://dev-api.example.com",
        "https://staging-api.example.com",
        "https://prod-api.example.com",
      ];

      environments.forEach((endpoint) => {
        process.env.API_ENDPOINT = endpoint;

        const mockScript = document.createElement("script");
        mockScript.setAttribute("data-client-key", "test-key");

        Object.defineProperty(document, "currentScript", {
          value: mockScript,
          writable: true,
        });

        const result = setup();
        expect(result.endpoint).toBe(endpoint);
      });
    });
  });

  describe("return value validation", () => {
    it("should return object with correct properties", () => {
      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "test-key");

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      const result = setup();

      expect(result).toHaveProperty("endpoint");
      expect(result).toHaveProperty("bSixtyFour");
      expect(typeof result.endpoint).toBe("string");
      expect(typeof result.bSixtyFour).toBe("string");
      expect(Object.keys(result)).toHaveLength(2);
    });

    it("should return consistent results for same input", () => {
      const mockScript = document.createElement("script");
      mockScript.setAttribute("data-client-key", "consistent-key");

      Object.defineProperty(document, "currentScript", {
        value: mockScript,
        writable: true,
      });

      const result1 = setup();
      const result2 = setup();

      expect(result1).toEqual(result2);
    });
  });
});
