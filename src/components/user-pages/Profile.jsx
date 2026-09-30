import {
  BriefcaseBusiness,
  Edit,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function Profile() {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profileData = await response.json();

        if (!response.ok) {
          throw new Error(profileData.message || "Failed to fetch profile");
        }

        setUser(profileData.data);

        const resumeResponse = await fetch(`${BASE_URL}/resume`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const resumeData = await resumeResponse.json();

        if (!resumeResponse.ok) {
          throw new Error(resumeData.message || "Failed to fetch resume");
        }

        setResume(resumeData.data || null);
      } catch (error) {
        console.error("Fetch profile error:", error);
        setError(error.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [BASE_URL, navigate]);

  const name = user?.name || "User";
  const email = user?.auth?.email || "No email";
  const role = user?.role?.roleName || "USER";

  const profileFields = [
    name,
    email,
    user?.phone,
    user?.location,
    user?.title,
    user?.about,
    user?.skills?.length > 0,
    user?.degree || user?.institution || user?.graduationYear,
    resume,
  ];

  const completedFields = profileFields.filter((field) => {
    if (typeof field === "boolean") {
      return field;
    }

    return field && field.toString().trim() !== "";
  }).length;

  const profileCompletion = Math.round(
    (completedFields / profileFields.length) * 100,
  );

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Prisma",
    "Tailwind CSS",
  ];
 */
  return (
    <div className="space-y-6">
      {/* Page intro */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and professional profile.
        </p>
      </div>

      {/* Profile header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-20 border">
                <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-bold">{name}</h2>

                <p className="mt-1 text-sm text-muted-foreground">{email}</p>

                <Badge variant="secondary" className="mt-3">
                  {role}
                </Badge>
              </div>
            </div>

            <Button onClick={() => navigate("/profile/edit")}>
              <Edit className="mr-2 size-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main information */}
        <div className="space-y-6">
          {/* Personal information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserRound className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>

                    <p className="mt-1 text-sm font-medium">{name}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>

                    <p className="mt-1 truncate text-sm font-medium">{email}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>

                    <p className="mt-1 text-sm font-medium">
                      {user?.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>

                    <p className="mt-1 text-sm font-medium">
                      {user?.location || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional information */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BriefcaseBusiness className="size-5" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Professional Title
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {user?.title || "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">About</p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {/* Computer Science graduate interested in
                  building modern web applications using
                  React, Node.js, Express and database
                  technologies. */}
                  {user?.about || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Skills</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(user?.skills || []).map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Degree</p>
                  <p className="mt-1 text-sm font-medium">
                    {user?.degree || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Institution</p>
                  <p className="mt-1 text-sm font-medium">
                    {user?.institution || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Graduation Year
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {user?.graduationYear || "Not provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile completion */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>

                <span className="text-sm font-semibold text-primary">
                  {profileCompletion}%
                </span>
              </div>

              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={profileCompletion}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Profile completion"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Complete your profile to improve your chances of getting noticed
                by recruiters.
              </p>
            </CardContent>
          </Card>

          {/* Resume */}
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BriefcaseBusiness className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {resume?.fileName || "No resume uploaded"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {resume?.updatedAt
                        ? `Updated ${new Date(
                            resume.updatedAt,
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}`
                        : "No resume uploaded"}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => navigate("/resume")}
                >
                  Manage Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
