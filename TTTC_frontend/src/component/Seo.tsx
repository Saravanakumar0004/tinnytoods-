import { useEffect } from "react";

type SEOProps = {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  robots?: string;
};

const DEFAULT_SITE_NAME = "Tiny Todds Therapy Care";
const DEFAULT_IMAGE = "/public/favicon.ico";

const SEO = ({
  title,
  description,
  keywords = "autism therapy Chennai, speech therapy Chennai, occupational therapy Chennai, child therapy center Chennai, autism treatment Chennai",
  canonical,
  image = DEFAULT_IMAGE,
  robots = "index, follow",
}: SEOProps) => {
  useEffect(() => {
    document.title = title;

    const ensureMeta = (
      selector: string,
      createAttrs: Record<string, string>
    ): HTMLMetaElement => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;

      if (!el) {
        el = document.createElement("meta");
        Object.entries(createAttrs).forEach(([key, value]) => {
          el.setAttribute(key, value);
        });
        document.head.appendChild(el);
      }

      return el;
    };

    const ensureLink = (
      rel: string
    ): HTMLLinkElement => {
      let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }

      return el;
    };

    ensureMeta('meta[name="description"]', { name: "description" }).setAttribute(
      "content",
      description
    );

    ensureMeta('meta[name="keywords"]', { name: "keywords" }).setAttribute(
      "content",
      keywords
    );

    ensureMeta('meta[name="robots"]', { name: "robots" }).setAttribute(
      "content",
      robots
    );

    ensureMeta('meta[property="og:title"]', { property: "og:title" }).setAttribute(
      "content",
      title
    );

    ensureMeta('meta[property="og:description"]', { property: "og:description" }).setAttribute(
      "content",
      description
    );

    ensureMeta('meta[property="og:type"]', { property: "og:type" }).setAttribute(
      "content",
      "website"
    );

    ensureMeta('meta[property="og:site_name"]', { property: "og:site_name" }).setAttribute(
      "content",
      DEFAULT_SITE_NAME
    );

    ensureMeta('meta[property="og:image"]', { property: "og:image" }).setAttribute(
      "content",
      image
    );

    ensureMeta('meta[name="twitter:card"]', { name: "twitter:card" }).setAttribute(
      "content",
      "summary_large_image"
    );

    ensureMeta('meta[name="twitter:title"]', { name: "twitter:title" }).setAttribute(
      "content",
      title
    );

    ensureMeta('meta[name="twitter:description"]', { name: "twitter:description" }).setAttribute(
      "content",
      description
    );

    ensureMeta('meta[name="twitter:image"]', { name: "twitter:image" }).setAttribute(
      "content",
      image
    );

    if (canonical) {
      ensureLink("canonical").setAttribute("href", canonical);
    }
  }, [title, description, keywords, canonical, image, robots]);

  return null;
};

export default SEO;