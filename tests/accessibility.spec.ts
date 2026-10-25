import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';

const title = 'The Midnight Library';
const detailsButtonName = `View details for ${title}`;
const saveButtonName = `Save ${title}`;
const removeButtonName = `Remove ${title} from saved books`;

async function tabTo(page: Page, target: Locator, backwards = false) {
  await expect(target).toBeVisible();

  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (await target.evaluate((element) => element === document.activeElement)) {
      return;
    }

    await page.keyboard.press(backwards ? 'Shift+Tab' : 'Tab');
  }

  throw new Error(`Keyboard focus did not reach ${await target.toString()}`);
}

async function expectVisibleKeyboardFocus(locator: Locator) {
  await expect(locator).toBeFocused();
  await expect(locator).toBeInViewport();

  const focusStyle = await locator.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      focusVisible: element.matches(':focus-visible'),
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
      boxShadow: style.boxShadow,
    };
  });

  expect(focusStyle.focusVisible).toBe(true);
  expect(
    (focusStyle.outlineStyle !== 'none' && focusStyle.outlineWidth >= 2) ||
      focusStyle.boxShadow !== 'none',
    'The focused control must have a visible outline of at least 2px or a box-shadow focus ring',
  ).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('keyboard-only user can complete the main task', async ({ page }) => {
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main#main-content')).toBeFocused();

  const search = page.getByLabel('Search', { exact: true });
  await tabTo(page, search);

  // Exercise reverse keyboard navigation, then return to the search field.
  await page.keyboard.press('Shift+Tab');
  await expect(search).not.toBeFocused();
  await page.keyboard.press('Tab');
  await expect(search).toBeFocused();

  await page.keyboard.type(title);
  await expect(
    page.locator('[aria-live="polite"]').filter({ hasText: /^1 book found$/ }),
  ).toBeVisible();

  const detailsButton = page.getByRole('button', {
    name: detailsButtonName,
    exact: true,
  });
  await tabTo(page, detailsButton);
  await page.keyboard.press('Enter');

  const dialog = page.locator('dialog[open]');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', { name: title, level: 3 })).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(detailsButton).toBeFocused();

  const saveButton = page.getByRole('button', { name: saveButtonName, exact: true });
  await page.keyboard.press('Tab');
  await expect(saveButton).toBeFocused();
  await page.keyboard.press('Space');
  await expect(saveButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: removeButtonName, exact: true })).toBeFocused();

  const name = page.getByLabel('Name', { exact: true });
  await tabTo(page, name);
  await page.keyboard.type('Alex Reader');

  const email = page.getByLabel('Email', { exact: true });
  await page.keyboard.press('Tab');
  await expect(email).toBeFocused();
  await page.keyboard.type('alex@example.com');

  const genre = page.getByLabel('Favourite genre', { exact: true });
  await page.keyboard.press('Tab');
  await expect(genre).toBeFocused();
  await page.keyboard.press('f');
  await expect(genre.locator('option:checked')).toHaveText('Fantasy');

  const consent = page.getByRole('checkbox');
  await page.keyboard.press('Tab');
  await expect(consent).toBeFocused();
  await page.keyboard.press('Space');
  await expect(consent).toBeChecked();

  const submit = page.getByRole('button', { name: /join|sign up|submit/i });
  await page.keyboard.press('Tab');
  await expect(submit).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    page.locator('[aria-live="polite"]').filter({
      hasText: 'Thank you for joining the BOOKMARK Reading Club!',
    }),
  ).toBeVisible();
});

test('interactive controls have visible keyboard focus', async ({ page }) => {
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await page.keyboard.press('Tab');
  await expectVisibleKeyboardFocus(skipLink);
  await page.keyboard.press('Enter');

  const search = page.getByLabel('Search', { exact: true });
  await tabTo(page, search);
  await expectVisibleKeyboardFocus(search);
  await page.keyboard.type(title);

  const detailsButton = page.getByRole('button', {
    name: detailsButtonName,
    exact: true,
  });
  await tabTo(page, detailsButton);
  await expectVisibleKeyboardFocus(detailsButton);

  await page.keyboard.press('Tab');
  await expectVisibleKeyboardFocus(
    page.getByRole('button', { name: saveButtonName, exact: true }),
  );

  const name = page.getByLabel('Name', { exact: true });
  await tabTo(page, name);
  await expectVisibleKeyboardFocus(name);
});

for (const activationKey of ['Enter', 'Space']) {
  test(`Save is independently keyboard operable with ${activationKey}`, async ({ page }) => {
    const search = page.getByLabel('Search', { exact: true });
    await expect(search).toBeVisible();
    await search.fill(title);

    const detailsButton = page.getByRole('button', {
      name: detailsButtonName,
      exact: true,
    });
    const saveButton = page.getByRole('button', {
      name: saveButtonName,
      exact: true,
    });
    const cardActions = detailsButton.locator('..');

    await expect(detailsButton).toHaveJSProperty('tagName', 'BUTTON');
    await expect(saveButton).toHaveJSProperty('tagName', 'BUTTON');
    await expect(cardActions.locator(':scope > button')).toHaveCount(2);

    await detailsButton.focus();
    await page.keyboard.press('Tab');
    await expect(saveButton).toBeFocused();

    await page.keyboard.press(activationKey);

    await expect(saveButton).toHaveAttribute('aria-pressed', 'true');
    await expect(
      page.getByRole('button', { name: removeButtonName, exact: true }),
    ).toBeFocused();
    await expect(page.locator('dialog[open]')).toHaveCount(0);
  });
}

test('dialog traps focus and restores it after Escape and Close', async ({ page }) => {
  const search = page.getByLabel('Search', { exact: true });
  await expect(search).toBeVisible();
  await search.fill(title);
  const detailsButton = page.getByRole('button', {
    name: detailsButtonName,
    exact: true,
  });
  const dialog = page.locator('dialog');
  const closeButton = dialog.getByRole('button', { name: 'Close', exact: true });

  await detailsButton.click();
  await expect(dialog).toHaveAttribute('open', '');
  await expect(closeButton).toBeFocused();

  await page.keyboard.press('Shift+Tab');
  await expect(dialog.locator(':focus')).toHaveCount(1);
  await page.keyboard.press('Tab');
  await expect(dialog.locator(':focus')).toHaveCount(1);

  await page.keyboard.press('Escape');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(detailsButton).toBeFocused();

  await detailsButton.click();
  await expect(closeButton).toBeFocused();
  await closeButton.press('Enter');
  await expect(dialog).not.toHaveAttribute('open', '');
  await expect(detailsButton).toBeFocused();
});

test('has no serious or critical axe-core violations', async ({ page }) => {
  // Prevent a missing target (for example, a server-generated 404 page) from
  // producing an empty axe result and being mistaken for a passing project.
  await expect(page.locator('main#main-content')).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  const seriousOrCritical = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  );

  expect(seriousOrCritical).toEqual([]);
});
