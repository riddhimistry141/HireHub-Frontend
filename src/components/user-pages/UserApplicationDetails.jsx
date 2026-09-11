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

import { useNavigate, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const applications = {
  "1": {
    id: "1",
    jobTitle: "Frontend Developer",
    company: "ABC Technologies",
    location: "Ahmedabad, Gujarat",
    jobType: "ONSITE",
    experience: "1-2 years",
    salary: "₹4 - ₹6 LPA",
    status: "APPLIED",
    appliedDate: "September 4, 2026",
    resume: "Riddhi_Mistry_Resume.pdf",
    resumeUpdated: "2 days ago",
    coverLetter:
      "I am excited to apply for the Frontend Developer position. I have experience working with React, JavaScript, Tailwind CSS and modern frontend development practices.",
  },

  "2": {
    id: "2",
    jobTitle: "React Developer",
    company: "XYZ Technologies",
    location: "Surat, Gujarat",
    jobType: "HYBRID",
    experience: "1-2 years",
    salary: "₹5 - ₹7 LPA",
    status: "SHORTLISTED",
    appliedDate: "September 1, 2026",
    resume: "Riddhi_Mistry_Resume.pdf",
    resumeUpdated: "5 days ago",
    coverLetter:
      "I am interested in the React Developer position and believe my frontend development experience would allow me to contribute effectively to your team.",
  },

  "3": {
    id: "3",
    jobTitle: "Node.js Developer",
    company: "Tech Company",
    location: "Remote",
    jobType: "REMOTE",
    experience: "2-3 years",
    salary: "₹6 - ₹9 LPA",
    status: "REVIEWING",
    appliedDate: "August 29, 2026",
    resume: "Riddhi_Mistry_Resume.pdf",
    resumeUpdated: "1 week ago",
    coverLetter:
      "I am interested in joining your backend development team and would love the opportunity to work with Node.js and modern backend technologies.",
  },
};

const timelineSteps = [
  {
    key: "APPLIED",
    title: "Application Submitted",
    description:
      "Your application has been successfully submitted.",
  },

  {
    key: "REVIEWING",
    title: "Application Under Review",
    description:
      "The recruiter is currently reviewing your application.",
  },

  {
    key: "SHORTLISTED",
    title: "Shortlisted",
    description:
      "Your application has been shortlisted for the next stage.",
  },

  {
    key: "INTERVIEW",
    title: "Interview",
    description:
      "You have been selected for an interview.",
  },

  {
    key: "HIRED",
    title: "Hired",
    description:
      "Congratulations! You have been selected for the position.",
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
  const { applicationId } = useParams();

  const application = applications[applicationId];

  if (!application) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <FileText className="size-5 text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold">
              Application not found
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              The application you're looking for doesn't exist.
            </p>

            <Button
              className="mt-5"
              onClick={() => navigate("/applications")}
            >
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
                  {application.jobTitle}
                </h1>

                <p className="mt-1 font-medium text-muted-foreground">
                  {application.company}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {application.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-4" />
                    Applied {application.appliedDate}
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
                  const completed =
                    index <= currentStep;

                  const active =
                    index === currentStep;

                  return (
                    <div
                      key={step.key}
                      className="relative flex gap-4"
                    >
                      {index !== timelineSteps.length - 1 && (
                        <div
                          className={`absolute left-[11px] top-7 h-[calc(100%-8px)] w-px ${
                            index < currentStep
                              ? "bg-primary"
                              : "bg-border"
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
                        {completed && (
                          <CheckCircle2 className="size-4" />
                        )}
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
                            <Badge
                              variant="secondary"
                              className="text-xs"
                            >
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
                    <p className="truncate font-medium">
                      {application.resume}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Updated {application.resumeUpdated}
                    </p>
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
                  <p className="text-xs text-muted-foreground">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {application.location}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BriefcaseBusiness className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Job Type
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {application.jobType}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <UsersIcon />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Experience
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {application.experience}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock3 className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Salary
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {application.salary}
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
                onClick={() =>
                  navigate(`/jobs/${application.id}`)
                }
              >
                View Job
              </Button>

              {application.status !== "REJECTED" &&
                application.status !== "HIRED" && (
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:text-destructive"
                  >
                    <XCircle className="mr-2 size-4" />
                    Withdraw Application
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