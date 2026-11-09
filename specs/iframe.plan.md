# IFrame

Explored `https://webdriveruniversity.com/IFrame/index.html` in a browser, then checked the DOM. The plan is only the iframe boundary. The framed page is the Page Object Model challenge, and its Contact Us link loads the existing Contact Us document. Those pages keep their own specs.

## What the live page does

- Parent title is `WebDriver | IFrame`. The only parent control is the brand link `WebdriverUniversity.com (IFrame)` (`#nav-title`, `href="../index.html"`). It navigates the top window to `/index.html`.
- One iframe, `#frame`, with no `name` and no `title`. `src` is `../Page-Object-Model/index.html`. The `CLICK ME!` markup inside the tag is fallback and is not shown.
- The frame is 1000px tall. At 1280×720, opening the dialog scrolls the trigger into view and leaves the dialog controls above the window. These tests use a 1280×1400 viewport so the frame fits.
- Framed home title is `WebDriver | Page Object Model`. Links, all with no `target`: Home `index.html`, Our Products `products.html`, Contact Us `../Contact-Us/contactus.html`, and the brand `#nav-title` (`WebdriverUniversity.com (Page Object Model)`) to `../index.html`.
- `Find Out More!` (`#button-find-out-more`) opens `#myModal` (`role="dialog"`, no accessible name). Title `Welcome to webdriveruniversity.com`. Body `Welcome to webdriveruniversity.com we sell a wide range of electrical goods such as laptops, game consoles, cameras...`. Close, ×, the backdrop, and the dialog's own Find Out More button all dismiss it. Escape does not.
- Our Products stays at `/Page-Object-Model/products.html` and shows Special Offers, Cameras, New Laptops, Used Laptops, Game Consoles, Components, Desktop Systems, and Audio. Each product `href` is `#`.
- Contact Us stays at `/Contact-Us/contactus.html` with heading `CONTACT US` and the First Name, Last Name, Email Address, and Comments fields.
- The framed brand loads `/index.html` inside the frame. The parent URL stays `/IFrame/index.html`.

## Cases

Tags: `@iframe` and `@regression` on every test. `@smoke` only on the welcome dialog, so that test carries both.

| Case                                     | Expected outcome                                                                                                                                                       | Category | Priority and rationale                                                                                                                             | Tags                             |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Find Out More opens the welcome dialog   | `Find Out More!` shows the dialog with that title and body. Close hides it. Parent URL stays `/IFrame/index.html` and the frame stays `/Page-Object-Model/index.html`. | Positive | High. Only in-frame action, and the smallest check that a click inside the frame does not replace the parent. The one smoke test.                  | `@iframe` `@smoke` `@regression` |
| Our Products stays inside the frame      | The frame loads `/Page-Object-Model/products.html` and shows Special Offers. Parent URL stays `/IFrame/index.html`.                                                    | Positive | High. Primary menu navigation. Proves the new document is the frame, not the top window.                                                           | `@iframe` `@regression`          |
| Contact Us stays inside the frame        | The frame loads `/Contact-Us/contactus.html` and shows the contact heading and First Name field. Parent URL stays `/IFrame/index.html`. The form is not submitted.     | Positive | High. This href leaves the Page Object Model folder, so it is the likeliest link to break out of the frame. The form itself belongs to Contact Us. | `@iframe` `@regression`          |
| Parent brand link leaves the IFrame page | The parent link navigates the top window to `/index.html` and `#frame` is gone.                                                                                        | Edge     | Medium. Only control outside the frame. Window behavior, paired with the framed brand link.                                                        | `@iframe` `@regression`          |
| Framed brand link stays inside the frame | The framed brand loads `/index.html` in the frame and shows the site home heading. Parent URL stays `/IFrame/index.html`.                                              | Edge     | Medium. Same relative home href as the parent link, opposite browsing context.                                                                     | `@iframe` `@regression`          |

## Not covered

| Category                                                  | Reason                                                                                                                                                               |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Negative                                                  | No error, disabled, or rejection path on this page. Nothing fails on purpose.                                                                                        |
| Dialog ×, backdrop, and the dialog's Find Out More button | They only dismiss, same as Close. Escape leaves the dialog open. Button Clicks already treats that Escape behavior as out of scope. One dismiss path is enough here. |
| Product tiles and the carousel                            | Tiles are `href="#"` and do not navigate. The carousel only moves slides. Both belong to the Page Object Model page.                                                 |
| Contact form submit, reset, and validation                | Already covered in `tests/contact-us.spec.ts`. Submitting from here would duplicate that spec.                                                                       |
| Home in the framed menu                                   | The frame starts on that document. Our Products and Contact Us already prove a no-target link stays in the frame.                                                    |
| Iframe fallback `CLICK ME!`                               | Not rendered once `#frame` loads.                                                                                                                                    |
| Mobile navbar toggle                                      | Bootstrap chrome, hidden at the desktop viewport. Not frame behavior.                                                                                                |
