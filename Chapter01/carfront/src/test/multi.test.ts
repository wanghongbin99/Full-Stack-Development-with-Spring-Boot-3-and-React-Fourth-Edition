import { calMulti } from "./multi";

test("calMulti", () => {
  expect(calMulti(2, 3)).toBe(6);
  expect(calMulti(0, 3)).toBe(0);
  expect(calMulti(-2, 3)).toBe(-6);
  expect(calMulti(2, -3)).toBe(-6);
  expect(calMulti(-2, -3)).toBe(6);
});
