---
name: accessibility
description: Use whenever you build or change UI.
---

# Accessibility Skill

Apply these accessibility rules whenever creating or modifying user interfaces.

The goal is to ensure that all users, including people who rely on keyboards and assistive technologies, can understand and interact with the interface.

## 1. Use Native HTML Elements

Prefer semantic HTML over custom interactive elements.

- Use `<button>` for actions.
- Use `<a>` for navigation.
- Use `<label>` for form controls.
- Use `<nav>` for navigation.
- Use `<dialog>` for modal dialogs.
- Use `<header>`, `<main>` and `<footer>` for page structure.

Never replace a native interactive element with a `<div>` or `<span>` unless there is a documented reason and equivalent accessibility is implemented.

## 2. Give Every Control an Accessible Name

Every interactive element must have a meaningful accessible name.

- Associate visible labels with form inputs.
- Give icon-only buttons descriptive accessible names.
- Ensure button names describe their actions.
- Update accessible names when actions change.
- Avoid redundant announcements from decorative icons.

## 3. Provide Visible Keyboard Focus

Every interactive element must have a visible focus indicator.

- Never remove focus outlines without providing an accessible replacement.
- Ensure focus indicators have sufficient contrast.
- Maintain logical keyboard navigation.
- Avoid positive `tabindex` values.
- Do not create unexpected keyboard traps.

## 4. Manage Dialog Focus Correctly

Use the native `<dialog>` element for modal interactions.

When opening a dialog:

- Move focus into the dialog.
- Ensure the dialog has an accessible name.
- Prevent interaction with background content.
- Keep keyboard focus within the modal.

When closing a dialog:

- Support Escape and a visible Close button.
- Return focus to the exact element that opened the dialog.
- Preserve the user's position.

## 5. Make Forms Accessible

Every form field must have a visible, associated label.

For validation:

- Show errors as text next to the relevant field.
- Do not display errors before the user has attempted interaction.
- Associate errors with fields using `aria-describedby`.
- Mark invalid fields using `aria-invalid`.
- Move focus to the first invalid field after an unsuccessful submission.
- Announce successful submission through a live region.

Do not rely on colour alone to communicate errors.

## 6. Provide Appropriate Alternative Text

Informative images must have meaningful alternative text.

- Book covers should identify the book and author.
- Decorative images must use `alt=""`.
- Decorative SVG icons should use `aria-hidden="true"`.
- Avoid repeating information unnecessarily.

## 7. Maintain Accessible Visual Design

Follow WCAG 2.2 AA contrast requirements.

- Normal text: minimum 4.5:1.
- Large text: minimum 3:1.
- Important interface icons and boundaries: minimum 3:1.
- Interactive touch targets: minimum 24 × 24 CSS pixels.
- Support keyboard navigation and 200% browser zoom.
- Avoid overlapping content and horizontal overflow.

## 8. Follow the Project Specification

Read and follow `spec.md` before implementing or modifying UI.

The specification defines:

- Heading hierarchy
- Landmarks
- Keyboard focus order
- Dialog behaviour
- Image alternative text
- Colour contrast requirements
- Form validation and announcements

Treat these decisions as implementation requirements.

## 9. Verify Accessibility

Before completing UI work:

- Test the main user task using keyboard interaction.
- Verify visible focus indicators.
- Verify dialog focus restoration.
- Check accessible names and form labels.
- Run automated accessibility tests.
- Fix implementation issues without weakening test assertions.

When you are done, run the tests and fix what fails.