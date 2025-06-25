// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
import { visualizer } from "file:///home/project/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  envDir: "./",
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && visualizer({
      open: true,
      // Opens the report in your default browser
      filename: "bundle-analysis.html",
      // Name of the output file
      gzipSize: true,
      // Show gzip sizes
      brotliSize: true
      // Show brotli sizes
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          recharts: ["recharts"],
          papaparse: ["papaparse"]
          // You can add more large dependencies here if needed
          // For example, if @radix-ui/react-tabs is large and used in a specific section:
          // 'radix-tabs': ['@radix-ui/react-tabs'],
        }
      }
    }
  },
  worker: {
    format: "es"
    // Ensure workers are output as ES modules
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tIFwicm9sbHVwLXBsdWdpbi12aXN1YWxpemVyXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xuICBlbnZEaXI6IFwiLi9cIixcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBtb2RlID09PSBcInByb2R1Y3Rpb25cIiAmJlxuICAgICAgdmlzdWFsaXplcih7XG4gICAgICAgIG9wZW46IHRydWUsIC8vIE9wZW5zIHRoZSByZXBvcnQgaW4geW91ciBkZWZhdWx0IGJyb3dzZXJcbiAgICAgICAgZmlsZW5hbWU6IFwiYnVuZGxlLWFuYWx5c2lzLmh0bWxcIiwgLy8gTmFtZSBvZiB0aGUgb3V0cHV0IGZpbGVcbiAgICAgICAgZ3ppcFNpemU6IHRydWUsIC8vIFNob3cgZ3ppcCBzaXplc1xuICAgICAgICBicm90bGlTaXplOiB0cnVlLCAvLyBTaG93IGJyb3RsaSBzaXplc1xuICAgICAgfSksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIHJlY2hhcnRzOiBbXCJyZWNoYXJ0c1wiXSxcbiAgICAgICAgICBwYXBhcGFyc2U6IFtcInBhcGFwYXJzZVwiXSxcbiAgICAgICAgICAvLyBZb3UgY2FuIGFkZCBtb3JlIGxhcmdlIGRlcGVuZGVuY2llcyBoZXJlIGlmIG5lZWRlZFxuICAgICAgICAgIC8vIEZvciBleGFtcGxlLCBpZiBAcmFkaXgtdWkvcmVhY3QtdGFicyBpcyBsYXJnZSBhbmQgdXNlZCBpbiBhIHNwZWNpZmljIHNlY3Rpb246XG4gICAgICAgICAgLy8gJ3JhZGl4LXRhYnMnOiBbJ0ByYWRpeC11aS9yZWFjdC10YWJzJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHdvcmtlcjoge1xuICAgIGZvcm1hdDogXCJlc1wiLCAvLyBFbnN1cmUgd29ya2VycyBhcmUgb3V0cHV0IGFzIEVTIG1vZHVsZXNcbiAgfSxcbn0pKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sU0FBUyxvQkFBb0I7QUFDdFAsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUNoQyxTQUFTLGtCQUFrQjtBQUozQixJQUFNLG1DQUFtQztBQU96QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxFQUNSLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUFpQixnQkFBZ0I7QUFBQSxJQUMxQyxTQUFTLGdCQUNQLFdBQVc7QUFBQSxNQUNULE1BQU07QUFBQTtBQUFBLE1BQ04sVUFBVTtBQUFBO0FBQUEsTUFDVixVQUFVO0FBQUE7QUFBQSxNQUNWLFlBQVk7QUFBQTtBQUFBLElBQ2QsQ0FBQztBQUFBLEVBQ0wsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUEsVUFDWixVQUFVLENBQUMsVUFBVTtBQUFBLFVBQ3JCLFdBQVcsQ0FBQyxXQUFXO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUFJekI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFFBQVE7QUFBQTtBQUFBLEVBQ1Y7QUFDRixFQUFFOyIsCiAgIm5hbWVzIjogW10KfQo=
