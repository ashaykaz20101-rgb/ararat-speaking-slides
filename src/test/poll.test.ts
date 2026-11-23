import { describe, expect, it } from "vitest";
import { POLLS, computePercentages, emptyCounts } from "@/lib/poll";

const first = POLLS[0]!;

describe("poll results", () => {
  it("asks the audience five questions", () => {
    expect(POLLS).toHaveLength(5);
  });

  it("each question has four answers", () => {
    for (const p of POLLS) expect(p.options).toHaveLength(4);
  });

  it("keeps the original first question so earlier votes still count", () => {
    expect(first.id).toBe("reduce-unemployment");
  });

  it("shows 0% everywhere before anyone votes", () => {
    expect(computePercentages(first, emptyCounts(first))).toEqual({ small_business: 0, vocational: 0, youth: 0, industries: 0 });
  });

  it("turns vote counts into percentages", () => {
    const p = computePercentages(first, { small_business: 2, vocational: 1, youth: 1, industries: 0 });
    expect(p).toEqual({ small_business: 50, vocational: 25, youth: 25, industries: 0 });
  });

  it("percentages always add up to 100", () => {
    const p = computePercentages(first, { small_business: 1, vocational: 1, youth: 1, industries: 0 });
    expect(Object.values(p).reduce((s, v) => s + v, 0)).toBe(100);
  });
});
