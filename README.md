# BOOKMARK — Your next favourite read starts here.

BOOKMARK is an academic web development experiment comparing two AI-generated implementations of the same book discovery website. Both versions use the same prompt, accessibility specification, book data and visual direction; the experimental variable is whether the coding agent received a custom accessibility skill.

**Live website:** [https://elmasigurb.github.io/bookmark-accessibility/](https://elmasigurb.github.io/bookmark-accessibility/)

- [Open Project A — Without Accessibility Skill](https://elmasigurb.github.io/bookmark-accessibility/a/)
- [Open Project B — With Accessibility Skill](https://elmasigurb.github.io/bookmark-accessibility/b/)

## Research question

> Does providing an AI coding agent with a custom accessibility skill improve the accessibility of the resulting website?

The results provide qualified support for the usefulness of structured accessibility guidance, but they do not prove that the skill alone caused the final differences. Project B also received iterative fixes, and one implementation per condition is too small a sample for a broad causal claim.

## Project A and Project B

| Version | Agent guidance | Treatment after initial test run |
|---|---|---|
| **Project A** | Built without the custom accessibility skill | Preserved as the baseline without manual implementation fixes |
| **Project B** | Built with the custom accessibility skill | Debugged iteratively until the required accessibility suite passed |

Both implementations follow the shared [project prompt](./prompt.md), [accessibility specification](./spec.md) and Module 3 visual system. The interface uses deep burgundy (`#44020E`), soft blush pink (`#FFEFF0`) and white (`#FFFFFF`), with DM Serif Display for headings, Inter for body text and a 14-pixel border radius.

## Main website features

- Search eight books by title or author.
- View book information in a details dialog.
- Save and remove books during the current browser session.
- Complete a demonstration BOOKMARK Reading Club form.
- Responsive layouts for desktop, tablet and mobile.
- A shared main task: search for *The Midnight Library*, open and close its details, save it and join the Reading Club.

## Custom accessibility skill

Project B used the custom skill at [`.agents/skills/accessibility/SKILL.md`](./.agents/skills/accessibility/SKILL.md). It provides implementation guidance for:

- semantic HTML and native interactive controls;
- meaningful accessible names;
- complete keyboard navigation and visible focus;
- modal-dialog focus containment and restoration;
- accessible form labels, validation and status messages;
- alternative text, colour contrast and responsive zoom behaviour; and
- automated and manual verification against a WCAG 2.2 AA target.

The skill is a development aid, not evidence of conformance by itself.

## Testing methodology

The original Playwright tests were written before either implementation. The shared suite covers:

1. completion of the main task using Tab, Shift+Tab, Enter, Space and Escape;
2. visible keyboard focus;
3. dialog focus containment and restoration; and
4. an axe-core scan for serious or critical violations.

The same [Playwright test file](./tests/accessibility.spec.ts) and [configuration](./playwright.config.ts) can target either implementation through `BOOKMARK_TARGET`. Manual Project B testing later produced two additional regression tests that explicitly activate the Save button with Enter and Space.

An additional Project B check covers horizontal reflow at 200% zoom and verifies that invalid form submission focuses the first invalid field and exposes its error programmatically.

## Results

### Automated comparison

| Implementation and stage | Result |
|---|---:|
| Project A baseline | **2/4 passed** |
| Project B initial implementation | **1/4 passed** |
| Project B final required suite | **4/4 passed** |
| Project B final expanded suite | **6/6 passed** |

Project A passed the visible-focus and serious/critical axe-core checks. Its two failures may partly reflect test assumptions or locator behaviour, so they are not presented as confirmed accessibility defects without further investigation.

Project B's final expanded suite includes two keyboard-save regression tests. Its additional 200% reflow and form-validation check also passed, and the final axe-core scan reported zero serious or critical violations.

These results describe the tested behaviours. They do **not** establish full WCAG 2.2 conformance.

### Manual testing — Project B

| Check | Result |
|---|---:|
| Keyboard-only navigation | Passed |
| VoiceOver on macOS | Passed |
| 200% browser zoom | Passed |

During keyboard testing, saving initially appeared to reopen the details dialog. Investigation found that Escape correctly returned focus to the **View details** button. Pressing Tab moved focus to the separate **Save** button, where both Enter and Space saved the book successfully. No implementation change was needed; two regression tests were added to preserve this behaviour.

## AI browser-agent experiment

An AI browser agent completed the same five-action task against Project B and a controlled div-based variant.

- **Project B:** The complete task succeeded, and Save was identified directly through its accessible `button` role and name.
- **Div experiment:** The complete task also succeeded, but Save had no accessible role or name. The agent used an unnamed clickable generic element next to the details button, which required a positional workaround.

The experiment did not show that the div version prevented completion. It showed that semantic HTML gave the agent clearer and more robust information for identifying the intended control. Agent success is not a substitute for testing with disabled users or assistive technology.

## Run locally

### Prerequisites

- [Node.js](https://nodejs.org/) 22
- npm

### Install

```bash
npm ci
npx playwright install chromium
```

The Playwright configuration starts the local static server automatically.

### Run Project B

```bash
BOOKMARK_TARGET=b npx playwright test
```

### Run Project A

```bash
BOOKMARK_TARGET=a npx playwright test
```

### Generate and open an HTML report

```bash
BOOKMARK_TARGET=b npx playwright test --reporter=list,html
npx playwright show-report
```

The environment-variable examples above use POSIX shell syntax. In PowerShell, set `$env:BOOKMARK_TARGET = "b"` before running `npx playwright test`.

## Continuous integration

The [GitHub Actions workflow](./.github/workflows/accessibility.yml) runs the complete Project B Playwright suite on:

- pushes to `main`; and
- pull requests targeting `main`.

CI installs Node.js 22, restores dependencies with `npm ci`, installs Chromium and runs Playwright with `BOOKMARK_TARGET=b`. Project A is not run in CI. Any failed Project B test fails the workflow, and an HTML Playwright report is uploaded as an artifact when the test step fails.

## Reports

- [Final academic report](./report/final-report.md)
- [Detailed testing results](./report/testing-results.md)

## Project structure

```text
bookmark-accessibility/
├── index.html                         # GitHub Pages comparison landing page
├── a/                                 # Project A baseline implementation
├── b/                                 # Project B accessibility-guided implementation
│   └── additional-accessibility-check.cjs
├── b-div-experiment/                  # Controlled semantic HTML experiment
├── .agents/skills/accessibility/
│   └── SKILL.md                       # Custom accessibility skill
├── .github/workflows/
│   └── accessibility.yml              # Project B continuous integration
├── tests/
│   └── accessibility.spec.ts          # Shared Playwright and axe-core suite
├── report/
│   ├── final-report.md
│   └── testing-results.md
├── references/
│   └── module3-style-guide.png
├── playwright.config.ts
├── prompt.md
└── spec.md
```

## Accessibility references

- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing)
- [axe-core](https://github.com/dequelabs/axe-core)

## Scope and limitations

The project evaluates a defined task using a small set of automated and manual checks. Automated tools cannot detect every accessibility barrier, one successful AI-agent run does not represent human experience, and a passing test suite does not prove complete WCAG compliance. See the [final report](./report/final-report.md) for the full discussion.
