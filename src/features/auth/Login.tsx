import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/authStore";
import type { LoginFormData } from "@/features/authentication/types/authentication.types";
import { SystemRole, type User } from "@/shared/types/common.types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Eye,
  EyeOff,
  Loader2,
  Users,
  BookOpen,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";
import { z } from "zod";

/**
 * Login Form Validation Schema
 * 
 * Supports three types of user identification formats:
 * 1. Email: user@example.com
 * 2. Mobile: +1234567890 or 1234567890
 * 3. Employee ID: EMP001 or 12345
 * 
 * The backend API will automatically detect the format and authenticate accordingly.
 */
const loginSchema = z.object({
  userName: z.string().min(1, "Username, email, mobile, or employee ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  subDomainName: z.string().optional(),
});

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get subdomain from URL or use default
  let subDomainName = window.location.host;
  if (subDomainName.includes("localhost") || subDomainName.includes("127.0.0.1")) {
    subDomainName = "skillsalpha.mobiusservices.co.in"; // Default subdomain for local dev
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    // Keep minimal validation but allow any non-empty credentials for demo
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "demo.user",
      password: "password123",
      subDomainName: subDomainName,
    },
  });

  // Local demo login: accept any username/password, create a sample user, and set auth store
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      // Simulate a small delay to show loading state
      await new Promise((res) => setTimeout(res, 600));

      const demoSystemRole =
        data.userName?.toLowerCase() === "sakshi"
          ? SystemRole.SUPER_ADMIN
          : data.userName?.toLowerCase() === "tenantadmin"
          ? SystemRole.TENANT_ADMIN
          : SystemRole.USER;

      const sampleUser: User = {
        id: 1,
        employeeId: "EMP-DEMO-001",
        name: "Demo User",
        email: data.userName || "demo.user@example.com",
        mobile: null,
        businessUnit: "Demo Business",
        designation: "Demo Engineer",
        orgRole: "Demo Org",
        systemRole: demoSystemRole,
        status: "active",
        photoUrl: undefined,
      };

      // Use a static demo token
      setAuth(sampleUser, "demo-token");

      toast({
        title: "Demo Login",
        description: `Signed in as ${sampleUser.name}`,
      });

    navigate("/demo");
    } catch (err: any) {
      toast({ title: "Login Failed", description: err?.message || "Error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Users,
      label: "Explore",
      color: "#7c3aed",
    },
    {
      icon: BookOpen,
      label: "Discover",
      color: "#10b981",
    },
    {
      icon: Target,
      label: "Personalize",
      color: "#06b6d4",
    },
    {
      icon: Award,
      label: "Experience",
      color: "#f97316",
    },
    {
      icon: TrendingUp,
      label: "Succeed",
      color: "#84cc16",
    },
  ];


  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Vibrant Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #a855f7 25%, #6366f1 50%, #8b5cf6 75%, #7c3aed 100%)",
        }}
      >
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute top-1/2 right-[10%] w-[150px] h-[150px] rounded-full bg-pink-400/20 blur-2xl"></div>

        <div className="max-w-lg mx-auto relative z-10">
          <p className="text-lg font-medium text-white/90 mb-2 tracking-wide">
            AI-Powered Skilling
          </p>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            For a Future-Ready You
          </h1>
          <p className="text-xl text-white/80 mb-10">
            Craft your Future Beyond Boundaries with AI
          </p>

          <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
            <div className="flex justify-center items-start gap-6 mb-2">
              {features.slice(0, 3).map((feature, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                  style={{ minWidth: "90px" }}
                >
                  {index < 2 && (
                    <div className="absolute right-[-20px] top-10 flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                    </div>
                  )}
                  <div
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-lg relative"
                    style={{
                      border: `3px solid ${feature.color}`,
                      background: "rgba(255,255,255,0.95)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                      style={{
                        background: feature.color,
                        borderRadius: "14px",
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                      style={{ background: feature.color }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <p className="text-xs text-center text-white/90 mt-4 font-medium">
                    {feature.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-start gap-6 mt-4">
              {features.slice(3, 5).map((feature, index) => (
                <div
                  key={index + 3}
                  className="relative flex flex-col items-center"
                  style={{ minWidth: "90px" }}
                >
                  {index === 0 && (
                    <div className="absolute right-[-20px] top-10 flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/50"></span>
                    </div>
                  )}
                  <div
                    className="w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-lg relative"
                    style={{
                      border: `3px solid ${feature.color}`,
                      background: "rgba(255,255,255,0.95)",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                      style={{
                        background: feature.color,
                        borderRadius: "14px",
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                      style={{ background: feature.color }}
                    >
                      {String(index + 4).padStart(2, "0")}
                    </div>
                  </div>
                  <p className="text-xs text-center text-white/90 mt-4 font-medium">
                    {feature.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/50 backdrop-blur-sm">
            <div className="mb-8 flex justify-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                SkillsAlpha
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">Sign In</h2>
              <p className="text-muted-foreground text-sm">
                Continue where you left off
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Controller
                  name="userName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="username"
                      type="text"
                      placeholder="Email, Mobile, or Employee ID"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      className="h-12 bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  )}
                />
                {errors.userName && (
                  <small className="text-destructive block">
                    {errors.userName.message}
                  </small>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                        className="h-12 pr-10 bg-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <EyeOff className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <small className="text-destructive block">
                    {errors.password.message}
                  </small>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base uppercase tracking-wide"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "LOG IN"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              Copyright SkillsAlpha © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
