# Autocomplete plan

Explored `https://webdriveruniversity.com/Autocomplete-TextField/autocomplete-textfield.html` in Chromium at the suite's Desktop Chrome viewport, 1280×720. The browser waited out the site's browser check. Nothing about that check was skipped or faked.

## What the page does

The document title is `Autocomplete TextField | WebDriverUniversity`. The heading is `Autocomplete TextField`. This suite calls the challenge Autocomplete, which is the coverage-row name, so the spec is `tests/autocomplete.spec.ts`.

The form has `autocomplete="off"` and an empty action, so Submit stays on this page and adds a query. The field is `#myInput`, `name="food-item"`, placeholder `Food Item`. It has no label. Its accessible name is `Food Item`, and its role is textbox. Submit is `#submit-button`, an `<input type="submit">` with no value attribute. Its accessible name is `Submit`, and its role is button.

The catalog is a prefix list. Comparison uppercases both sides, so `a` and `A` match the same foods. The suggestion text keeps the catalog spelling. The typed value stays as typed until a row is chosen.

```text
Asparagus, Avacado, Almond, Artichoke, Apple,
Bruscetta, Bacon, Black beans, Bagels, Barley,
Cabbage, Carrots, Celery, Chicken, Catfish, Chips, Coffee, Cookies,
Dates, Dips, Duck, Donuts, Eggs,
Fondu, French toast, French dip,
Garlic, Ginger, Granola, Grapes, Green beans,
Honey, Ham, Hash browns, Hummus,
Ice cream, Irish stew, Italian bread, Jerky,
Kale, Kiwi, Kidney beans, Kingfish,
Lobster, Lamb, Linguine, Lasagna,
Meatballs, Milk, Milkshake, Noodles,
Pizza, Pepperoni, Pancakes, Quiche, Reuben,
Spinach, Spaghetti, Toast, Venison,
Waffles, Wine, Walnuts, Yogurt, Zucchini
```

`Avacado` and `Bruscetta` are the catalog spellings. Order is this array, not alphabetical. `Milk` is a prefix of `Milkshake`, so a suggestion locator has to be exact.

On `input`, the handler closes any open list. An empty value stops there. Any other value adds `#myInputautocomplete-list` (class `autocomplete-items`) and one child `div` per food that starts with the value. A value with no match still adds that list, with no children. Each row is a `div` with no role and no id. The matching characters are a `strong` cut from the catalog string, and a hidden input holds the catalog value.

Clicking a row copies that hidden value into the field and removes the list. A click elsewhere in the document removes the list and leaves the field alone. Arrow Down and Arrow Up move the class `autocomplete-active`, and the index wraps. Enter always cancels the form submit. If a row is highlighted, Enter clicks that row. If none is highlighted, Enter changes nothing. Submit posts the field as typed. There is no error message, no required check, and no request. After the navigation the document loads again and the field is empty. The result is the query:

| Field before Submit | URL query         |
| ------------------- | ----------------- |
| `Pizza`             | `food-item=Pizza` |
| `App`               | `food-item=App`   |
| empty               | `food-item=`      |
| three spaces        | `food-item=+++`   |

`Pi` matches only `Pizza`. `a` matches the five A foods. `zz` matches nothing. `gr` matches `Granola`, `Grapes`, `Green beans`.

Locators, in the project order: the field is a textbox named `Food Item`, and Submit is a button named `Submit`. The suggestion list has no role. Its id is the field id plus `autocomplete-list`. The rows are the list's direct child divs, because the list's own text repeats its only row when one food matches. The highlighted row is found by its catalog text, then the test checks the `autocomplete-active` class. The page heading is the click-outside target.

## Cases

The describe block is tagged `@autocomplete`. Every test is `@regression`. `@smoke` is only the select-and-submit path.

| Case                                                               | Category | Priority | Tag                    | What it checks                                                                                                                                                                         | Why this one                                                                                                                                |
| ------------------------------------------------------------------ | -------- | -------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Selecting Pizza and submitting sends Pizza                         | Positive | Critical | `@smoke` `@regression` | `Pi` shows only `Pizza`. The field is still `Pi`. The click sets `Pizza`, closes the list, and Submit navigates to `?food-item=Pizza`.                                                 | The only success path. It checks the filtered row, the value the click writes, and the query Submit sends.                                  |
| Typing a shows only the foods that start with A                    | Positive | High     | `@regression`          | `a` shows `Asparagus`, `Avacado`, `Almond`, `Artichoke`, `Apple`, in that order.                                                                                                       | The smoke prefix matches one food. This is the list: several matches, catalog order, the `Avacado` spelling, and no other food.             |
| An unknown prefix shows no foods                                   | Negative | High     | `@regression`          | `zz` leaves the field as `zz`, the suggestion list is attached, and it has no rows.                                                                                                    | A handler that did not run looks the same as an empty list. The attached list shows the input ran, and the row count shows nothing matched. |
| Submitting a prefix sends the typed text                           | Negative | High     | `@regression`          | `App` shows `Apple`. Submit navigates to `?food-item=App`.                                                                                                                             | Submit posts the field. It does not complete the highlighted catalog value. The smoke test only submits after a click.                      |
| An uppercase prefix shows the catalog food                         | Edge     | High     | `@regression`          | `APP` shows `Apple` and the field stays `APP`.                                                                                                                                         | The `a` list uses a lowercase letter. This is the other direction: all caps still matches, and typing does not rewrite the field.           |
| Arrow Down and Enter fills the highlighted food without submitting | Positive | High     | `@regression`          | `gr` shows `Granola`, `Grapes`, `Green beans`. Two Arrow Downs highlight `Grapes` and clear `Granola`. Enter sets `Grapes`, closes the list, and the URL stays the form with no query. | Keyboard selection is a real path. Enter on a highlighted row must not submit.                                                              |
| Enter without a highlighted food does not submit                   | Negative | High     | `@regression`          | `Pi` shows `Pizza`. Enter leaves the URL on the form, the field as `Pi`, and `Pizza` still shown.                                                                                      | Enter always cancels submit. With no highlight it also does not choose the row. The keyboard test only covers Enter after Arrow Down.       |
| Clicking outside closes the suggestions                            | Edge     | Medium   | `@regression`          | `b` opens the list. A click on the heading removes it and leaves `b` in the field.                                                                                                     | The document click is the dismiss path. Choosing a row also closes the list, so this is the close that does not copy a value.               |
| Submitting an empty field sends an empty food item                 | Negative | Medium   | `@regression`          | With the field empty, Submit navigates to `?food-item=`.                                                                                                                               | The field is not required. The prefix submit always sends text. This is the missing value.                                                  |

## Not selected

| Category                           | Reason                                                                                                                                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Disabled or read-only controls     | N/A. The field and Submit are enabled. There is no disabled state.                                                                                                                           |
| A failed or slow request           | N/A. The list is built in the input handler. The page does not call fetch or XHR.                                                                                                            |
| Several values in the field        | N/A. One field holds one string.                                                                                                                                                             |
| Arrow Up wrapping to the last row  | Arrow Up from the start highlights the last match (`Green beans` for `gr`). That is the same highlight function as Arrow Down. The keyboard test already moves the highlight and accepts it. |
| Whitespace                         | Three spaces submit as `food-item=+++`, and a leading space matches nothing because the space is part of the prefix. That is the same raw post as `App` and the empty post.                  |
| The bold prefix                    | The `strong` is the catalog's own first characters. The row text is the outcome.                                                                                                             |
| A value that is not in the catalog | `zzzz-not-a-food` submits as that string. The unknown-prefix test covers the empty list, and the `App` test covers a raw post.                                                               |
| Navbar, brand link, and shop logo  | Site chrome, not the autocomplete result.                                                                                                                                                    |
| Mobile widths                      | The suite runs Desktop Chrome only.                                                                                                                                                          |
