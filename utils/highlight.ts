import { Page, Locator } from '@playwright/test';

/**
 * Highlight a Locator element visually during test execution.
 * Shows a colored border + label tooltip so you can clearly see which element is being verified.
 *
 * Usage:
 *   await highlight(page, locator, "Button Label");
 *
 * @param page       - Playwright Page instance
 * @param locator    - The Locator to highlight
 * @param label      - A label shown as a tooltip overlay on the element
 * @param color      - Border/label color (default: '#FF4500' orange-red)
 * @param durationMs - How long to keep the highlight visible in ms (default: 800ms)
 */
export async function highlight(
  page: Page,
  locator: Locator,
  label = '',
  color = '#00C853',
  durationMs = 1500
): Promise<void> {
  try {
    // Scroll into view first
    await locator.scrollIntoViewIfNeeded().catch(() => {});

    await locator.evaluate(
      (el, { color, label, durationMs }) => {
        const element = el as HTMLElement;

        // Save original styles
        const originalOutline = element.style.outline;
        const originalOutlineOffset = element.style.outlineOffset;
        const originalPosition = element.style.position;
        const originalZIndex = element.style.zIndex;

        // Apply highlight styles
        element.style.outline = `3px solid ${color}`;
        element.style.outlineOffset = '2px';

        // Create label badge
        let badge: HTMLElement | null = null;
        if (label) {
          badge = document.createElement('div');
          badge.innerText = `▶ ${label}`;
          badge.style.cssText = `
            position: absolute;
            background: ${color};
            color: white;
            font-size: 11px;
            font-weight: 700;
            font-family: monospace;
            padding: 2px 8px;
            border-radius: 3px;
            z-index: 99999;
            pointer-events: none;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            letter-spacing: 0.5px;
          `;
          // Position the badge relative to the element
          const rect = element.getBoundingClientRect();
          badge.style.top = `${rect.top + window.scrollY - 22}px`;
          badge.style.left = `${rect.left + window.scrollX}px`;
          document.body.appendChild(badge);
        }

        // Remove highlight after durationMs
        return new Promise<void>((resolve) =>
          setTimeout(() => {
            element.style.outline = originalOutline;
            element.style.outlineOffset = originalOutlineOffset;
            element.style.position = originalPosition;
            element.style.zIndex = originalZIndex;
            if (badge && badge.parentNode) badge.parentNode.removeChild(badge);
            resolve();
          }, durationMs)
        );
      },
      { color, label, durationMs }
    );

    // Brief pause after highlight fades so the eye can register before moving on
    await page.waitForTimeout(300);
  } catch {
    // Silently ignore if element is gone or detached – do not fail the test
  }
}
