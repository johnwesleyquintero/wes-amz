# Sidebar Enhancement Plan

This document outlines the plan for implementing a collapsible main sidebar and a new secondary sidebar to enhance the user interface, particularly for pages with numerous tabs like "Amazon Seller Tools."

## Requirements Summary:

1.  **Main Sidebar:**
    - Collapsible with a toggle button.
    - When collapsed, both the logo and navigation icons should remain visible.
2.  **Secondary Sidebar:**
    - Displays sub-navigation links specific to the current main page (e.g., tools within "Amazon Seller Tools").
    - Dynamically populated based on the active route.
    - Fixed width.
    - Sits beside the main content area.

## Detailed Plan:

### Phase 1: Implement Collapsible Main Sidebar

1.  **Modify `src/components/layout/Sidebar.tsx`:**

    - Introduce a state variable (e.g., `isCollapsed`) to manage the collapsed/expanded state of the sidebar.
    - Add a toggle button (e.g., an arrow icon) within the sidebar's header or footer to control this `isCollapsed` state.
    - Conditionally apply CSS classes (e.g., using `cn` from `src/lib/utils.ts`) to adjust the width of the sidebar and the visibility of text labels (like "Alerion" and navigation item names) based on the `isCollapsed` state.
    - Ensure the logo (`/logo.svg`) and navigation icons remain visible even when the sidebar is collapsed. The width of the collapsed sidebar should be just enough to accommodate the logo and icons.
    - Consider using React Context to provide the `isCollapsed` state to `MainLayout.tsx` if layout adjustments are needed there based on the sidebar's state.

2.  **Modify `src/components/layout/MainLayout.tsx`:**
    - Adjust the main content area's width or left margin dynamically based on the `isCollapsed` state of the main sidebar. This will prevent content from being obscured or having unnecessary empty space when the sidebar collapses or expands. This can be achieved by reading the `isCollapsed` state from the context provided by `Sidebar.tsx` or by passing it as a prop.

### Phase 2: Implement Secondary Sidebar

1.  **Create a new component `src/components/layout/SecondarySidebar.tsx`:**

    - This component will be responsible for rendering the sub-navigation links for specific pages.
    - It will receive props, such as a list of sub-navigation items, to dynamically render the links.
    - It will have a fixed width (e.g., `w-48` or `w-64` using Tailwind CSS classes) to maintain a consistent layout.

2.  **Define Sub-navigation Data Structure:**

    - Create a data structure, likely in a new file like `src/lib/sub-routes.ts` or extending `src/lib/routes.ts`, that maps main routes (e.g., `/tools/amazon-seller-tools`) to their respective sub-navigation links.
    - For `AmazonSellerTools.tsx`, this structure would include entries for each tool component (e.g., `acos-calculator`, `competitor-analyzer`, `description-editor`, etc.), along with their display names and paths.

3.  **Modify `src/pages/AmazonSellerTools.tsx`:**

    - Currently, this page likely uses tabs or similar UI elements to switch between different tools. These will be replaced by the secondary sidebar.
    - The content area of `AmazonSellerTools.tsx` will then display the selected tool's component based on the active sub-route. This will likely involve using `react-router-dom`'s `Outlet` component for nested routing.

4.  **Modify `src/components/layout/MainLayout.tsx`:**
    - Integrate the `SecondarySidebar` component into the layout.
    - Conditionally render the `SecondarySidebar` only when the current route indicates that a secondary sidebar is needed (e.g., when navigating to `/tools/amazon-seller-tools/*`).
    - Adjust the overall layout to accommodate three columns when the secondary sidebar is present: Main Sidebar, Secondary Sidebar, and Main Content Area. This might involve using CSS Grid or Flexbox.

### Phase 3: Routing and State Management

1.  **Update Routing (`src/App.tsx` or relevant routing file):**

    - Ensure `react-router-dom` is configured to handle nested routes for the sub-navigation links. For example, a route for `AmazonSellerTools` might look like:
      ```jsx
      <Route
        path="/tools/amazon-seller-tools"
        element={<AmazonSellerToolsPage />}
      >
        <Route path="acos-calculator" element={<AcosCalculator />} />
        <Route path="competitor-analyzer" element={<CompetitorAnalyzer />} />
        <Route path="description-editor" element={<DescriptionEditor />} />
        {/* Add all other Amazon Seller Tools routes here */}
      </Route>
      ```
    - The `AmazonSellerTools.tsx` page will then render the `SecondarySidebar` and an `Outlet` for the specific tool components.

2.  **State Management for Sidebar Collapse:**
    - Utilize React Context API to manage the `isCollapsed` state of the main sidebar. This will allow `Sidebar.tsx` to update the state and `MainLayout.tsx` (and potentially other components) to consume this state for layout adjustments without prop drilling.

## Mermaid Diagram:

```mermaid
graph TD
    A[User Interaction] --> B{Toggle Main Sidebar};
    B -- Collapsed --> C[Main Sidebar (Logo + Icons)];
    B -- Expanded --> D[Main Sidebar (Full)];

    E[MainLayout.tsx] --> F[Main Sidebar];
    E --> G{Conditional Secondary Sidebar};
    G -- If Route Requires --> H[SecondarySidebar.tsx];
    G -- Else --> I[No Secondary Sidebar];

    H --> J[Sub-navigation Links];
    J --> K[Main Content Area (Tool Component)];

    F --> L[Main Content Area];
    I --> L;

    subgraph Main Application Flow
        M[App.tsx] --> E;
        E --> N[Pages (e.g., AmazonSellerTools.tsx)];
        N --> K;
    end

    style C fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#bbf,stroke:#333,stroke-width:2px
    style H fill:#ccf,stroke:#333,stroke-width:2px
    style K fill:#cfc,stroke:#333,stroke-width:2px
```
