import { motion, cubicBezier } from "framer-motion";
import { Sparkles, Globe, Code2, Smartphone, TrendingUp, ArrowRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const CATALOG = [
  {
    id: "website-design",
    title: "Website Design",
    desc: "Modern websites that build trust and drive enquiries",
    Icon: Globe,
    image: "/images/website-design.PNG",
  },
  {
    id: "web-apps",
    title: "Web Applications",
    desc: "Admin panels & portals to run your business smarter",
    Icon: Code2,
    image: "/images/web-applications.jpg",
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    desc: "Android / iOS apps to reach more customers",
    Icon: Smartphone,
    image: "/images/social.jpg",
  },
  {
    id: "sales-growth",
    title: "Sales Growth",
    desc: "SEO + performance to grow traffic and increase sales",
    Icon: TrendingUp,
    image: "/images/sales-and-growth.jpg",
  },
];

const INTERVAL_MS = 3600;
const ease = cubicBezier(0.16, 1, 0.3, 1);

const Advertisement = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(
    () => setIndex((p) => (p + 1) % CATALOG.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(advance, INTERVAL_MS);
    return () => clearInterval(id);
  }, [advance, paused]);

  const getRelPos = (i: number) => {
    const total = CATALOG.length;
    let rel = i - index;
    if (rel < -Math.floor(total / 2)) rel += total;
    if (rel > Math.floor(total / 2)) rel -= total;
    return rel;
  };

  return (
    <section
      className="relative z-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Outer shell: bg image + dark overlay */}
      <div
        onClick={() => window.open("https://ttss-frontend.vercel.app/", "_blank")}
        className="relative rounded-3xl overflow-hidden cursor-pointer"
        style={{
          backgroundImage: "url('/images/5076404.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay keeps text legible over any bg image */}
        <div className="absolute inset-0 bg-[rgba(8,6,30,0.72)]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 p-6 sm:p-8 md:p-10">

          {/* LEFT */}
          <div className="text-center lg:text-left lg:max-w-lg">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/25 rounded-full px-3.5 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-yellow-400">
                Grow your business
              </span>
            </div>

            <h2 className="text-xl sm:text-[22px] font-bold leading-snug text-white mb-5">
              We build powerful,{" "}
              <span className="text-yellow-400">scalable software</span>{" "}
              solutions that drive real{" "}
              <span className="text-yellow-400">business growth</span>.
            </h2>

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open("https://ttss-frontend.vercel.app/", "_blank");
              }}
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300
                         active:scale-95 text-[#08061e] font-bold text-sm rounded-full
                         px-5 py-2.5 transition-all duration-200"
            >
              Explore our work
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* RIGHT: 3-D card stack */}
          <div className="w-full lg:w-[480px] flex-shrink-0">
            {/* perspective on parent gives rotateY real depth */}
            <div
              className="relative h-[200px] sm:h-[210px] flex items-center justify-center"
              style={{ perspective: "900px" }}
            >
              {CATALOG.map((card, i) => {
                const rel = getRelPos(i);

                let scale = 0.75, x = 0, z = 0, opacity = 0, zIndex = 0, rotateY = 0;

                if (rel === 0) {
                  scale = 1;    x = 0;    z = 0;   opacity = 1;    zIndex = 10; rotateY = 0;
                } else if (rel === 1) {
                  scale = 0.87; x = 75;   z = -50; opacity = 0.62; zIndex = 9;  rotateY = -12;
                } else if (rel === -1) {
                  scale = 0.87; x = -75;  z = -50; opacity = 0.62; zIndex = 9;  rotateY = 12;
                } else if (Math.abs(rel) === 2) {
                  scale = 0.75;
                  x = rel > 0 ? 140 : -140;
                  z = -90;
                  opacity = 0.2;
                  zIndex = 8;
                  rotateY = rel > 0 ? -20 : 20;
                }

                return (
                  <motion.div
                    key={card.id}
                    animate={{ scale, x, z, opacity, zIndex, rotateY }}
                    transition={{ duration: 0.6, ease }}
                    onClick={(e) => {
                      if (rel === 1) {
                        e.stopPropagation();
                        setIndex((index + 1) % CATALOG.length);
                      } else if (rel === -1) {
                        e.stopPropagation();
                        setIndex((index - 1 + CATALOG.length) % CATALOG.length);
                      }
                    }}
                    className="absolute w-[255px] h-[195px] sm:h-[208px] rounded-2xl overflow-hidden
                               border border-white/20 shadow-2xl"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Card image */}
                    <img
                      src={card.image}
                      alt={card.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    {/* Gradient scrim over the image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    {/* Label */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-[9px] bg-white/10 border border-white/15
                                        flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                          <card.Icon className="w-[15px] h-[15px] text-yellow-400" />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-white leading-tight">
                            {card.title}
                          </div>
                          <div className="text-[11px] text-white/65 mt-0.5 leading-snug">
                            {card.desc}
                          </div>
                        </div>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-2.5 mb-1.5" />
                      <div className="text-right text-[10px] font-semibold tracking-widest text-white/40 uppercase">
                        Tiny Todds
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-3">
              {CATALOG.map((card, i) => (
                <button
                  key={card.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  className={`h-[5px] rounded-full transition-all duration-300
                    ${i === index
                      ? "w-[18px] bg-yellow-400"
                      : "w-[6px] bg-white/25 hover:bg-white/40"
                    }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Advertisement;