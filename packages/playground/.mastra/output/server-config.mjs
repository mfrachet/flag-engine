const ENV = process.env.NODE_ENV || "development";
const server = {
  // Disable CORS for development
  cors: ENV === "development" ? {
    origin: "*",
    allowMethods: ["*"],
    allowHeaders: ["*"]
  } : void 0
};

export { server };
//# sourceMappingURL=server-config.mjs.map
