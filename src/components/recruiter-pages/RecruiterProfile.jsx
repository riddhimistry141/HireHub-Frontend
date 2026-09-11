import { useState } from "react";
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

function RecruiterProfile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const user = storedUser || {};

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: user.name || "Recruiter",
    email: user.email || "",
    jobTitle: "",
    hiringFocus: "",
    about: "",
  });

  const [formData, setFormData] = useState(profile);

  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

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
                  <h2 className="text-xl font-semibold">{profile.name}</h2>

                  <Badge>
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    RECRUITER
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {profile.jobTitle || "Recruiter"}
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {profile.email}
                  </span>
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className="w-fit border-green-500/30 text-green-600"
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Active Account
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
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                />
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>

                <Input
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. Talent Acquisition Specialist"
                />
              </div>
            </div>

            {/* Hiring Focus */}
            <div className="space-y-2">
              <Label htmlFor="hiringFocus">Hiring Focus</Label>

              <Input
                id="hiringFocus"
                name="hiringFocus"
                value={formData.hiringFocus}
                onChange={handleChange}
                placeholder="e.g. Frontend, Backend and Full Stack Developers"
              />
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
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>

              <Button onClick={handleSave}>Save Changes</Button>
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
                  {profile.jobTitle || "Not provided"}
                </p>
              </div>

              {/* Hiring Focus */}
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Hiring Focus
                </p>

                <p className="mt-1 font-medium">
                  {profile.hiringFocus || "Not provided"}
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

                  <p className="mt-1 font-medium">{profile.email}</p>
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
                    Active
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
