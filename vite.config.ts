import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  envDir: "./",
  server: {
    host: "::",
    port: 4000,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" &&
      visualizer({
        open: true, // Opens the report in your default browser
        filename: "bundle-analysis.html", // Name of the output file
        gzipSize: true, // Show gzip sizes
        brotliSize: true, // Show brotli sizes
      }),
  ].filter(Boolean),
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
