import { useEffect, useState } from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BASE_URL = import.meta.env.VITE_BASE_URL;


function getStatusLabel(status) {
  const labels = {
    REVIEWING: "Under Review",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    HIRED: "Hired",
    REJECTED: "Rejected",
    APPLIED: "Applied",
    WITHDRAWN: "Withdrawn",
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

    APPLIED:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",

    WITHDRAWN:
      "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300",
  };

  return classes[status] || "";
}

function formatRelativeTime(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const now = new Date();

  const difference = now.getTime() - date.getTime();

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (days < 7) {
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  }

  return date.toLocaleDateString("en-IN");
}

function formatInterviewDate(scheduledAt) {
  if (!scheduledAt) {
    return "Date not specified";
  }

  const date = new Date(scheduledAt);
  const today = new Date();

  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const interviewStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const difference = interviewStart.getTime() - todayStart.getTime();

  const oneDay = 1000 * 60 * 60 * 24;

  if (difference === 0) {
    return "Today";
  }

  if (difference === oneDay) {
    return "Tomorrow";
  }

  if (difference === -oneDay) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatInterviewTime(scheduledAt) {
  if (!scheduledAt) {
    return "Time not specified";
  }

  return new Date(scheduledAt).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function RecruiterDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const name = user?.data?.name || "Recruiter";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };

        const [jobsResponse, applicationsResponse, interviewsResponse] =
          await Promise.all([
            fetch(`${BASE_URL}/jobs/my`,{headers,}),
            fetch(`${BASE_URL}/applications/recruiter`,{headers,}),
            fetch(`${BASE_URL}/applications/recruiter/interviews`,{headers,}),
          ]);

        const jobsData = await jobsResponse.json();
        const applicationsData = await applicationsResponse.json();
        const interviewsData = await interviewsResponse.json();

        if (
          !jobsResponse.ok ||
          !applicationsResponse.ok ||
          !interviewsResponse.ok
        ) {
          throw new Error(
            jobsData.message ||
              applicationsData.message ||
              interviewsData.message ||
              "Failed to load dashboard data.",
          );
        }

        setJobs(jobsData.data || []);
        setApplications(applicationsData.data || []);
        setInterviews(interviewsData.data || []);
      } catch (error) {
        console.error("Recruiter dashboard error:", error);

        setError(
          error.message || "Failed to load dashboard data.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /*
   * Dashboard calculations
   */

  const activeJobs = jobs.filter((job) => job.status === "ACTIVE").length;

  const totalApplicants = applications.length;

  const pendingReview = applications.filter(
    (application) => application.status === "REVIEWING",
  ).length;

  const shortlisted = applications.filter(
    (application) => application.status === "SHORTLISTED",
  ).length;

  const interviewApplications = applications.filter(
    (application) => application.status === "INTERVIEW",
  ).length;

  const hired = applications.filter(
    (application) => application.status === "HIRED",
  ).length;

  const upcomingInterviews = interviews
    .filter((interview) => {
      return interview.status === "SCHEDULED";
    })
    .filter((interview) => {
      if (!interview.scheduledAt) {
        return false;
      }

      return new Date(interview.scheduledAt) >= new Date();
    })
    .sort(
      (first, second) =>
        new Date(first.scheduledAt) - new Date(second.scheduledAt),
    )
    .slice(0, 5);

  const recentApplicants = applications.slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {name}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Here's an overview of your recruitment activity.
          </p>
        </div>

        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>

            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <BriefcaseBusiness className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>

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
            <div className="text-2xl font-bold">{totalApplicants}</div>

            <p className="mt-1 text-xs text-muted-foreground">
              Across all jobs
            </p>
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <CalendarDays className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingInterviews.length}
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
            <div className="text-2xl font-bold">{pendingReview}</div>

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
              <CardTitle>Recent Applicants</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Latest candidates who applied to your jobs.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/recruiter/applicants")}
            >
              View all
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </CardHeader>

          <CardContent>
            {recentApplicants.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No applicants yet.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {recentApplicants.map((application) => {
                  const applicantName =
                    application.user?.name || "Unknown Candidate";

                  return (
                    <div
                      key={application.id}
                      className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {applicantName
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {applicantName}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {application.job?.title || "Job not specified"}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {application.user?.title || "Candidate"} ·{" "}
                            {formatRelativeTime(application.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={getStatusClasses(application.status)}
                        >
                          {getStatusLabel(application.status)}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            navigate(`/recruiter/applicants/${application.id}`)
                          }
                          aria-label={`View ${applicantName}`}
                        >
                          <ArrowRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Interviews */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Interviews</CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Your next scheduled interviews.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/recruiter/interviews")}
            >
              View all
            </Button>
          </CardHeader>

          <CardContent>
            {upcomingInterviews.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No upcoming interviews.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => {
                  const candidateName =
                    interview.application?.user?.name || "Unknown Candidate";

                  const jobTitle =
                    interview.application?.job?.title || "Job not specified";

                  return (
                    <div key={interview.id} className="rounded-lg border p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                          <CalendarDays className="size-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-medium">{candidateName}</p>

                          <p className="text-sm text-muted-foreground">
                            {jobTitle}
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays className="size-3.5" />

                            {formatInterviewDate(interview.scheduledAt)}

                            <span>•</span>

                            <Clock3 className="size-3.5" />

                            {formatInterviewTime(interview.scheduledAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recruitment overview */}
      <Card>
        <CardHeader>
          <CardTitle>Recruitment Overview</CardTitle>

          <p className="text-sm text-muted-foreground">
            Current hiring activity across your jobs.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Shortlisted */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />

                <span className="text-sm font-medium">Shortlisted</span>
              </div>

              <p className="mt-2 text-2xl font-bold">{shortlisted}</p>

              <p className="text-xs text-muted-foreground">
                Candidates shortlisted
              </p>
            </div>

            {/* Interviews */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-purple-600 dark:text-purple-400" />

                <span className="text-sm font-medium">Interviews</span>
              </div>

              <p className="mt-2 text-2xl font-bold">{interviewApplications}</p>

              <p className="text-xs text-muted-foreground">
                Candidates in interview stage
              </p>
            </div>

            {/* Hired */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />

                <span className="text-sm font-medium">Hired</span>
              </div>

              <p className="mt-2 text-2xl font-bold">{hired}</p>

              <p className="text-xs text-muted-foreground">Candidates hired</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RecruiterDashboard;
