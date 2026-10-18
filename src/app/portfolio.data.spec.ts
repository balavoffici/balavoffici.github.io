import { calculateDuration } from './portfolio.data';

describe('calculateDuration', () => {
  it('counts years and months inclusively', () => {
    expect(calculateDuration('Sep 2022', new Date(2026, 9, 18))).toBe('Sep 2022 - Present · 4 yrs 2 mos');
  });

  it('rolls a full 12 months over into a year', () => {
    expect(calculateDuration('Jan 2024', new Date(2024, 11, 5))).toBe('Jan 2024 - Present · 1 yr');
  });

  it('handles spans that cross a year boundary', () => {
    expect(calculateDuration('Dec 2025', new Date(2026, 0, 10))).toBe('Dec 2025 - Present · 2 mos');
  });

  it('shows a single month for a start this month', () => {
    expect(calculateDuration('Oct 2026', new Date(2026, 9, 1))).toBe('Oct 2026 - Present · 1 mo');
  });
});
