export interface NavItem {
  readonly label: string;
  readonly href: string;
  /**
   * Marks an item that opens a submenu in the header. "services" is built
   * from `content/services.ts`, so adding or removing a service updates the
   * navigation with it.
   */
  readonly menu?: "services";
}

export const primaryNavigation: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", menu: "services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Secondary routes that stay reachable from the footer. */
export const secondaryNavigation: readonly NavItem[] = [
  { label: "Frequently asked questions", href: "/faq" },
];

export const legalNavigation: readonly NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
