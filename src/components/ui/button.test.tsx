import * as React from "react";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "./button";

describe("Button", () => {
  it("should not have any accessibility violations", async () => {
    const { container } = render(<Button>Test Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should render with the correct text", () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText("Click Me")).toBeInTheDocument();
  });
});
