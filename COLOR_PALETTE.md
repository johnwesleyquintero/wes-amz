# Color Palette Documentation

This document outlines the color variables used in the Alerion UI, their HSL values, and their intended semantic usage.

## Base Colors

These variables define the core color scheme for the application, used for backgrounds, text, borders, and primary interactive elements.

| Variable               | Light Mode HSL | Dark Mode HSL  | Description                                          |
| ---------------------- | -------------- | -------------- | ---------------------------------------------------- |
| `--primary`            | `216 100% 40%` | `216 100% 70%` | Primary brand color, used for main actions/elements. |
| `--secondary`          | `210 90% 45%`  | `210 100% 65%` | Secondary brand color.                               |
| `--accent`             | `32 92% 63%`   | `32 92% 75%`   | Accent color, used for highlights or emphasis.       |
| `--foreground`         | `210 10% 14%`  | `210 17% 93%`  | Default text color.                                  |
| `--muted-foreground`   | `208 8% 38%`   | `210 17% 85%`  | Muted text color for less emphasis.                  |
| `--background`         | `210 17% 98%`  | `220 20% 13%`  | Default background color.                            |
| `--card`               | `0 0% 100%`    | `218 20% 23%`  | Background color for cards and containers.           |
| `--border`             | `210 14% 90%`  | `218 17% 28%`  | Border color for elements.                           |
| `--input`              | `210 14% 90%`  | `218 17% 28%`  | Border/background color for input fields.            |
| `--code-bg`            | `210 17% 93%`  | `218 17% 28%`  | Background color for code blocks.                    |
| `--quote-bg`           | `217 100% 95%` | N/A            | Background color for blockquotes (Light Mode only).  |
| `--quote-text`         | `210 22% 24%`  | N/A            | Text color for blockquotes (Light Mode only).        |
| `--date-text`          | `210 9% 45%`   | `216 17% 63%`  | Text color for dates or timestamps.                  |
| `--testimonial-bg`     | `0 0% 98%`     | `220 17% 30%`  | Background color for testimonials.                   |
| `--testimonial-quote`  | `0 0% 33%`     | `210 17% 90%`  | Text color for testimonial quotes.                   |
| `--skeleton-bg`        | `210 17% 93%`  | `218 17% 28%`  | Background color for skeleton loading states.        |
| `--skeleton-highlight` | `210 17% 90%`  | `218 17% 35%`  | Highlight color for skeleton loading animation.      |
| `--radius`             | `0.5rem`       | `0.5rem`       | Border radius value.                                 |

## Semantic Status Colors

These variables are used to indicate status or severity.

| Variable                 | Light Mode HSL | Dark Mode HSL | Description                                                       |
| ------------------------ | -------------- | ------------- | ----------------------------------------------------------------- |
| `--color-status-error`   | `359 82% 64%`  | `359 60% 75%` | Used for error messages, destructive actions, or negative trends. |
| `--color-status-info`    | `195 66% 57%`  | `195 50% 70%` | Used for informational messages or elements.                      |
| `--color-status-warning` | `48 100% 50%`  | `48 80% 65%`  | Used for warning messages or elements.                            |

## Chart Colors

These variables are intended for use in data visualizations and charts.

| Variable          | Light Mode HSL | Dark Mode HSL | Description           |
| ----------------- | -------------- | ------------- | --------------------- |
| `--chart-color-1` | `8 74% 67%`    | `8 60% 75%`   | Chart series color 1. |
| `--chart-color-2` | `22 80% 57%`   | `22 60% 70%`  | Chart series color 2. |
| `--chart-color-3` | `195 50% 94%`  | `195 30% 30%` | Chart series color 3. |
| `--chart-color-4` | `47 50% 91%`   | `47 30% 35%`  | Chart series color 4. |
| `--chart-color-5` | `262 34% 48%`  | `262 25% 65%` | Chart series color 5. |

## Shadcn/ui Component Colors

These variables are primarily used by shadcn/ui components and are derived from the base colors.

| Variable                   | Light Mode HSL | Dark Mode HSL  | Description                                         |
| -------------------------- | -------------- | -------------- | --------------------------------------------------- |
| `--popover`                | `0 0% 100%`    | `218 20% 23%`  | Background for popovers and dropdowns.              |
| `--popover-foreground`     | `210 10% 14%`  | `210 17% 93%`  | Text color for popovers and dropdowns.              |
| `--primary-foreground`     | `0 0% 100%`    | `0 0% 100%`    | Text color on primary background.                   |
| `--secondary-foreground`   | `210 10% 14%`  | `210 17% 93%`  | Text color on secondary background.                 |
| `--muted`                  | `210 17% 93%`  | `218 17% 28%`  | Background for muted elements (e.g., hover states). |
| `--accent-foreground`      | `210 10% 14%`  | `210 17% 93%`  | Text color on accent background.                    |
| `--destructive`            | `0 84% 60%`    | `0 63% 31%`    | Background for destructive elements.                |
| `--destructive-foreground` | `210 40% 98%`  | `210 40% 98%`  | Text color on destructive background.               |
| `--ring`                   | `216 100% 40%` | `216 100% 70%` | Color for focus rings.                              |

## Sidebar Colors

These variables define the color scheme specifically for the sidebar.

| Variable                       | Light Mode HSL | Dark Mode HSL | Description                                        |
| ------------------------------ | -------------- | ------------- | -------------------------------------------------- |
| `--sidebar-background`         | `220 80% 98%`  | `240 6% 10%`  | Background color for the sidebar.                  |
| `--sidebar-foreground`         | `240 5% 26%`   | `240 5% 96%`  | Default text color in the sidebar.                 |
| `--sidebar-primary`            | `240 6% 10%`   | `224 76% 48%` | Primary color for interactive elements in sidebar. |
| `--sidebar-primary-foreground` | `0 0% 98%`     | `0 0% 100%`   | Text color on sidebar primary background.          |
| `--sidebar-accent`             | `240 5% 96%`   | `240 4% 16%`  | Accent color for sidebar elements.                 |
| `--sidebar-accent-foreground`  | `240 6% 10%`   | `240 5% 96%`  | Text color on sidebar accent background.           |
| `--sidebar-border`             | `220 13% 91%`  | `240 4% 16%`  | Border color in the sidebar.                       |
| `--sidebar-ring`               | `217 91% 60%`  | `217 91% 60%` | Focus ring color in the sidebar.                   |
