import { useEffect, useState } from "react";

import {
  ArrowLeft,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function EditProfile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: user?.data?.name || "",
    email: user?.data?.email || "",
    phone: "+91 98765 43210",
    location: "Gujarat, India",
    title: "Full Stack Developer",
    about:
      "Computer Science graduate interested in building modern web applications using React, Node.js, Express and database technologies.",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (storedUser?.data) {
      setFormData((previous) => ({
        ...previous,
        name: storedUser.data.name || "",
        email: storedUser.data.email || "",
      }));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.phone.trim() && formData.phone.length < 10) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Professional title is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    // Mock save for now.
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    const currentUser = JSON.parse(
      localStorage.getItem("user")
    );

    const updatedUser = {
      ...currentUser,
      data: {
        ...currentUser?.data,
        name: formData.name,
        email: formData.email,
      },
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setSaving(false);

    navigate("/profile");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent"
        onClick={() => navigate("/profile")}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Profile
      </Button>

      {/* Page intro */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Edit Profile
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Update your personal and professional information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              Personal Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name
              </Label>

              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="pl-9"
                  aria-invalid={!!errors.name}
                />
              </div>

              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="pl-9"
                  aria-invalid={!!errors.email}
                />
              </div>

              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone + Location */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone
                </Label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="pl-9"
                    aria-invalid={!!errors.phone}
                  />
                </div>

                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location
                </Label>

                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Gujarat, India"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              Professional Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Professional Title
              </Label>

              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                aria-invalid={!!errors.title}
              />

              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                This describes your primary professional role.
              </p>
            </div>

            {/* About */}
            <div className="space-y-2">
              <Label htmlFor="about">
                About
              </Label>

              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell recruiters about yourself..."
                className="min-h-[150px] resize-none"
                maxLength={500}
              />

              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {formData.about.length}/500
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/profile")}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;