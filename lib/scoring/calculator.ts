import type { ArrowScore } from '@/types/database';

/**
 * Calculate the total score for an end (sum of all arrow numeric values).
 */
export function calculateEndScore(arrows: ArrowScore[]): number {
  return arrows.reduce((sum, arrow) => sum + arrow.numeric_value, 0);
}

/**
 * Calculate the total score across all completed ends.
 */
export function calculateTotalScore(endScores: number[]): number {
  return endScores.reduce((sum, score) => sum + score, 0);
}

/**
 * Calculate the average score per arrow, rounded to 2 decimal places.
 */
export function calculateAverage(totalScore: number, totalArrows: number): number {
  if (totalArrows === 0) return 0;
  return Math.round((totalScore / totalArrows) * 100) / 100;
}

/**
 * Calculate the theoretical maximum score for a session.
 */
export function calculateMaximumScore(
  endsCount: number,
  arrowsPerEnd: number,
  maxArrowScore: number = 10
): number {
  return endsCount * arrowsPerEnd * maxArrowScore;
}

/**
 * Count the occurrences of a specific display value in a list of arrows.
 */
export function countDisplayValue(arrows: ArrowScore[], displayValue: string): number {
  return arrows.filter((a) => a.display_value === displayValue).length;
}

/**
 * Count X-ring hits across all arrows.
 */
export function countX(arrows: ArrowScore[]): number {
  return countDisplayValue(arrows, 'X');
}

/**
 * Count 10-score hits (excluding X) across all arrows.
 */
export function countTens(arrows: ArrowScore[]): number {
  return countDisplayValue(arrows, '10');
}

/**
 * Count 9-score hits across all arrows.
 */
export function countNines(arrows: ArrowScore[]): number {
  return countDisplayValue(arrows, '9');
}

/**
 * Validate that an arrow score is within the valid range for the session.
 */
export function isValidArrowScore(
  numericValue: number,
  maxArrowScore: number = 10
): boolean {
  return Number.isInteger(numericValue) && numericValue >= 0 && numericValue <= maxArrowScore;
}

/**
 * Validate that the correct number of arrows have been entered for an end.
 */
export function isValidEndSubmission(
  arrows: ArrowScore[],
  arrowsPerEnd: number,
  maxArrowScore: number = 10
): { valid: boolean; error?: string } {
  if (arrows.length !== arrowsPerEnd) {
    return {
      valid: false,
      error: `Expected ${arrowsPerEnd} arrows, got ${arrows.length}`,
    };
  }

  for (let i = 0; i < arrows.length; i++) {
    if (!isValidArrowScore(arrows[i].numeric_value, maxArrowScore)) {
      return {
        valid: false,
        error: `Arrow ${i + 1} has an invalid score: ${arrows[i].numeric_value}`,
      };
    }
  }

  return { valid: true };
}
