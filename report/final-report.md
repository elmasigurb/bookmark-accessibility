# BOOKMARK Accessibility Comparison

## 1. Introduction

BOOKMARK is an academic web development project that examines how accessibility guidance affects an AI-generated website. The project uses a book discovery interface because it combines several common interaction patterns: search, dynamically updated results, action buttons, a modal dialog and a form. These patterns make it possible to examine accessibility as part of a realistic user journey rather than as a collection of isolated checks.

Web accessibility matters because people use websites through different input and output methods. Some users navigate with a keyboard instead of a pointer, some use screen readers, and others enlarge content or adjust browser settings. An interface can appear complete visually while still making its controls difficult to identify or operate. Accessibility therefore needs to be considered in the HTML structure, interaction design, visual styling and testing process.

The research question for this project is:

> **Does providing an AI coding agent with a custom accessibility skill improve the accessibility of the resulting website?**

The project compares two implementations produced from the same prompt, specification, dataset and visual direction. The comparison uses automated tests, manual accessibility testing and an AI browser-agent experiment. The results are interpreted cautiously because the study includes only one implementation in each condition and Project B received iterative fixes after its initial test run.

## 2. Project Overview

BOOKMARK is a responsive book discovery website with the tagline “Your next favourite read starts here.” Users can search a collection by title or author, read detailed information about a selected book, save books during the current browser session and complete a demonstration sign-up form for the BOOKMARK Reading Club. The main test journey is to search for *The Midnight Library*, open and close its details, save it and submit the club form.

The visual design follows the Module 3 style guide. Deep burgundy (`#44020E`) is used for headings, controls and accents; soft blush pink (`#FFEFF0`) is used for cards and containers; and white (`#FFFFFF`) is the main background. The intended distribution is approximately 10% burgundy, 30% pink and 60% white. Headings use DM Serif Display, body text uses Inter, and components use a consistent 14-pixel corner radius. The overall direction is minimal and editorial, similar to an independent bookshop or literary magazine.

Two versions were created from the same requirements:

- **Project A — Without a custom accessibility skill.** This is the baseline implementation. It was not manually corrected after its initial evaluation.
- **Project B — With a custom accessibility skill.** This version was generated with additional accessibility guidance and was then corrected iteratively until the required automated suite passed.

Holding the prompt, specification and visual system constant was intended to make the additional accessibility guidance the main difference in the initial generation process. However, the later debugging applied to Project B is an additional difference that must be considered when interpreting the final results.

## 3. Methodology

### Shared requirements and test-first setup

Both implementations used `prompt.md`, `spec.md` and the Module 3 style reference. The prompt defined the BOOKMARK product, dataset, features and main task. The specification translated the brief into detailed accessibility requirements, including landmarks, heading order, keyboard focus order, native controls, accessible names, dialog behaviour, form validation, colour contrast, minimum target sizes and 200% zoom support.

The accessibility tests were written before either website implementation. The repository history records the test commit before Project A, the accessibility skill and Project B. This test-first sequence established the expected behaviour independently of the generated solutions and created an initial failing state before the implementations were complete.

The original Playwright suite contained four tests:

1. completion of the full main task using the keyboard;
2. visible focus on representative controls;
3. dialog focus containment and restoration after Escape and the Close button; and
4. an axe-core scan that rejected serious or critical violations.

The shared Playwright configuration selected the implementation through `BOOKMARK_TARGET`, which allowed the same test file to run against either `a/` or `b/`.

### Project A baseline

Project A was implemented without the custom accessibility skill. Its initial result was recorded and the implementation was left unchanged, as required by the experimental specification. This created a baseline for comparison, although the interpretation of its failures requires care because some may have been influenced by the locators and interaction assumptions used in the tests.

### Accessibility skill and Project B

The custom skill was added before Project B was implemented. Project B used the same product requirements but received the additional guidance in `.agents/skills/accessibility/SKILL.md`. Its first run still contained failures. Unlike Project A, Project B then went through an explicit accessibility-fixing stage until all four required tests passed. This distinction between the initial and corrected results is important: the final Project B result represents both skill-guided development and iterative debugging.

### Automated, manual and agent-based evaluation

After the required tests passed, manual testing was carried out with keyboard-only navigation, VoiceOver on macOS and browser zoom at 200%. A possible keyboard problem found during this process was investigated and converted into two new regression tests, one for Enter and one for Space on the Save button. A separate automated script also checked horizontal reflow at 200% zoom and accessible form-error behaviour.

Finally, an AI browser agent completed the same five-action task against Project B and against a controlled div-based experiment. This comparison examined whether the semantic representation of the Save control affected how directly the agent could identify it.

## 4. Custom Accessibility Skill

The purpose of `.agents/skills/accessibility/SKILL.md` is to make accessibility an active implementation constraint rather than a final checklist. It gives the coding agent concrete rules to apply whenever it creates or changes a user interface.

### Semantic HTML and accessible names

The skill prioritises native HTML elements such as `<button>`, `<a>`, `<label>`, `<nav>` and `<dialog>`. Native elements provide established keyboard behaviour and accessibility semantics without requiring a developer to recreate them. The skill also requires every interactive element to have a meaningful accessible name. This is especially relevant to the icon-only Save button, whose name needs to identify both the action and the book.

### Keyboard access and visible focus

The skill requires a logical keyboard order, no unnecessary positive `tabindex` values, no keyboard traps and a clearly visible focus indicator. These requirements were reflected directly in the Playwright suite, which moved through the task using Tab, Shift+Tab, Enter, Space and Escape and inspected the computed focus style.

### Dialog focus management

The skill specifies a native modal dialog, focus movement into the dialog, containment while it is open, support for Escape and a visible Close button, and restoration of focus to the exact triggering control. These details are important because a dialog may appear visually correct while leaving keyboard or screen-reader users uncertain about their location.

### Forms and error handling

For forms, the skill requires visible associated labels, text-based error messages, `aria-invalid`, `aria-describedby`, focus on the first invalid field and a live-region success message. Errors must not be communicated by colour alone. The additional Project B check tested a subset of these requirements by submitting the empty form and inspecting the first invalid field and its linked error.

### WCAG 2.2 AA and verification

The skill adopts WCAG 2.2 Level AA as the target [1]. It includes contrast thresholds, minimum interactive target sizes, responsive behaviour and usability at 200% zoom. Its guidance on names, semantics and keyboard patterns is also consistent with the areas covered by the WAI-ARIA Authoring Practices Guide [2]. The skill requires keyboard testing, accessible-name checks, dialog focus testing and automated accessibility tests before completion. This verification requirement is significant: it does not assume that following design rules guarantees a correct result.

## 5. Automated Test Results

The verified Playwright results were:

| Implementation and stage | Passed | Failed | Interpretation |
|---|---:|---:|---|
| Project A — initial baseline | 2 | 2 | Visible focus and the serious/critical axe scan passed; the main keyboard task and dialog-focus test failed. |
| Project B — initial implementation | 1 | 3 | The skill-guided first version did not immediately satisfy the required suite. |
| Project B — final required suite | 4 | 0 | All four original requirements passed after implementation fixes. |
| Project B — final expanded suite | 6 | 0 | The original suite plus two keyboard-save regression tests passed. |

Project A passed the visible keyboard-focus test and the axe-core serious/critical scan. It failed the keyboard-only main task and dialog-focus-management test. These failures are recorded outcomes of the test suite, but they should not automatically be treated as confirmed accessibility defects. A test can fail because its locator, expected focus target or interaction sequence does not match an otherwise usable implementation. The available evidence therefore supports saying that Project A did not meet two test expectations, not that every related Project A interaction was inaccessible.

Project B initially passed one test and failed three. After accessibility fixes, the four required tests passed with no failures. Two further regression tests explicitly confirmed that the details and Save controls were separate native buttons, that Tab moved focus to Save, that both Enter and Space changed its `aria-pressed` state, that focus remained on the renamed Save control and that no dialog opened. The final axe-core result contained zero serious or critical violations.

The additional Project B script used a 640 by 800 pixel viewport, applied 200% page zoom and checked for horizontal document overflow. It then submitted the empty Reading Club form and verified that the Name field received focus, exposed `aria-invalid="true"`, and referenced a visible error through `aria-describedby`. This check passed. It adds useful coverage, but it does not test every possible viewport, zoom configuration or validation state.

## 6. Manual Accessibility Testing

Project B was also evaluated manually:

| Manual check | Result |
|---|---:|
| Keyboard-only navigation | Passed |
| VoiceOver screen reader | Passed |
| 200% browser zoom | Passed |

The keyboard test confirmed that the main journey could be completed without a pointer. The VoiceOver test confirmed that the tested structure, controls and feedback were usable in the tested macOS screen-reader environment. The zoom check confirmed that the tested content remained usable at 200%. These results apply to the specific task and environment used; they are not a claim about every assistive technology or device.

### Keyboard-save observation

During manual testing, saving initially appeared not to work with Enter or Space because those keys seemed to reopen the details dialog. Investigation showed that Project B was behaving according to the focus specification. When Escape closed the dialog, focus returned to the **View details** button that had opened it. Pressing Enter or Space immediately after Escape therefore activated View details again.

Pressing Tab once moved focus from View details to the separate **Save** button. With Save focused, both Enter and Space saved the book successfully and did not reopen the dialog. No implementation change was needed. Instead, two regression tests were added so that both keyboard activation paths would remain covered. This observation also shows why visible focus and a documented focus sequence matter: the same key has different effects depending on which control currently owns focus.

## 7. AI Browser-Agent Experiment

The browser-agent experiment used the same five actions in each variant: search for *The Midnight Library*, open its details, close the dialog, save the book and join the Reading Club.

| Variant | Task result | Identification of Save |
|---|---|---|
| Project B with a native button | All five actions succeeded; the full task was completed. | The agent found Save through its accessible `button` role and name. |
| Div experiment | All five actions succeeded; the full task was completed. | The control had no accessible role or name. The agent used an unnamed clickable generic element adjacent to the details button. |

The div experiment did not prevent completion. The important difference was the quality of the information available to the agent. In Project B, the accessibility tree stated what the control was and what it did. In the div experiment, the agent had to infer the target from position and context, which required a workaround and would be more sensitive to layout or component changes.

This suggests that semantic HTML can benefit both human assistive-technology users and software agents that rely on the accessibility tree. However, one successful agent run does not establish that the div control was accessible to people, and agent success is not a substitute for keyboard or screen-reader testing.

## 8. CI/CD and Deployment

The repository includes `.github/workflows/accessibility.yml`. The GitHub Actions workflow runs on pushes to `main` and pull requests targeting `main`. It checks out the repository, installs Node.js 22, runs `npm ci`, installs Playwright's Chromium browser and executes the suite with `BOOKMARK_TARGET=b`. This environment variable ensures that the workflow tests Project B rather than Project A. A failed Playwright command returns a non-zero status and therefore fails the job. When the test step fails, the workflow uploads the generated Playwright HTML report as an artifact for investigation.

The GitHub Actions workflow completed successfully after it was added, providing an automated check that the Project B suite also passed in CI rather than only in the local development environment. Continuous testing on pushes and pull requests helps detect later regressions, although it remains limited to the behaviours encoded in the suite.

The project is deployed with GitHub Pages at:

- [BOOKMARK live website](https://elmasigurb.github.io/bookmark-accessibility/)

The root landing page introduces the comparison and uses relative links to Project A (`./a/`) and Project B (`./b/`), so the navigation works under the GitHub Pages repository path. The source repository is available at:

- [BOOKMARK GitHub repository](https://github.com/elmasigurb/bookmark-accessibility)

## 9. Discussion and Limitations

The final Project B results are stronger than the recorded Project A baseline: Project B passed the required suite, the expanded keyboard-save suite, the additional reflow and form check, and all three documented manual checks. The custom skill also directly addressed the areas covered by the evaluation, including native controls, accessible names, focus order, modal behaviour and form errors. The browser-agent experiment provides a concrete example of why those instructions matter: a native button exposed enough information for direct identification, while the div control required positional inference.

The experiment nevertheless has several limitations.

First, the sample size is very small. There is one Project A implementation and one Project B implementation, so differences could reflect variation in individual AI outputs rather than the skill alone. Repeating each condition across several independent generations would produce stronger evidence.

Second, the test design covers a defined main journey and selected requirements. It does not exercise every state, book, form correction sequence, viewport, browser or assistive-technology combination. The Project A failures also show that test assumptions matter. A locator mismatch or a different but potentially valid focus implementation can produce a failing result, so failures require investigation before they are labelled as accessibility defects.

Third, Project B received additional fixes while Project A remained unchanged. This was part of the specified process, but it means the final comparison is not a pure comparison of two first attempts. The final outcome combines the accessibility skill with iterative debugging and regression testing. In fact, the initial automated counts alone do not demonstrate an immediate skill advantage: Project A initially passed two tests, while Project B initially passed one. The clearer evidence is that the skill provided structured guidance for correction and verification, not that it guaranteed a perfect first generation.

Fourth, automated tools have limited coverage. Playwright can verify keyboard sequences and focus states, while axe-core can find many common machine-detectable problems [4], but neither can judge the whole user experience. Official Playwright guidance recommends combining automated checks with manual assessment because many accessibility problems cannot be detected automatically [3]. A passing suite, including zero serious or critical axe violations, therefore does not prove full WCAG 2.2 AA conformance.

Finally, AI-agent performance and human accessibility overlap but are not equivalent. A browser agent may infer an unnamed control from page structure, as it did in the div experiment, while a human user may not have the same contextual or programmatic support. Conversely, an agent failure would not by itself prove that every human user would fail. The agent experiment is best understood as evidence about the practical value of semantics for machine interpretation, not as a complete accessibility evaluation.

## 10. Conclusion

The observed results provide qualified support for the research question. Giving the AI coding agent a custom accessibility skill contributed to a Project B implementation and repair process that ultimately satisfied the required automated tests, two additional keyboard regressions, the reflow and form-validation check, and the documented manual tests. The skill's emphasis on semantic HTML, accessible names, keyboard interaction, visible focus, dialog management and verification closely matched the behaviours that were successfully demonstrated.

However, the experiment does not isolate the skill as the sole cause. Project B did not outperform Project A in the initial test counts, it received iterative fixes that Project A did not receive, and the study used only one implementation per condition. The most defensible conclusion is that the skill was useful as a structured accessibility framework and supported a stronger final workflow and outcome, while further repeated and more tightly controlled testing would be required to claim a causal improvement in AI-generated accessibility.

## 11. References

1. World Wide Web Consortium (W3C), *Web Content Accessibility Guidelines (WCAG) 2.2*, W3C Recommendation. [https://www.w3.org/TR/WCAG22/](https://www.w3.org/TR/WCAG22/)
2. World Wide Web Consortium Web Accessibility Initiative (WAI), *ARIA Authoring Practices Guide (APG)*. [https://www.w3.org/WAI/ARIA/apg/](https://www.w3.org/WAI/ARIA/apg/)
3. Playwright, *Accessibility testing*. [https://playwright.dev/docs/accessibility-testing](https://playwright.dev/docs/accessibility-testing)
4. Deque Systems, *axe-core: Accessibility engine for automated Web UI testing*. [https://github.com/dequelabs/axe-core](https://github.com/dequelabs/axe-core)

All online references were accessed on 25 October 2026.
