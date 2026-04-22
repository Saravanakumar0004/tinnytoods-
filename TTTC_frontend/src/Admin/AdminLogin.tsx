import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock } from "lucide-react";
import { tokenStorage } from "@/lib/storage";
import Logo from "@/assets/admin.jpg";
import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";
import { routes } from "@/routes";

// ── Constants ─────────────────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // ✅ DIRECT SEO RESTRICTION — Does NOT depend on any SEO component or HelmetProvider
  // Directly manipulates the DOM meta tag to guarantee noindex on this page
  useEffect(() => {
    // Set page title
    document.title = "Admin Login | Tiny Todds Therapy Care";

    // Set robots to noindex, nofollow
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const previousRobotsContent = metaRobots?.getAttribute("content") ?? "index, follow";

    if (metaRobots) {
      // Update existing tag
      metaRobots.setAttribute("content", "noindex, nofollow");
    } else {
      // Create new tag if not present
      metaRobots = document.createElement("meta");
      metaRobots.setAttribute("name", "robots");
      metaRobots.setAttribute("content", "noindex, nofollow");
      document.head.appendChild(metaRobots);
    }

    // ✅ Cleanup: Restore original robots value when leaving this page
    return () => {
      const tag = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (tag) {
        tag.setAttribute("content", previousRobotsContent);
      }
      document.title = "Tiny Todds Therapy Care | Autism & Child Therapy Center in Chennai";
    };
  }, []);

  const validate = useCallback((): string | null => {
    if (!email.trim() || !password.trim()) return "Email and password are required";
    if (!EMAIL_REGEX.test(email))          return "Please enter a valid email address";
    return null;
  }, [email, password]);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);
      setError("");
      const res = await api.post(endpoints.admin.login, {
        email:    email.trim(),
        password: password.trim(),
      });
      const { access, refresh } = res.data;
      if (access) {
        tokenStorage.setTokens(access, refresh);
        navigate(routes.adminPanel, { replace: true });
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? (err as any)?.response?.data?.detail ?? err.message
          : "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [email, password, validate, navigate]);

  return (
    <div className="relative min-h-[100dvh] flex items-start sm:items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden pt-[40px] px-4 py-6 sm:py-0">

      {/* Animated Gradient Glow */}
      <div aria-hidden="true" className="absolute w-[500px] h-[500px] bg-orange-400 rounded-full blur-[120px] opacity-20 animate-pulse top-[-100px] left-[-100px] pointer-events-none" />
      <div aria-hidden="true" className="absolute w-[400px] h-[400px] bg-orange-500 rounded-full blur-[120px] opacity-20 animate-pulse bottom-[-100px] right-[-100px] pointer-events-none" />

      {/* Floating Glass Shapes */}
      <div aria-hidden="true" className="absolute top-20 right-20 w-25 h-20 bg-orange-200/40 backdrop-blur-xl rounded-2xl rotate-12 shadow-xl pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-24 left-24 w-24 h-24 bg-orange-300/30 backdrop-blur-xl rounded-full shadow-xl pointer-events-none" />

      <Card className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(255,115,0,0.25)] rounded-3xl border border-orange-100">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src={Logo}
              alt="Tiny Todds Therapy Care Admin"
              className="w-58 h-56 object-contain"
            />
          </div>
          <CardTitle className="text-3xl font-bold text-orange-600">
            Admin Login
          </CardTitle>
          <p className="text-sm text-gray-500">
            Welcome back! Please login to continue.
          </p>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleLogin}
            className="space-y-6"
            noValidate
            aria-label="Admin login form"
          >
            {error && (
              <p
                role="alert"
                aria-live="polite"
                className="bg-red-100 text-red-600 text-sm p-2 rounded-md text-center"
              >
                {error}
              </p>
            )}

            <div className="relative">
              <Mail aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-4 h-4 pointer-events-none" />
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                autoComplete="email"
                disabled={loading}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
                className="pl-10 h-12 rounded-xl border-orange-200 focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-60"
                aria-label="Email address"
                aria-required="true"
              />
            </div>

            <div className="relative">
              <Lock aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-4 h-4 pointer-events-none" />
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                autoComplete="current-password"
                disabled={loading}
                onChange={(e) => { setPassword(e.target.value); if (error) setError(""); }}
                className="pl-10 h-12 rounded-xl border-orange-200 focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-60"
                aria-label="Password"
                aria-required="true"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}