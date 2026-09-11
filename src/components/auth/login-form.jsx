import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

//import authIllustration from "@/assets/hirehub-auth-illustration.png";
import AuthBackground from "./AuthBackground";

export function LoginForm({ className, ...props }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((current) => ({
      ...current,
      [id]: value,
    }));

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!formData.email || !formData.password) {
      setMessage("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        setMessage(data.message || "Invalid email or password.");
        return;
      }
      //token genrating
      localStorage.setItem("token", data.token);

      // Store logged-in user
      localStorage.setItem("user", JSON.stringify(data.data));

      // Optional remember-me flag
      localStorage.setItem("rememberMe", JSON.stringify(rememberMe));

      toast.success(data.message /* || "Login successful!" */);

      switch (data.data.roleName) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
          
          case "RECRUITER":
          navigate("/recruiter/dashboard");
          break;

        case "USER":
          navigate("/jobs");
          break;

        default:
          navigate("/jobs");
      }
    } catch (error) {
      console.error("Error during login:", error);

      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen w-full items-center justify-center bg-muted/40 p-4 md:p-8 ",
        className,
      )}
      {...props}
    >
      <AuthBackground>
        <Card className="w-full max-w-md overflow-hidden border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-0">
            {/* ================= FORM ================= */}

            {/*<div className="flex items-center justify-center p-6 sm:p-10">*/}
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <FieldGroup>
                {/* Logo */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">HireHub</h2>

                    <p className="text-xs text-muted-foreground">
                      Job & Recruitment Platform
                    </p>
                  </div>
                </div>

                {/* Heading */}
                <div className="mb-4 flex flex-col gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back 👋
                  </h1>

                  <p className="text-sm text-muted-foreground">
                    Sign in to continue to your HireHub account.
                  </p>
                </div>

                {/* Error */}
                {message && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {message}
                  </div>
                )}

                {/* Email */}
                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      autoComplete="email"
                      disabled={loading}
                    />
                  </div>
                </Field>

                {/* Password */}
                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="password">Password</FieldLabel>

                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() =>
                        toast("Forgot password will be added later.")
                      }
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pr-10 pl-10"
                      autoComplete="current-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                    className="h-4 w-4 rounded border"
                  />

                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me
                  </label>
                </div>

                {/* Login Button */}
                <Field>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Field>

                {/* Register */}
                <FieldDescription className="text-center">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    disabled={loading}
                  >
                    Create an account
                  </button>
                </FieldDescription>
              </FieldGroup>
            </form>
            {/* </div> */}

            {/* ================= IMAGE ================= 

          <div className="relative hidden overflow-hidden md:block">
            <img
              //src={authIllustration}
              alt="Secure HireHub login"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Overlay 
            <div className="absolute inset-0 bg-black/50" />*/}

            {/* Content 
            <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
              <div className="max-w-md">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <h2 className="text-3xl font-bold leading-tight">
                  Connect talent with opportunity.
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/80">
                  Find the right job, discover talented candidates,
                  and manage your recruitment journey with HireHub.
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm text-white/80">
                  <ShieldCheck className="h-4 w-4" />
                  Secure & trusted recruitment platform
                </div>

              </div>
            </div>
          </div>*/}
          </CardContent>
        </Card>
      </AuthBackground>
    </div>
  );
}
