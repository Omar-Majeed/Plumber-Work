import { business, directionsUrl } from "@/content/business";
import { services } from "@/content/services";

/**
 * FAQ content.
 *
 * Answers are limited to what the business has confirmed: identity, location,
 * phone number, ABN and the service catalogue. Questions whose honest answer
 * would require unconfirmed information (call-out fees, response times,
 * payment terms, warranty cover, after-hours availability, licence numbers,
 * insurance, suburb coverage) are deliberately absent rather than answered
 * with a plausible guess.
 *
 * Safety guidance (burst pipe, gas smell) is general advice, not a claim about
 * this business, and is safe to publish.
 */

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface FaqGroup {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly items: readonly FaqItem[];
}

const serviceList = services.map((service) => service.title).join(", ");

/** The six questions published on the home page, per the homepage specification. */
export const homepageFaqs: readonly FaqItem[] = [
  {
    question: "Where is Hohmanns Plumbing Services located?",
    answer: `The business is at ${business.address.singleLine}. There is a map and a directions link in the location section above.`,
  },
  {
    question: "How can I contact Hohmanns Plumbing Services?",
    answer: `Call ${business.phone.display} to speak to the business directly, or send the enquiry form on this page with the job and property details.`,
  },
  {
    question: "What plumbing services are available?",
    answer: `${serviceList}. Each service has its own page with a fuller description of the work it covers.`,
  },
  {
    question: "Does Hohmanns provide gas fitting?",
    answer:
      "Yes. Gas fitting is one of the six services listed on this page, and the business is listed publicly under the trade category Plumbers & Gasfitters. Gas work in Queensland must be carried out by an appropriately licensed gas fitter, and compliance documentation is issued as part of the job.",
  },
  {
    question: "How can I send details about a job?",
    answer:
      "Use the enquiry form in the contact section below. Choose the service that best matches the job, add the property suburb or address, and describe what is happening. The business will use those details to respond.",
  },
  {
    question: "How do I get directions to the business?",
    answer: `Use the Get directions button in the location section, which opens ${business.address.street} in Google Maps.`,
  },
];

export const faqGroups: readonly FaqGroup[] = [
  {
    id: "contact",
    title: "Contacting the business",
    summary: "How to reach Hohmanns and what to have ready.",
    items: [
      ...homepageFaqs.slice(0, 2),
      {
        question: "What details are useful when I get in touch?",
        answer:
          "What is happening and where, which fixture or area is affected, roughly when it started, and the suburb or address of the property. If you can safely take a photo of the fitting or the affected area, that often makes the job easier to scope.",
      },
      homepageFaqs[4] as FaqItem,
    ],
  },
  {
    id: "services",
    title: "Services",
    summary: "The work covered by the six service categories.",
    items: [
      homepageFaqs[2] as FaqItem,
      homepageFaqs[3] as FaqItem,
      {
        question: "Do you work on commercial properties as well as homes?",
        answer:
          "Commercial plumbing and maintenance is one of the six service categories. The service page for it describes the kind of work it covers.",
      },
      {
        question: "Can you supply fixtures and appliances, or should I?",
        answer:
          "Either can work. If you are buying your own hot water unit or fixture, it is worth sending the model through before you order so the connections and clearances can be checked against what is already installed.",
      },
    ],
  },
  {
    id: "urgent",
    title: "Before anyone arrives",
    summary: "General safety guidance for the first few minutes.",
    items: [
      {
        question: "A pipe has burst. What do I do first?",
        answer:
          "Turn the water off. Most fixtures have an isolation tap beside them, and there is a main tap at the water meter. Turning it off limits the damage while you arrange an inspection. Keep electrical fittings and switchboards clear of the water.",
      },
      {
        question: "I can smell gas. What now?",
        answer:
          "Treat it as an emergency and do not call a plumber first. Do not use switches, flames or anything that could ignite. If it is safe, turn the gas off at the meter or bottle, open windows, get everyone outside, and call your gas supplier's emergency line or 000. Arrange the repair and compliance paperwork afterwards.",
      },
      {
        question: "The toilet is overflowing. Can I stop it myself?",
        answer:
          "Close the small isolation tap on the wall behind or beside the pan. That stops the cistern refilling. If several fixtures are backing up at once, stop using water in the property altogether, because the blockage is likely to be downstream of everything.",
      },
    ],
  },
  {
    id: "location",
    title: "Location",
    summary: "Where the business operates from.",
    items: [
      homepageFaqs[0] as FaqItem,
      homepageFaqs[5] as FaqItem,
      {
        question: "What are the registered business details?",
        answer: `${business.legalName}, ABN ${business.abn}, ${business.address.singleLine}.`,
      },
    ],
  },
];

/** Flattened list, used for FAQPage structured data. */
export const allFaqItems: readonly FaqItem[] = faqGroups.flatMap(
  (group) => group.items,
);

export { directionsUrl };
