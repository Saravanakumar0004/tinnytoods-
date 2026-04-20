import { motion } from "framer-motion";
import { MapPin, Phone, ArrowRight, Sparkles, Building2, Zap, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { getbranches, type BranchDto } from "@/services/modules/branches.api";
import { useHome } from "@/hooks/useHome";
import { useAbout } from "@/hooks/usePhone";
import { formatPhoneForDisplay, formatPhoneForTel } from "@/utils/phone";
import { useCallCount } from "@/services/modules/callcount";


interface Branch {
  name: string;
  phone: string;
  area: string;
  mapUrl: string;
  lat: number;
  lng: number;
  distance?: number;
}

const Branches = () => {
  const [showAll, setShowAll] = useState(false);
  const [nearestBranch, setNearestBranch] = useState<Branch | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const {about} = useAbout();
  const fallbackphone = "9941350646";
  const phoneRaw = about?.phone_no_one ?? fallbackphone;
  const phoneHref = formatPhoneForTel(phoneRaw) ??  `tel:+91${fallbackphone}`;
  const phoneText = formatPhoneForDisplay(phoneRaw) ?? `+91 ${fallbackphone}`
  const phoneRaw2 = about?.phone_no_two ?? fallbackphone;
  const phoneHref2 = formatPhoneForTel(phoneRaw2) ??  `tel:+91${fallbackphone}`;
  const phoneText2 = formatPhoneForDisplay(phoneRaw2) ?? `+91 ${fallbackphone}`

  const toNumber = (v: unknown): number | null => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const makeMapsUrl = (mapUrl: string | null, lat: number | null, lng: number | null, label?: string) => {
    if (mapUrl && mapUrl.trim()) return mapUrl;

    // fallback if backend didn't give mapurl
    if (lat != null && lng != null) {
      const q = label ? encodeURIComponent(label) : `${lat},${lng}`;
      return `https://www.google.com/maps/search/?api=1&query=${q}`;
    }

    // last fallback
    return "https://www.google.com/maps";
  };

  const normalizePhoneForTel = (phone: string) => phone.replace(/[^\d]/g, "");



  useEffect(() => {
      let mounted = true;

      (async () => {
        try {
          setLoading(true);
          setApiError(null);

          const res = await getbranches();

          const mapped: Branch[] = res
            .map((b) => {
              const lat = toNumber(b.latitude);
              const lng = toNumber(b.longitude);

              return {
                name: b.branch_name,
                phone: b.phone,
                area: b.location,
                mapUrl: makeMapsUrl(b.mapurl, lat, lng, `${b.branch_name} ${b.location}`),
                lat: lat ?? 0, // temporary default
                lng: lng ?? 0,
              };
            })
            // OPTIONAL: if you want to remove branches with invalid lat/lng from nearest calculation
            // keep them still for listing, but nearest calc should ignore
            .filter((b) => b.name && b.phone);

          if (mounted) setBranches(mapped);
        } catch (e: any) {
          if (mounted) setApiError(e?.message ?? "Failed to load branches");
        } finally {
          if (mounted) setLoading(false);
        }
      })();

      return () => {
        mounted = false;
      };
    }, []);
 


  const VISIBLE_COUNT = 7;

  const visibleBranches = useMemo(() => {
    return showAll ? branches : branches.slice(0, VISIBLE_COUNT);
  }, [showAll, branches]);

  const hasMore = branches.length > VISIBLE_COUNT;


  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };


  const findNearestBranch = () => {

    setIsLocating(true);
    setLocationError(null);
    setNearestBranch(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        const validBranches = branches.filter(
          (b) => Number.isFinite(b.lat) && Number.isFinite(b.lng) && !(b.lat === 0 && b.lng === 0)
        );
        
        if (!validBranches.length) {
          setLocationError("Branch locations are missing (lat/lng). Please update branch coordinates.");
          setIsLocating(false);
          return;
        }
        
        const branchesWithDistance = validBranches.map((branch) => ({
          ...branch,
          distance: calculateDistance(userLat, userLng, branch.lat, branch.lng),
        }));
        
        
        const nearest = branchesWithDistance.reduce((prev, current) => 
          (prev.distance! < current.distance!) ? prev : current
      );
      
      setNearestBranch(nearest);
      setIsLocating(false);
    },
    (error) => {
      setIsLocating(false);
      switch(error.code) {
        case error.PERMISSION_DENIED:
            setLocationError("Location permission denied. Please enable location access.");
            break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information unavailable.");
              break;
              case error.TIMEOUT:
                setLocationError("Location request timed out.");
                break;
                default:
                  setLocationError("An unknown error occurred.");
                }
              },
              {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
              }
            );
          };
          const { stats, loading:homeLoding } = useHome();
  

        const { increaseCallCount } = useCallCount();
      
        const handleCallClick = async (e) => {
          e.preventDefault(); 
      
          try {
            await increaseCallCount(); 
          } catch (err) {
            console.error("Error increasing call count:", err);
          }
          window.location.href = phoneHref;
        };

  return (
    <section id="branches" className="py-10 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-sky/20 to-lavender/20 rounded-full blur-3xl"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-foreground px-5 py-2.5 rounded-full text-sm font-medium mb-6 shadow-glass"
          >
            <Building2 className="w-4 h-4 text-primary" />
            <span>{loading ? "Loading..." : `${stats?.branches ?? 0} Branches`}</span>
            <Zap className="w-4 h-4 text-accent" />
          </motion.div>
          
          <h2 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Find Your Nearest{" "}
            <span className="text-gradient">Branch</span>
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg mb-8">
            World-class autism therapy services at a location near you
          </p>

          {/* Find Nearest Branch Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={findNearestBranch}
              disabled={isLocating}
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 shadow-lg"
            >
              {isLocating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Locating...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Find Nearest Branch
                </>
              )}
            </Button>
          </motion.div>

          {loading && (
            <div className="mt-6 text-sm text-muted-foreground">
              Loading branches...
            </div>
          )}

          {apiError && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm max-w-md mx-auto">
              {apiError}
            </div>
          )}


          {/* Error Message */}
          {locationError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm max-w-md mx-auto"
            >
              {locationError}
            </motion.div>
          )}
        </motion.div>

        {/* Nearest Branch Card */}
        {nearestBranch && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mb-12 max-w-2xl mx-auto"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 backdrop-blur-xl border-2 border-primary/30" />
              
              <motion.div
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 opacity-50"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                  backgroundSize: "200% 100%",
                }}
              />
              
              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
                    <span className="text-xs font-bold text-primary">NEAREST BRANCH</span>
                  </div>
                  <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <span className="text-xs font-medium text-foreground">
                      {nearestBranch.distance!.toFixed(1)} km away
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
                      {nearestBranch.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{nearestBranch.area}</span>
                    </div>
                    
                    <a 
                      href={`tel:+91${nearestBranch.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-foreground hover:text-primary transition-colors w-fit"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="font-semibold">+91 {nearestBranch.phone}</span>
                    </a>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      asChild
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0"
                    >
                      <a href={nearestBranch.mapUrl} target="_blank" rel="noopener noreferrer">
                        <MapPin className="w-4 h-4 mr-2" />
                        Open in Maps
                      </a>
                    </Button>
                    
                    <Button
                      asChild
                      variant="outline"
                      className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-foreground"
                    >
                      <a href={`tel:+91${nearestBranch.phone.replace(/\s/g, '')}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </a>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
            </div>
          </motion.div>
        )}

        <motion.div
          layout
          layoutRoot
          initial={false}
          whileInView="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.05 }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {visibleBranches.map((branch) => (
            <motion.div
              key={branch.name}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <div className="relative h-full rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-white/[0.08] backdrop-blur-xl border border-white/20 rounded-2xl" />
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                />
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <motion.a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10"
                    >
                      <MapPin className="w-5 h-5 text-primary" />
                    </motion.a>
                    <span className="text-xs font-medium text-muted-foreground bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                      {branch.area}
                    </span>
                  </div>
                  
                  <h3 className="font-heading font-bold text-lg md:text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                    {branch.name}
                  </h3>
                  
                  <a 
                    href={`tel:+91${normalizePhoneForTel(branch.phone)}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-medium">+91 {branch.phone}</span>
                  </a>
                  
                  <a
                    href={`tel:+91${normalizePhoneForTel(branch.phone)}`}
                    className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">Tap to call</span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </motion.div>
                  </a>
                </div>
                
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
          {!showAll && hasMore && (
          <motion.div
            layout
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group cursor-pointer"
            onClick={() => setShowAll(true)}
          >
            <div className="relative h-full rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border border-white/20 rounded-2xl" />

              <div className="relative p-6 h-full flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 mb-4 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-black" />
                </div>

                <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                  Show More
                </h3>

                <p className="text-sm text-muted-foreground">
                  View {branches.length - VISIBLE_COUNT} more branches
                </p>
              </div>
            </div>
          </motion.div>
        )}

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16"
        >
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-2xl border border-white/20" />
            
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-3xl p-[1px]"
              style={{
                background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--sky)), hsl(var(--primary)))",
                backgroundSize: "300% 100%",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />
            
            <div className="relative z-10 p-8 md:p-12 text-center">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm rounded-2xl border border-white/20 mb-6"
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              
              <h3 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-4">
                Start Your Child's Journey Today
              </h3>
              
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                Contact us for a free consultation and discover how we can help your child thrive.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  asChild 
                  className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 text-foreground shadow-glass"
                >
                  <a href={phoneHref}onClick={handleCallClick}  className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {phoneText}
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  asChild 
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0"
                >
                  <a href={phoneHref2} onClick={handleCallClick}  className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {phoneText2}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Branches;