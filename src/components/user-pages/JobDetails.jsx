import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  Send,
  Users,
  CalendarDays,
  Loader2,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function getJobTypeLabel(type) {
  const labels = {
    ONSITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  };

  return labels[type] || type;
}

function getJobTypeClasses(type) {
  const classes = {
    ONSITE:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",

    REMOTE:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",

    HYBRID:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
  };

  return classes[type] || "";
}

function formatDate(date) {
  if (!date) {
    return "Not specified";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPostedDate(date) {
  if (!date) {
    return "Not specified";
  }

  const createdDate = new Date(date);
  const currentDate = new Date();

  const difference = currentDate - createdDate;
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (days <= 0) {
    return "Today";
  }

  if (days === 1) {
    return "1 day ago";
  }

  if (days < 7) {
    return `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);

  if (weeks === 1) {
    return "1 week ago";
  }

  return `${weeks} weeks ago`;
}

function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadline = job?.applicationDeadline
    ? new Date(job.applicationDeadline)
    : null;

  if (deadline) {
    deadline.setHours(0, 0, 0, 0);
  }

  const isDeadlinePassed = deadline ? deadline <= today : false;
  const isSlotsFull = job?.left <= 0;
  const canApply =
    job?.status === "ACTIVE" && !isDeadlinePassed && !isSlotsFull;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${BASE_URL}/jobs/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch job details");
        }

        setJob(data.data);
      } catch (error) {
        console.error("Fetch job details error:", error);

        setError(error.message || "Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  useEffect(() => {
    const checkSavedJob = async () => {
      const token = localStorage.getItem("token");

      if (!token || !id) {
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/jobs/${id}/saved`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to check saved job");
        }

        setIsSaved(data.saved);
      } catch (error) {
        console.error("Check saved job error:", error);
      }
    };

    checkSavedJob();
  }, [id]);

  const handleSaveJob = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to save jobs");
        return;
      }

      setSavingJob(true);

      const response = await fetch(`${BASE_URL}/jobs/${id}/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save job");
      }

      setIsSaved(data.saved);

      toast.success(data.message);
    } catch (error) {
      console.error("Save job error:", error);

      toast.error(error.message || "Failed to save job");
    } finally {
      setSavingJob(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Loading job details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <BriefcaseBusiness className="size-5 text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold">Unable to load job</h2>

            <p className="mt-1 text-sm text-muted-foreground">{error}</p>

            <Button className="mt-5" onClick={() => navigate("/jobs")}>
              <ArrowLeft className="mr-2 size-4" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <BriefcaseBusiness className="size-5 text-muted-foreground" />
            </div>

            <h2 className="text-lg font-semibold">Job not found</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              The job you're looking for may no longer exist.
            </p>

            <Button className="mt-5" onClick={() => navigate("/jobs")}>
              <ArrowLeft className="mr-2 size-4" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent"
        onClick={() => navigate("/jobs")}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Jobs
      </Button>

      {/* Job header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 className="size-7" />
              </div>

              <div className="min-w-0">
                <h1 className="text-2xl font-bold tracking-tight">
                  {job.title}
                </h1>

                <p className="mt-1 font-medium text-muted-foreground">
                  {job.company?.name || "Company not available"}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {job.location}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <BriefcaseBusiness className="size-4" />
                    {job.experience?.experienceName || "Not specified"}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 className="size-4" />
                    {formatPostedDate(job.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <Badge variant="outline" className={getJobTypeClasses(job.jobType)}>
              {getJobTypeLabel(job.jobType)}
            </Badge>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
            <Button
              disabled={!canApply}
              onClick={() => navigate(`/jobs/${id}/apply`)}
            >
              {isSlotsFull
                ? "No Slots Available"
                : isDeadlinePassed
                  ? "Application Closed"
                  : "Apply Now"}
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveJob}
              disabled={savingJob}
            >
              <Bookmark
                className={`mr-2 size-4 ${isSaved ? "fill-current" : ""}`}
              />

              {savingJob ? "Saving..." : isSaved ? "Saved" : "Save Job"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left */}
        <div className="space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-line leading-7 text-muted-foreground">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>

            <CardContent>
              {job.responsibilities?.length > 0 ? (
                <div className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

                      <p className="text-sm leading-6 text-muted-foreground">
                        {responsibility}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No responsibilities specified.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>

            <CardContent>
              {job.requirements?.length > 0 ? (
                <div className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />

                      <p className="text-sm leading-6 text-muted-foreground">
                        {requirement}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No requirements specified.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>

            <CardContent>
              {job.benefits?.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {job.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />

                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No benefits specified.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Job overview */}
          <Card>
            <CardHeader>
              <CardTitle>Job Overview</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Job Type */}
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BriefcaseBusiness className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Job Type</p>

                  <p className="mt-1 text-sm font-medium">
                    {getJobTypeLabel(job.jobType)}
                  </p>
                </div>
              </div>

              {/* Experience */}
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Experience</p>

                  <p className="mt-1 text-sm font-medium">
                    {job.experience?.experienceName || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Location</p>

                  <p className="mt-1 text-sm font-medium">{job.location}</p>
                </div>
              </div>

              {/* Salary */}
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BriefcaseBusiness className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Salary</p>

                  <p className="mt-1 text-sm font-medium">
                    {job.salary || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Deadline */}
              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CalendarDays className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Application Deadline
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(job.applicationDeadline)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="size-4" />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Available Slots
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {job.left} of {job.totalSlots}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company */}
          <Card>
            <CardHeader>
              <CardTitle>About the Company</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="size-5 text-muted-foreground" />
                </div>

                <div>
                  <p className="font-medium">
                    {job.company?.name || "Company not available"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {job.company?.location || "Technology Company"}
                  </p>
                </div>
              </div>

              {job.company?.description && (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {job.company.description}
                </p>
              )}

              {job.company?.website && (
                <p className="mt-2 text-sm text-primary">
                  {job.company.website}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Apply CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <h3 className="font-semibold">Interested in this position?</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Submit your application and take the next step in your career.
              </p>

              <Button
                disabled={!canApply}
                onClick={() => navigate(`/jobs/${id}/apply`)}
              >
                {isSlotsFull
                  ? "No Slots Available"
                  : isDeadlinePassed
                    ? "Application Closed"
                    : "Apply Now"}

                {/* <Send className="ml-2 size-4" /> */}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
