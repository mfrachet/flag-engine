import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { isElementInteractive } from "../isInteractive";

describe("isElementInteractive", () => {
  afterEach(() => {
    // Clean up any elements added to the DOM
    document.body.innerHTML = "";
  });

  describe("interactive tag names", () => {
    const interactiveTagNames = ["A", "BUTTON", "INPUT", "SELECT", "TEXTAREA"];

    interactiveTagNames.forEach((tagName) => {
      it(`should return true for ${tagName} element`, () => {
        const element = document.createElement(tagName);
        expect(isElementInteractive(element)).toBe(true);
      });
    });

    it("should handle case insensitive tag names", () => {
      // Create elements with different casing
      const upperCaseButton = document.createElement("BUTTON");
      const lowerCaseButton = document.createElement("button");

      expect(isElementInteractive(upperCaseButton)).toBe(true);
      expect(isElementInteractive(lowerCaseButton)).toBe(true);
    });
  });

  describe("non-interactive tag names", () => {
    const nonInteractiveTagNames = [
      "DIV",
      "SPAN",
      "P",
      "H1",
      "H2",
      "H3",
      "IMG",
      "SECTION",
      "MAIN",
      "FOOTER",
    ];

    nonInteractiveTagNames.forEach((tagName) => {
      it(`should return false for ${tagName} element by default`, () => {
        const element = document.createElement(tagName);
        expect(isElementInteractive(element)).toBe(false);
      });
    });
  });

  describe("tabindex attribute", () => {
    it('should return true for element with tabindex="0"', () => {
      const element = document.createElement("div");
      element.setAttribute("tabindex", "0");
      expect(isElementInteractive(element)).toBe(true);
    });

    it("should return true for element with positive tabindex", () => {
      const element = document.createElement("div");
      element.setAttribute("tabindex", "1");
      expect(isElementInteractive(element)).toBe(true);
    });

    it("should return false for element with negative tabindex", () => {
      const element = document.createElement("div");
      element.setAttribute("tabindex", "-1");
      expect(isElementInteractive(element)).toBe(false);
    });

    it("should return false for element without tabindex", () => {
      const element = document.createElement("div");
      expect(isElementInteractive(element)).toBe(false);
    });

    it("should handle invalid tabindex values", () => {
      const element = document.createElement("div");
      element.setAttribute("tabindex", "invalid");
      // Different browsers handle invalid tabindex differently
      expect(isElementInteractive(element)).toBe(element.tabIndex >= 0);
    });

    it("should handle empty tabindex values", () => {
      const element = document.createElement("div");
      element.setAttribute("tabindex", "");
      // Empty tabindex should be treated as 0
      expect(element.tabIndex).toBe(0);
      expect(isElementInteractive(element)).toBe(true);
    });
  });

  describe("role attribute", () => {
    const interactiveRoles = [
      "button",
      "checkbox",
      "link",
      "menuitem",
      "option",
      "radio",
      "searchbox",
      "slider",
      "spinbutton",
      "switch",
      "textbox",
    ];

    interactiveRoles.forEach((role) => {
      it(`should return true for element with role="${role}"`, () => {
        const element = document.createElement("div");
        element.setAttribute("role", role);
        expect(isElementInteractive(element)).toBe(true);
      });
    });

    it("should handle case insensitive roles", () => {
      const element = document.createElement("div");
      element.setAttribute("role", "BUTTON");
      expect(isElementInteractive(element)).toBe(true);
    });

    it("should handle mixed case roles", () => {
      const element = document.createElement("div");
      element.setAttribute("role", "ChEcKbOx");
      expect(isElementInteractive(element)).toBe(true);
    });

    it("should return false for non-interactive roles", () => {
      const nonInteractiveRoles = [
        "banner",
        "main",
        "navigation",
        "contentinfo",
        "complementary",
        "article",
        "section",
      ];

      nonInteractiveRoles.forEach((role) => {
        const element = document.createElement("div");
        element.setAttribute("role", role);
        expect(isElementInteractive(element)).toBe(false);
      });
    });

    it("should return false for element without role", () => {
      const element = document.createElement("div");
      expect(isElementInteractive(element)).toBe(false);
    });

    it("should return false for empty role", () => {
      const element = document.createElement("div");
      element.setAttribute("role", "");
      expect(isElementInteractive(element)).toBe(false);
    });

    it("should return false for invalid role", () => {
      const element = document.createElement("div");
      element.setAttribute("role", "invalid-role");
      expect(isElementInteractive(element)).toBe(false);
    });

    it("should handle multiple roles (space-separated)", () => {
      const element = document.createElement("div");
      element.setAttribute("role", "button checkbox");
      // The current implementation checks the full string, not individual roles
      expect(isElementInteractive(element)).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle null role attribute", () => {
      const element = document.createElement("div");
      element.setAttribute("role", "button");

      // Mock getAttribute to return null
      const originalGetAttribute = element.getAttribute;
      element.getAttribute = (attr) => {
        if (attr === "role") return null;
        return originalGetAttribute.call(element, attr);
      };

      expect(isElementInteractive(element)).toBe(false);
    });

    it("should handle elements with no attributes", () => {
      const element = document.createElement("div");
      expect(isElementInteractive(element)).toBe(false);
    });

    it("should handle elements with only non-interactive attributes", () => {
      const element = document.createElement("div");
      element.setAttribute("id", "test");
      element.setAttribute("class", "test-class");
      element.setAttribute("data-test", "value");
      expect(isElementInteractive(element)).toBe(false);
    });

    it("should handle custom elements", () => {
      // Create a custom element
      const customElement = document.createElement(
        "custom-element"
      ) as HTMLElement;
      expect(isElementInteractive(customElement)).toBe(false);

      // Make it interactive with role
      customElement.setAttribute("role", "button");
      expect(isElementInteractive(customElement)).toBe(true);
    });

    it("should handle elements with whitespace in role", () => {
      const element = document.createElement("div");
      element.setAttribute("role", "  button  ");
      // Note: The current implementation doesn't trim whitespace
      expect(isElementInteractive(element)).toBe(false);
    });

    it("should handle elements with multiple whitespace in role", () => {
      const element = document.createElement("div");
      element.setAttribute("role", "button   checkbox");
      // Note: The current implementation checks the full string, not split by whitespace
      expect(isElementInteractive(element)).toBe(false);
    });
  });

  describe("real-world scenarios", () => {
    it("should identify form elements correctly", () => {
      const form = document.createElement("form");
      const input = document.createElement("input");
      const textarea = document.createElement("textarea");
      const select = document.createElement("select");
      const button = document.createElement("button");

      form.appendChild(input);
      form.appendChild(textarea);
      form.appendChild(select);
      form.appendChild(button);

      expect(isElementInteractive(form)).toBe(false); // form itself is not interactive
      expect(isElementInteractive(input)).toBe(true);
      expect(isElementInteractive(textarea)).toBe(true);
      expect(isElementInteractive(select)).toBe(true);
      expect(isElementInteractive(button)).toBe(true);
    });

    it("should handle navigation elements", () => {
      const nav = document.createElement("nav");
      const link = document.createElement("a");
      link.href = "#";
      nav.appendChild(link);

      expect(isElementInteractive(nav)).toBe(false);
      expect(isElementInteractive(link)).toBe(true);
    });

    it("should handle interactive divs (like buttons)", () => {
      const interactiveDiv = document.createElement("div");
      interactiveDiv.setAttribute("role", "button");
      interactiveDiv.setAttribute("tabindex", "0");

      expect(isElementInteractive(interactiveDiv)).toBe(true);
    });

    it("should handle ARIA widgets", () => {
      const slider = document.createElement("div");
      slider.setAttribute("role", "slider");
      slider.setAttribute("aria-valuemin", "0");
      slider.setAttribute("aria-valuemax", "100");
      slider.setAttribute("aria-valuenow", "50");

      expect(isElementInteractive(slider)).toBe(true);
    });

    it("should handle custom button-like elements", () => {
      const customButton = document.createElement("span");
      customButton.setAttribute("role", "button");
      customButton.setAttribute("tabindex", "0");
      customButton.setAttribute("aria-label", "Custom button");

      expect(isElementInteractive(customButton)).toBe(true);
    });
  });

  describe("performance considerations", () => {
    it("should not modify the element", () => {
      const element = document.createElement("div");
      const originalAttributes = element.attributes.length;
      const originalTagName = element.tagName;

      isElementInteractive(element);

      expect(element.attributes.length).toBe(originalAttributes);
      expect(element.tagName).toBe(originalTagName);
    });

    it("should handle many elements efficiently", () => {
      const elements: HTMLElement[] = [];

      // Create many elements
      for (let i = 0; i < 1000; i++) {
        const element = document.createElement(i % 2 === 0 ? "div" : "button");
        if (i % 3 === 0) element.setAttribute("role", "button");
        if (i % 5 === 0) element.setAttribute("tabindex", "0");
        elements.push(element);
      }

      const start = performance.now();
      elements.forEach((element) => isElementInteractive(element));
      const end = performance.now();

      // Should complete in reasonable time (less than 100ms for 1000 elements)
      expect(end - start).toBeLessThan(100);
    });
  });
});
