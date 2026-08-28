import { proposedFact, type ContentFact } from "@/lib/content-facts";

/**
 * Service catalogue.
 *
 * SAMPLE CONTENT: these six categories and their copy were written for the
 * demo. The public listing confirms the trade category "Plumbers & Gasfitters"
 * and nothing more, so every entry still carries `requiresConfirmation: true`
 * and the production content gate blocks a release until the business signs
 * them off.
 *
 * Adding, removing, renaming or reordering a service is a change to this file
 * only — the grid, the detail pages, the sitemap, the form dropdown and the
 * static params all follow.
 */

export type ServiceIconKey =
  "wrench" | "drain" | "hot-water" | "gas" | "leak" | "commercial";

export interface ServiceFaq {
  readonly question: string;
  readonly answer: string;
}

export interface Service {
  readonly slug: string;
  readonly title: string;
  /** Used for the page <h1>, which stays distinct from the card title. */
  readonly headline: string;
  readonly icon: ServiceIconKey;
  /** One to two sentences, used on cards and in listings. */
  readonly summary: string;
  /** Two short paragraphs of plain-language introduction. */
  readonly intro: readonly string[];
  /** Signs a customer typically notices before they call. */
  readonly indicators: readonly string[];
  /** What the visit usually covers. */
  readonly includes: readonly string[];
  /** Short line used under the service-page heading. */
  readonly promise: string;
  readonly faqs: readonly ServiceFaq[];
  readonly related: readonly string[];
  /** Always true until the client confirms the service is offered. */
  readonly requiresConfirmation: boolean;
}

export const services: readonly Service[] = [
  {
    slug: "general-plumbing-and-repairs",
    title: "General plumbing and repairs",
    headline: "General plumbing and repairs in Rockhampton",
    icon: "wrench",
    summary:
      "Everyday plumbing work around the house or workplace — taps, toilets, fixtures and the small repairs that keep adding up.",
    intro: [
      "General plumbing covers the ordinary, unglamorous jobs that make a building work: a tap that will not stop dripping, a toilet that runs all night, a mixer that has lost its temperature control, a new fixture that needs connecting properly.",
      "Most of these jobs are small on their own. Grouping them into one visit is usually the practical way to handle them, and it is worth describing everything on your list when you call.",
    ],
    indicators: [
      "A tap or shower that drips after it is turned off firmly",
      "A toilet cistern that keeps refilling between uses",
      "Fixtures that move, rock or leak at the base",
      "Water pressure that has dropped at one outlet but not others",
    ],
    includes: [
      "Tap, mixer and shower repairs or replacements",
      "Toilet suites, cisterns and running-water faults",
      "Basin, sink and laundry fixture installation",
      "Water pressure and flow-rate checks",
      "Small jobs grouped into one visit",
    ],
    promise:
      "Book the small jobs together and we will work through the list in one visit.",
    faqs: [
      {
        question: "What information helps when I describe a plumbing problem?",
        answer:
          "Where the problem is, roughly when it started, whether it is getting worse, and whether water is still running or has been isolated. If you know where your water meter and isolation tap are, mention that too.",
      },
      {
        question: "Should I turn the water off before help arrives?",
        answer:
          "If water is escaping and you can safely reach the isolation tap for that fixture — or the main tap at the meter — turning it off limits the damage while you arrange an inspection.",
      },
    ],
    related: ["leaks-and-burst-pipes", "blocked-drains"],
    requiresConfirmation: true,
  },
  {
    slug: "blocked-drains",
    title: "Blocked drains",
    headline: "Blocked drains and slow-running waste",
    icon: "drain",
    summary:
      "Sinks, showers, toilets and outside drains that are draining slowly, gurgling or backing up.",
    intro: [
      "A blockage rarely appears overnight. Most build up gradually from fat, hair, food waste, wet wipes or root growth in older clay lines, and the early signs show up well before anything overflows.",
      "Where the blockage sits changes how it is dealt with. A single slow fixture usually points to the branch line serving it; several fixtures backing up together points further downstream.",
    ],
    indicators: [
      "Water pooling in a shower base or sink and clearing slowly",
      "Gurgling from a nearby drain when another fixture is used",
      "A recurring smell around a floor waste or gully",
      "More than one fixture backing up at the same time",
    ],
    includes: [
      "High-pressure jetting of sinks, showers and sewer lines",
      "CCTV camera inspection of the affected line",
      "Root cutting and grease removal",
      "Locating the blockage before anything is dug up",
      "A written report on what caused it",
    ],
    promise: "We find where the blockage actually is before anything gets dug up.",
    faqs: [
      {
        question: "Are supermarket drain chemicals a good first step?",
        answer:
          "They can clear light build-up in a basin, but repeated use is hard on older pipework and they do nothing about roots or a collapsed section. If a drain blocks again within weeks, the cause is usually further along the line.",
      },
      {
        question: "Why do the same drains keep blocking?",
        answer:
          "Recurring blockages in the same line often indicate a partial obstruction, a sag, or root intrusion at a joint, rather than whatever was cleared last time. Repeat blockages are worth investigating rather than clearing again.",
      },
    ],
    related: [
      "general-plumbing-and-repairs",
      "commercial-plumbing-and-maintenance",
    ],
    requiresConfirmation: true,
  },
  {
    slug: "hot-water-systems",
    title: "Hot water systems",
    headline: "Hot water systems: repair and replacement",
    icon: "hot-water",
    summary:
      "No hot water, not enough hot water, or a unit near the end of its life and due for a decision.",
    intro: [
      "Hot water units fail in fairly predictable ways. Electric storage units commonly lose an element or thermostat; gas units may have an ignition or valve fault; any storage unit will eventually corrode through and leak.",
      "Age matters when deciding between a repair and a replacement. Storage units generally have a service life measured in years rather than decades, and a leaking tank is not a repairable fault.",
    ],
    indicators: [
      "Hot water runs out much faster than it used to",
      "Water is discoloured or smells different at hot taps only",
      "Water pooling underneath or around the base of the unit",
      "The relief valve is discharging far more than an occasional drip",
    ],
    includes: [
      "Element, thermostat and valve replacement",
      "Gas, electric, solar and heat-pump changeovers",
      "Relief valve and tempering valve servicing",
      "Like-for-like replacement, usually same day",
      "Manufacturer warranty registered for you",
    ],
    promise:
      "Most changeovers are finished the same day, with the old unit taken away.",
    faqs: [
      {
        question: "What details should I have ready about my unit?",
        answer:
          "The brand and model from the compliance plate, whether it is electric, gas or solar, its approximate age, and where it is installed. A photo of the data plate is usually enough.",
      },
      {
        question: "Is a small drip from the relief valve normal?",
        answer:
          "Some discharge during heating is expected on a storage unit. Continuous running, hot water discharging, or a noticeable increase are all reasons to have the unit looked at.",
      },
    ],
    related: ["gas-fitting", "general-plumbing-and-repairs"],
    requiresConfirmation: true,
  },
  {
    slug: "gas-fitting",
    title: "Gas fitting",
    headline: "Gas fitting and gas appliance connections",
    icon: "gas",
    summary:
      "Gas appliance connections, gas lines and gas-related plumbing work carried out to Queensland requirements.",
    intro: [
      "Gas work in Queensland is licensed work. Installing, altering or connecting gas appliances and gas lines must be carried out by an appropriately licensed gas fitter, and compliance documentation is part of the job.",
      "Typical requests include connecting a cooktop or gas hot water unit, extending a line for an outdoor appliance, or checking existing pipework before an appliance change.",
    ],
    indicators: [
      "A gas smell anywhere in or around the building",
      "A new appliance that needs connecting or an old one removed",
      "Yellow, lazy burner flames instead of a steady blue flame",
      "Pilot lights that will not stay lit",
    ],
    includes: [
      "Cooktop, oven and gas hot water connections",
      "New gas lines and appliance points",
      "Leak testing and pressure checks",
      "LPG and natural gas conversions",
      "Compliance certificate issued on completion",
    ],
    promise:
      "Licensed gas work, with the compliance paperwork handed over on the day.",
    faqs: [
      {
        question: "What should I do if I can smell gas?",
        answer:
          "Treat it as urgent. Do not use switches, flames or anything that could ignite. If it is safe, turn the gas off at the meter or bottle, ventilate the area, leave the building and contact your gas supplier's emergency line or emergency services before arranging any other work.",
      },
      {
        question: "Do I need paperwork after gas work?",
        answer:
          "Gas work in Queensland requires the licensed gas fitter to issue compliance documentation. Keep it — insurers, appliance warranties and future buyers all ask for it.",
      },
    ],
    related: ["hot-water-systems", "general-plumbing-and-repairs"],
    requiresConfirmation: true,
  },
  {
    slug: "leaks-and-burst-pipes",
    title: "Leaks and burst pipes",
    headline: "Water leaks and burst pipes",
    icon: "leak",
    summary:
      "Visible leaks, hidden leaks behind walls or under slabs, and burst pipes that need isolating quickly.",
    intro: [
      "Some leaks announce themselves. Others show up only as a water bill that has climbed for no obvious reason, a damp patch that never quite dries, or a warm spot on a floor.",
      "Isolating the water is the first priority with an active burst. After that, finding the source matters more than patching the symptom, because concealed leaks tend to reappear nearby.",
    ],
    indicators: [
      "A water bill noticeably higher than the same period last year",
      "Damp, staining or bubbling paint on a wall or ceiling",
      "The water meter continuing to tick over with every tap closed",
      "Ground that stays wet near the meter or along a pipe run",
    ],
    includes: [
      "Isolating the water and stopping the damage first",
      "Acoustic and thermal leak detection",
      "Concealed leaks in walls, ceilings and under slabs",
      "Burst and split pipe repair or replacement",
      "Meter checks to confirm the leak is gone",
    ],
    promise: "Water off first, source found second, repair third — in that order.",
    faqs: [
      {
        question: "How can I check for a leak myself?",
        answer:
          "Turn off every tap and water-using appliance, then watch the water meter for several minutes. Movement with nothing running suggests water is escaping somewhere on the property side of the meter.",
      },
      {
        question: "Where is the main isolation tap usually located?",
        answer:
          "Most Queensland properties have it at or beside the water meter near the street boundary. It is worth locating and testing it before you ever need it in a hurry.",
      },
    ],
    related: ["general-plumbing-and-repairs", "blocked-drains"],
    requiresConfirmation: true,
  },
  {
    slug: "commercial-plumbing-and-maintenance",
    title: "Commercial plumbing and maintenance",
    headline: "Commercial plumbing and maintenance",
    icon: "commercial",
    summary:
      "Plumbing and gasfitting work for business premises, where downtime, access and scheduling all have to be planned around.",
    intro: [
      "Commercial work has different constraints to domestic work. Trading hours, tenancy agreements, access arrangements and reporting requirements usually shape when and how the job is done.",
      "Planned maintenance is generally cheaper than reactive callouts, because failures in commercial amenities affect staff and customers immediately.",
    ],
    indicators: [
      "Amenities that need attention outside trading hours",
      "Recurring faults across multiple fixtures or tenancies",
      "Grease trap, backflow or compliance obligations to schedule",
      "A property or facilities manager who needs written reporting",
    ],
    includes: [
      "Scheduled maintenance and compliance servicing",
      "Backflow prevention testing and grease traps",
      "Amenities, kitchens and plant-room work",
      "Out-of-hours work around trading times",
      "Itemised reporting for property managers",
    ],
    promise:
      "Work scheduled around your trading hours, with reporting your manager can file.",
    faqs: [
      {
        question: "What should a commercial enquiry include?",
        answer:
          "The site address, the type of premises, access and trading-hour constraints, who authorises the work, and whether reporting or documentation is required.",
      },
      {
        question: "Can maintenance be scheduled around trading hours?",
        answer:
          "Scheduling is usually negotiated per site. Raise it early in the conversation so availability can be discussed before anything is booked.",
      },
    ],
    related: ["blocked-drains", "general-plumbing-and-repairs"],
    requiresConfirmation: true,
  },
] as const;

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getRelatedServices(service: Service): readonly Service[] {
  return service.related
    .map((slug) => getService(slug))
    .filter((related): related is Service => Boolean(related));
}

export const serviceFacts: readonly ContentFact<unknown>[] = services.map(
  (service) =>
    proposedFact({
      id: `service.${service.slug}`,
      label: `Confirm the business offers "${service.title}"`,
      category: "service",
      value: service.title,
      source:
        "Proposed for the demo — the public listing confirms the category 'Plumbers & Gasfitters' only",
      productionVisible: true,
      affects: ["/", "/services", `/services/${service.slug}`],
    }),
);
