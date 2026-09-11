import {
  BriefcaseBusiness,
  Edit,
  Mail,
  MapPin,
  Phone,
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
import { Badge } from "@/components/ui/badge";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

function Profile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const name = user?.data?.name || "Riddhi Mistry";
  const email = user?.data?.email || "riddhi@gmail.com";
  const role = user?.data?.roleName || "USER";

  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const skills = [
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

  return (
    <div className="space-y-6">
      {/* Page intro */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Profile
        </h1>

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
                <h2 className="text-xl font-bold">
                  {name}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {email}
                </p>

                <Badge
                  variant="secondary"
                  className="mt-3"
                >
                  {role}
                </Badge>
              </div>
            </div>

            <Button
              onClick={() => navigate("/profile/edit")}
            >
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
              <CardTitle>
                Personal Information
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserRound className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Full Name
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {name}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">
                      Email
                    </p>

                    <p className="mt-1 truncate text-sm font-medium">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Phone className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      +91 98765 43210
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="size-5" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      Gujarat, India
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional information */}
          <Card>
            <CardHeader>
              <CardTitle>
                Professional Information
              </CardTitle>
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
                    Full Stack Developer
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">
                  About
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Computer Science graduate interested in
                  building modern web applications using
                  React, Node.js, Express and database
                  technologies.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">
                  Skills
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                    >
                      {skill}
                    </Badge>
                  ))}
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
              <CardTitle>
                Profile Completion
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Completed
                </span>

                <span className="text-sm font-semibold text-primary">
                  80%
                </span>
              </div>

              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow="80"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label="Profile completion"
              >
                <div className="h-full w-[80%] rounded-full bg-primary" />
              </div>

              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Complete your profile to improve your
                chances of getting noticed by recruiters.
              </p>
            </CardContent>
          </Card>

          {/* Resume */}
          <Card>
            <CardHeader>
              <CardTitle>
                Resume
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BriefcaseBusiness className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      Riddhi_Mistry_Resume.pdf
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Updated 2 days ago
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