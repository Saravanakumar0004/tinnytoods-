import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { loginUser } from "@/services/modules/Api";
import { tokenStorage } from "@/lib/storage";
import Logo from "@/assets/admin.jpg";
import { api } from "@/services/api/client";
import { endpoints } from "@/services/api/endpoints";
import { routes } from "@/routes";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); 
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await api.post(endpoints.admin.login, {
        email,
        password,
      });
      const { access, refresh } = res.data;
      if (access) {
        tokenStorage.setTokens(access, refresh);
        navigate(routes.adminPanel, { replace: true });
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };
  
return (
  <div className="relative min-h-[100dvh] flex items-start sm:items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 overflow-hidden pt-[40px] px-4 py-6 sm:py-0">
    {/* Animated Gradient Glow */}
    <div className="absolute w-[500px] h-[500px] bg-orange-400 rounded-full blur-[120px] opacity-20 animate-pulse top-[-100px] left-[-100px]"></div>
    <div className="absolute w-[400px] h-[400px] bg-orange-500 rounded-full blur-[120px] opacity-20 animate-pulse bottom-[-100px] right-[-100px]"></div>

    {/* Floating Glass Shapes */}
    <div className="absolute top-20 right-20 w-25 h-20 bg-orange-200/40 backdrop-blur-xl rounded-2xl rotate-12 shadow-xl"></div>
    <div className="absolute bottom-24 left-24 w-24 h-24 bg-orange-300/30 backdrop-blur-xl rounded-full shadow-xl"></div>

    <Card className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(255,115,0,0.25)] rounded-3xl border border-orange-100">

      <CardHeader className="text-center space-y-4">
      <div className="flex justify-center">
        <div className="rounded-2xl ">
          <img
            src={Logo}
            alt="Admin Logo"
            className="w-58 h-56 object-contain"
          />
        </div>
      </div>


        <CardTitle className="text-3xl  font-bold text-orange-600">
          Admin Login
        </CardTitle>

        <p className="text-sm text-gray-500">
          Welcome back! Please login to continue.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-6">

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-2 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-4 h-4" />
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12 rounded-xl border-orange-200 focus-visible:ring-2 focus-visible:ring-orange-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 w-4 h-4" />
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12 rounded-xl border-orange-200 focus-visible:ring-2 focus-visible:ring-orange-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02] transition-all duration-300 shadow-lg"
            disabled={loading}
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