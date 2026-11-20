# Quick Booking

Source: source.png (Magenta docs, FormWithStepper "SnFArea 1") · Built 2026-11-10 with Magenta @ocean-network-express/magenta-react 1.32.0
Open: http://localhost:5173/#/mockup/quick-booking

## Screen type
A multi-step form (wizard): page header with actions, a `Stepper` for the stages of one task, a summary side panel and a form section, with Previous and Next buttons on the page ([Stepper note](../../components/stepper.md)). No data table, so no `patterns/` entry applies.

## Mapping
| Region / element in the source | Magenta | Props and notes |
|---|---|---|
| Title "Quick Booking", "Title Description" | `Text` | `level="h4"` (`component="h1"`) and `body1`; colors `neutral.1000` and `neutral.800` |
| Booking template | `Button` | `variant="outline"` `color="neutral"` |
| Add New Booking | `Button` | `variant="outline"` (primary), `leftIcon={<AddOutline />}` |
| Divider, then two icon buttons (watch, help) | `Divider`, `ButtonGroup` + `IconButton` | `direction="vertical"`; `aria-label` on each icon button |
| Three-step progress | `Stepper`, `Step` | `activeStep={1}`, `fullWidth`, `aria-label` |
| Summary card | divs with `borders.1`, `radii.lg`, `Text`, `Divider` | No Card component (see Gaps) |
| Summary label / value pairs | `Text` | `body2` in `neutral.700`; `body1` in `neutral.900` |
| Contact Information card | section with `Text`, `Divider` | Red asterisk `red.600`, `aria-hidden` |
| First Name, Last Name, Address, Apt / Suite | `Input` | `label`, `placeholder`, `fullWidth`, `size="responsive"` |
| Address type | `FormCheck` + `Radio` x3 | `name`, controlled `checked`; row layout via `radioGroupClassName` grid |
| Country | `Select` + `SelectOption` + `ListItemText` | Options are sample data (source has none) |
| Add New Contact | `Button` | `variant="ghost"`, `leftIcon={<AddOutline />}` |
| Previous / Next | `Button` | ghost primary / fill primary |

## Gaps
- No Card or Panel component in Magenta: the Summary and Contact cards are divs styled with border, radius and spacing tokens (`borders.1`, `radii.lg`, `neutral.200`).
- No page-header or form-section-header component: built from `Text`, `Button` and `Divider`.
- No key-value (description list) component for the Summary: built from `Text`.
- The 12-column grid overlay with "col" labels in the source is a design overlay, not UI; it is not built.
- The source's asterisk after "Contact Information" has no component: a styled span.

## Differences from the source
- Select options (Singapore, Japan, United States) are invented sample data; the source shows only the placeholder.
- The Summary card is 23% wide (a layout width with no token) and wraps long values at 1024px and 1280px; the source is shown at a wider width.
- Header and Stepper spacing are rounded to spacing tokens (`spacing.24`, `spacing.16`).
- The source's "Address type" radios are inline; the form is a 4-column grid, as in the source, and stays 4 columns at 1024px (fields get narrow).
- Placeholder texts ("Company Name" in First Name, "Founded Year" in Apt / Suite) are copied from the source although they do not match their labels.

## Checks
- evals/check.mjs: 5/5 (imports, mustNot, props, size, tokens)
- Screenshots: result-1024.png, result-1280.png, result-1920.png
