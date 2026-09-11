import { useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
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

// Mock applicant data for now.
const mockApplicants = [
  {
    id: "1",
    name: "Rahul Patel",
    email: "rahul.patel@example.com",
    phone: "+91 98765 43210",
    location: "Ahmedabad, Gujarat",
    experience: "2 years",
    jobTitle: "Frontend Developer",
    company: "ABC Technologies",
    appliedDate: "2026-08-28",
    status: "REVIEWING",

    resume: {
      name: "Rahul_Patel_Resume.pdf",
      size: "1.6 MB",
      updated: "Aug 27, 2026",
    },

    coverLetter:
      "I am excited to apply for the Frontend Developer position. I have experience building responsive React applications and working with REST APIs. I believe my JavaScript and React skills would allow me to contribute effectively to your team.",

    skills: [
      "JavaScript",
      "React",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "REST APIs",
      "Git",
    ],

    education: "B.E. Computer Science & Engineering",

    timeline: [
      {
        title: "Application Submitted",
        description: "Candidate submitted an application.",
        date: "Aug 28, 2026",
        completed: true,
      },
      {
        title: "Application Under Review",
        description: "Recruiter started reviewing the application.",
        date: "Aug 29, 2026",
        completed: true,
      },
      {
        title: "Shortlisted",
        description: "Candidate will move to the next stage.",
        date: "Pending",
        completed: false,
      },
      {
        title: "Interview",
        description: "Interview has not been scheduled yet.",
        date: "Pending",
        completed: false,
      },
    ],
  },

  {
    id: "2",
    name: "Priya Shah",
    email: "priya.shah@example.com",
    phone: "+91 99887 66554",
    location: "Surat, Gujarat",
    experience: "1 year",
    jobTitle: "Frontend Developer",
    company: "ABC Technologies",
    appliedDate: "2026-08-27",
    status: "SHORTLISTED",

    resume: {
      name: "Priya_Shah_Resume.pdf",
      size: "1.8 MB",
      updated: "Aug 26, 2026",
    },

    coverLetter:
      "I am interested in joining your team as a Frontend Developer. My experience with React and modern frontend tools makes this opportunity a great match for my skills.",

    skills: ["JavaScript", "React", "TypeScript", "HTML", "CSS", "Git"],

    education: "B.E. Information Technology",

    timeline: [
      {
        title: "Application Submitted",
        description: "Candidate submitted an application.",
        date: "Aug 27, 2026",
        completed: true,
      },
      {
        title: "Application Under Review",
        description: "Recruiter reviewed the application.",
        date: "Aug 28, 2026",
        completed: true,
      },
      {
        title: "Shortlisted",
        description: "Candidate was shortlisted.",
        date: "Aug 29, 2026",
        completed: true,
      },
      {
        title: "Interview",
        description: "Interview scheduling is pending.",
        date: "Pending",
        completed: false,
      },
    ],
  },
];

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
};

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ApplicantDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const applicant = mockApplicants.find((item) => item.id === id);

  const [status, setStatus] = useState(applicant?.status || "APPLIED");

  if (!applicant) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <UserRound className="size-7 text-muted-foreground" />
            </div>

            <h1 className="mt-4 text-xl font-semibold">Applicant Not Found</h1>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              The applicant you are trying to view does not exist or may have
              been removed.
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

  const currentStatus = statusConfig[status];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back */}

      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent"
        onClick={() => navigate(`/recruiter/applicants?job=1`)}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Applicants
      </Button>

      {/* Applicant Header */}

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {applicant.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {applicant.name}
                  </h1>

                  <Badge variant={currentStatus.variant}>
                    {currentStatus.label}
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  Applied for{" "}
                  <span className="font-medium text-foreground">
                    {applicant.jobTitle}
                  </span>
                </p>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-4" />
                    {applicant.email}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {applicant.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness className="size-4" />
                    {applicant.experience}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}

            <div className="w-full lg:w-56">
              <p className="mb-2 text-sm font-medium">Application Status</p>

              <Select value={status} onValueChange={setStatus}>
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
              <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="size-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-medium">{applicant.resume.name}</p>

                    <p className="text-xs text-muted-foreground">
                      {applicant.resume.size} • Updated{" "}
                      {applicant.resume.updated}
                    </p>
                  </div>
                </div>

                <Button variant="outline">
                  <Download className="mr-2 size-4" />
                  Download
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
              <div className="rounded-lg bg-muted/40 p-5">
                <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                  {applicant.coverLetter}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
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
                  <p className="font-medium">{applicant.education}</p>

                  <p className="text-sm text-muted-foreground">
                    Candidate education
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

                  <p className="text-sm font-medium">{applicant.jobTitle}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <CalendarDays className="size-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Applied On</p>

                  <p className="text-sm font-medium">
                    {formatDate(applicant.appliedDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="size-4 text-muted-foreground" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Location</p>

                  <p className="text-sm font-medium">{applicant.location}</p>
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

                <span className="break-all text-sm">{applicant.email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" />

                <span className="text-sm">{applicant.phone}</span>
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
                {applicant.timeline.map((item, index) => (
                  <div key={item.title} className="relative flex gap-3">
                    {index < applicant.timeline.length - 1 && (
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
            <Button variant="outline" onClick={() => setStatus("REJECTED")}>
              Reject
            </Button>

            <Button onClick={() => setStatus("SHORTLISTED")}>
              Shortlist Candidate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ApplicantDetails;
