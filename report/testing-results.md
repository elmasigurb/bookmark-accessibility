# BOOKMARK Accessibility Testing Results

## Overview

This report summarises the verified automated, manual and AI browser-agent testing results for the two BOOKMARK implementations. Project A served as the baseline implementation. Project B was developed with the accessibility skill and was subsequently tested after implementation fixes.

The results below distinguish direct observations from interpretation. A passing automated check provides evidence for the behaviour covered by that check, but it does not establish complete conformance with WCAG 2.2 AA. Likewise, a failed test can indicate either an implementation defect or a mismatch between the test's assumptions and the implemented interaction.

## Automated Testing

### Project A — Baseline

The initial Playwright run produced the following results:

| Check | Result |
|---|---:|
| Total Playwright tests | 2 passed, 2 failed |
| Keyboard-only main task | Failed |
| Dialog focus management | Failed |
| Visible keyboard focus | Passed |
| axe-core serious/critical scan | Passed |

The two failures record the behaviour observed by the automated suite. They may partly reflect assumptions made by the tests rather than genuine accessibility defects, so they should not be interpreted in isolation as proof that every related interaction in Project A was inaccessible.

### Project B — Accessibility Skill

Project B's initial Playwright run produced one passing test and three failing tests. After implementation fixes, the original four-test suite passed in full.

Two additional regression tests were then added for keyboard activation of the Save button. The final results were:

| Check | Result |
|---|---:|
| Initial Playwright suite | 1 passed, 3 failed |
| Original suite after implementation fixes | 4 passed, 0 failed |
| Additional keyboard-save regression tests | 2 added, 2 passed |
| Final Playwright suite | 6 passed, 0 failed |
| Additional 200% reflow and form-validation check | Passed |
| axe-core serious/critical violations | 0 |

The additional check confirmed that the tested page did not introduce horizontal overflow at 200% zoom and that an invalid form submission exposed and focused the first invalid field as expected.

## Manual Testing — Project B

Manual testing produced the following verified results:

| Test | Result |
|---|---:|
| Keyboard-only navigation | Passed |
| VoiceOver screen reader | Passed |
| 200% browser zoom | Passed |

These results apply to the interactions and content exercised during the manual test sessions. They do not represent an exhaustive assessment across every browser, assistive technology, operating system or viewport combination.

### Keyboard Save Observation

During keyboard-only testing, saving a book initially appeared not to work with Enter or Space. Investigation showed that this was not an implementation defect.

After the details dialog was closed with Escape, focus was correctly restored to the **View details** button that had opened the dialog. Pressing Enter or Space at that point therefore activated **View details** again. Pressing Tab once moved focus to the separate **Save** button. With Save focused, both Enter and Space saved the book successfully without opening the details dialog.

No implementation change was required. Two Playwright regression tests were added to explicitly focus the Save button, activate it with Enter and Space respectively, confirm that the saved state changed, and verify that the details dialog did not open.

## AI Browser-Agent Experiment

The same five main task actions were evaluated in both variants: searching for the book, opening its details, closing the dialog, saving the book and joining the reading club.

### Project B with Native Button

- The complete task was successful.
- All five main task actions succeeded.
- The Save control was identified through its accessible button role and accessible name.

### Div Experiment

- The complete task was successful.
- All five main task actions succeeded.
- The Save control did not expose an accessible role or name.
- The agent identified it as an unnamed clickable generic element adjacent to the details button.
- Activating the Save control therefore required a workaround based on its position in the accessibility representation.

The div implementation did not prevent task completion in this experiment. The difference was in how reliably and directly the agent could identify the intended control.

## Interpretation

The browser-agent experiment demonstrates a practical benefit of semantic HTML. In Project B, the native `<button>` element exposed both the control's purpose and its interaction type through the accessibility tree. This allowed the agent to locate Save using the same role-and-name information that assistive technologies use.

In the div experiment, the agent still completed the task, but the Save control lacked those semantic cues. It had to infer the target from an unnamed clickable element's position next to another control. This positional workaround was less explicit and would be more vulnerable to changes in layout or component structure.

The observed difference supports the conclusion that native semantic controls make interactions easier to identify and operate programmatically. It does not show that a non-semantic control always prevents completion, nor does a single successful agent run measure the experience of all disabled users.

## Limitations

- Automated tests covered defined interaction paths and selected accessibility requirements rather than the whole of WCAG 2.2 AA.
- axe-core detects many common issues but cannot replace manual testing or expert review.
- Manual results reflect the specific environment, content and tasks tested.
- The browser-agent experiment compared two runs of a defined task; it was not a statistical study of agent reliability.
- The agent's successful workaround in the div experiment should not be treated as evidence that the unnamed control was accessible to users.
- Differences in test assumptions may have influenced some initial failures, particularly in Project A.
