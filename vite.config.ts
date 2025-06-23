import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  envDir: "./",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ["recharts"],
          papaparse: ["papaparse"],
          // You can add more large dependencies here if needed
          // For example, if @radix-ui/react-tabs is large and used in a specific section:
          // 'radix-tabs': ['@radix-ui/react-tabs'],
        },
      },
    },
  },
  worker: {
    format: "es", // Ensure workers are output as ES modules
  },
}));
