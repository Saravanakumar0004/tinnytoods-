import { Helmet } from "react-helmet-async";

type SEOProps = {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  robots?: string;
  url?: string;
};

const DEFAULT_SITE_NAME = "Tiny Todds Therapy Care";
const DEFAULT_IMAGE = "https://tinytoddstherapycare.com/assets/img/tttclogo.jpg";
const DEFAULT_URL = "https://tinytoddstherapycare.com";

const DEFAULT_KEYWORDS =
  "Speech Therapy Chennai, Occupational Therapy Chennai, Behavioral Therapy Chennai, Special Education Chennai, Parent Training, Early Intervention, Child Therapy West Mambalam, Autism Therapy Chennai, Pediatric Therapy Chennai";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  name: "Tiny Todds Therapy Care",
  image: DEFAULT_IMAGE,
  url: DEFAULT_URL,
  telephone: "+91-XXXXXXXXXX", // ← Replace with real number
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Door No.1, 2nd St, KV Colony, Kasi Viswanathar Colony, West Mambalam",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600033",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 13.038246,
    longitude: 80.219815,
  },
  areaServed: "Chennai",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/tinytoddstherapycare",   // ← Replace with real URL
    "https://www.instagram.com/tinytoddstherapycare",  // ← Replace with real URL
  ],
};

const SEO = ({
  title,
  description,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  image = DEFAULT_IMAGE,
  robots = "index, follow",
  url = DEFAULT_URL,
}: SEOProps) => {
  const fullTitle = title.includes(DEFAULT_SITE_NAME)
    ? title
    : `${title} | ${DEFAULT_SITE_NAME}`;

  return (
    <Helmet>
      {/* ── Basic ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <meta name="author" content={DEFAULT_SITE_NAME} />

      {/* ── Canonical ── */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* ── Open Graph ── */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={DEFAULT_SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_IN" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ── Geo Tags ── */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Chennai" />
      <meta name="geo.position" content="13.038246;80.219815" />
      <meta name="ICBM" content="13.038246,80.219815" />

      {/* ── JSON-LD Structured Data (only on public pages) ── */}
      {robots !== "noindex, nofollow" && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;