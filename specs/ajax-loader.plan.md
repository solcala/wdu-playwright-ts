# Ajax Loader plan

Explored `https://webdriveruniversity.com/Ajax-Loader/index.html` in Chromium before these cases were written. The cases below match that page.

## What the page does

The path is `/Ajax-Loader/index.html`. The document title is `WebDriver | Ajax-Loader`.

On load the spinner (`#loader`) is visible and `CLICK ME!` is not. `body` `onload` calls `setTimeout(showPage, 5000)`. In Chromium the control was still hidden at about 4.6 seconds and visible at about 5.1 seconds. No `fetch` or XHR runs, so a network wait would not see this delay.

`showPage` hides `#loader` and shows `#myDiv`. The control is a `span#button1`. Its label is a paragraph, `CLICK ME!`. It is not a button or a link, and its `tabIndex` is `-1`. A click adds the class `clicked` (the control turns blue) and opens the Bootstrap modal `#myModalClick`.

That modal is the only dialog, and it has no accessible name. The title is `Well Done For Waiting....!!!`. The body is `The waiting game can be a tricky one; this exercise will hopefully improve your understandings of the various types of waits.`

Close and the header × both use `data-dismiss="modal"` and hide it. A click on the overlay, outside the dialog, also hides it. Escape leaves it open. Enter and Space do not open it. Clicking the spinner does not open the modal, and the hidden control is not clickable.

`#myDiv` fades in for one second. The tests wait until `CLICK ME!` is visible. They do not sleep. That visibility check uses a 15 second assertion timeout: the page takes about five seconds, and the default assertion timeout is five seconds, so the default window can expire as the control appears.

## Cases

| Case                                                        | Category | Priority | Tag                    | Expected result                                                                                                                 | Why this case                                                                                                                                                                |
| ----------------------------------------------------------- | -------- | -------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clicking the delayed control shows the waiting result       | Positive | High     | `@smoke` `@regression` | `CLICK ME!` becomes visible and the spinner is gone. The click opens the modal with that title and body. Close hides the modal. | The only success path. This is the smallest critical check, so it is the only `@smoke` test. It is also `@regression` so the regression subset still covers the result copy. |
| The result stays hidden while the loader is showing         | Negative | High     | `@regression`          | Right after load the spinner is visible, `CLICK ME!` is hidden, and the modal is hidden.                                        | The failure mode this page is built for: reading the result before the delay. It checks the initial state and does not wait out the timer.                                   |
| The × button hides the modal and the control opens it again | Edge     | Medium   | `@regression`          | × hides the modal. A second click shows it again.                                                                               | Close is the smoke path. × is the other dismiss control, and a second open shows the modal was fully dismissed.                                                              |
| A click outside the dialog hides the modal                  | Edge     | Medium   | `@regression`          | A click on the overlay, outside the dialog, hides the modal.                                                                    | Backdrop dismiss is a different path from the two buttons. Confirmed on the live page.                                                                                       |

The describe block is tagged `@ajax-loader`.

## Not automated

| Category          | Decision                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Invalid input     | N/A. The page has no fields, so there is no invalid value to submit.                                                            |
| Keyboard          | N/A. The control is a span with `tabIndex` `-1`. Enter and Space do not open the modal, so there is no keyboard path to assert. |
| Escape to close   | Checked on the live page. Escape leaves the modal open. Not a test: the page does not offer that dismiss path.                  |
| `clicked` class   | Observed. The class is a style hook on the span. The result under test is the modal copy.                                       |
| Network failure   | N/A. The delay is a timer. Nothing is requested with XHR or fetch.                                                              |
| Navbar brand link | Out of scope. It is not the loader, the delayed control, or the modal.                                                          |

## Runtime

Four tests. Three wait until the control is visible, about five seconds each, then assert an outcome. The negative test asserts the initial state and returns. That is the coverage worth the wait: one success path, the early-read failure, and two dismiss paths that are not the Close button.
