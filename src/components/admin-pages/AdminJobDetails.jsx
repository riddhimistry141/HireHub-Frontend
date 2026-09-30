import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminJobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch job");
      }

      setJob(data.data);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async () => {
    if (!job) return;

    const isActive = job.status === "ACTIVE";
    const nextStatus = isActive ? "CLOSED" : "ACTIVE";

    const actionText = isActive ? "deactivate" : "activate";

    const confirmed = window.confirm(
      isActive
        ? "Deactivate this job?"
        : "Activate this job?"
    );

    if (!confirmed) return;

    try {
      setUpdating(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/jobs/${job.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${actionText} job`);
      }

      setJob((currentJob) => ({
        ...currentJob,
        status: nextStatus,
      }));
    } catch (error) {
      setError(error.message || "Failed to update job status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading job...
        </p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <BriefcaseBusiness className="h-10 w-10 text-muted-foreground" />

        <h2 className="mt-4 text-xl font-semibold">
          {error || "Job not found"}
        </h2>

        <Button
          className="mt-4"
          onClick={() => navigate("/admin/jobs")}
        >
          Back to Jobs
        </Button>
      </div>
    );
  }

  const isActive = job.status === "ACTIVE";
  const isClosed = job.status === "CLOSED";

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Back */}
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => navigate("/admin/jobs")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Jobs
      </Button>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Header */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {job.title}
                </h1>

                <Badge variant="outline">
                  {job.jobType}
                </Badge>

                {isActive && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-green-500/40 text-green-600"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Activated
                  </Badge>
                )}

                {isClosed && (
                  <Badge
                    variant="outline"
                    className="gap-1 border-red-500/40 text-red-600"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Deactivated
                  </Badge>
                )}

                {!isActive && !isClosed && (
                  <Badge variant="outline">
                    {job.status || "Unknown"}
                  </Badge>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {job.company?.name || "—"}
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location || "—"}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              {isActive && (
                <Button
                  variant="outline"
                  className="border-red-500/40 text-red-600 hover:bg-red-500/10 hover:text-red-600"
                  disabled={updating}
                  onClick={updateJobStatus}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {updating ? "Deactivating..." : "Deactivate Job"}
                </Button>
              )}

              {isClosed && (
                <Button
                  variant="outline"
                  className="border-green-500/40 text-green-600 hover:bg-green-500/10 hover:text-green-600"
                  disabled={updating}
                  onClick={updateJobStatus}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {updating ? "Activating..." : "Activate Job"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard
          label="Experience"
          value={job.experience?.experienceName || "—"}
        />

        <InfoCard
          label="Job Type"
          value={job.jobType || "—"}
        />

        <InfoCard
          label="Salary"
          value={job.salary || "Not specified"}
        />

        <InfoCard
          label="Deadline"
          value={
            job.applicationDeadline
              ? new Date(
                  job.applicationDeadline
                ).toLocaleDateString()
              : "No deadline"
          }
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Job Description
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">
                {job.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          <ListCard
            title="Responsibilities"
            items={job.responsibilities}
          />

          <ListCard
            title="Requirements"
            items={job.requirements}
          />

          <ListCard
            title="Benefits"
            items={job.benefits}
          />

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Skills
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skills?.length > 0 ? (
                  job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="font-normal"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No skills specified.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Job Overview
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <InfoRow
                icon={BriefcaseBusiness}
                label="Job Type"
                value={job.jobType}
              />

              <Separator />

              <InfoRow
                icon={Clock3}
                label="Experience"
                value={
                  job.experience?.experienceName || "—"
                }
              />

              <Separator />

              <InfoRow
                icon={MapPin}
                label="Location"
                value={job.location}
              />

              <Separator />

              <InfoRow
                icon={CalendarDays}
                label="Posted"
                value={
                  job.createdAt
                    ? new Date(
                        job.createdAt
                      ).toLocaleDateString()
                    : "—"
                }
              />

              <Separator />

              <InfoRow
                icon={CalendarDays}
                label="Deadline"
                value={
                  job.applicationDeadline
                    ? new Date(
                        job.applicationDeadline
                      ).toLocaleDateString()
                    : "No deadline"
                }
              />

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground">
                  Salary
                </p>

                <p className="mt-1 text-sm font-medium">
                  {job.salary || "Not specified"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Company */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Company
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="font-semibold">
                {job.company?.name || "—"}
              </p>

              {job.company?.location && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.company.location}
                </p>
              )}

              {job.company?.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block break-all text-sm text-primary hover:underline"
                >
                  {job.company.website}
                </a>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-1.5 truncate text-sm font-semibold">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function ListCard({ title, items = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={`${item}-${index}`}
                className="flex gap-3 text-sm text-muted-foreground"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                <span className="leading-6">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No information available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="truncate text-sm font-medium">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default AdminJobDetails;