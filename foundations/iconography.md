---
type: foundation
foundation: iconography
token_group: icons
status: stable
figma_url: ""
sources:
  - packages/docs/stories/Foundation/Icon/Design.mdx
  - packages/docs/stories/Foundation/Icon/Icon.stories.mdx
  - packages/docs/assets/images/Icon
  - packages/react-icons/src
  - packages/magenta-commons/src/types/component.ts
  - packages/css/src/recipes/icon.ts
  - packages/css/src/tokens.ts
review_status: draft-ai
reviewed_by: ""
reviewed_on: ""
---

# Iconography

## Overview

Icons are visually compact and simplified graphic elements that represent a specific object, action, or concept. They enhance usability, improve visual communication, and maintain a cohesive visual language across interfaces.

Icons come from the package `@ocean-network-express/magenta-react-icons`, one React component per icon, named `<Name><Style>`, for example `AddCircleOutline` or `WarningFill`. The full list is in the GENERATED block. There are two styles, Outline and Fill; the Duo-tone style in the docs is not in the package and is not used (team decision, 2026-10-28). Each icon takes a `size` prop (`xs` to `xl`, or `responsive`; default `md`) and draws in `currentColor`, so it takes the text color of the icon or its parent.

## Principles

**Simplicity and easy comprehension.** Icons should be simple and easy to understand at a glance, conveying their intended meaning clearly and intuitively.

**Consistency.** Keep the visual style and weight of icons consistent. All icons share a common visual language.

**Size follows text.** Icon size follows a scale relative to the font size and line height of the text next to it.

**Style shows importance.** Outline is the default. Fill emphasizes key actions or important elements.

## Rules

- MUST use icons from `@ocean-network-express/magenta-react-icons`. MUST NOT draw a custom SVG or use another icon set for a concept the package covers. If no icon fits, ask.
- MUST set icon size with the `size` prop. MUST NOT set `width` and `height` in px.
- Inside a component with `size="responsive"`, or next to responsive text, MUST use `size="responsive"`.
- MUST set icon color with a color token on the icon or its parent, e.g. `css({ color: 'neutral.700' })`. MUST NOT use hex.
- Outline MUST be the default style. Fill is only for key actions or important elements. MUST NOT use a duo-tone style.
- A decorative icon next to visible text MUST be hidden from assistive technology with `aria-hidden="true"`. An icon that carries meaning without visible text MUST have an accessible name (`role="img"` and `aria-label`). The icon components set neither.
- MUST NOT rely on icon color alone to convey meaning.

Rules for drawing a new icon (for designers):

- MUST start on a 32 × 32px base grid, with 2px padding inside the grid. Artwork may extend into the padding when the shape needs it.
- MUST use a 2px stroke, with one stroke weight per icon.
- Corners MUST have a 2px radius; larger radii in multiples of 2 when the metaphor needs it. Stroke start and end points MUST be rounded. Sharp objects such as knives or needles keep sharp corners.
- MUST keep a simple, flat style.
- MUST name the icon after the real object or its function, in the structure `name_variants-style` in Figma. The code component name is the same in PascalCase, e.g. `AddCircleOutline`.

## Primitive tokens

<!-- Icons are not Panda tokens. These are the values of the icon `size` prop and the icon styles. Pixel values are in the GENERATED block. -->

| Token | Description |
|---|---|
| `size="xs"` | Tiny icon. |
| `size="sm"` | Small icon. |
| `size="md"` | The default icon size. |
| `size="lg"` | Large icon, for emphasis. |
| `size="xl"` | Extra large icon, for emphasis. |
| `size="responsive"` | Follows the viewport, like components with `size="responsive"`. |
| Outline style | Shape drawn with a 2px stroke. Component names end in `Outline`. |
| Fill style | Solid shape. Component names end in `Fill`. |

## Semantic roles

<!-- Roles come from the Usage section of the Icons page in the Storybook docs, and the icon roles in Color. -->

### Size

The docs pair icons with 10, 12, 14 and 16px text, sizes Magenta does not have. The team mapped the pairs to Magenta's font sizes (2026-10-28), matching the responsive icon, which switches at the same breakpoints as responsive text.

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Icon next to 15 to 17px text (`fontSizes.md`, `fontSizes.lg`) | `size="md"` |  |  |  |
| Icon next to 11 to 13px text (`fontSizes.xs`, `fontSizes.sm`) | `size="sm"` |  |  |  |
| Icon next to 10px text (`fontSizes.2xs`), or in confined spaces | `size="xs"` |  |  |  |
| A larger, prominent icon for emphasis or to draw attention | `size="lg"`, `size="xl"` |  |  |  |
| Icon inside a responsive component, or next to responsive text | `size="responsive"` |  |  |  |

### Style

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Default icons | Outline style |  |  |  |
| Emphasis: key actions and important elements | Fill style |  |  |  |

### Color

| Role | Token | Use on | Don't use on | Replaced by |
|---|---|---|---|---|
| Default icon | `colors.neutral.700` |  |  |  |
| Disabled icon | `colors.neutral.200` |  |  |  |
| Icon next to text | The color of that text |  |  |  |
| Icon in a status palette, active icon | See Icons in [Color](color.md#icons) |  |  |  |
| Icon inside a component | What the component applies |  |  |  |

## Accessibility

- **Contrast.** The docs ask icons to meet the same 4.5:1 as text. WCAG 1.4.11 asks 3:1 for icons that carry meaning. `colors.orange.700` (3.27) meets 3:1 but not 4.5:1; see the Contrast table below.
- **Names.** Decorative icons next to text are hidden with `aria-hidden="true"`. Icons that carry meaning on their own need `role="img"` and an `aria-label`. An icon-only button gets its name from the button (`aria-label`), not from the icon.
- **Color alone.** Status icons must differ in shape, not only in color (WCAG 1.4.1).

## Do and don't

| Don't | Do |
|---|---|
| An SVG copied from another icon set | An icon from `@ocean-network-express/magenta-react-icons` |
| `<WarningFill width={18} height={18} />` | `<WarningFill size="md" />` |
| `<WarningOutline style={{ color: '#555A61' }} />` | `color: 'neutral.700'` on the icon or its parent |
| A Fill icon on every item in a list | Outline by default, Fill only for the key action |
| A meaningful icon with no name | `role="img"` and `aria-label`, or visible text next to it |

## Open questions

**1. Upstream doc cleanup.** To report to the Magenta team:
- The naming convention `name_variants-style` describes the Figma names; the code names are PascalCase (`AddCircleOutline`). The docs should show both.
- The size pairing uses font sizes that Magenta does not have. The team pairs `xs` with 10px, `sm` with 11 to 13px and `md` with 15 to 17px text.
- Duo-tone is documented but not in the package. The team does not use it, so it should come out of the docs.

---

<!-- GENERATED:START. Written by scripts from the package. Do not edit between the markers. -->
<!-- Generated 2026-10-28 by a one-off script from packages/react-icons/src and packages/css/src/tokens.ts. Replaced by scripts/ in phase 3. -->

### Sizes

The `size` prop of every icon. Default: `md`. `responsive` sets 20px in the SVG attributes, and the class `mag-icon--size-responsive` overrides it with CSS: 16px, 20px from `breakpoints.xl`, 24px from `breakpoints.3xl`.

| Size | px |
|---|---|
| `xs` | 12 |
| `sm` | 16 |
| `md` | 20 |
| `lg` | 24 |
| `xl` | 32 |
| `responsive` | 16 / 20 / 24 |

### Contrast of icon colors

Ratios on `colors.white`, truncated. The docs ask for 4.5:1; WCAG 1.4.11 asks 3:1 for icons.

| Token | on `white` |
|---|---|
| `colors.neutral.700` | 6.95 meets 4.5 |
| `colors.primary.700` | 9.19 meets 4.5 |
| `colors.blue.700` | 6.01 meets 4.5 |
| `colors.green.700` | 4.58 meets 4.5 |
| `colors.orange.700` | 3.27 meets 3, not 4.5 |
| `colors.red.700` | 7.34 meets 4.5 |
| `colors.purple.700` | 11.06 meets 4.5 |
| `colors.royal.700` | 10.63 meets 4.5 |
| `colors.neutral.200` | 1.36 below 3 |

### Icons in the package

Import from `@ocean-network-express/magenta-react-icons`. 375 outline and 48 fill icons. No duo-tone icons.

**Outline (375):** `AddCircleOutline`, `AddOutline`, `AddSquareOutline`, `AddToCartOutline`, `AlarmErrorOutline`, `AlarmInfoOutline`, `AlarmOutline`, `AlarmWarningOutline`, `AnalyticsFinanceOutline`, `AnchorPortOutline`, `ArrowCloseOutline`, `ArrowDownOutline`, `ArrowDownloadOutline`, `ArrowExportOutline`, `ArrowLaunchOutline`, `ArrowLeftOutline`, `ArrowLoginOutline`, `ArrowLogoutOutline`, `ArrowOpenOutline`, `ArrowRedoOutline`, `ArrowRightOutline`, `ArrowUndoOutline`, `ArrowUpOutline`, `ArrowUploadOutline`, `ArrowsMaximizeOutline`, `ArrowsMinimizeOutline`, `ArrowsOppositeHorizontalOutline`, `ArrowsOppositeVerticalOutline`, `ArrowsSwapHorizontalOutline`, `ArrowsSwapRightOutline`, `ArrowsSwapVerticalOutline`, `AsteriskOutline`, `AtmosphereOutline`, `AttachmentOutline`, `BookGuideOutline`, `BookingOutline`, `BookmarkAddOutline`, `BookmarkOutline`, `BuildingOutline`, `BulbIdeaOutline`, `CalculatorOutline`, `CalendarAddOutline`, `CalendarArrowInOutline`, `CalendarArrowOutOutline`, `CalendarBlankOutline`, `CalendarBookingOutline`, `CalendarDelayOutline`, `CalendarEditOutline`, `CalendarOutline`, `CalendarSearchOutline`, `CalendarStarOutline`, `CalendarTimeOutline`, `CelsiusOutline`, `ChartFinanceOutline`, `CheckCircleOutline`, `CheckCompletedOutline`, `CheckProgressOutline`, `CheckboxCheckedOutline`, `CheckboxIndeterminateOutline`, `CheckboxOutline`, `CheckmarkOutline`, `ChevronDoubleDownOutline`, `ChevronDoubleUpOutline`, `ChevronDownOutline`, `ChevronFirstOutline`, `ChevronLastOutline`, `ChevronLeftOutline`, `ChevronNextOutline`, `ChevronPreviousOutline`, `ChevronRightOutline`, `ChevronSortOutline`, `ChevronUpOutline`, `ClipboardCheck2Outline`, `ClipboardListOutline`, `ClipboardPercentOutline`, `ClipboardPlusOutline`, `ClipboardRemoveOutline`, `ClipboardSearchOutline`, `ClipboardUserOutline`, `CloseCircleOutline`, `CloseRemoveOutline`, `CloseSquareOutline`, `Co2Outline`, `CompassOutline`, `ConditionOutline`, `ContainerAvailableIoTOutline`, `ContainerAvailableOutline`, `ContainerBreakbulkOutline`, `ContainerCheckOutline`, `ContainerChilledOutline`, `ContainerDamageOutline`, `ContainerDangerousOutline`, `ContainerDryOutline`, `ContainerErrorOutline`, `ContainerFlagOutline`, `ContainerFlatrackOutline`, `ContainerFrozenOutline`, `ContainerOpenTopOutline`, `ContainerPalletOutline`, `ContainerPharmaOutline`, `ContainerReeferOutline`, `ContainerSearchOutline`, `ContainerTankOutline`, `ContainerTimeOutline`, `ContainerToolOutline`, `ContainerWarningOutline`, `CookieOutline`, `CraneContainerOutline`, `CranePortOutline`, `CreditCardOutline`, `CurrencyExchangeOutline`, `CurrencyOutline`, `CurrencyReciveOutline`, `CurrencySendOutline`, `CurrrencyOutline`, `DesktopToolOutline`, `DesktopTypeOutline`, `DesktopVideoOutline`, `DisabledOutline`, `DiscountOutline`, `DivideOutline`, `DivisionOutline`, `DocChecklistOutline`, `DocumentCopyOutline`, `DocumentEditOutline`, `DocumentErrorOutline`, `DocumentPasteOutline`, `DocumentSearchOutline`, `DocumentTextOutline`, `DocumentWarningOutline`, `DownloadCloudOutline`, `DraggableOutline`, `DropRainOutline`, `EmailNewOutline`, `EmailOutline`, `EmojiExcellentOutline`, `EmojiNeutralOutline`, `EmojiSatisfiedGoodOutline`, `EmojiUnsatisfiedBadOutline`, `EmojiVerySatisfiedVerygoodOutline`, `EmojiVeryUnsatisfiedVeryBadOutline`, `EmojiWinkOutline`, `EmptyTruckLeaveErrorOutline`, `EmptyTruckPickupErrorOutline`, `ErrorCircleOutline`, `EuroOutline`, `ExchangeCheckmarkOutline`, `EyeDisabledOutline`, `EyeOutline`, `FactoryOutline`, `FahrenheitOutline`, `FileAttachOutline`, `FileChartOutline`, `FileCheck2Outline`, `FileCopyOutline`, `FileCsvOutline`, `FileDataOutline`, `FileDownloadOutline`, `FileEditOutline`, `FileErrorOutline`, `FileExportOutline`, `FileFolderOutline`, `FileImportOutline`, `FilePasteOutline`, `FilePdfOutline`, `FilePlusOutline`, `FilePngOutline`, `FileRemoveOutline`, `FileSearchOutline`, `FileTextOutline`, `FileUploadOutline`, `FileWarningOutline`, `FileXlsxOutline`, `FileXmlOutline`, `FileZipOutline`, `FilterAddOutline`, `FilterEditOutline`, `FilterGearOutline`, `FilterOutline`, `FilterRemoveOutline`, `FilterResetOutline`, `FireOutline`, `FlagOutline`, `FlashLightingOutline`, `FormulaOutline`, `GearSettingOutline`, `GlobalArrowsOppositeOutline`, `GlobalOutline`, `HamburgerClosseOutline`, `HamburgerMenuOutline`, `HamburgerOpenOutline`, `HeartOutline`, `HomeOutline`, `Humidity2Outline`, `ImageOutline`, `InboxCheckOutline`, `InboxInOutline`, `InboxOutOutline`, `InboxOutline`, `InfoCircleOutline`, `InfoSquareOutline`, `KeyOutline`, `Layout01Outline`, `Layout02Outline`, `Layout03Outline`, `Layout04Outline`, `LeavesOutline`, `LinkCopyOutline`, `LinkOutline`, `ListBoxOutline`, `LocationAdd2Outline`, `LocationPinLineOutline`, `LocationPinOutline`, `LocationRemoveOutline`, `LockOutline`, `LockPasswordOutline`, `LogoDriveOutline`, `LogoFacebookOutline`, `LogoInstagramOutline`, `LogoLinkedinOutline`, `LogoXOutline`, `LogoYoutubeOutline`, `MedalOutline`, `MenuListOutline`, `MenuMoreHorizontalOutline`, `MenuMoreVerticalOutline`, `MessageChatOutline`, `MessageFeedbackOutline`, `MessageNewOutline`, `MessageOutline`, `MobileOutline`, `MoneyOutline`, `NotificationNewOutline`, `NotificationOffOutline`, `NotificationOutline`, `O2Outline`, `Package2AddOutline`, `Package2ErrorOutline`, `Package2Outline`, `Package2WarningOutline`, `PenEditOutline`, `PenSquareEditOutline`, `PercentOutline`, `PhoneOutline`, `PinOutline`, `PointToPointErrorOutline`, `PointToPointOutline`, `PointToPointWarningOutline`, `PoundOutline`, `PowerPlugDisabledOutline`, `PowerPlugOutline`, `PrinterDisabledOutline`, `PrinterOutline`, `PriorityHighOutline`, `PriorityLowOutline`, `PriorityMediumOutline`, `PriorityNotApplyOutline`, `PriorityVeryHighOutline`, `PriorityVeryLowOutline`, `QuestionCircleOutline`, `RadioButtonCheckedOutline`, `RadioButtonOutline`, `ReceiptBillInvoiceOutline`, `ReceiptListOutline`, `ReceiptLongBillOutline`, `ReceiptLongListOutline`, `ReceiptLongOutline`, `ReceiptLongPercentOutline`, `ReceiptOutline`, `ReceiptPercentOutline`, `RecycleOutline`, `ReeferIoTOutline`, `RefreshOutline`, `RemarkAddOutline`, `RemarkedOutline`, `RenewOutline`, `ResetOutline`, `RestrictionOutline`, `RouterWarningOutline`, `SaveOutline`, `SearchOutline`, `SearchZoomInOutline`, `SearchZoomOutOutline`, `SendOutline`, `ShareOutline`, `ShieldOutline`, `ShoppingCartOutline`, `SingaporeDollarOutline`, `SliderOutline`, `SmartSuggestionOutline`, `SnowOutline`, `SortAToZOutline`, `SortAscendingOutline`, `SortDescendingOutline`, `SortFilterListOutline`, `SortZToAOutline`, `StarOutline`, `SubtractCircleOutline`, `SubtractOutline`, `SubtractSquareOutline`, `TableEditOutline`, `TemperatureCOutline`, `TemperatureChilledOutline`, `TemperatureFOutline`, `TemperatureMeasureOutline`, `TemperaturePharmaOutline`, `TemperatureReeferOutline`, `TextAlignCenterOutline`, `TextAlignJustifyOutline`, `TextAlignLeftOutline`, `TextAlignRightOutline`, `TextBoldOutline`, `TextBulletedOutline`, `TextClearFormatOutline`, `TextColorOutline`, `TextHighlightOutline`, `TextItalicOutline`, `TextNumberedOutline`, `TextStrikethroughOutline`, `TextUnderlineOutline`, `ThumbsDownOutline`, `ThumbsUpOutline`, `TimeOutline`, `TrainFrontOutline`, `TranslateOutline`, `TrashDeleteOutline`, `TruckCloseOutline`, `TruckContainerOutline`, `TruckErrorOutline`, `TruckFrontOutline`, `TruckWarningOutline`, `UnlinkOutline`, `UnlockOutline`, `UnpinOutline`, `UploadCloudOutline`, `UsDollarOutline`, `UserAddOutline`, `UserAddressBookOutline`, `UserCheckOutline`, `UserCircleLoginOutline`, `UserCircleLogoutOutline`, `UserCircleOutline`, `UserCirclePlusOutline`, `UserIdOutline`, `UserManagerOutline`, `UserMultipleOutline`, `UserOutline`, `UserSearchOutline`, `VesselDoubleOutline`, `VesselFrontAddOutline`, `VesselFrontEditOutline`, `VesselFrontOutline`, `VesselFrontRestrictedOutline`, `VesselRevertOutline`, `VesselSideOutline`, `VesselSpcErrorOutline`, `VesselSpcOutline`, `WalletOpenOutline`, `WarehouseOutline`, `WarningOutline`, `WeightScaleOutline`, `WeightVgmErrorOutline`, `WeightVgmOutline`, `WifiIoTCheckOutline`, `WifiIoTCloseOutline`, `WifiIoTErrorOutline`, `WifiIoTGearOutline`, `WifiIoTInOutline`, `WifiIoTOutOutline`, `WifiIoTOutline`, `WifiIoTSearchOutline`, `WifiIoTToolOutline`, `WifiIoTWarningOutline`, `YenOutline`, `YuanOutline`

**Fill (48):** `AddCircleFill`, `AddSquareFill`, `BookingFill`, `BookmarkFill`, `CaretBackwardFill`, `CaretDownFill`, `CaretForwardFill`, `CaretLeftFill`, `CaretRightFill`, `CaretSortFill`, `CaretUpFill`, `CheckCircleFill`, `CheckboxCheckedFill`, `CheckboxIndeterminateFill`, `CloseCircleFill`, `CloseSquareFill`, `DiscountFill`, `DocumentTextFill`, `EmojiExcellentFill`, `EmojiNeutralFill`, `EmojiSatisfiedGoodFill`, `EmojiUnsatisfiedBadFill`, `EmojiVerySatisfiedVerygoodFill`, `EmojiVeryUnsatisfiedVeryBadFill`, `EmojiWinkFill`, `ErrorCircleFill`, `FireFill`, `FlagFill`, `HeartFill`, `HomeFill`, `InfoCircleFill`, `InfoSquareFill`, `MedalFill`, `OneLogoFill`, `QuestionCircleFill`, `SentFill`, `ShieldFill`, `StarFill`, `SubtractCircleFill`, `SubtractSquareFill`, `ThumbsDownFill`, `ThumbsUpFill`, `UserCircleFill`, `UserCircleLoginFill`, `UserCircleLogoutFill`, `UserCirclePlusFill`, `UserFill`, `WarningFill`

<!-- GENERATED:END -->
