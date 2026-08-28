import "server-only";

import type { EnquiryValues } from "@/lib/form-schema";
import { contactDeliveryProvider } from "@/lib/site-config";

/**
 * Outbound delivery boundary.
 *
 * Nothing here transmits data yet. Adding a provider means implementing one
 * adapter and setting `CONTACT_DELIVERY_PROVIDER` — no page or component
 * changes are required.
 *
 * Required environment variables per provider are documented in README.md.
 */

export type DeliveryOutcome =
  { ok: true } | { ok: false; reason: "not-configured" | "provider-error" };

export interface DeliveryAdapter {
  readonly id: string;
  send(values: EnquiryValues): Promise<DeliveryOutcome>;
}

/** Default adapter. Explicitly does nothing and reports that it is disabled. */
const disabledAdapter: DeliveryAdapter = {
  id: "disabled",
  async send() {
    return { ok: false, reason: "not-configured" };
  },
};

/**
 * Placeholder for a future transactional-email or CRM adapter.
 * Implement `send`, register it below, then set CONTACT_DELIVERY_PROVIDER.
 */
const adapters: Record<string, DeliveryAdapter> = {
  disabled: disabledAdapter,
};

export function getDeliveryAdapter(): DeliveryAdapter {
  return adapters[contactDeliveryProvider] ?? disabledAdapter;
}

export function isDeliveryConfigured(): boolean {
  return getDeliveryAdapter().id !== "disabled";
}
