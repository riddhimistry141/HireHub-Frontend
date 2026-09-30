import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Pencil,
  ShieldCheck,
  User,
  BriefcaseBusiness,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function RecruiterProfile() {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    title: "",
    about: "",
    status: "ACTIVE",
  });

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    about: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${BASE_URL}/users/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch profile");
        }

        const user = result.data;

        const profileData = {
          name: user.name || "",
          email: user.auth?.email || user.email || "",
          title: user.title || "",
          about: user.about || "",
          status: user.status || "ACTIVE",
        };

        setProfile(profileData);

        setFormData({
          name: profileData.name,
          title: profileData.title,
          about: profileData.about,
        });
      } catch (error) {
        console.error("Fetch recruiter profile error:", error);
        setError(error.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "R";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          title: formData.title,
          about: formData.about,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      const updatedUser = result.data;

      const updatedProfile = {
        name: updatedUser.name || "",
        email:
          updatedUser.auth?.email || updatedUser.email || profile.email || "",
        title: updatedUser.title || "",
        about: updatedUser.about || "",
        status: updatedUser.status || profile.status || "ACTIVE",
      };

      setProfile(updatedProfile);

      setFormData({
        name: updatedProfile.name,
        title: updatedProfile.title,
        about: updatedProfile.about,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Update recruiter profile error:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      title: profile.title,
      about: profile.about,
    });

    setError("");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Recruiter Profile
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage your professional and account information
            </p>
          </div>
        </div>

        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-background" />

        <CardContent className="-mt-12 pb-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-primary shadow-md">
                <span className="text-2xl font-semibold text-primary-foreground">
                  {initials}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">
                    {profile.name || "Recruiter"}
                  </h2>

                  <Badge>
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    RECRUITER
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {profile.title || "Recruiter"}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {profile.email || "No email"}
                  </span>
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className="w-fit border-green-500/30 text-green-600"
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              {profile.status === "ACTIVE" ? "Active Account" : profile.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {isEditing ? (
        /* Edit Profile */
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>

            <CardDescription>
              Update your recruiter information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  disabled
                />
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>

                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Talent Acquisition Specialist"
                />
              </div>
            </div>

            {/* About */}
            <div className="space-y-2">
              <Label htmlFor="about">About</Label>

              <Textarea
                id="about"
                name="about"
                rows={5}
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell candidates about yourself..."
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseBusiness className="h-5 w-5 text-primary" />
                Professional Information
              </CardTitle>

              <CardDescription>
                Your professional recruiter information.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Job Title */}
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Job Title
                </p>

                <p className="mt-1 font-medium">
                  {profile.title || "Not provided"}
                </p>
              </div>

              {/* About */}
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  About
                </p>

                <p className="mt-1 leading-7 text-muted-foreground">
                  {profile.about || "No information provided."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Account Information
              </CardTitle>

              <CardDescription>Your HireHub account details.</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                {/* Email */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Email
                  </p>

                  <p className="mt-1 font-medium">
                    {profile.email || "Not provided"}
                  </p>
                </div>

                {/* Role */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Role
                  </p>

                  <Badge className="mt-2">RECRUITER</Badge>
                </div>

                {/* Status */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Account Status
                  </p>

                  <Badge
                    variant="outline"
                    className="mt-2 border-green-500/30 text-green-600"
                  >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    {profile.status === "ACTIVE" ? "Active" : profile.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default RecruiterProfile;
