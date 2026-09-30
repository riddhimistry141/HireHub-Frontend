import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Pencil,
  Save,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function AdminProfile() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    about: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // Fetch Profile
  // ========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch profile");
      }

      const user = result.data;

      setProfile(user);

      setFormData({
        name: user.name || "",
        email: user.auth?.email || "",
        phone: user.phone || "",
        location: user.location || "",
        about: user.about || "",
      });
    } catch (error) {
      console.error("Fetch admin profile error:", error);
      setError(error.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
     fetchProfile();
  }, []);

  // ========================================
  // Helpers
  // ========================================

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatJoinedDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
    });
  };

  // ========================================
  // Edit
  // ========================================

  const handleEdit = () => {
    setFormData({
      name: profile.name || "",
      email: profile.auth?.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      about: profile.about || "",
    });

    setEditMode(true);
  };

  // ========================================
  // Cancel
  // ========================================

  const handleCancel = () => {
    setFormData({
      name: profile.name || "",
      email: profile.auth?.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      about: profile.about || "",
    });

    setEditMode(false);
  };

  // ========================================
  // Save Profile
  // ========================================

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/users/profile`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          location: formData.location.trim(),
          about: formData.about.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      setProfile(result.data);

      setFormData({
        name: result.data.name || "",
        email: result.data.auth?.email || "",
        phone: result.data.phone || "",
        location: result.data.location || "",
        about: result.data.about || "",
      });

      setEditMode(false);

      toast.success(
        result.message || "Profile updated successfully"
      );
    } catch (error) {
      console.error("Update admin profile error:", error);

      toast.error(
        error.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // Loading
  // ========================================

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-5xl items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="mt-3 text-sm text-muted-foreground">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // Error
  // ========================================

  if (error || !profile) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <p className="text-sm text-destructive">
              {error || "Profile not found"}
            </p>

            <Button
              variant="outline"
              onClick={fetchProfile}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const initials = getInitials(profile.name);

  const roleName =
    profile.role?.roleName || "ADMIN";

  const accountStatus =
    profile.status || "ACTIVE";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ========================================
          Header
      ======================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin Profile
          </h1>

          <p className="text-muted-foreground">
            Manage your administrator account information.
          </p>
        </div>

        {!editMode ? (
          <Button onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={saving}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="mr-2 h-4 w-4" />

              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>

      {/* ========================================
          Profile Header
      ======================================== */}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {initials}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold">
                  {profile.name}
                </h2>

                <Badge variant="outline">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {roleName}
                </Badge>
              </div>

              <p className="mt-1 text-muted-foreground">
                {profile.auth?.email || "-"}
              </p>

              <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                Account Status
              </p>

              <div className="mt-1 flex items-center justify-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    accountStatus === "ACTIVE"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />

                <span className="text-sm font-medium">
                  {accountStatus}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          Personal Information
      ======================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>

          <CardDescription>
            Your basic administrator account information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}

            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name
              </Label>

              {editMode ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event) =>
                    handleChange(
                      "name",
                      event.target.value
                    )
                  }
                />
              ) : (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
                  <User className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm">
                    {profile.name}
                  </span>
                </div>
              )}
            </div>

            {/* Email */}

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address
              </Label>

              <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
                <Mail className="h-4 w-4 text-muted-foreground" />

                <span className="text-sm">
                  {profile.auth?.email || "-"}
                </span>
              </div>

              {editMode && (
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed here.
                </p>
              )}
            </div>

            {/* Phone */}

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number
              </Label>

              {editMode ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(event) =>
                    handleChange(
                      "phone",
                      event.target.value
                    )
                  }
                />
              ) : (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
                  <Phone className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm">
                    {profile.phone || "-"}
                  </span>
                </div>
              )}
            </div>

            {/* Location */}

            <div className="space-y-2">
              <Label htmlFor="location">
                Location
              </Label>

              {editMode ? (
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(event) =>
                    handleChange(
                      "location",
                      event.target.value
                    )
                  }
                />
              ) : (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />

                  <span className="text-sm">
                    {profile.location || "-"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* About */}

          <div className="space-y-2">
            <Label htmlFor="about">
              About
            </Label>

            {editMode ? (
              <Textarea
                id="about"
                value={formData.about}
                onChange={(event) =>
                  handleChange(
                    "about",
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Tell us about your role..."
              />
            ) : (
              <p className="rounded-lg border bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
                {profile.about || "No information provided."}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          Administrator Information
      ======================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Administrator Information</CardTitle>

          <CardDescription>
            Platform permissions and account details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Role */}

            <div>
              <p className="text-sm text-muted-foreground">
                Role
              </p>

              <div className="mt-2">
                <Badge variant="outline">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  {roleName}
                </Badge>
              </div>
            </div>

            {/* Joined */}

            <div>
              <p className="text-sm text-muted-foreground">
                Joined
              </p>

              <div className="mt-2 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />

                <span className="font-medium">
                  {formatJoinedDate(profile.createdAt)}
                </span>
              </div>
            </div>

            {/* Account Status */}

            <div>
              <p className="text-sm text-muted-foreground">
                Account Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    accountStatus === "ACTIVE"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                />

                <span className="font-medium">
                  {accountStatus}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          Permissions
      ======================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Administrator Permissions</CardTitle>

          <CardDescription>
            Current permissions available to this account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Manage Users",
              "Manage Recruiters",
              "Manage Jobs",
              "Monitor Applications",
              "Approve Jobs",
              "Manage Platform",
            ].map((permission) => (
              <div
                key={permission}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                </div>

                <span className="text-sm font-medium">
                  {permission}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminProfile;