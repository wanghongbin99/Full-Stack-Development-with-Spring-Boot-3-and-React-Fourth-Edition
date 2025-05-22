import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

vi.mock('@mui/x-data-grid', () => ({
  DataGrid: (props: any) => <div data-testid="datagrid-mock" {...props} />,
}));

describe("App", () => {
  test("should render without crashing", () => {
    render(<App />);
    expect(screen.getByText(/Car Shop/i)).toBeInTheDocument();
  });
});
