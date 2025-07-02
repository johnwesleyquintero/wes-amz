"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("react-dom/client");
var App_tsx_1 = __importDefault(require("./App.tsx"));
require("./index.css");
var theme_provider_tsx_1 = require("@/components/theme/theme-provider.tsx");
(0, client_1.createRoot)(document.getElementById("root")).render(<theme_provider_tsx_1.ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <App_tsx_1.default />
  </theme_provider_tsx_1.ThemeProvider>);
