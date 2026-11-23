import { describe, expect, it } from "vitest";
import { POLL_OPTIONS, computePercentages, emptyCounts } from "@/lib/poll";

describe("poll results", () => {
  it("offers five answers to vote for", () => {
    expect(POLL_OPTIONS).toHaveLength(5);
  });

  it("shows 0% everywhere before anyone votes", () => {
    expect(computePercentages(emptyCounts())).toEqual({ small_business: 0, vocational: 0, youth: 0, industries: 0, regions: 0 });
  });

  it("turns vote counts into percentages", () => {
    const p = computePercentages({ small_business: 2, vocational: 1, youth: 0, industries: 0, regions: 1 });
    expect(p).toEqual({ small_business: 50, vocational: 25, youth: 0, industries: 0, regions: 25 });
  });

  it("percentages always add up to 100", () => {
    const p = computePercentages({ small_business: 1, vocational: 1, youth: 1, industries: 0, regions: 0 });
    expect(p.small_business + p.vocational + p.youth + p.industries + p.regions).toBe(100);
  });
});
