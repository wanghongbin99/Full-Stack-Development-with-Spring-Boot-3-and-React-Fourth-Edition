import { describe, test, expect, vi } from "vitest";
import { render, screen} from "@testing-library/react";
import App from "./App";

vi.mock('@mui/x-data-grid/esm/index.css', () => ({}));
describe("App", () => {
  test("should render without crashing", () => {
    // This is a placeholder test. You can add more specific tests here.
    render(<App />);
    expect(screen.getByText(/Car Shop/i)).toBeDefined();
  });

});
