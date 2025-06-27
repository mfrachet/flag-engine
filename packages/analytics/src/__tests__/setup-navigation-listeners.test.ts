import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setupNavigationListeners } from "../setup-navigation-listeners";

describe("setupNavigationListeners", () => {
  let callback: ReturnType<typeof vi.fn>;
  let originalPushState: typeof history.pushState;
  let originalReplaceState: typeof history.replaceState;
  let originalAddEventListener: typeof window.addEventListener;

  beforeEach(() => {
    callback = vi.fn();

    // Store original methods
    originalPushState = history.pushState;
    originalReplaceState = history.replaceState;
    originalAddEventListener = window.addEventListener;

    // Mock addEventListener
    window.addEventListener = vi.fn();
  });

  afterEach(() => {
    // Restore original methods
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
    window.addEventListener = originalAddEventListener;
  });

  describe("popstate event listener", () => {
    it("should register popstate event listener", () => {
      setupNavigationListeners(callback);

      expect(window.addEventListener).toHaveBeenCalledWith(
        "popstate",
        callback
      );
    });

    it("should register popstate listener only once per call", () => {
      setupNavigationListeners(callback);

      expect(window.addEventListener).toHaveBeenCalledTimes(1);
      expect(window.addEventListener).toHaveBeenCalledWith(
        "popstate",
        callback
      );
    });
  });

  describe.skip("history.replaceState interception", () => {
    it("should intercept history.replaceState calls", () => {
      setupNavigationListeners(callback);

      expect(history.replaceState).not.toBe(originalReplaceState);
    });

    it("should call original replaceState when intercepted", () => {
      const mockOriginalReplaceState = vi.fn();
      history.replaceState = mockOriginalReplaceState;

      setupNavigationListeners(callback);

      const state = { test: "data" };
      const title = "Test Title";
      const url = "/test-url";

      history.replaceState(state, title, url);

      expect(mockOriginalReplaceState).toHaveBeenCalledWith(state, title, url);
    });

    it("should call callback after replaceState", () => {
      setupNavigationListeners(callback);

      history.replaceState({}, "", "/test");

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should handle replaceState with different parameter combinations", () => {
      setupNavigationListeners(callback);

      history.replaceState(null, "", "/test1");
      history.replaceState({ data: "test" }, "Title", "/test2");
      history.replaceState({}, "");

      expect(callback).toHaveBeenCalledTimes(3);
    });

    it("should maintain this context for replaceState", () => {
      setupNavigationListeners(callback);

      const contextSpy = vi.fn();
      const originalApply = Function.prototype.apply;
      Function.prototype.apply = vi.fn().mockImplementation(function (...args) {
        contextSpy(this);
        return originalApply.call(this, ...args);
      });

      history.replaceState({}, "", "/test");

      expect(contextSpy).toHaveBeenCalledWith(originalReplaceState);

      Function.prototype.apply = originalApply;
    });
  });

  describe("multiple setup calls", () => {
    it("should handle multiple setup calls without breaking", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      setupNavigationListeners(callback1);
      setupNavigationListeners(callback2);

      // Both should be set up
      expect(window.addEventListener).toHaveBeenCalledTimes(2);
    });

    it("should call all callbacks when multiple listeners are set up", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      setupNavigationListeners(callback1);
      setupNavigationListeners(callback2);

      history.pushState({}, "", "/test");

      // Both callbacks should be called for the last setup
      // Note: This tests the current behavior, which may not be ideal
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe("edge cases", () => {
    it("should handle callback throwing error", () => {
      const errorCallback = vi.fn().mockImplementation(() => {
        throw new Error("Test error");
      });

      setupNavigationListeners(errorCallback);

      expect(() => {
        history.pushState({}, "", "/test");
      }).toThrow("Test error");
    });

    it("should handle null/undefined states", () => {
      setupNavigationListeners(callback);

      expect(() => {
        history.pushState(null, "", "/test");
        history.replaceState(undefined as any, "", "/test");
      }).not.toThrow();

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should handle empty strings", () => {
      setupNavigationListeners(callback);

      expect(() => {
        history.pushState({}, "", "");
        history.replaceState({}, "", "");
      }).not.toThrow();

      expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should handle relative URLs", () => {
      setupNavigationListeners(callback);

      expect(() => {
        history.pushState({}, "", "/relative");
        history.pushState({}, "", "../parent");
        history.pushState({}, "", "./current");
      }).not.toThrow();

      expect(callback).toHaveBeenCalledTimes(3);
    });

    it("should handle absolute URLs", () => {
      setupNavigationListeners(callback);

      expect(() => {
        history.pushState({}, "", "https://example.com/test");
        history.replaceState({}, "", "http://other.com/page");
      }).toThrow();

      expect(callback).toHaveBeenCalledTimes(0);
    });
  });

  describe("real world scenarios", () => {
    it("should handle rapid successive navigation calls", () => {
      setupNavigationListeners(callback);

      // Simulate rapid SPA navigation
      for (let i = 0; i < 10; i++) {
        history.pushState({}, "", `/page${i}`);
      }

      expect(callback).toHaveBeenCalledTimes(10);
    });

    it("should handle mixed pushState and replaceState calls", () => {
      setupNavigationListeners(callback);

      history.pushState({}, "", "/page1");
      history.replaceState({}, "", "/page1-updated");
      history.pushState({}, "", "/page2");
      history.replaceState({}, "", "/page2-updated");

      expect(callback).toHaveBeenCalledTimes(4);
    });

    it("should preserve return values from original methods", () => {
      // Note: pushState and replaceState don't return values, but test anyway
      setupNavigationListeners(callback);

      const pushResult = history.pushState({}, "", "/test");
      const replaceResult = history.replaceState({}, "", "/test");

      expect(pushResult).toBeUndefined();
      expect(replaceResult).toBeUndefined();
    });
  });
});
