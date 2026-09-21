import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  XCircle,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const timelineSteps = [
  {
    key: "APPLIED",
    title: "Application Submitted",
    description: "Your application has been successfully submitted.",
  },

  {
    key: "REVIEWING",
    title: "Application Under Review",
    description: "The recruiter is currently reviewing your application.",
  },

  {
    key: "SHORTLISTED",
    title: "Shortlisted",
    description: "Your application has been shortlisted for the next stage.",
  },

  {
    key: "INTERVIEW",
    title: "Interview",
    description: "You have been selected for an interview.",
  },

  {
    key: "HIRED",
    title: "Hired",
    description: "Congratulations! You have been selected for the position.",
  },
];

const statusOrder = {
  APPLIED: 0,
  REVIEWING: 1,
  SHORTLISTED: 2,
  INTERVIEW: 3,
  HIRED: 4,
};

function getStatusLabel(status) {
  const labels = {
    APPLIED: "Applied",
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
    APPLIED:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",

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

function UserApplicationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  //const application = applications[applicationId];
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${BASE_URL}/applications/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch application");
        }

        setApplication(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [BASE_URL, id, navigate]);

  const handleWithdraw = async () => {
    try {
      setWithdrawing(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/applications/${id}/withdraw`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to withdraw application");
      }

      setApplication(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading application...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <FileText className="size-5 text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold">Application not found</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {error || "The application you're looking for doesn't exist."}
            </p>

            <Button className="mt-5" onClick={() => navigate("/applications")}>
              <ArrowLeft className="mr-2 size-4" />
              Back to Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStep = statusOrder[application.status] ?? 0;

  return (
    <div className="space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent"
        onClick={() => navigate("/applications")}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Applications
      </Button>

      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <BriefcaseBusiness className="size-7" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight">
                  {application.job.title}
                </h1>

                <p className="mt-1 font-medium text-muted-foreground">
                  {application.job.company.name}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {application.job.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    Applied{" "}
                    {new Date(application.createdAt).toLocaleDateString()}{" "}
                  </span>
                </div>
              </div>
            </div>

            <Badge
              variant="outline"
              className={getStatusClasses(application.status)}
            >
              {getStatusLabel(application.status)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-0">
                {timelineSteps.map((step, index) => {
                  const completed = index <= currentStep;

                  const active = index === currentStep;

                  return (
                    <div key={step.key} className="relative flex gap-4">
                      {index !== timelineSteps.length - 1 && (
                        <div
                          className={`absolute left-[11px] top-7 h-[calc(100%-8px)] w-px ${
                            index < currentStep ? "bg-primary" : "bg-border"
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                          completed
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/30 bg-background"
                        }`}
                      >
                        {completed && <CheckCircle2 className="size-4" />}
                      </div>

                      <div className="pb-8">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className={`text-sm font-semibold ${
                              active
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.title}
                          </h3>

                          {active && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Resume */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted Resume</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>

                  <div className="min-w-0">
                    {/*<p className="truncate font-medium">
                       {application.resume} */}
                      <p className="font-medium">
                        {application.resumeUrl
                          ? "Submitted resume"
                          : "No resume attached"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Resume upload will be available when resume storage is
                        connected.
                      </p>
                    {/* </p> */}

                    {/* <p className="text-xs text-muted-foreground">
                      Updated {application.resumeUpdated}
                    </p> */}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/resume")}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cover letter */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm leading-7 text-muted-foreground">
                  {application.coverLetter}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job information */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Location</p>

                  <p className="mt-1 text-sm font-medium">
                    {application.job.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BriefcaseBusiness className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Job Type</p>

                  <p className="mt-1 text-sm font-medium">
                    {application.job.jobType}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UsersIcon />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>

                  <p className="mt-1 text-sm font-medium">
                    {application.job.experience?.experienceName ||
                      "Not specified"}{" "}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock3 className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>

                  <p className="mt-1 text-sm font-medium">
                    {application.job.salary || "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button
                className="w-full"
                onClick={() => navigate(`/jobs/${application.job.id}`)}
              >
                View Job
              </Button>

              {["APPLIED", "REVIEWING", "SHORTLISTED"].includes(
                application.status,
              ) && (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={handleWithdraw}
                  disabled={withdrawing}
                >
                  <XCircle className="mr-2 size-4" />

                  {withdrawing ? "Withdrawing..." : "Withdraw Application"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export default UserApplicationDetails;
