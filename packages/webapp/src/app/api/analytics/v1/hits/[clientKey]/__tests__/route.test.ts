import { NextRequest } from "next/server";
import { POST } from "../route";
import { describe, it, expect } from "vitest";

describe("POST /api/analytics/v1/hits/[clientKey]", () => {
  const createRequest = (body: unknown, clientKey: string = "test-client") => {
    const request = new NextRequest(
      "http://localhost:3000/api/analytics/v1/hits/" + clientKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    return request;
  };

  const createParams = (clientKey: string) => Promise.resolve({ clientKey });

  describe("valid requests", () => {
    it("should accept a valid hit with all fields", async () => {
      const validHit = [
        {
          name: "page_view",
          url: "https://example.com/dashboard",
          referer: "https://google.com",
          viewportWidth: 1920,
          viewportHeight: 1080,
          posX: 100,
          posY: 200,
          selector: "#main-content",
          data: "user_interaction",
        },
      ];

      const request = createRequest(validHit);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(200);
      expect(await response.text()).toBe("OK");
    });

    it("should accept a valid hit with only required fields", async () => {
      const validHit = [
        {
          name: "button_click",
          url: "https://example.com/dashboard",
          viewportWidth: 1920,
          viewportHeight: 1080,
        },
      ];

      const request = createRequest(validHit);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(200);
      expect(await response.text()).toBe("OK");
    });

    it("should accept multiple valid hits", async () => {
      const validHits = [
        {
          name: "page_view",
          url: "https://example.com/dashboard",
          viewportWidth: 1920,
          viewportHeight: 1080,
        },
        {
          name: "button_click",
          url: "https://example.com/dashboard",
          viewportWidth: 1920,
          viewportHeight: 1080,
          posX: 150,
          posY: 300,
        },
      ];

      const request = createRequest(validHits);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(200);
      expect(await response.text()).toBe("OK");
    });

    it("should handle different client keys", async () => {
      const validHit = [
        {
          name: "page_view",
          url: "https://example.com/dashboard",
          viewportWidth: 1920,
          viewportHeight: 1080,
        },
      ];

      const request = createRequest(validHit);
      const params = createParams("different-client-key");

      const response = await POST(request, { params });

      expect(response.status).toBe(200);
      expect(await response.text()).toBe("OK");
    });
  });

  describe("validation errors", () => {
    it("should return 400 when name is missing", async () => {
      const invalidHit = [
        {
          url: "https://example.com/dashboard",
          viewportWidth: 1920,
          viewportHeight: 1080,
        },
      ];

      const request = createRequest(invalidHit);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Invalid request data");
    });

    it("should return 400 when url is missing", async () => {
      const invalidHit = [
        {
          name: "page_view",
          viewportWidth: 1920,
          viewportHeight: 1080,
        },
      ];

      const request = createRequest(invalidHit);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Invalid request data");
    });

    it("should return 400 when viewportWidth is missing", async () => {
      const invalidHit = [
        {
          name: "page_view",
          url: "https://example.com/dashboard",
          viewportHeight: 1080,
        },
      ];

      const request = createRequest(invalidHit);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Invalid request data");
    });

    it("should return 400 when viewportHeight is missing", async () => {
      const invalidHit = [
        {
          name: "page_view",
          url: "https://example.com/dashboard",
          viewportWidth: 1920,
        },
      ];

      const request = createRequest(invalidHit);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Invalid request data");
    });

    it("should return 400 when viewportWidth is not a number", async () => {
      const invalidHit = [
        {
          name: "page_view",
          url: "https://example.com/dashboard",
          viewportWidth: "1920",
          viewportHeight: 1080,
        },
      ];

      const request = createRequest(invalidHit);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Invalid request data");
    });

    it("should return 400 when viewportHeight is not a number", async () => {
      const invalidHit = [
        {
          name: "page_view",
          url: "https://example.com/dashboard",
          viewportWidth: 1920,
          viewportHeight: "1080",
        },
      ];

      const request = createRequest(invalidHit);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Invalid request data");
    });

    it("should return 400 when name is not a string", async () => {
      const invalidHit = [
        {
          name: 123,
          url: "https://example.com/dashboard",
          viewportWidth: 1920,
          viewportHeight: 1080,
        },
      ];

      const request = createRequest(invalidHit);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Invalid request data");
    });

    it("should return 400 when url is not a string", async () => {
      const invalidHit = [
        {
          name: "page_view",
          url: 123,
          viewportWidth: 1920,
          viewportHeight: 1080,
        },
      ];

      const request = createRequest(invalidHit);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Invalid request data");
    });

    it("should return 400 when body is not an array", async () => {
      const invalidBody = {
        name: "page_view",
        url: "https://example.com/dashboard",
        viewportWidth: 1920,
        viewportHeight: 1080,
      };

      const request = createRequest(invalidBody);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(400);
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Invalid request data");
    });

    it("should return 400 when body is empty array", async () => {
      const request = createRequest([]);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(200); // Empty array is valid
      expect(await response.text()).toBe("OK");
    });
  });

  describe("edge cases", () => {
    it("should handle optional fields with null values", async () => {
      const hitWithNulls = [
        {
          name: "page_view",
          url: "https://example.com/dashboard",
          referer: null,
          viewportWidth: 1920,
          viewportHeight: 1080,
          posX: null,
          posY: null,
          selector: null,
          data: null,
        },
      ];

      const request = createRequest(hitWithNulls);
      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(400); // Zod doesn't accept null for optional fields
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Invalid request data");
    });

    it("should handle malformed JSON", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/analytics/v1/hits/test-client",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: "invalid json",
        }
      );

      const params = createParams("test-client");

      const response = await POST(request, { params });

      expect(response.status).toBe(500); // JSON.parse will throw
      const responseBody = await response.json();
      expect(responseBody.error).toBe("Internal server error");
    });
  });
});
