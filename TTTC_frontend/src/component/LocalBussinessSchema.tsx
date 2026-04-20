import { useEffect } from "react";

const BASE_URL = import.meta.env.BASE_URL;

const LocalBusinessSchema = () => {
  useEffect(() => {
    const existing = document.getElementById("local-business-schema");
    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "local-business-schema";

    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: "Tiny Todds Therapy Care",
      url: `${BASE_URL}`,
      image: `${BASE_URL}/og-image.jpg`,
      telephone: "+91-9941350646",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Chennai",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN"
      },
      areaServed: "Chennai",
      sameAs: [
        "https://www.youtube.com/channel/UCap6cC3CV2ZcLUBeGzo6GQw"
      ]
    });

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
};

export default LocalBusinessSchema;