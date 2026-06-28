/**
 * SEO helpers — generate consistent meta tags + JSON-LD structured data
 * for every page in the app.
 */

export const BASE_URL = "https://rivalscope.com";
export const SITE_NAME = "RivalScope";

export function pageMeta({
  title,
  description,
  path = "/",
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  type?: string;
}) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;

  return [
    { title: fullTitle },
    { name: "description", content: description },
    { name: "og:title",       content: fullTitle },
    { name: "og:description", content: description },
    { name: "og:url",         content: url },
    { name: "og:type",        content: type },
    { name: "og:site_name",   content: SITE_NAME },
    { name: "og:image",       content: `${BASE_URL}/og-image.png` },
    { name: "twitter:card",        content: "summary_large_image" },
    { name: "twitter:title",       content: fullTitle },
    { name: "twitter:description", content: description },
    { name: "twitter:image",       content: `${BASE_URL}/og-image.png" ` },
    { name: "canonical",           content: url },
    { name: "robots",              content: "index, follow" },
  ];
}

/** JSON-LD for the homepage (SoftwareApplication schema) */
export const SOFTWARE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered competitor monitoring SaaS. Get real-time alerts when competitors change pricing, launch features, or update messaging.",
  url: BASE_URL,
  offers: [
    { "@type": "Offer", price: "0",  priceCurrency: "USD", name: "Free"   },
    { "@type": "Offer", price: "29", priceCurrency: "USD", name: "Pro"    },
    { "@type": "Offer", price: "99", priceCurrency: "USD", name: "Agency" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "124",
  },
};

/** FAQ JSON-LD for the pricing page */
export const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is RivalScope?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RivalScope is an AI-powered competitor monitoring tool that automatically tracks changes on competitor websites and sends you instant alerts.",
      },
    },
    {
      "@type": "Question",
      name: "How does the free plan work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The free plan lets you monitor 2 competitors with weekly change digests. No credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel anytime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can cancel your subscription at any time. You\'ll keep access until the end of your billing period.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free trial for paid plans?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! All paid plans include a 14-day free trial. No credit card required to start.",
      },
    },
  ],
};
