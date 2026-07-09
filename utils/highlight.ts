import { Page, Locator } from '@playwright/test';

/**
 * Highlight is currently DISABLED to improve test run speed.
 * All call sites are kept intact but this function is a no-op.
 *
 * To re-enable, restore the original implementation from git history.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function highlight(
  _page: Page,
  _locator: Locator,
  _label = '',
  _color = '#00C853',
  _durationMs = 1500
): Promise<void> {
  // No-op: highlighting disabled for performance
}
