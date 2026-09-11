import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  User,
  Loader2,
  CheckCircle2,
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
import { Label } from "@/components/ui/label";
//import authIllustration from "@/assets/hirehub-auth-illustration.png";
import AuthBackground from "./AuthBackground";

export function SignupForm({ className, ...props }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [roleName, setRoleName] = useState("USER");
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    setMessage("");
  };

  const getPasswordStrength = () => {
    const password = formData.password;

    if (!password) {
      return {
        label: "",
        width: "w-0",
      };
    }

    if (password.length < 6) {
      return {
        label: "Weak password",
        width: "w-1/4",
      };
    }

    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return {
        label: "Strong password",
        width: "w-full",
      };
    }

    if (password.length >= 8) {
      return {
        label: "Good password",
        width: "w-2/3",
      };
    }

    return {
      label: "Weak password",
      width: "w-1/3",
    };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setMessage("Please accept the Terms & Conditions.");
      return;
    }

    try {
      setLoading(true);

      console.log("REGISTER DATA:", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roleName,
      });

      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          roleName,
        }),
      });

      const data = await response.json();

      console.log("Register response:", data);

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      /* add in toast for user and recruiter sucess sign up */
      if (roleName === "RECRUITER") {
        setRegistrationSubmitted(true);
        toast.success(
          data.message /*||  "Recruiter registration submitted!" */,
        );
        return;
      }

      toast.success(data.message /* || "Registration successful!" */);
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);

      setMessage("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //add bolck of msg for recruiter registertion is sccuess and wait admin
  if (registrationSubmitted) {
    return (
      <AuthBackground>
        <Card className="w-full max-w-md border-border bg-background/95 shadow-2xl backdrop-blur-xl">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Registration Submitted
                </h2>

                <p className="text-sm text-muted-foreground">
                  Your recruiter profile has been created successfully.
                </p>

                <p className="text-sm text-muted-foreground">
                  An administrator needs to approve your recruiter account
                  before you can log in.
                </p>
              </div>

              <Button
                type="button"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </AuthBackground>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-screen w-full items-center justify-center bg-muted/40 p-4 md:p-8",
        className,
      )}
      {...props}
    >
      <AuthBackground>
        <Card className="w-full max-w-md overflow-hidden border-white/10 bg-background/95 shadow-2xl backdrop-blur-xl">
          <CardContent
            className="p-0" /* "grid min-h-[650px] p-0 md:grid-cols-2" */
          >
            {/* ================= FORM ================= */}

            {/* <div className="flex items-center justify-center p-6 sm:p-10"> */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <FieldGroup>
                {/* Logo */}

                <div className="mb-3 flex items-center gap-2">
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

                <div className="mb-2 flex flex-col gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Create your account
                  </h1>

                  <p className="text-sm text-muted-foreground">
                    Join HireHub and start your journey.
                  </p>
                </div>

                {/* Error Message */}

                {message && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {message}
                  </div>
                )}

                {/* new option user or recruiter */}
                <div className="space-y-3">
                  <Label>I am registering as</Label>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRoleName("USER")}
                      className={`rounded-lg border p-4 text-left transition ${
                        roleName === "USER"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <p className="font-medium text-card-foreground">
                        Job Seeker
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Find jobs and apply to opportunities
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRoleName("RECRUITER")}
                      className={`rounded-lg border p-4 text-left transition ${
                        roleName === "RECRUITER"
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <p className="font-medium text-card-foreground">
                        Recruiter
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Post jobs and manage applicants
                      </p>
                    </button>
                  </div>
                </div>

                {/* Full Name */}

                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10"
                      autoComplete="name"
                      disabled={loading}
                    />
                  </div>
                </Field>

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

                  <FieldDescription>
                    We'll use this email for your account.
                  </FieldDescription>
                </Field>

                {/* Password */}

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      autoComplete="new-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength */}

                  {formData.password && (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${passwordStrength.width} bg-primary`}
                        />
                      </div>

                      <p className="text-xs text-muted-foreground">
                        {passwordStrength.label}
                      </p>
                    </div>
                  )}

                  <FieldDescription>
                    Use at least 8 characters.
                  </FieldDescription>
                </Field>

                {/* Confirm Password */}

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="pl-10 pr-10"
                      autoComplete="new-password"
                      disabled={loading}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((current) => !current)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Passwords match
                      </div>
                    )}
                </Field>

                {/* Terms */}

                <div className="flex items-start gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    disabled={loading}
                    className="mt-0.5 h-4 w-4 rounded border"
                  />

                  <label
                    htmlFor="terms"
                    className="text-xs leading-5 text-muted-foreground"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      className="font-medium text-primary hover:underline"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and Privacy Policy.
                  </label>
                </div>

                {/* Submit */}

                <Field>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Field>

                {/* Login */}

                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    disabled={loading}
                  >
                    Sign in
                  </button>
                </FieldDescription>
              </FieldGroup>
            </form>
            {/* </div> */}

            {/* ================= IMAGE ================= */}

            {/* <div className="relative hidden overflow-hidden md:block">
            <img
              src={authIllustration}
              alt="Join HireHub"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Overlay *

            <div className="absolute inset-0 bg-black/50" />

            {/* Content *

            <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
              <div className="max-w-md">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <h2 className="text-3xl font-bold leading-tight">
                  Your next opportunity starts here.
                </h2>

                <p className="mt-3 text-sm leading-6 text-white/80">
                  Create your HireHub account and discover
                  opportunities that match your skills and career
                  goals.
                </p>

                <div className="mt-6 space-y-3 text-sm text-white/80">

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Discover relevant job opportunities
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Manage your applications
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Build your professional profile
                  </div>

                </div>

              </div>
            </div>
          </div> */}
          </CardContent>
        </Card>
      </AuthBackground>
    </div>
  );
}
