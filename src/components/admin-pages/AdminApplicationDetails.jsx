import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  MapPin,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const mockApplications = {
  APP001: {
    id: "APP001",
    applicantId: "1",
    applicantName: "Rahul Patel",
    applicantEmail: "rahul.patel@gmail.com",
    applicantLocation: "Ahmedabad, Gujarat",
    jobId: "1",
    jobTitle: "Frontend Developer",
    company: "TechCorp",
    recruiter: "Amit Kumar",
    appliedDate: "August 28, 2026",
    status: "APPLIED",
    resume: "Rahul_Patel_Resume.pdf",
    coverLetter:
      "I am interested in the Frontend Developer position and believe my React and JavaScript experience would make me a strong candidate.",
  },

  APP002: {
    id: "APP002",
    applicantId: "2",
    applicantName: "Priya Shah",
    applicantEmail: "priya.shah@gmail.com",
    applicantLocation: "Surat, Gujarat",
    jobId: "2",
    jobTitle: "React Developer",
    company: "InnovateLabs",
    recruiter: "Vikram Shah",
    appliedDate: "August 27, 2026",
    status: "REVIEWING",
    resume: "Priya_Shah_Resume.pdf",
    coverLetter:
      "I would love the opportunity to contribute to InnovateLabs as a React Developer.",
  },

  APP003: {
    id: "APP003",
    applicantId: "3",
    applicantName: "Amit Mehta",
    applicantEmail: "amit.mehta@gmail.com",
    applicantLocation: "Ahmedabad, Gujarat",
    jobId: "3",
    jobTitle: "Node.js Developer",
    company: "CodeWorks",
    recruiter: "Neha Mehta",
    appliedDate: "August 26, 2026",
    status: "SHORTLISTED",
    resume: "Amit_Mehta_Resume.pdf",
    coverLetter:
      "My Node.js and backend development experience aligns closely with this opportunity.",
  },
};

const statusConfig = {
  APPLIED: {
    label: "Applied",
    className: "bg-blue-100 text-blue-700",
  },
  REVIEWING: {
    label: "Reviewing",
    className: "bg-yellow-100 text-yellow-700",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "bg-purple-100 text-purple-700",
  },
  INTERVIEW: {
    label: "Interview",
    className: "bg-orange-100 text-orange-700",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
  },
  HIRED: {
    label: "Hired",
    className: "bg-green-100 text-green-700",
  },
};

function AdminApplicationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const application = mockApplications[id];

  if (!application) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <FileText className="h-10 w-10 text-muted-foreground" />

        <h2 className="mt-4 text-xl font-semibold">
          Application not found
        </h2>

        <Button
          className="mt-4"
          onClick={() =>
            navigate("/admin/applications")
          }
        >
          Back to Applications
        </Button>
      </div>
    );
  }

  const status = statusConfig[application.status];

  const initials = application.applicantName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="px-0"
        onClick={() =>
          navigate("/admin/applications")
        }
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Applications
      </Button>

      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {initials}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {application.applicantName}
                </h1>

                <Badge
                  className={status.className}
                >
                  {status.label}
                </Badge>
              </div>

              <p className="mt-1 text-muted-foreground">
                Application for {application.jobTitle}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {application.applicantEmail}
                </span>

                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {application.applicantLocation}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          {/* Application Information */}
          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-6 sm:grid-cols-2">
              <InfoRow
                icon={CalendarDays}
                label="Applied Date"
                value={application.appliedDate}
              />

              <InfoRow
                icon={Clock3}
                label="Current Status"
                value={status.label}
              />

              <InfoRow
                icon={BriefcaseBusiness}
                label="Position"
                value={application.jobTitle}
              />

              <InfoRow
                icon={Building2Icon}
                label="Company"
                value={application.company}
              />
            </CardContent>
          </Card>

          {/* Resume */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted Resume</CardTitle>

              <CardDescription>
                Resume attached to this application.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-100 p-3">
                    <FileText className="h-5 w-5 text-red-600" />
                  </div>

                  <div>
                    <p className="font-medium">
                      {application.resume}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      PDF Document
                    </p>
                  </div>
                </div>

                <Button variant="outline">
                  View Resume
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          <Card>
            <CardHeader>
              <CardTitle>Cover Letter</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="leading-7 text-muted-foreground">
                {application.coverLetter}
              </p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <TimelineItem
                  title="Application Submitted"
                  description="Candidate submitted the application."
                  date={application.appliedDate}
                  completed
                />

                <TimelineItem
                  title="Application Under Review"
                  description="Recruiter reviewed the application."
                  date="August 29, 2026"
                  completed={
                    [
                      "REVIEWING",
                      "SHORTLISTED",
                      "INTERVIEW",
                      "HIRED",
                    ].includes(
                      application.status
                    )
                  }
                />

                <TimelineItem
                  title="Candidate Shortlisted"
                  description="Candidate moved to the shortlist."
                  date="Pending"
                  completed={[
                    "SHORTLISTED",
                    "INTERVIEW",
                    "HIRED",
                  ].includes(application.status)}
                />

                <TimelineItem
                  title="Interview"
                  description="Candidate interview stage."
                  date="Pending"
                  completed={[
                    "INTERVIEW",
                    "HIRED",
                  ].includes(application.status)}
                />

                <TimelineItem
                  title="Final Decision"
                  description="Hiring decision."
                  date="Pending"
                  completed={
                    application.status === "HIRED"
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job */}
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">
                  {application.jobTitle}
                </p>

                <p className="text-sm text-muted-foreground">
                  {application.company}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground">
                  Recruiter
                </p>

                <p className="mt-1 font-medium">
                  {application.recruiter}
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  navigate(
                    `/admin/jobs/${application.jobId}`
                  )
                }
              >
                View Job
              </Button>
            </CardContent>
          </Card>

          {/* Applicant */}
          <Card>
            <CardHeader>
              <CardTitle>Applicant</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-4 w-4 text-primary" />
                </div>

                <div>
                  <p className="font-medium">
                    {application.applicantName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {application.applicantEmail}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  navigate(
                    `/admin/users/${application.applicantId}`
                  )
                }
              >
                View Applicant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />

      <div>
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  description,
  date,
  completed,
}) {
  return (
    <div className="flex gap-4">
      <div
        className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          completed
            ? "bg-green-100"
            : "bg-muted"
        }`}
      >
        <CheckCircle2
          className={`h-4 w-4 ${
            completed
              ? "text-green-600"
              : "text-muted-foreground"
          }`}
        />
      </div>

      <div>
        <p className="font-medium">
          {title}
        </p>

        <p className="text-sm text-muted-foreground">
          {description}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {date}
        </p>
      </div>
    </div>
  );
}

function Building2Icon(props) {
  return <BriefcaseBusiness {...props} />;
}

export default AdminApplicationDetails;