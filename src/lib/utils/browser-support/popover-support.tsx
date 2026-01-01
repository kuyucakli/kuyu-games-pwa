export function supportsPopover() {
  return Object.hasOwn(HTMLElement.prototype, "popover");
}
