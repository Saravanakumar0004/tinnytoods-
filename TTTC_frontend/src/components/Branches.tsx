import { memo, useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, ArrowRight, Sparkles, Building2, Zap, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getbranches } from "@/services/modules/branches.api";
import { useHome } from "@/hooks/useHome";
import { useAbout } from "@/hooks/usePhone";
import { formatPhoneForDisplay, formatPhoneForTel } from "@/utils/phone";
import { useCallCount } from "@/services/modules/callcount";

interface Branch {
  name: string; phone: string; area: string;
  mapUrl: string; lat: number; lng: number; distance?: number;
}

const VISIBLE_COUNT = 7;

const toNumber = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
};

const makeMapsUrl = (mapUrl: string | null, lat: number | null, lng: number | null, label?: string) => {
  if (mapUrl?.trim()) return mapUrl;
  if (lat != null && lng != null) {
    const q = label ? encodeURIComponent(label) : `${lat},${lng}`;
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }
  return "https://www.google.com/maps";
};

const normalizePhone = (phone: string) => phone.replace(/[^\d]/g, "");

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371, toRad = (d: number) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const Branches = memo(() => {
  const [showAll, setShowAll]           = useState(false);
  const [nearestBranch, setNearest]     = useState<Branch | null>(null);
  const [isLocating, setIsLocating]     = useState(false);
  const [locationError, setLocError]    = useState<string | null>(null);
  const [branches, setBranches]         = useState<Branch[]>([]);
  const [loading, setLoading]           = useState(true);
  const [apiError, setApiError]         = useState<string | null>(null);

  const { about }            = useAbout();
  const { stats }            = useHome();
  const { increaseCallCount } = useCallCount();

  const fallback   = "9941350646";
  const phoneRaw   = about?.phone_no_one ?? fallback;
  const phoneHref  = formatPhoneForTel(phoneRaw)     ?? `tel:+91${fallback}`;
  const phoneText  = formatPhoneForDisplay(phoneRaw) ?? `+91 ${fallback}`;
  const phoneRaw2  = about?.phone_no_two ?? fallback;
  const phoneHref2 = formatPhoneForTel(phoneRaw2)     ?? `tel:+91${fallback}`;
  const phoneText2 = formatPhoneForDisplay(phoneRaw2) ?? `+91 ${fallback}`;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getbranches();
        const mapped: Branch[] = res
          .map((b) => {
            const lat = toNumber(b.latitude), lng = toNumber(b.longitude);
            return {
              name: b.branch_name, phone: b.phone, area: b.location,
              mapUrl: makeMapsUrl(b.mapurl, lat, lng, `${b.branch_name} ${b.location}`),
              lat: lat ?? 0, lng: lng ?? 0,
            };
          })
          .filter((b) => b.name && b.phone);
        if (mounted) setBranches(mapped);
      } catch (e: any) {
        if (mounted) setApiError(e?.message ?? "Failed to load branches");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const visibleBranches = useMemo(
    () => (showAll ? branches : branches.slice(0, VISIBLE_COUNT)),
    [showAll, branches]
  );
  const hasMore = branches.length > VISIBLE_COUNT;

  const findNearestBranch = useCallback(() => {
    setIsLocating(true);
    setLocError(null);
    setNearest(null);
    if (!navigator.geolocation) {
      setLocError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: uLat, longitude: uLng } }) => {
        const valid = branches.filter((b) => Number.isFinite(b.lat) && Number.isFinite(b.lng) && !(b.lat === 0 && b.lng === 0));
        if (!valid.length) { setLocError("Branch coordinates missing."); setIsLocating(false); return; }
        const nearest = valid
          .map((b) => ({ ...b, distance: calculateDistance(uLat, uLng, b.lat, b.lng) }))
          .reduce((a, b) => (a.distance! < b.distance! ? a : b));
        setNearest(nearest);
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        const msgs: Record<number, string> = {
          [err.PERMISSION_DENIED]: "Location permission denied.",
          [err.POSITION_UNAVAILABLE]: "Location unavailable.",
          [err.TIMEOUT]: "Location request timed out.",
        };
        setLocError(msgs[err.code] ?? "Unknown error.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [branches]);

  const handleCallClick = useCallback(async (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    try { await increaseCallCount(); } catch (err) { console.error(err); }
    window.location.href = href;
  }, [increaseCallCount]);

  return (
    <section id="branches" className="py-10 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />

      {/* ✅ CSS-animated blobs */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl pointer-events-none"
        style={{ animation: "blobA 8s ease-in-out infinite" }} aria-hidden="true" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-sky/20 to-lavender/20 rounded-full blur-3xl pointer-events-none"
        style={{ animation: "blobB 10s ease-in-out infinite" }} aria-hidden="true" />
      <style>{`
        @keyframes blobA { 0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.3);opacity:.5} }
        @keyframes blobB { 0%,100%{transform:scale(1.2);opacity:.2}50%{transform:scale(1);opacity:.4} }
        @keyframes floatBadge { 0%,100%{transform:translateY(-5px)}50%{transform:translateY(5px)} }
        @keyframes borderFlow {
          0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}
        }
      `}</style>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-12 md:mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-foreground px-5 py-2.5 rounded-full text-sm font-medium mb-6 shadow-glass">
            <Building2 className="w-4 h-4 text-primary" />
            <span>{loading ? "Loading..." : `${stats?.branches ?? 0} Branches`}</span>
            <Zap className="w-4 h-4 text-accent" />
          </motion.div>

          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Find Your Nearest <span className="text-gradient">Branch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg mb-8">
            World-class autism therapy services at a location near you
          </p>

          <Button onClick={findNearestBranch} disabled={isLocating} size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 shadow-lg">
            {isLocating ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Locating...</>
            ) : (
              <><Navigation className="w-4 h-4 mr-2" />Find Nearest Branch</>
            )}
          </Button>

          {loading && <div className="mt-6 text-sm text-muted-foreground">Loading branches...</div>}
          {apiError && <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm max-w-md mx-auto">{apiError}</div>}
          {locationError && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm max-w-md mx-auto">
              {locationError}
            </motion.div>
          )}
        </motion.div>

        {/* Nearest branch card */}
        {nearestBranch && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }} className="mb-12 max-w-2xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 backdrop-blur-xl border-2 border-primary/30" />
              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
                    <span className="text-xs font-bold text-primary">NEAREST BRANCH</span>
                  </div>
                  <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <span className="text-xs font-medium text-foreground">{nearestBranch.distance!.toFixed(1)} km away</span>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">{nearestBranch.name}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" /><span className="font-medium">{nearestBranch.area}</span>
                    </div>
                    <a href={`tel:+91${nearestBranch.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors w-fit">
                      <Phone className="w-4 h-4" /><span className="font-semibold">+91 {nearestBranch.phone}</span>
                    </a>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0">
                      <a href={nearestBranch.mapUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin className="w-4 h-4 mr-2" />Open in Maps
                      </a>
                    </Button>
                    <Button asChild variant="outline"
                      className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-foreground">
                      <a href={`tel:+91${nearestBranch.phone.replace(/\s/g, "")}`}>
                        <Phone className="w-4 h-4 mr-2" />Call Now
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
            </div>
          </motion.div>
        )}

        {/* Branch grid */}
        <motion.div layout layoutRoot initial={false} whileInView="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {visibleBranches.map((branch) => (
            <motion.div key={branch.name}
              variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}
              whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400 } }}
              whileTap={{ scale: 0.98 }} className="group">
              <div className="relative h-full rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer"
                      className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10 hover:rotate-[360deg] transition-transform duration-500">
                      <MapPin className="w-5 h-5 text-primary" />
                    </a>
                    <span className="text-xs font-medium text-muted-foreground bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                      {branch.area}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg md:text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    {branch.name}
                  </h3>
                  <a href={`tel:+91${normalizePhone(branch.phone)}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Phone className="w-4 h-4" /><span className="font-medium">+91 {branch.phone}</span>
                  </a>
                  <a href={`tel:+91${normalizePhone(branch.phone)}`}
                    className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tap to call</span>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {!showAll && hasMore && (
            <motion.div layout whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="group cursor-pointer" onClick={() => setShowAll(true)}>
              <div className="relative h-full rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border border-white/20 rounded-2xl" />
                <div className="relative p-6 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 mb-4 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">Show More</h3>
                  <p className="text-sm text-muted-foreground">View {branches.length - VISIBLE_COUNT} more branches</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mt-12 md:mt-16">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-2xl border border-white/20" />
            <div className="relative z-10 p-8 md:p-12 text-center">
              <div style={{ animation: "floatBadge 3s ease-in-out infinite" }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm rounded-2xl border border-white/20 mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">Start Your Child's Journey Today</h3>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Contact us for a free consultation and discover how we can help your child thrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-foreground shadow-glass">
                  <a href={phoneHref} onClick={(e) => handleCallClick(e, phoneHref)} className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />{phoneText}
                  </a>
                </Button>
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0">
                  <a href={phoneHref2} onClick={(e) => handleCallClick(e, phoneHref2)} className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />{phoneText2}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

Branches.displayName = "Branches";
export default Branches;