# AI Testing Playground core plan

Explored `https://webdriveruniversity.com/AI-Playground/index.html` (title `AI Testing Playground | WebDriver University`) in Chromium at the suite's Desktop Chrome viewport, 1280×720. The heading is `AI Testing Playground`. The path is `/AI-Playground/index.html`. This plan is challenges 10–14. The split is `specs/ai-playground.plan.md`. This file does not copy that roadmap.

The describe block is tagged `@ai-testing-playground` and `@ai-testing-playground-core`. Every test is `@regression`. `@smoke` is only the iFrame Login that reaches `Login successful` with `admin` / `secret123`.

## What the page does

### 10. iFrame Login

`#login-frame` is filled with a `srcdoc` document. The form is only in that frame. The Username label is a sibling of `#frame-username`, not tied with `for`, so the field has no accessible name from the label. The placeholder `admin` is unique inside the frame. The Password field is `#frame-password`, placeholder `secret123`. Login is `#frame-submit`. The result is `#frame-result`. It starts empty.

The click compares exact strings: username `admin` and password `secret123`. A match sets the result to `Login successful` in `#4caf50`. Anything else sets `Invalid credentials` in `#f45950`. There is no trim. `Admin`, an empty field, or a wrong password all fail. The fields keep their values after Login.

### 11. Shadow DOM Widget

`wdu-shadow-form` is a custom element with an open shadow root. Inside it: one text field with placeholder `Enter any value`, one `Submit` button, and `#shadow-result`. Playwright pierces the open root. Submit appears on other challenges, so the host scopes the button and the result. The placeholder is unique on the page.

The click trims the value. A non-empty value sets the paragraph to `Echo: ` plus that trimmed value. An empty or whitespace-only value sets `Please enter a value.` The field keeps what was typed, including spaces.

### 12. Employee Directory

Fifteen employees are rendered into `#employee-tbody` on load. Columns are Name, Department, Salary, Status, Start Date. Salary is shown as `£` plus `toLocaleString()` (for example `£45,000`). Status is `active` or `inactive`, with a `data-status` attribute.

`#table-filter` has placeholder `Filter employees…` (ellipsis U+2026). Each `input` re-renders. The filter trims and lowercases, then keeps a row when the name or department contains the text, the status starts with the text, the raw salary string contains it, the `£` salary string contains it, or the start date contains it. An empty filter shows all fifteen.

Each header `th` has `data-col` (`name`, `dept`, `salary`, `status`, `start`). The first click on a column sorts ascending and shows ` ↑` in `.sort-arrow`. A second click on the same column toggles to descending (` ↓`). A click on another column starts ascending on that column. Salary sorts as a number.

### 13. File Upload Validator

`#file-input` accepts `.jpg`, `.jpeg`, `.png`, `.pdf`. The label above it is not tied with `for`. The button is `#file-submit`, accessible name `Validate & Upload`. `#file-result` and `#file-error` start with class `hidden` (`display: none`).

Validate & Upload hides both messages, then reads `files[0]`. No file shows `No file selected.` on the error. A type outside `image/jpeg`, `image/png`, and `application/pdf` shows `Invalid file type: "` plus the type or `unknown`, plus `". Only .jpg, .png, .pdf allowed.` A size over `2 * 1024 * 1024` bytes shows `File too large: ` plus megabytes to two decimals, plus ` MB. Maximum 2 MB.` A pass shows the result with `File accepted`, then Name, Size in KB to one decimal, and Type. The result is not hidden. The error stays hidden.

### 14. Priority Board

Backlog is `#backlog-column`. In Progress is `#inprogress-column`. Tasks are `#task-1` (`Fix login bug`), `#task-2` (`Write unit tests`), `#task-3` (`Update docs`). All three start in Backlog. `#board-result` starts empty.

HTML5 drag-and-drop moves a card. On drop, the card is appended to that column and the result becomes `"` plus the task text plus `" moved to Backlog` or `" moved to In Progress`. A drop on the same column still appends and updates the result. Playwright's `dragTo` fires the drag events this board listens for.

## Cases

Ordered by ROI within each challenge. The smoke test is the one named in the roadmap.

| Case                                                | Category | Priority | Tag                    | What it checks                                                                                                           | Why this case                                                                         |
| --------------------------------------------------- | -------- | -------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| a completed iframe login shows login successful     | Positive | High     | `@smoke` `@regression` | Inside `#login-frame`, `admin` / `secret123` shows `Login successful`.                                                   | The only smoke test. The form is only in the frame.                                   |
| a wrong iframe password shows invalid credentials   | Negative | High     | `@regression`          | `admin` / `wrong` shows `Invalid credentials`. The username stays `admin`.                                               | Exact password match. A non-empty wrong password is the miss.                         |
| an empty iframe login shows invalid credentials     | Negative | High     | `@regression`          | Empty username and password show `Invalid credentials`.                                                                  | The blank submit.                                                                     |
| a wrong iframe username shows invalid credentials   | Negative | Medium   | `@regression`          | `not-admin` / `secret123` shows `Invalid credentials`.                                                                   | The username is exact too. The right password alone is not enough.                    |
| a shadow value is echoed                            | Positive | High     | `@regression`          | Inside `wdu-shadow-form`, `playwright` then Submit shows `Echo: playwright`.                                             | The happy path through the shadow root.                                               |
| an empty shadow value asks for a value              | Negative | High     | `@regression`          | Submit with an empty field shows `Please enter a value.`                                                                 | The empty path. Trim makes whitespace the same path.                                  |
| whitespace-only shadow input asks for a value       | Negative | Medium   | `@regression`          | `   ` then Submit shows `Please enter a value.` The field keeps the spaces.                                              | Trim runs before the empty check. The field is not cleared.                           |
| filtering by department keeps matching rows         | Positive | High     | `@regression`          | `Engineering` leaves five rows, all Engineering, including Sarah Mitchell and Daniel Wright.                             | Filter by department is the challenge prompt. Exact row count catches extras.         |
| sorting by salary ascending puts the lowest first   | Positive | High     | `@regression`          | The first Salary click puts Fiona Walsh / `£28,000` first and shows ` ↑`.                                                | Sort by salary is the other half of the prompt. Ascending is the first click.         |
| sorting by salary descending puts the highest first | Edge     | High     | `@regression`          | A second Salary click puts Daniel Wright / `£55,000` first and shows ` ↓`.                                               | The toggle. Descending is the second click on the same header.                        |
| a filter with no matches clears the table           | Negative | High     | `@regression`          | `zzz-no-match` leaves zero rows.                                                                                         | An empty body is a real outcome, not an error.                                        |
| clearing the filter restores every row              | Edge     | Medium   | `@regression`          | After `Engineering`, clearing the filter restores fifteen rows.                                                          | The filter is not sticky. Fifteen is the full set.                                    |
| a known employee row shows exact cells              | Positive | Medium   | `@regression`          | The Sarah Mitchell row shows Engineering, `£45,000`, `active`, `2019-03-15`.                                             | Exact cell values are in the challenge prompt.                                        |
| a valid png upload is accepted                      | Positive | High     | `@regression`          | `dot.png` shows File accepted with that name, a KB size, and `image/png`. The error stays hidden.                        | The happy path. Name, size, and type are the challenge.                               |
| validating with no file shows an error              | Negative | High     | `@regression`          | Validate & Upload with no file shows `No file selected.` The result stays hidden.                                        | The blank submit.                                                                     |
| an invalid file type is rejected                    | Negative | High     | `@regression`          | `notes.txt` shows an invalid type error that names `text/plain`. The result stays hidden.                                | Type is checked before size.                                                          |
| a file over two megabytes is rejected               | Negative | High     | `@regression`          | A PNG over 2 MB shows a File too large error that includes `Maximum 2 MB`. The result stays hidden.                      | The size rule. The file is built in memory so the repo stays small.                   |
| a valid pdf upload is accepted                      | Edge     | Medium   | `@regression`          | `note.pdf` shows File accepted with `application/pdf`.                                                                   | PDF is the third allowed type.                                                        |
| dragging a task to in progress updates the board    | Positive | High     | `@regression`          | `Fix login bug` moves to In Progress. The result is `"Fix login bug" moved to In Progress`. Backlog keeps the other two. | The challenge. The result line is the outcome.                                        |
| the board starts with three backlog tasks           | Negative | High     | `@regression`          | Before any drag, Backlog has the three tasks, In Progress has none, and the result is empty. The test does not drag.     | The starting board. An empty In Progress check after a drag would be a different bug. |
| dragging a task back to backlog updates the result  | Edge     | High     | `@regression`          | After a move to In Progress, dragging that task back shows `"…" moved to Backlog` and leaves In Progress empty.          | Both columns are drop targets. The result names Backlog.                              |
| a second task can join in progress                  | Edge     | Medium   | `@regression`          | After `Fix login bug` is in In Progress, `Write unit tests` also moves there. Both cards are in that column.             | The column holds more than one card.                                                  |

## Not automated

| Category                                        | Reason                                                                                                     |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Parent-page locators for iframe fields          | The challenge is scoping to the frame. A failing parent lookup is a technique demo, not a product outcome. |
| Closed shadow root                              | The widget uses `mode: 'open'`.                                                                            |
| Filter by salary string or start date           | Department and the empty-match case cover the filter. Salary string matching is the same `indexOf` path.   |
| Sorting name, department, status, or start date | Salary is the column the challenge names. The toggle path is the same for every column.                    |
| A JPEG upload                                   | `image/jpeg` is the same allow-list path as `image/png`. PNG is the smoke-adjacent happy path.             |
| A type of `unknown` (empty MIME)                | Requires a file the browser cannot type. The `text/plain` case already fails the allow list.               |
| Dragging onto the same column                   | `appendChild` still runs and rewrites the result. Moving across columns is the user journey.               |
| Keyboard drag                                   | The board listens for HTML5 drag events. Playwright's `dragTo` is the interaction under test.              |

## Runtime

Twenty-two tests. One is `@smoke`. None of these challenges use a timer for the outcome. File size for the oversize case is built in memory. Drags use `dragTo`. No `waitForTimeout`.
