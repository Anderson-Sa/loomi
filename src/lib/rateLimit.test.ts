import { describe, expect, it } from "vitest";
import { checkRateLimit } from "./rateLimit";

describe("checkRateLimit", () => {
  it("permite até o número máximo de tentativas dentro da janela", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key, 5, 60_000)).toEqual({ allowed: true });
    }
  });

  it("bloqueia após exceder o máximo de tentativas", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) checkRateLimit(key, 5, 60_000);

    const result = checkRateLimit(key, 5, 60_000);
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.retryAfterSeconds).toBeGreaterThan(0);
    }
  });

  it("trata chaves diferentes de forma independente", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    for (let i = 0; i < 5; i++) checkRateLimit(keyA, 5, 60_000);

    expect(checkRateLimit(keyA, 5, 60_000).allowed).toBe(false);
    expect(checkRateLimit(keyB, 5, 60_000).allowed).toBe(true);
  });

  it("libera novamente após a janela expirar", () => {
    const key = `test-${Math.random()}`;
    checkRateLimit(key, 1, -1_000);
    expect(checkRateLimit(key, 1, 60_000)).toEqual({ allowed: true });
  });
});
