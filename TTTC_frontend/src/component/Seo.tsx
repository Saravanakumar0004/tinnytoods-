// src/component/Seo.tsx
import { Helmet } from "react-helmet-async";

// ── Constants ────────────────────────────────────────────────────────────────
const SITE_NAME     = "Tiny Todds Therapy Care";
const SITE_URL      = "https://tinytoddstherapycare.com";
const TWITTER_SITE  = "@TinyTodds";
const PHONE         = "+91-9841356600"; // ← Replace with real number
const FACEBOOK_URL  = "https://www.facebook.com/tinytoddstherapycare";
const INSTAGRAM_URL = "https://www.instagram.com/tinytoddstherapycare";

const DEFAULT_IMAGE     = `${SITE_URL}/assets/img/og-cover.jpg`;
const DEFAULT_IMAGE_ALT = "Tiny Todds Therapy Care – Autism & Child Therapy Center, Chennai";
const DEFAULT_KEYWORDS  =
  "Speech Therapy Chennai, Occupational Therapy Chennai, Behavioral Therapy Chennai, Special Education Chennai, Parent Training, Early Intervention, Child Therapy West Mambalam, Autism Therapy Chennai, Pediatric Therapy Chennai";

// ── Types ─────────────────────────────────────────────────────────────────────
// Accepts BOTH the old style (canonical + url) and new style (path).
// This prevents TypeScript errors across all existing pages.
type SEOProps = {
  title        : string;
  description  : string;
  keywords?    : string;
  image?       : string;
  imageAlt?    : string;
  robots?      : string;
  noIndex?     : boolean;
  type?        : "website" | "article";
  // New preferred prop:
  path?        : string;   // e.g. "/services" — auto-builds canonical & og:url
  // Legacy props (kept for backward compat — won't cause TS errors):
  canonical?   : string;
  url?         : string;
};

// ── Structured Data ───────────────────────────────────────────────────────────
const buildStructuredData = () => ({
  "@context" : "https://schema.org",
  "@type"    : "MedicalBusiness",
  name       : SITE_NAME,
  image      : DEFAULT_IMAGE,
  url        : SITE_URL,
  telephone  : PHONE,
  priceRange : "$$",
  address: {
    "@type"         : "PostalAddress",
    streetAddress   : "Door No.1, 2nd St, KV Colony, Kasi Viswanathar Colony, West Mambalam",
    addressLocality : "Chennai",
    addressRegion   : "Tamil Nadu",
    postalCode      : "600033",
    addressCountry  : "IN",
  },
  geo: {
    "@type"    : "GeoCoordinates",
    latitude   : 13.038246,
    longitude  : 80.219815,
  },
  areaServed : "Chennai",
  openingHoursSpecification: [
    {
      "@type"   : "OpeningHoursSpecification",
      dayOfWeek : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens     : "08:00",
      closes    : "20:00",
    },
  ],
  sameAs: [FACEBOOK_URL, INSTAGRAM_URL],
});

// ── Component ─────────────────────────────────────────────────────────────────
const SEO = ({
  title,
  description,
  keywords   = DEFAULT_KEYWORDS,
  image      = DEFAULT_IMAGE,
  imageAlt   = DEFAULT_IMAGE_ALT,
  robots,
  noIndex    = false,
  type       = "website",
  // Resolve page URL: prefer `path`, fall back to `canonical` or `url`
  path,
  canonical,
  url,
}: SEOProps) => {

  // Auto-append site name unless already present
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  // Resolve the canonical URL from whichever prop was provided
  const resolvedUrl = (() => {
    if (path) {
      // path="/services" → "https://tinytoddstherapycare.com/services"
      const clean = path === "/" ? "" : path.replace(/\/$/, "");
      return `${SITE_URL}${clean}`;
    }
    // Legacy: use canonical or url directly if passed
    return canonical ?? url ?? SITE_URL;
  })();

  const robotsContent = noIndex
    ? "noindex, nofollow"
    : (robots ?? "index, follow");

  return (
    <Helmet>
      {/* ── Basic ── */}
      <title>{fullTitle}</title>
      <meta name="description"  content={description} />
      <meta name="keywords"     content={keywords} />
      <meta name="robots"       content={robotsContent} />
      <meta name="author"       content={SITE_NAME} />
      <meta name="theme-color"  content="#ffffff" />

      {/* ── Canonical ── */}
      <link rel="canonical" href={resolvedUrl} />

      {/* ── Open Graph (WhatsApp · Facebook · Telegram · LinkedIn) ── */}
      <meta property="og:type"              content={type} />
      <meta property="og:site_name"         content={SITE_NAME} />
      <meta property="og:title"             content={fullTitle} />
      <meta property="og:description"       content={description} />
      <meta property="og:url"               content={resolvedUrl} />
      <meta property="og:locale"            content="en_IN" />
      <meta property="og:image"             content={image} />
      <meta property="og:image:secure_url"  content={image} />
      <meta property="og:image:type"        content="image/jpeg" />
      <meta property="og:image:width"       content="1200" />
      <meta property="og:image:height"      content="630" />
      <meta property="og:image:alt"         content={imageAlt} />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={TWITTER_SITE} />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />
      <meta name="twitter:image:alt"   content={imageAlt} />

      {/* ── Geo Tags ── */}
      <meta name="geo.region"    content="IN-TN" />
      <meta name="geo.placename" content="Chennai" />
      <meta name="geo.position"  content="13.038246;80.219815" />
      <meta name="ICBM"          content="13.038246,80.219815" />

      {/* ── JSON-LD (skipped on admin/noindex pages) ── */}
      {!noIndex && (
        <script type="application/ld+json">
          {JSON.stringify(buildStructuredData())}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;