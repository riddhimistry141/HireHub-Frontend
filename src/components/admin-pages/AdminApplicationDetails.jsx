import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  User,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

function AdminApplicationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/admin/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch applications");
        }

        const applications = data.data || [];

        const selectedApplication = applications.find((item) => item.id === id);

        if (!selectedApplication) {
          throw new Error("Application not found");
        }

        setApplication(selectedApplication);
      } catch (error) {
        console.error("Error fetching application details:", error);

        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchApplication();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Clock3 className="h-6 w-6 animate-spin text-muted-foreground" />

          <p className="text-sm text-muted-foreground">
            Loading application details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-muted p-3">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>

        <h2 className="mt-4 text-lg font-semibold">Application not found</h2>

        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          {error || "Unable to load application details."}
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

  const status = statusConfig[application.status] || {
    label: application.status || "Unknown",
    icon: FileText,
    className: "border-muted-foreground/30 text-muted-foreground",
  };

  const StatusIcon = status.icon;

  const applicantName = application.user?.name || "Unknown Applicant";

  const applicantEmail = application.user?.auth?.email || "Email not available";

  const companyName = application.job?.company?.name || "Company not available";

  const jobTitle = application.job?.title || "Job not available";

  const appliedDate = application.createdAt
    ? new Date(application.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date not available";

  const initials = applicantName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

      {/* Header */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </div>

            {/* Applicant Info */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">
                  {applicantName}
                </h1>

                <Badge
                  variant="outline"
                  className={`gap-1 ${status.className}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {status.label}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Application for{" "}
                <span className="font-medium text-foreground">{jobTitle}</span>
              </p>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {applicantEmail}
                </span>

                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Applied {appliedDate}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-5 lg:col-span-2">
          {/* Application Information */}
          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-base">
                Application Information
              </CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 px-5 pb-5 sm:grid-cols-2">
              <InfoRow
                icon={CalendarDays}
                label="Applied Date"
                value={appliedDate}
              />

              <InfoRow icon={FileText} label="Status" value={status.label} />

              <InfoRow
                icon={BriefcaseBusiness}
                label="Position"
                value={jobTitle}
              />

              <InfoRow
                icon={BriefcaseBusiness}
                label="Company"
                value={companyName}
              />
            </CardContent>
          </Card>

          {/* Application ID */}
          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-base">Application Details</CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="rounded-md border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Application ID</p>

                <p className="mt-1 break-all font-mono text-xs text-foreground">
                  {application.id}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submitted Information */}
          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-base">Submitted Information</CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="rounded-md border border-dashed p-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Additional application data
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      The current admin application API provides the applicant,
                      job, company, application status, and application date.
                      Resume and cover letter details are not currently included
                      in this endpoint.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Job Information */}
          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-base">Job Information</CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <BriefcaseBusiness className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{jobTitle}</p>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {companyName}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/admin/jobs/${application.job.id}`)}
              >
                <BriefcaseBusiness className="mr-2 h-4 w-4" />
                View Job
              </Button>
            </CardContent>
          </Card>

          {/* Applicant */}
          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-base">Applicant</CardTitle>
            </CardHeader>

            <CardContent className="px-5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {applicantName}
                  </p>

                  <p className="truncate text-xs text-muted-foreground">
                    {applicantEmail}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  navigate(`/admin/applicants/${application.user.id}`)
                }
              >
                <User className="mr-2 h-4 w-4" />
                View Applicant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>

        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default AdminApplicationDetails;
