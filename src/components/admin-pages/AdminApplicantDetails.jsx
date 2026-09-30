import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  User,
  XCircle,
  FileText
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { Separator } from "@/components/ui/separator";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const statusConfig = {
  APPLIED: {
    label: "Applied",
    icon: Clock3,
    className: "border-blue-500/40 text-blue-600",
  },

  REVIEWING: {
    label: "Reviewing",
    icon: Clock3,
    className: "border-yellow-500/40 text-yellow-600",
  },

  SHORTLISTED: {
    label: "Shortlisted",
    icon: CheckCircle2,
    className: "border-purple-500/40 text-purple-600",
  },

  INTERVIEW: {
    label: "Interview",
    icon: CalendarDays,
    className: "border-orange-500/40 text-orange-600",
  },

  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "border-red-500/40 text-red-600",
  },

  HIRED: {
    label: "Hired",
    icon: CheckCircle2,
    className: "border-green-500/40 text-green-600",
  },

  WITHDRAWN: {
    label: "Withdrawn",
    icon: XCircle,
    className: "border-muted-foreground/30 text-muted-foreground",
  },
};

function AdminApplicantDetails() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicantApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${BASE_URL}/admin/applications/applicant/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to fetch applicant details",
          );
        }

        setData(result.data);
      } catch (error) {
        console.error("Error fetching applicant details:", error);

        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchApplicantApplications();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Clock3 className="h-6 w-6 animate-spin text-muted-foreground" />

          <p className="text-sm text-muted-foreground">
            Loading applicant details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-muted p-3">
          <User className="h-6 w-6 text-muted-foreground" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">Applicant not found</h2>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {error || "Unable to load applicant details."}
        </p>

        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => navigate("/admin/applications")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Applications
        </Button>
      </div>
    );
  }

  const applicant = data.applicant;
  const applications = data.applications || [];

  const initials = applicant.name
    ? applicant.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => navigate("/admin/applications")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Applications
      </Button>

      {/* Applicant Header */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>

            {/* Applicant Info */}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold tracking-tight">
                {applicant.name || "Unknown Applicant"}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {applicant.auth?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    {applicant.auth.email}
                  </span>
                )}

                <span className="flex items-center gap-1.5">
                  <BriefcaseBusiness className="h-3.5 w-3.5" />
                  {applications.length}{" "}
                  {applications.length === 1 ? "Application" : "Applications"}
                </span>
              </div>
            </div>

            {/* Application Count */}
            <div className="flex shrink-0 items-center gap-2 rounded-md border bg-muted/30 px-3 py-2">
              <FileCountIcon />

              <div>
                <p className="text-xs text-muted-foreground">Applications</p>

                <p className="text-sm font-semibold">{applications.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardHeader className="px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Applications</CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Jobs this applicant has applied for
              </p>
            </div>

            <Badge variant="secondary" className="shrink-0">
              {applications.length}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 pt-0">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3">
                <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />
              </div>

              <p className="mt-3 text-sm font-medium">No applications found</p>

              <p className="mt-1 text-xs text-muted-foreground">
                This applicant has not applied for any jobs.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {applications.map((application) => {
                const status = statusConfig[application.status] || {
                  label: application.status || "Unknown",
                  icon: Clock3,
                  className: "border-muted-foreground/30 text-muted-foreground",
                };

                const StatusIcon = status.icon;

                const appliedDate = application.createdAt
                  ? new Date(application.createdAt).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )
                  : "Date not available";

                return (
                  <div
                    key={application.id}
                    className="flex flex-col gap-4 py-4 first:pt-2 last:pb-2 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Job Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <BriefcaseBusiness className="h-4 w-4 text-primary" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-medium">
                            {application.job?.title || "Job not available"}
                          </h3>

                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {application.job?.company?.name ||
                              "Company not available"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 sm:ml-12">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Applied {appliedDate}
                        </span>

                        <Badge
                          variant="outline"
                          className={`gap-1 ${status.className}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </Badge>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/jobs/${application.job.id}`)
                        }
                      >
                        <BriefcaseBusiness className="mr-2 h-4 w-4" />
                        View Job
                      </Button>

                      <Button
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/applications/${application.id}`)
                        }
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Application
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FileCountIcon() {
  return (
    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
      <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" />
    </div>
  );
}

export default AdminApplicantDetails;
