"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var toaster_1 = require("@/components/ui/toaster");
var sonner_1 = require("@/components/ui/sonner");
var tooltip_1 = require("@/components/ui/tooltip");
var react_query_1 = require("@tanstack/react-query");
var react_1 = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var sidebar_context_tsx_1 = require("./context/sidebar-context.tsx");
var MainLayout_1 = __importDefault(require("./components/layout/MainLayout"));
var ProtectedRoute_1 = __importDefault(require("./components/auth/ProtectedRoute"));
var ErrorBoundary_1 = __importDefault(require("./components/shared/ErrorBoundary")); // Import ErrorBoundary
var app_routes_tsx_1 = require("./lib/app-routes.tsx");
var routes_tsx_1 = require("./lib/routes.tsx");
var queryClient = new react_query_1.QueryClient();
function App() {
    return (<react_1.Suspense fallback={null}>
      <react_query_1.QueryClientProvider client={queryClient}>
        <tooltip_1.TooltipProvider>
          <toaster_1.Toaster />
          <sonner_1.Toaster />
          <sidebar_context_tsx_1.SidebarProvider>
            <ErrorBoundary_1.default>
              {" "}
              {/* Wrap BrowserRouter with ErrorBoundary */}
              <react_router_dom_1.BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
        }}>
                <react_router_dom_1.Routes>
                  {/* Public Routes */}
                  <react_router_dom_1.Route path="/" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                        <app_routes_tsx_1.Pages.LandingPage />
                      </react_1.Suspense>}/>
                  <react_router_dom_1.Route path="/privacy-policy" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                        <app_routes_tsx_1.Pages.PrivacyPolicy />
                      </react_1.Suspense>}/>
                  <react_router_dom_1.Route path="/terms-of-service" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                        <app_routes_tsx_1.Pages.TermsOfService />
                      </react_1.Suspense>}/>

                  {/* Authentication Routes - No MainLayout */}
                  <react_router_dom_1.Route path="/auth">
                    <react_router_dom_1.Route path="register" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                          <app_routes_tsx_1.AuthComponents.Register />
                        </react_1.Suspense>}/>
                    <react_router_dom_1.Route path="login" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                          <app_routes_tsx_1.AuthComponents.Login />
                        </react_1.Suspense>}/>
                    <react_router_dom_1.Route path="forgot-password" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                          <app_routes_tsx_1.AuthComponents.ForgotPassword />
                        </react_1.Suspense>}/>
                    <react_router_dom_1.Route path="update-password" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                          <app_routes_tsx_1.AuthComponents.UpdatePassword />
                        </react_1.Suspense>}/>
                  </react_router_dom_1.Route>

                  {/* Protected Routes (within MainLayout) */}
                  <react_router_dom_1.Route element={<ProtectedRoute_1.default />}>
                    {/* Protected Routes (within MainLayout) */}
                    <react_router_dom_1.Route element={<ProtectedRoute_1.default />}>
                      <react_router_dom_1.Route path="/dashboard" element={<MainLayout_1.default />}>
                        <react_router_dom_1.Route index element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                              <app_routes_tsx_1.Pages.DashboardContent />
                            </react_1.Suspense>}/>
                      </react_router_dom_1.Route>

                      {/* Direct routes for tools and settings */}
                      <react_router_dom_1.Route path="/" element={<MainLayout_1.default />}>
                        {routes_tsx_1.authenticatedAppRoutes.map(function (route) { return (<react_router_dom_1.Route key={route.path} path={route.path} element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                                <route.component {...route.props}/>
                              </react_1.Suspense>}/>); })}
                        {/* Settings Routes */}
                        <react_router_dom_1.Route path="settings" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                              <app_routes_tsx_1.SettingsComponents.SettingsLayout />
                            </react_1.Suspense>}>
                          <react_router_dom_1.Route index element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                                <app_routes_tsx_1.SettingsComponents.ProfileManagement />
                              </react_1.Suspense>}/>
                          <react_router_dom_1.Route path="profile" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                                <app_routes_tsx_1.SettingsComponents.ProfileManagement />
                              </react_1.Suspense>}/>
                          <react_router_dom_1.Route path="organization" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                                <app_routes_tsx_1.SettingsComponents.OrganizationSettings />
                              </react_1.Suspense>}/>
                          <react_router_dom_1.Route path="team" element={<react_1.Suspense fallback={routes_tsx_1.DEFAULT_SUSPENSE_FALLBACK}>
                                <app_routes_tsx_1.SettingsComponents.TeamManagement />
                              </react_1.Suspense>}/>
                        </react_router_dom_1.Route>
                      </react_router_dom_1.Route>
                    </react_router_dom_1.Route>
                  </react_router_dom_1.Route>

                  <react_router_dom_1.Route path="*" element={<app_routes_tsx_1.Pages.NotFound />}/>
                </react_router_dom_1.Routes>
              </react_router_dom_1.BrowserRouter>
            </ErrorBoundary_1.default>
          </sidebar_context_tsx_1.SidebarProvider>
        </tooltip_1.TooltipProvider>
      </react_query_1.QueryClientProvider>
    </react_1.Suspense>);
}
exports.default = App;
