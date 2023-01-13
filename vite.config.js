import { resolve } from "path"
import { defineConfig } from "vite";
import createVuePlugin from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "vue3-confirm-dialog",
      fileName: "vue3-confirm-dialog",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        }
      }
    }
  },
  plugins: [createVuePlugin()]
})
