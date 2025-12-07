import { expect, test, describe } from "vitest";

describe("Hello first test, r u ok?", () => {
  test("2+3. must be 5", () => {
    expect(2 + 3).toBe(5);
  });
});
