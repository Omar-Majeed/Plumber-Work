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
  { label: "Services", href: "/services", menu: "services" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const legalNavigation: readonly NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];
