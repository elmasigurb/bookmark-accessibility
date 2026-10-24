# BOOKMARK — Accessibility Specification

## 1. Project Overview

**Project:** BOOKMARK — Book Discovery Website  
**Tagline:** Your next favourite read starts here.  
**Accessibility target:** WCAG 2.2 Level AA  
**Design reference:** `references/module3-style-guide.png`

BOOKMARK is a responsive book discovery website inspired by Goodreads. Users can search for books, explore detailed information, save books to a reading list and sign up for a reading club.

This specification documents the accessibility and design decisions for both Project A and Project B.

Both implementations must follow the same requirements to ensure a fair comparison.

### Main User Task

Search for **The Midnight Library**, open its details, close the dialog, save the book and sign up for the BOOKMARK Reading Club.

---

## 2. Design System

The website must follow the colours, typography, spacing and visual principles established in the Module 3 style guide.

### 2.1 Colour Palette

The design follows the **10/30/60 colour distribution rule**.

| Colour | HEX | Usage | Distribution |
|---|---|---|---|
| Deep Burgundy | `#44020E` | Headings, buttons, icons, text and accents | 10% |
| Soft Blush Pink | `#FFEFF0` | Cards, form containers and section backgrounds | 30% |
| White | `#FFFFFF` | Main background, content areas and negative space | 60% |

The percentages represent the intended visual distribution of colours throughout the interface, not opacity.

The distribution should guide the overall design rather than require exact pixel-by-pixel measurements.

### 2.2 Colour Contrast

The following contrast ratios are calculated using the WCAG relative luminance formula.

| Foreground | Background | Contrast Ratio | WCAG AA |
|---|---|---|---|
| Burgundy `#44020E` | White `#FFFFFF` | 16.66:1 | Pass |
| Burgundy `#44020E` | Pink `#FFEFF0` | 14.96:1 | Pass |
| White `#FFFFFF` | Burgundy `#44020E` | 16.66:1 | Pass |
| Pink `#FFEFF0` | White `#FFFFFF` | 1.11:1 | Fail for text |

**Contrast requirements:**

- Normal text must have a minimum contrast ratio of 4.5:1.
- Large text must have a minimum contrast ratio of 3:1.
- Important interface icons and component boundaries must have a minimum contrast ratio of 3:1.
- Burgundy text may be used on white and pink backgrounds.
- White text may be used on burgundy backgrounds.
- Pink must not be used as the only visual indicator of important information on white backgrounds.
- Focus indicators and interactive controls must maintain sufficient contrast.

### 2.3 Typography

Use the typography defined in the Module 3 style guide.

| Element | Font |
|---|---|
| Main headings | DM Serif Display |
| Section headings | DM Serif Display |
| Body text | Inter |
| Form labels | Inter |
| Emphasized text | Inter Bold |
| Buttons | Inter |

**Typography requirements:**

- Standard body text should be at least 16px.
- Heading sizes must follow a consistent visual hierarchy.
- Text must remain readable when enlarged.
- Line spacing must support comfortable reading.
- Font size must not be used as a replacement for semantic heading elements.

### 2.4 Layout and Components

- Use a consistent border radius of 14px.
- Primary buttons must use burgundy backgrounds with white text.
- Book cards and form containers should use soft pink backgrounds.
- Main content areas should use white backgrounds.
- Maintain consistent spacing between components.
- Use responsive layouts for desktop, tablet and mobile.
- Interactive targets must be at least 24 × 24 CSS pixels.
- Content must remain usable at 200% browser zoom.
- Avoid horizontal scrolling caused by layout overflow.

---

## 3. Semantic HTML and Landmarks

The page must use semantic HTML elements to establish a clear document structure.

### Required Landmarks

| Landmark | HTML Element | Purpose |
|---|---|---|
| Header | `<header>` | Contains the BOOKMARK brand and primary navigation |
| Navigation | `<nav aria-label="Main navigation">` | Links to the three main sections |
| Main | `<main id="main-content">` | Contains the primary page content |
| Footer | `<footer>` | Contains copyright and additional information |

There must be exactly one main landmark.

### Skip Link

The first keyboard-focusable element must be a skip link labelled:

**Skip to main content**

The skip link must:

- Link to `#main-content`.
- Be visually hidden until focused.
- Become clearly visible when receiving keyboard focus.
- Move keyboard focus to the main content when activated.

### Main Navigation

The navigation must contain three links:

1. Discover Books — `#discover`
2. Book Details — `#details`
3. Reading Club — `#reading-club`

All navigation links must be accessible using the keyboard.

The Book Details navigation link must lead to a visible section explaining that selecting a book opens its details. The actual book details appear in a modal dialog.

---

## 4. Heading Hierarchy

The page must contain exactly one `<h1>`.

Headings must follow a logical hierarchy without skipping levels.

### Heading Outline

**H1 — BOOKMARK — Your next favourite read starts here**

**H2 — Discover Books**

Each book result must use an `<h3>` for its title:

- H3 — The Midnight Library
- H3 — Normal People
- H3 — The Seven Husbands of Evelyn Hugo
- H3 — The Silent Patient
- H3 — A Little Life
- H3 — The Song of Achilles
- H3 — It Ends with Us
- H3 — The Housemaid

**H2 — Book Details**

The selected book title must appear as an `<h3>` inside the details dialog.

**H2 — Join the Reading Club**

Heading levels must represent the document structure rather than visual styling.

Only headings for currently displayed search results should appear in the results section.

---

## 5. Search and Results

The Discover Books section allows users to search for books by title or author.

### Search Input

The search field must have a visible label:

**Search**

The label must be programmatically associated with the input.

Search results must update dynamically as the user types.

### Results Count

The number of matching books must be displayed as visible text.

Examples:

- "8 books found"
- "1 book found"
- "No books found"

The result count must use a polite live region so that screen readers announce changes.

### Book Cards

Each book card must include:

- Book cover image
- Book title as an `<h3>`
- Author name
- A native button labelled "View details for [book title]"
- An icon-only save button

The details button must appear before the save button in the keyboard focus order.

The card itself must not be given an unnecessary `tabindex` when the details button already provides keyboard access.

### Save Buttons

Save buttons must use native `<button>` elements.

The accessible name must include the book title.

Example:

**Save The Midnight Library**

After saving:

**Remove The Midnight Library from saved books**

The button must communicate its current state using `aria-pressed`.

The icon must be decorative and must not create a duplicate accessible name.

The saved state must be visually identifiable without relying only on colour.

For this demonstration, saved books should remain saved during the current browser session. A backend is not required.

---

## 6. Details Dialog

Selecting a book opens a modal dialog containing more information about that book.

### Dialog Content

The dialog must display:

- Book title
- Author
- Cover image
- Genre
- Publication year
- Detailed description
- Close button

### Dialog Behaviour

Use the native HTML `<dialog>` element and open it using `showModal()`.

The dialog must have an accessible name associated with the selected book title.

When opened:

1. Focus moves to the visible Close button inside the dialog.
2. The dialog content becomes available to assistive technologies.
3. Background content becomes unavailable for keyboard interaction.
4. Keyboard focus remains within the modal dialog.

### Closing the Dialog

The dialog must close when:

- The user presses Escape.
- The user activates the Close button.

After closing:

- Focus returns to the exact "View details" button that opened the dialog.
- The user's position in the search results is preserved.
- The user can continue navigating through the results.

The dialog must not cause unexpected focus changes.

---

## 7. Keyboard Navigation and Focus Management

The website must support complete keyboard-only interaction.

### Required Keyboard Controls

| Key | Expected Behaviour |
|---|---|
| Tab | Move to the next interactive element |
| Shift + Tab | Move to the previous interactive element |
| Enter | Activate links and buttons |
| Space | Activate buttons and checkboxes |
| Escape | Close the modal dialog |

### Main Task — Expected Focus Order

#### Step 1 — Access Main Content

1. Press Tab.
2. Focus moves to "Skip to main content".
3. Press Enter.
4. Focus moves to the main content.
5. Press Tab until reaching the Search field.

#### Step 2 — Search for a Book

6. Enter "The Midnight Library".
7. Search results update.
8. The results count changes to "1 book found".
9. The updated count is announced to screen readers.

#### Step 3 — Open Book Details

10. Press Tab to reach "View details for The Midnight Library".
11. Press Enter.
12. The details dialog opens.
13. Focus moves to the Close button.
14. The book information is available to screen readers.

#### Step 4 — Close the Dialog

15. Press Escape.
16. The dialog closes.
17. Focus returns to "View details for The Midnight Library".

#### Step 5 — Save the Book

18. Press Tab.
19. Focus moves to "Save The Midnight Library".
20. Press Space.
21. The book is saved.
22. The button changes to "Remove The Midnight Library from saved books".
23. Focus remains on the save button.

#### Step 6 — Complete Sign-up

24. Continue navigating to the Reading Club form using the keyboard.
25. Enter a name.
26. Enter an email address.
27. Select a favourite genre.
28. Check the consent checkbox using Space.
29. Activate the Submit button.
30. A success message appears and is announced.

### General Focus Requirements

- Every interactive element must have visible keyboard focus.
- Focus must follow the logical document order.
- No positive `tabindex` values may be used.
- Focus must not move unexpectedly during search updates.
- Focus must remain within an open modal dialog.
- Focus must return to the original trigger after closing the dialog.

---

## 8. Images and Alternative Text

Images must have appropriate alternative text.

### Book Covers

Book covers must identify the book and author.

| Book | Alternative Text |
|---|---|
| The Midnight Library | Cover of The Midnight Library by Matt Haig |
| Normal People | Cover of Normal People by Sally Rooney |
| The Seven Husbands of Evelyn Hugo | Cover of The Seven Husbands of Evelyn Hugo by Taylor Jenkins Reid |
| The Silent Patient | Cover of The Silent Patient by Alex Michaelides |
| A Little Life | Cover of A Little Life by Hanya Yanagihara |
| The Song of Achilles | Cover of The Song of Achilles by Madeline Miller |
| It Ends with Us | Cover of It Ends with Us by Colleen Hoover |
| The Housemaid | Cover of The Housemaid by Freida McFadden |

If a cover image appears inside a button whose accessible name already identifies the book, the image may be decorative to avoid repetitive announcements.

### Decorative Images

Decorative images must use:

`alt=""`

Examples:

- Background illustrations
- Decorative shapes
- Non-informative visual elements

Decorative SVG icons must use `aria-hidden="true"`.

Important information must never be communicated through images alone.

---

## 9. Reading Club Sign-up Form

The Reading Club section contains a demonstration sign-up form.

### Required Fields

| Field | Type | Required |
|---|---|---|
| Name | Text | Yes |
| Email | Email | Yes |
| Favourite genre | Select | Yes |
| Consent | Checkbox | Yes |

### Genre Options

The select element must include:

- Romance
- Fantasy
- Thriller
- Literary Fiction
- Historical Fiction
- Other

The default option must be:

"Select a genre"

### Labels

Every form field must have a visible label associated with its input.

Placeholder text must not replace labels.

### Validation

Validation errors must appear as text next to the relevant fields.

Errors must only appear after the user has attempted to interact with a field or submit the form.

Example error messages:

- "Please enter your name."
- "Please enter a valid email address."
- "Please select your favourite genre."
- "You must agree before signing up."

### Accessible Error Handling

- Invalid fields must use `aria-invalid="true"`.
- Error messages must be connected to their fields using `aria-describedby`.
- After an invalid submission, focus moves to the first invalid field.
- Error messages must be available to screen readers.
- Errors must not rely only on colour.
- Correcting a field must remove its invalid state when appropriate.

### Successful Submission

After valid submission:

- Display a visible confirmation message.
- Announce the message using a polite live region.
- Keep the user on the same page.

Success message:

**Thank you for joining the BOOKMARK Reading Club!**

The form is a demonstration. No real account creation, email delivery or backend is required.

---

## 10. Focus Visibility

All interactive elements must have a clearly visible focus indicator.

### Focus Styling

On white or pink backgrounds:

- Use a solid burgundy outline.
- Minimum outline width: 2px.
- Provide sufficient spacing between the outline and the element.

On burgundy backgrounds:

- Use a contrasting light focus indicator.
- Ensure the indicator remains distinguishable from surrounding colours.

Focus indicators must not be removed without providing an accessible replacement.

The focus state must be distinguishable from hover and default states.

---

## 11. Responsive Accessibility

The website must remain accessible on different screen sizes.

### Desktop

- Display books in a responsive grid.
- Maintain clear navigation and readable content.
- Avoid excessive line lengths.

### Tablet

- Reduce the number of grid columns when necessary.
- Maintain adequate spacing between interactive elements.

### Mobile

- Use a single-column or two-column book layout where appropriate.
- Ensure buttons and inputs remain easy to activate.
- Avoid horizontal overflow.
- Maintain visible focus indicators.

### Zoom

At 200% browser zoom:

- Text must remain readable.
- Interactive elements must remain accessible.
- Content must not overlap.
- Important information must not disappear.
- Users must be able to complete the main task.

---

## 12. Accessibility Testing

Both Project A and Project B must be evaluated using the same automated tests.

### Test 1 — Keyboard Navigation

Verify that the main task can be completed using:

- Tab
- Shift + Tab
- Enter
- Space
- Escape

The test must verify that the user can search, open details, close the dialog, save a book and complete the sign-up form.

### Test 2 — Visible Focus

Verify that interactive elements display a visible focus indicator when navigating with the keyboard.

### Test 3 — Dialog Focus Return

Verify that closing the details dialog returns focus to the exact button that originally opened it.

Test both Escape and the visible Close button.

### Test 4 — axe-core Accessibility Scan

Run axe-core accessibility checks.

The implementation must have no serious or critical accessibility violations.

### Manual Testing

Project B must also be tested manually using:

1. Keyboard-only navigation
2. VoiceOver on macOS
3. Browser zoom at 200%

Manual testing must document issues that automated tests did not detect.

At least one additional automated test must be created based on a problem discovered during manual testing.

---

## 13. Accessibility Acceptance Criteria

The website must satisfy the following requirements:

- Exactly one h1 is present.
- Heading levels follow a logical hierarchy.
- Header, navigation, main and footer landmarks are present.
- A functional skip link is provided.
- Search results update correctly.
- Changes to result counts are announced.
- All book results have accessible headings and images.
- Every save button has an accessible name.
- Saved states are communicated accessibly.
- The details dialog supports keyboard interaction.
- Focus returns correctly after closing the dialog.
- Form fields have associated labels.
- Validation errors are accessible.
- Successful submission is announced.
- Colour contrast meets applicable WCAG AA requirements.
- Interactive targets are at least 24 × 24 CSS pixels.
- The website remains usable at 200% zoom.
- No serious or critical axe-core violations remain.

---

## 14. Project A and Project B Comparison

Both implementations must use:

- The same `prompt.md`
- The same `spec.md`
- The same Module 3 style guide
- The same book dataset
- The same automated accessibility tests

### Project A

Project A is built without the custom accessibility skill.

After the initial implementation:

- Run the tests.
- Record the number of failed tests.
- Record which tests failed.
- Do not manually fix the implementation.

### Project B

Project B is built using the custom accessibility skill.

After the initial implementation:

- Run the tests.
- Record the initial failures.
- Fix the implementation until all tests pass.
- Keep Project A unchanged.

The custom accessibility skill must be the only difference in agent guidance between the two builds.

---

## 15. Final Accessibility Goal

BOOKMARK should demonstrate how thoughtful accessibility decisions can improve the usability of an AI-generated website.

The goal is not only to achieve passing automated tests but also to ensure that real users can complete the main task using different interaction methods.

The final report must compare the results of Project A and Project B and explain which accessibility decisions had the greatest impact.