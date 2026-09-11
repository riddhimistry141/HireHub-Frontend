import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Pencil,
  Search,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingJobId, setUpdatingJobId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      setJobs(data.data || []);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId, isActive) => {
    try {
      setUpdatingJobId(jobId);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/admin/jobs/${jobId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update job status");
      }

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                isActive,
              }
            : job
        )
      );
    } catch (error) {
      setError(error.message || "Failed to update job status");
    } finally {
      setUpdatingJobId(null);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        job.title?.toLowerCase().includes(searchValue) ||
        job.company?.name?.toLowerCase().includes(searchValue) ||
        job.location?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && job.isActive) ||
        (statusFilter === "INACTIVE" && !job.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const totalJobs = jobs.length;

  const activeJobs = jobs.filter(
    (job) => job.isActive
  ).length;

  const inactiveJobs = jobs.filter(
    (job) => !job.isActive
  ).length;

  const getJobTypeBadge = (type) => {
    const labels = {
      ONSITE: "Onsite",
      REMOTE: "Remote",
      HYBRID: "Hybrid",
    };

    return (
      <Badge variant="secondary">
        {labels[type] || type}
      </Badge>
    );
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <Badge className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="gap-1">
        <XCircle className="h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-5 w-5 text-primary" />

          <span className="text-sm font-medium text-primary">
            Job Management
          </span>
        </div>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Jobs
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View and manage all jobs posted on HireHub.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Total Jobs
            </p>

            <p className="mt-2 text-3xl font-bold">
              {totalJobs}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Active Jobs
            </p>

            <p className="mt-2 text-3xl font-bold">
              {activeJobs}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              Inactive Jobs
            </p>

            <p className="mt-2 text-3xl font-bold">
              {inactiveJobs}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search by job, company or location..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Job Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">
                  All Status
                </SelectItem>

                <SelectItem value="ACTIVE">
                  Active
                </SelectItem>

                <SelectItem value="INACTIVE">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading jobs...
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead className="w-12 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => (
                        <TableRow key={job.id}>
                          {/* Job */}
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {job.title}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {job.location}
                              </p>
                            </div>
                          </TableCell>

                          {/* Company */}
                          <TableCell>
                            {job.company?.name || "—"}
                          </TableCell>

                          {/* Type */}
                          <TableCell>
                            {getJobTypeBadge(job.jobType)}
                          </TableCell>

                          {/* Experience */}
                          <TableCell>
                            {job.experience?.experienceName || "—"}
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            {getStatusBadge(job.isActive)}
                          </TableCell>

                          {/* Posted */}
                          <TableCell className="text-sm text-muted-foreground">
                            {job.createdAt
                              ? new Date(
                                  job.createdAt
                                ).toLocaleDateString()
                              : "—"}
                          </TableCell>

                          {/* Actions */}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  />
                                }
                              >
                                <MoreHorizontal className="h-4 w-4" />

                                <span className="sr-only">
                                  Open actions
                                </span>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  <DropdownMenuLabel>
                                    Job Actions
                                  </DropdownMenuLabel>

                                  <DropdownMenuSeparator />

                                  {/* View */}
                                  <DropdownMenuItem
                                    onClick={() =>
                                      navigate(
                                        `/admin/jobs/${job.id}`
                                      )
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Job
                                  </DropdownMenuItem>

                                  {/* Edit */}
                                  <DropdownMenuItem
                                    onClick={() =>
                                      navigate(
                                        `/admin/jobs/${job.id}/edit`
                                      )
                                    }
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit Job
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  {/* Status */}
                                  {job.isActive ? (
                                    <DropdownMenuItem
                                      disabled={
                                        updatingJobId === job.id
                                      }
                                      onClick={() =>
                                        updateJobStatus(
                                          job.id,
                                          false
                                        )
                                      }
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Deactivate Job
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem
                                      disabled={
                                        updatingJobId === job.id
                                      }
                                      onClick={() =>
                                        updateJobStatus(
                                          job.id,
                                          true
                                        )
                                      }
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Activate Job
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-32 text-center"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <BriefcaseBusiness className="h-8 w-8 text-muted-foreground" />

                            <p className="font-medium">
                              No jobs found
                            </p>

                            <p className="text-sm text-muted-foreground">
                              Try changing your search or filters.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredJobs.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {jobs.length}
                </span>{" "}
                jobs
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminJobs;