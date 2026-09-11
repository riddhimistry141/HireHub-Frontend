import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
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

const initialProfile = {
  name: "Riddhi Mistry",
  email: "admin@hirehub.com",
  phone: "+91 98765 43210",
  location: "Gujarat, India",
  department: "Platform Administration",
  joinedDate: "January 2026",
  about:
    "Responsible for managing the HireHub platform, users, recruiters, jobs and overall platform operations.",
};

function AdminProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(initialProfile);
  const [saving, setSaving] = useState(false);

  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setFormData(profile);
    setEditMode(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    setSaving(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    setProfile(formData);
    setEditMode(false);
    setSaving(false);

    toast.success("Profile updated successfully");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
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

      {/* Profile Header */}
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

                <Badge>
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  ADMIN
                </Badge>
              </div>

              <p className="mt-1 text-muted-foreground">
                {profile.email}
              </p>

              <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {profile.department}
                </span>

                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/30 px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                Account Status
              </p>

              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />

                <span className="text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>

          <CardDescription>
            Your basic administrator account information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name
              </Label>

              {editMode ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    handleChange(
                      "name",
                      e.target.value
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

            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address
              </Label>

              {editMode ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target.value
                    )
                  }
                />
              ) : (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {profile.email}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone Number
              </Label>

              {editMode ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange(
                      "phone",
                      e.target.value
                    )
                  }
                />
              ) : (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {profile.phone}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location
              </Label>

              {editMode ? (
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleChange(
                      "location",
                      e.target.value
                    )
                  }
                />
              ) : (
                <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-3 py-2.5">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {profile.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="about">
              About
            </Label>

            {editMode ? (
              <Textarea
                id="about"
                value={formData.about}
                onChange={(e) =>
                  handleChange(
                    "about",
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Tell us about your role..."
              />
            ) : (
              <p className="rounded-lg border bg-muted/20 p-4 text-sm leading-6 text-muted-foreground">
                {profile.about}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Administrator Information */}
      <Card>
        <CardHeader>
          <CardTitle>Administrator Information</CardTitle>

          <CardDescription>
            Platform permissions and account details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">
                Role
              </p>

              <div className="mt-2">
                <Badge>
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Administrator
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Department
              </p>

              <p className="mt-2 font-medium">
                {profile.department}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Joined
              </p>

              <div className="mt-2 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />

                <span className="font-medium">
                  {profile.joinedDate}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Account Status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />

                <span className="font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions */}
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