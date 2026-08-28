/**
 * FAQ content for /faq.
 *
 * SAMPLE CONTENT: the answers describe how the business is presented in this
 * demo. Confirm each one before launch — they are tracked as a single item in
 * CONTENT_CONFIRMATION.md.
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

export const faqGroups: readonly FaqGroup[] = [
  {
    id: "booking",
    title: "Booking a job",
    summary: "Getting us out, and what happens between the call and the visit.",
    items: [
      {
        question: "How do I book a plumber?",
        answer:
          "Ring the office on the number at the top of this page, or send the enquiry form and we will call you back. Tell us what the problem is, roughly when it started, and the address — that is usually enough to work out what to bring.",
      },
      {
        question: "How soon can someone come out?",
        answer:
          "Straightforward jobs in and around Rockhampton are normally booked within a day or two. Anything involving active water escaping or a gas fault is treated as urgent and fitted in ahead of scheduled work.",
      },
      {
        question: "Do you charge a call-out fee?",
        answer:
          "There is no separate call-out fee on top of the quoted price. You get the price for the job before we start, and that price includes getting there.",
      },
      {
        question: "Do I need to be home?",
        answer:
          "Not always. If we can get safe access to the work area and the water meter, plenty of jobs are done with a key or a code and a phone call once we are finished. Gas work and anything needing a decision on the day is easier with someone there.",
      },
      {
        question: "Can I get a quote from photos?",
        answer:
          "Often, yes. Clear photos of the fixture, the data plate on a hot water unit, or the area under a sink are usually enough for a written quote on common work. Anything hidden behind a wall or under a slab needs a look first.",
      },
    ],
  },
  {
    id: "pricing",
    title: "Pricing and payment",
    summary: "What things cost, when you find out, and how you pay.",
    items: [
      {
        question: "How is the price worked out?",
        answer:
          "Scheduled work is quoted as a fixed price for the job. You approve it before anything starts. If we open something up and find more than we could see, we stop and talk to you rather than adding it to the bill.",
      },
      {
        question: "Are quotes free?",
        answer:
          "Written quotes on scheduled work are free. Where a fault has to be traced first — a concealed leak, a recurring blockage — the investigation itself is chargeable, and we tell you that number before we start.",
      },
      {
        question: "How can I pay?",
        answer:
          "Cash, EFTPOS, Visa and Mastercard, or bank transfer. Domestic work is payable on completion; account customers have 14-day terms.",
      },
      {
        question: "Is the work guaranteed?",
        answer:
          "Workmanship is covered for 12 months in writing. Fixtures and appliances carry their own manufacturer warranty on top of that, and we register them where the manufacturer requires it.",
      },
    ],
  },
  {
    id: "urgent",
    title: "Urgent problems",
    summary: "What to do in the first few minutes, before anyone arrives.",
    items: [
      {
        question: "A pipe has burst — what do I do first?",
        answer:
          "Turn the water off at the meter, usually near the front boundary. Once the water is off the damage stops getting worse and there is no rush to make the next decision. Then call us and describe where the water was coming from.",
      },
      {
        question: "I can smell gas. What now?",
        answer:
          "Treat it as an emergency. Do not use switches, flames or anything that could ignite. If it is safe, turn the gas off at the meter or bottle, open windows, get everyone outside, and call your gas supplier's emergency line or 000 first. Book us afterwards for the repair and compliance paperwork.",
      },
      {
        question: "Do you do after-hours call-outs?",
        answer:
          "Yes — burst pipes, blocked sewers and gas faults are handled outside office hours. Call the same number and follow the prompts. After-hours work is charged at a higher rate, and we tell you that before we come out.",
      },
      {
        question: "The toilet is overflowing. Can I stop it myself?",
        answer:
          "Close the small isolation tap on the wall behind or beside the pan — that stops the cistern refilling. If several fixtures are backing up at once, stop using water in the house altogether and call us; the blockage is likely downstream of everything.",
      },
    ],
  },
  {
    id: "work",
    title: "The work itself",
    summary: "Licensing, compliance and the things people ask on site.",
    items: [
      {
        question: "Are you licensed and insured?",
        answer:
          "Yes. We hold a QBCC contractor licence covering plumbing, drainage and gas work, and carry public liability insurance. We are happy to show you the paperwork before a job starts.",
      },
      {
        question: "Will I get compliance paperwork?",
        answer:
          "Where the work requires it — gas installations, notifiable plumbing and drainage work — you get the compliance documentation for your records. Keep it: insurers, appliance warranties and future buyers all ask for it.",
      },
      {
        question: "Do you fix work someone else did?",
        answer:
          "Regularly. We will tell you plainly what we find and what it will take to put right, without editorialising about whoever did it last.",
      },
      {
        question: "Can you supply the fixtures, or should I?",
        answer:
          "Either. We can supply and install, which keeps the warranty in one place, or install what you have bought. If you are buying your own, send us the model before you order so we can check it suits the connections you have.",
      },
      {
        question: "How long will the job take?",
        answer:
          "Most domestic repairs are done in one visit. Hot water changeovers usually take half a day. Drain repairs and anything needing excavation depend on what is found, and we give you a revised timeframe as soon as we know.",
      },
    ],
  },
  {
    id: "area",
    title: "Where we work",
    summary: "The area we cover out of Bolsover Street.",
    items: [
      {
        question: "Which suburbs do you cover?",
        answer:
          "All of Rockhampton and the surrounding suburbs, out to Gracemere, Parkhurst and Mount Morgan, and across to Yeppoon and Emu Park on the Capricorn Coast. Roughly a 60km radius from the office.",
      },
      {
        question: "Do you travel further than that?",
        answer:
          "For larger or scheduled work, often yes. Ring and ask — if it is not something we can get to, we will tell you straight away rather than string you along.",
      },
      {
        question: "Do you do commercial and rental properties?",
        answer:
          "Yes. We work with property managers, body corporates and local businesses, and can invoice to an account with the reporting most managers need.",
      },
    ],
  },
] as const;

export const allFaqItems: readonly FaqItem[] = faqGroups.flatMap(
  (group) => group.items,
);
