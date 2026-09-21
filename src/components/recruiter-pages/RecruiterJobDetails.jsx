import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Edit,
  ExternalLink,
  MapPin,
  Users,
  UserCheck,
  UserRoundCheck,
  Wallet,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function RecruiterJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${BASE_URL}/jobs/recruiter/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job");
        }

        setJob(data.data);
      } catch (error) {
        console.error("Fetch recruiter job error:", error);
        toast.error(error.message || "Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "Not specified";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            <CheckCircle2 className="size-3.5" />
            Active
          </Badge>
        );

      case "CLOSED":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="size-3.5" />
            Closed
          </Badge>
        );

      case "DRAFT":
        return (
          <Badge
            variant="secondary"
            className="gap-1"
          >
            <Clock3 className="size-3.5" />
            Draft
          </Badge>
        );

      default:
        return (
          <Badge variant="outline">
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const getJobTypeLabel = (jobType) => {
    switch (jobType) {
      case "ONSITE":
        return "On-site";
      case "REMOTE":
        return "Remote";
      case "HYBRID":
        return "Hybrid";
      default:
        return jobType || "Not specified";
    }
  };

  const renderList = (items, emptyText) => {
    if (!items || items.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          {emptyText}
        </p>
      );
    }

    return (
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-3 text-sm"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />

            <span className="leading-6 text-muted-foreground">
              {item}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 p-4 md:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-10 w-32 animate-pulse rounded-md bg-muted" />

          <div className="rounded-2xl border bg-background p-6">
            <div className="space-y-4">
              <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-5 w-1/4 animate-pulse rounded bg-muted" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-xl border bg-background"
              />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-80 animate-pulse rounded-xl border bg-background lg:col-span-2" />
            <div className="h-80 animate-pulse rounded-xl border bg-background" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-10 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <BriefcaseBusiness className="size-8 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">
              Job not found
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              This job may have been deleted or you may not
              have permission to view it.
            </p>

            <Button
              className="mt-6"
              onClick={() => navigate("/recruiter/jobs")}
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to My Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">

        {/* Back */}
        <Button
          variant="ghost"
          className="-ml-2"
          onClick={() => navigate("/recruiter/jobs")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to My Jobs
        </Button>

        {/* Job Header */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              <div className="flex gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <BriefcaseBusiness className="size-7 text-primary" />
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(job.status)}

                    <Badge variant="outline">
                      {getJobTypeLabel(job.jobType)}
                    </Badge>
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                      {job.title}
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {job.company?.companyName ||
                        job.company?.name ||
                        "Your Company"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-4" />
                      {job.location || "Location not specified"}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="size-4" />
                      Posted {formatDate(job.createdAt)}
                    </div>

                    {job.experience?.experienceName && (
                      <div className="flex items-center gap-1.5">
                        <BriefcaseBusiness className="size-4" />
                        {job.experience.experienceName}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate(`/recruiter/jobs/edit/${job.id}`)
                  }
                >
                  <Edit className="mr-2 size-4" />
                  Edit Job
                </Button>

                <Button
                  onClick={() =>
                    navigate(`/recruiter/applicants?job=${job.id}`)
                  }
                >
                  <Users className="mr-2 size-4" />
                  View Applicants
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recruitment Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Slots
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {job.totalSlots}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Positions available
                  </p>
                </div>

                <div className="rounded-xl bg-primary/10 p-3">
                  <BriefcaseBusiness className="size-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Applied
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {job.applied}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Total applications
                  </p>
                </div>

                <div className="rounded-xl bg-blue-100 p-3">
                  <Users className="size-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Left
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {job.left}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Remaining positions
                  </p>
                </div>

                <div className="rounded-xl bg-amber-100 p-3">
                  <UserRoundCheck className="size-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Hired
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {job.hired}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Candidates hired
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-100 p-3">
                  <UserCheck className="size-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left */}
          <div className="space-y-6 lg:col-span-2">

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
                  {job.description || "No description provided."}
                </p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>

              <CardContent>
                {renderList(
                  job.responsibilities,
                  "No responsibilities provided."
                )}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>

              <CardContent>
                {renderList(
                  job.requirements,
                  "No requirements provided."
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>

              <CardContent>
                {renderList(
                  job.benefits,
                  "No benefits provided."
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>

              <CardContent>
                {job.skills && job.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge
                        key={`${skill}-${index}`}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No skills specified.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="space-y-6">

            {/* Job Information */}
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">

                <div className="flex gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <MapPin className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {job.location || "Not specified"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <Wallet className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Salary
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {job.salary || "Not specified"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <BriefcaseBusiness className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {job.experience?.experienceName ||
                        "Not specified"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <CalendarDays className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Application Deadline
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {formatDateTime(
                        job.applicationDeadline
                      )}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-3">
                  <div className="rounded-lg bg-muted p-2">
                    <Clock3 className="size-4" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Job Type
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {getJobTypeLabel(job.jobType)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recruitment Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Overview</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total positions
                  </span>

                  <span className="font-semibold">
                    {job.totalSlots}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Applications
                  </span>

                  <span className="font-semibold">
                    {job.applied}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Hired
                  </span>

                  <span className="font-semibold text-emerald-600">
                    {job.hired}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Positions remaining
                  </span>

                  <span className="font-semibold">
                    {job.left}
                  </span>
                </div>

                <Separator />

                <Button
                  className="w-full"
                  onClick={() =>
                    navigate(
                      `/recruiter/applicants?job=${job.id}`
                    )
                  }
                >
                  <Users className="mr-2 size-4" />
                  Manage Applicants
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    navigate("/recruiter/interviews")
                  }
                >
                  <CalendarDays className="mr-2 size-4" />
                  Manage Interviews
                </Button>
              </CardContent>
            </Card>

            {/* Company */}
            <Card>
              <CardHeader>
                <CardTitle>Company</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10">
                    <BriefcaseBusiness className="size-5 text-primary" />
                  </div>

                  <div>
                    <p className="font-medium">
                      {job.company?.companyName ||
                        job.company?.name ||
                        "Company"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Recruiter posted job
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Actions */}
        <Card>
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">
                Manage this job
              </p>

              <p className="text-sm text-muted-foreground">
                Update the job or review candidates who
                applied.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  navigate(`/recruiter/jobs/edit/${job.id}`)
                }
              >
                <Edit className="mr-2 size-4" />
                Edit Job
              </Button>

              <Button
                onClick={() =>
                  navigate(
                    `/recruiter/applicants?job=${job.id}`
                  )
                }
              >
                <ExternalLink className="mr-2 size-4" />
                View Applicants
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RecruiterJobDetails;