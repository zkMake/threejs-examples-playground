import { resolve } from "path";
import { defineConfig, splitVendorChunkPlugin } from "vite";
import glsl from "vite-plugin-glsl";

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3000 },
  resolve: {
    alias: {
      "@src": resolve(__dirname, "./src"),
    },
  },
  plugins: [splitVendorChunkPlugin(), glsl()],
});
