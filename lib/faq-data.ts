/**
 * Single source of truth for the public FAQ. Rendered by the FAQ section UI and
 * also emitted as FAQPage JSON-LD so the answers stay identical in both places
 * (Google requires the structured data to match the visible content).
 */
export type Faq = {
  q: string
  a: string
}

export const faqs: Faq[] = [
  {
    q: "Where is Rapido Motorsiklo Garage located?",
    a: "We're located at 57 St. Dominic Subd. San Roque Arbol, Lubao, Pampanga, 2005, Philippines. Walk-ins are welcome — or message us on Facebook so we can prepare for your visit.",
  },
  {
    q: "What motorcycles do you service?",
    a: "We service popular daily-rider motorcycles — commuter bikes, underbones, scooters, and more. Not sure if your motor is covered? Just send us a photo on Facebook and we'll let you know.",
  },
  {
    q: "Do you offer free estimates?",
    a: "Yes. Send us a message describing the issue (a photo or short video helps a lot), and we'll give you an honest estimate before any work begins. No commitment.",
  },
  {
    q: "How long does a typical repair take?",
    a: "Most routine jobs like oil change, tune-up, or brake service are finished the same day. Bigger repairs and overhauls depend on parts availability — we'll always give you a clear timeline upfront.",
  },
  {
    q: "Do you sell genuine motorcycle parts?",
    a: "Yes. We carry OEM-quality and reliable parts for common motorcycle models, plus accessories. If we don't have a specific part in stock, we'll help you source it.",
  },
  {
    q: "How do I book a service?",
    a: "The fastest way is to message us on Facebook. Tell us your motor model and the issue — we'll confirm the next available slot and what you should bring.",
  },
  {
    q: "Can you help me decide if I should buy or upgrade a motor?",
    a: "Yes. We offer pre-purchase checks and upgrade advice as part of our motor trade services. Tell us what you're considering and we'll help you make a smart decision.",
  },
]
