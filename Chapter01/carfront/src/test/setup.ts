import { vi } from "vitest";

// mock MUI DataGrid 的 CSS 文件，防止 TypeError
vi.mock('@mui/x-data-grid/esm/index.css', () => ({}));