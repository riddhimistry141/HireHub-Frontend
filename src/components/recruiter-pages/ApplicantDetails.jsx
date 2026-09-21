import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  /* Download, */ Eye,
  FileText,
  Mail,
  MapPin,
  UserRound,
  BriefcaseBusiness,
  Clock3,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const statusConfig = {
  APPLIED: {
    label: "Applied",
    variant: "secondary",
  },

  REVIEWING: {
    label: "Reviewing",
    variant: "outline",
  },

  SHORTLISTED: {
    label: "Shortlisted",
    variant: "default",
  },

  INTERVIEW: {
    label: "Interview",
    variant: "default",
  },

  REJECTED: {
    label: "Rejected",
    variant: "destructive",
  },

  HIRED: {
    label: "Hired",
    variant: "default",
  },

  WITHDRAWN: {
    label: "Withdrawn",
    variant: "secondary",
  },
};

function formatDate(date) {
  if (!date) {
    return "Not available";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name) {
  if (!name) {
    return "NA";
  }

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ApplicantDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("APPLIED");

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState("");

  /*
   * Fetch recruiter application details
   */
  useEffect(() => {
    let ignore = false;

    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(
          `${BASE_URL}/applications/recruiter/${id}`,
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

        if (!ignore) {
          setApplication(result.data);
          setStatus(result.data?.status || "APPLIED");
        }
      } catch (error) {
        console.error("Fetch applicant details error:", error);

        if (!ignore) {
          setError(error.message || "Failed to fetch applicant details");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchApplication();

    return () => {
      ignore = true;
    };
  }, [id]);

  /*
   * Update application status
   */
  const handleStatusChange = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${BASE_URL}/applications/recruiter/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update application status",
        );
      }

      setStatus(newStatus);

      if (result.data) {
        setApplication(result.data);
      }
    } catch (error) {
      console.error("Update application status error:", error);

      setError(error.message || "Failed to update application status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <Card>
          <CardContent className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <p className="font-medium">Loading applicant...</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please wait while we fetch the application.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * Error / not found
   */
  if (error || !application) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <UserRound className="size-7 text-muted-foreground" />
            </div>

            <h1 className="mt-4 text-xl font-semibold">
              {error ? "Failed to Load Applicant" : "Applicant Not Found"}
            </h1>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {error ||
                "The applicant you are trying to view does not exist or may have been removed."}
            </p>

            <Button
              className="mt-6"
              onClick={() => navigate("/recruiter/applicants")}
            >
              Back to Applicants
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const applicant = application.user;
  const job = application.job;

  const applicantName = applicant?.name || "Unknown Applicant";

  const applicantEmail = applicant?.auth?.email || "Email not available";

  const currentStatus = statusConfig[status] || statusConfig.APPLIED;

  /*
   * Resume information
   *
   * The current recruiter application API gives us
   * application.resumeUrl, but not the original file name.
   */

  /* const downloadResume = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            `${BASE_URL}/applications/recruiter/${id}/resume`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const data = await response.json();

            throw new Error(
                data.message || "Failed to download resume"
            );
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${applicant?.name || "applicant"}-${job?.title}-resume.pdf`;

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success("Resume downloaded successfully");
    } catch (error) {
        console.error("Download resume error:", error);

        toast.error(
            error.message || "Failed to download resume"
        );
    }
}; */

  const previewResume = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/applications/recruiter/${id}/resume`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(data.message || "Failed to preview resume");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Preview resume error:", error);

      toast.error(error.message || "Failed to preview resume");
    }
  };

  const hasResume = Boolean(application.resumeUrl);

  /*
   * Build timeline from current application status.
   *
   * Exact historical status dates are not stored in the
   * current Application model, so we only know that the
   * current stage has been reached.
   */
  const timeline = [
    {
      title: "Application Submitted",
      description: "Candidate submitted an application.",
      date: formatDate(application.createdAt),
      completed: true,
    },
    {
      title: "Application Under Review",
      description: "Application is being reviewed by the recruiter.",
      date: status === "APPLIED" ? "Pending" : "Current application stage",
      completed: [
        "REVIEWING",
        "SHORTLISTED",
        "INTERVIEW",
        "REJECTED",
        "HIRED",
      ].includes(status),
    },
    {
      title: "Shortlisted",
      description: "Candidate has been shortlisted for the position.",
      date:
        status === "SHORTLISTED" || status === "INTERVIEW" || status === "HIRED"
          ? "Completed"
          : "Pending",
      completed: ["SHORTLISTED", "INTERVIEW", "HIRED"].includes(status),
    },
    {
      title: "Interview",
      description: application.interview
        ? "Interview has been scheduled."
        : "Interview has not been scheduled yet.",
      date: application.interview
        ? formatDate(application.interview.scheduledAt)
        : "Pending",
      completed: status === "INTERVIEW" || status === "HIRED",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back */}

      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent"
        onClick={() => navigate(`/recruiter/applicants?job=${job?.id || ""}`)}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Applicants
      </Button>

      {/* Error message */}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Applicant Header */}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {getInitials(applicantName)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {applicantName}
                  </h1>

                  <Badge variant={currentStatus.variant}>
                    {currentStatus.label}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Applied for{" "}
                  <span className="font-medium text-foreground">
                    {job?.title || "Unknown Position"}
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-4" />
                    {applicantEmail}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {job?.location || "Not specified"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness className="size-4" />
                    {job?.experience?.experienceName || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}

            <div className="w-full lg:w-56">
              <p className="mb-2 text-sm font-medium">Application Status</p>

              <Select
                value={status}
                onValueChange={handleStatusChange}
                disabled={updatingStatus}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="APPLIED">Applied</SelectItem>

                  <SelectItem value="REVIEWING">Reviewing</SelectItem>

                  <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>

                  <SelectItem value="INTERVIEW">Interview</SelectItem>

                  <SelectItem value="REJECTED">Rejected</SelectItem>

                  <SelectItem value="HIRED">Hired</SelectItem>
                </SelectContent>
              </Select>

              {updatingStatus && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Updating status...
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}

        <div className="space-y-6 lg:col-span-2">
          {/* Resume */}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                Resume
              </CardTitle>
            </CardHeader>

            <CardContent>
              {hasResume ? (
                <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="size-5 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium">Applicant Resume</p>

                      <p className="break-all text-xs text-muted-foreground">
                        Resume submitted with this application
                      </p>
                    </div>
                  </div>

                  {/* <Button
                    variant="outline"
                    title="Recruiter resume download endpoint is not implemented yet"
                    onClick={downloadResume}
                  >
                    <Download className="mr-2 size-4" />
                    Download
                  </Button> */}
                  <Button variant="outline" onClick={previewResume}>
                    <Eye className="mr-2 size-4" />
                    Preview Resume
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <FileText className="mx-auto size-8 text-muted-foreground" />

                  <p className="mt-3 font-medium">No resume attached</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    This application does not have a resume URL.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cover Letter */}

          <Card>
            <CardHeader>
              <CardTitle>Cover Letter</CardTitle>
            </CardHeader>

            <CardContent>
              {application.coverLetter ? (
                <div className="rounded-lg bg-muted/40 p-5">
                  <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                    {application.coverLetter}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-muted/40 p-5">
                  <p className="text-sm text-muted-foreground">
                    No cover letter was provided.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills */}

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg bg-muted/40 p-5">
                <p className="text-sm text-muted-foreground">
                  Skills are not currently stored in the application data
                  returned by the backend.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Education */}

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <BriefcaseBusiness className="size-5 text-muted-foreground" />
                </div>

                <div>
                  <p className="font-medium">Not available</p>

                  <p className="text-sm text-muted-foreground">
                    Education details are not currently stored in the applicant
                    data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}

        <div className="space-y-6">
          {/* Application Information */}

          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <BriefcaseBusiness className="size-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Position</p>

                  <p className="text-sm font-medium">
                    {job?.title || "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <CalendarDays className="size-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Applied On</p>

                  <p className="text-sm font-medium">
                    {formatDate(application.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="size-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Location</p>

                  <p className="text-sm font-medium">
                    {job?.location || "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-muted-foreground" />

                <span className="break-all text-sm">{applicantEmail}</span>
              </div>

              <div className="flex items-center gap-3">
                <UserRound className="size-4 text-muted-foreground" />

                <span className="text-sm">Phone number not available</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}

          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={item.title} className="relative flex gap-3">
                    {index < timeline.length - 1 && (
                      <div className="absolute left-[9px] top-5 h-[calc(100%+24px)] w-px bg-border" />
                    )}

                    <div
                      className={`relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full ${
                        item.completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : (
                        <Clock3 className="size-3" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.title}</p>

                      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                        {item.description}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Actions */}

      <Card>
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Recruiter Actions</p>

            <p className="text-sm text-muted-foreground">
              Manage this candidate's application.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              disabled={
                updatingStatus ||
                status === "REJECTED" ||
                status === "WITHDRAWN"
              }
              onClick={() => handleStatusChange("REJECTED")}
            >
              Reject
            </Button>

            <Button
              disabled={
                updatingStatus ||
                status === "REJECTED" ||
                status === "WITHDRAWN"
              }
              onClick={() => handleStatusChange("SHORTLISTED")}
            >
              Shortlist Candidate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApplicantDetails;
