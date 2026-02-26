import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const external = ["murmurhash-js", "semver"];
const globals = { "murmurhash-js": "murmurhash-js", "semver": "semver" };

export default () => {
  return {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs.js",
        format: "cjs",
        name: "flag-engine",
        globals,
      },
      {
        file: "dist/index.mjs",
        format: "es",
      },
    ],
    plugins: [
      nodeResolve(),
      typescript({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
      }),
      terser(),
    ],
    external,
  };
};
