// src/components/Seo.tsx
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

// ── Constants ────────────────────────────────────────────────────────────────
const SITE_NAME     = "Tiny Todds Therapy Care";
const SITE_URL      = "https://tinytoddstherapycare.com";
const TWITTER_SITE  = "@TinyTodds";
const PHONE         = "+91-9841356600";
const FACEBOOK_URL  = "https://www.facebook.com/tinytoddstherapycare";
const INSTAGRAM_URL = "https://www.instagram.com/tinytoddstherapycare";

const DEFAULT_IMAGE     = `${SITE_URL}/assets/img/og-cover.jpg`;
const DEFAULT_IMAGE_ALT = "Tiny Todds Therapy Care – Autism & Child Therapy Center, Chennai";
const DEFAULT_KEYWORDS  =
  "Speech Therapy Chennai, Occupational Therapy Chennai, Behavioral Therapy Chennai, Special Education Chennai, Parent Training, Early Intervention, Child Therapy West Mambalam, Autism Therapy Chennai, Pediatric Therapy Chennai";

// ── Types ─────────────────────────────────────────────────────────────────────
type SEOProps = {
  title       : string;
  description : string;
  keywords?   : string;
  image?      : string;
  imageAlt?   : string;
  robots?     : string;
  noIndex?    : boolean;
  type?       : "website" | "article";
  // ✅ Preferred prop — auto-builds canonical & og:url
  path?       : string;
  // ✅ Legacy props kept for backward compatibility
  canonical?  : string;
  url?        : string;
};

// ── Structured Data ───────────────────────────────────────────────────────────
// ✅ FIX 1: Moved outside component — pure function, no need to redefine each render
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
  keywords  = DEFAULT_KEYWORDS,
  image     = DEFAULT_IMAGE,
  imageAlt  = DEFAULT_IMAGE_ALT,
  robots,
  noIndex   = false,
  type      = "website",
  path,
  canonical,
  url,
}: SEOProps) => {

  // ✅ FIX 2: Auto-append site name unless already present
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : `${title} | ${SITE_NAME}`;

  // ✅ FIX 3: Memoize resolved URL — only recomputes when path/canonical/url changes
  const resolvedUrl = useMemo(() => {
    if (path) {
      const clean = path === "/" ? "" : path.replace(/\/$/, "");
      return `${SITE_URL}${clean}`;
    }
    return canonical ?? url ?? SITE_URL;
  }, [path, canonical, url]);

  // ✅ FIX 4: noIndex takes priority; fallback to explicit robots or default
  const robotsContent = noIndex
    ? "noindex, nofollow"
    : (robots ?? "index, follow");

  // ✅ FIX 5: Memoize structured data — pure object, no need to rebuild every render
  const structuredData = useMemo(() => buildStructuredData(), []);

  // ✅ FIX 6: Detect image type dynamically instead of hardcoding "image/jpeg"
  const ogImageType = useMemo(() => {
    if (image.endsWith(".png"))  return "image/png";
    if (image.endsWith(".webp")) return "image/webp";
    if (image.endsWith(".gif"))  return "image/gif";
    return "image/jpeg"; // default fallback
  }, [image]);

  return (
    <Helmet>
      {/* ── Basic ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords"    content={keywords} />
      <meta name="robots"      content={robotsContent} />
      <meta name="author"      content={SITE_NAME} />
      <meta name="theme-color" content="#ffffff" />

      {/* ── Canonical (skipped for noindex pages — no point indexing canonical) ── */}
      {/* ✅ FIX 7: Don't emit canonical on noindex pages to avoid mixed signals */}
      {!noIndex && <link rel="canonical" href={resolvedUrl} />}

      {/* ── Open Graph ── */}
      <meta property="og:type"             content={type} />
      <meta property="og:site_name"        content={SITE_NAME} />
      <meta property="og:title"            content={fullTitle} />
      <meta property="og:description"      content={description} />
      <meta property="og:url"              content={resolvedUrl} />
      <meta property="og:locale"           content="en_IN" />
      <meta property="og:image"            content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:type"       content={ogImageType} /> {/* ✅ FIX 6 */}
      <meta property="og:image:width"      content="1200" />
      <meta property="og:image:height"     content="630" />
      <meta property="og:image:alt"        content={imageAlt} />

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

      {/* ── JSON-LD: skipped on noindex pages (admin, private routes) ── */}
      {/* ✅ FIX 8: Structured data must never appear on noindex pages */}
      {!noIndex && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;