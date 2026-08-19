/**
 * Element ids shared between a control and the thing it controls.
 *
 * Its own module because MobileNav is dynamically imported: importing the
 * constant from that file would pull the whole drawer into the header bundle
 * and undo the code-split. `aria-controls` has to name a real element, so the
 * id cannot come from useId either — the trigger and the dialog render in
 * different components and would generate different values.
 */
export const MOBILE_NAV_ID = "mobile-nav-drawer";
