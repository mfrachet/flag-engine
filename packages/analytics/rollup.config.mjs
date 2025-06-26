import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import "dotenv/config";

export default () => {
  return {
    input: "src/index.ts",
    output: {
      file: "dist/progressively.min.js",
      format: "iife",
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      terser(),
      replace({
        "process.env.API_ENDPOINT": JSON.stringify(process.env.API_ENDPOINT),
        preventAssignment: true,
      }),
    ],
  };
};
