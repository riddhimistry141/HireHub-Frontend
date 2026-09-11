import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users,
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

const recentApplicants = [
  {
    id: "1",
    name: "Rahul Patel",
    job: "Frontend Developer",
    experience: "2 years",
    status: "SHORTLISTED",
    applied: "2 hours ago",
  },
  {
    id: "2",
    name: "Priya Shah",
    job: "React Developer",
    experience: "1.5 years",
    status: "REVIEWING",
    applied: "5 hours ago",
  },
  {
    id: "3",
    name: "Amit Kumar",
    job: "Node.js Developer",
    experience: "3 years",
    status: "INTERVIEW",
    applied: "1 day ago",
  },
];

const upcomingInterviews = [
  {
    id: "1",
    candidate: "Amit Kumar",
    job: "Node.js Developer",
    date: "Today",
    time: "11:30 AM",
  },
  {
    id: "2",
    candidate: "Neha Patel",
    job: "Frontend Developer",
    date: "Tomorrow",
    time: "2:00 PM",
  },
];

function getStatusLabel(status) {
  const labels = {
    REVIEWING: "Under Review",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    HIRED: "Hired",
    REJECTED: "Rejected",
  };

  return labels[status] || status;
}

function getStatusClasses(status) {
  const classes = {
    REVIEWING:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300",

    SHORTLISTED:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",

    INTERVIEW:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",

    HIRED:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",

    REJECTED:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  };

  return classes[status] || "";
}

function RecruiterDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const name = user?.data?.name || "Recruiter";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {name}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's an overview of your recruitment activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Jobs */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Jobs
            </CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <BriefcaseBusiness className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              6
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Currently hiring
            </p>
          </CardContent>
        </Card>

        {/* Total Applicants */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applicants
            </CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Users className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              48
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Across all jobs
            </p>
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Interviews
            </CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <CalendarDays className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              4
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Upcoming interviews
            </p>
          </CardContent>
        </Card>

        {/* Pending Review */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Clock3 className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              12
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Applications to review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Recent Applicants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                Recent Applicants
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Latest candidates who applied to your jobs.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate("/recruiter/applicants")
              }
            >
              View all
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </CardHeader>

          <CardContent>
            <div className="divide-y">
              {recentApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {applicant.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {applicant.name}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {applicant.job}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {applicant.experience} experience ·{" "}
                        {applicant.applied}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={getStatusClasses(
                        applicant.status
                      )}
                    >
                      {getStatusLabel(
                        applicant.status
                      )}
                    </Badge>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate(
                          `/recruiter/applicants/${applicant.id}`
                        )
                      }
                      aria-label={`View ${applicant.name}`}
                    >
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>
                Upcoming Interviews
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Your next scheduled interviews.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                navigate("/recruiter/interviews")
              }
            >
              View all
            </Button>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="rounded-lg border p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                      <CalendarDays className="size-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium">
                        {interview.candidate}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {interview.job}
                      </p>

                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {interview.date}

                        <span>•</span>

                        <Clock3 className="size-3.5" />
                        {interview.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment overview */}
      <Card>
        <CardHeader>
          <CardTitle>
            Recruitment Overview
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Current hiring activity across your jobs.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />

                <span className="text-sm font-medium">
                  Shortlisted
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold">
                9
              </p>

              <p className="text-xs text-muted-foreground">
                Candidates shortlisted
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-purple-600 dark:text-purple-400" />

                <span className="text-sm font-medium">
                  Interviews
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold">
                4
              </p>

              <p className="text-xs text-muted-foreground">
                Interviews scheduled
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />

                <span className="text-sm font-medium">
                  Hired
                </span>
              </div>

              <p className="mt-2 text-2xl font-bold">
                3
              </p>

              <p className="text-xs text-muted-foreground">
                Candidates hired
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecruiterDashboard;