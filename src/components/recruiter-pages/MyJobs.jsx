import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import {
  BriefcaseBusiness,
  CalendarDays,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function getStatusLabel(status) {
  const labels = {
    ACTIVE: "Active",
    CLOSED: "Closed",
  };

  return labels[status] || status;
}

function getStatusClasses(status) {
  const classes = {
    ACTIVE:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",

    CLOSED:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300",
  };

  return classes[status] || "";
}

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
    return "No deadline";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPostedLabel(date) {
  if (!date) {
    return "Unknown";
  }

  const createdDate = new Date(date);
  const currentDate = new Date();

  const differenceInTime = currentDate.getTime() - createdDate.getTime();

  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  if (differenceInDays <= 0) {
    return "today";
  }

  if (differenceInDays === 1) {
    return "1 day ago";
  }

  if (differenceInDays < 7) {
    return `${differenceInDays} days ago`;
  }

  const differenceInWeeks = Math.floor(differenceInDays / 7);

  if (differenceInWeeks === 1) {
    return "1 week ago";
  }

  if (differenceInWeeks < 4) {
    return `${differenceInWeeks} weeks ago`;
  }

  const differenceInMonths = Math.floor(differenceInDays / 30);

  if (differenceInMonths === 1) {
    return "1 month ago";
  }

  return `${differenceInMonths} months ago`;
}

function MyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${BASE_URL}/jobs/my`, {
          method: "GET",
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
        console.error("Fetch my jobs error:", error);

        setError(error.message || "Failed to load your jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(searchText) ||
        job.location.toLowerCase().includes(searchText);

      const jobStatus = job.isActive ? "ACTIVE" : "CLOSED";

      const matchesStatus =
        statusFilter === "ALL" || jobStatus === statusFilter;

      const matchesType = typeFilter === "ALL" || job.jobType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [jobs, search, statusFilter, typeFilter]);

  const activeJobs = jobs.filter((job) => job.isActive).length;

  const totalApplicants = 0;

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) {
      return;
    }

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/jobs/${jobToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete job");
      }

      toast.success("Job deleted successfully");

      setDeleteDialogOpen(false);
      setJobToDelete(null);

      // Remove deleted job immediately from UI
      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== jobToDelete.id),
      );
    } catch (error) {
      console.error("Delete job error:", error);

      toast.error(error.message || "Failed to delete job");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Jobs</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create, manage and track your job postings.
          </p>
        </div>

        <Button onClick={() => navigate("/recruiter/jobs/create")}>
          <Plus className="mr-2 size-4" />
          Create Job
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <BriefcaseBusiness className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{activeJobs}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Currently accepting applications
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applicants
            </CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Users className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{totalApplicants}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              Applications will appear here
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <BriefcaseBusiness className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-bold">{jobs.length}</p>

            <p className="mt-1 text-xs text-muted-foreground">
              All your job postings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs or locations..."
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>

                <SelectItem value="ACTIVE">Active</SelectItem>

                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Job Types</SelectItem>

                <SelectItem value="ONSITE">On-site</SelectItem>

                <SelectItem value="REMOTE">Remote</SelectItem>

                <SelectItem value="HYBRID">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Job Postings</CardTitle>

          <p className="text-sm text-muted-foreground">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <BriefcaseBusiness className="size-5 animate-pulse text-muted-foreground" />
              </div>

              <h3 className="font-semibold">Loading jobs...</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Fetching your job postings.
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <BriefcaseBusiness className="size-5 text-muted-foreground" />
              </div>

              <h3 className="font-semibold">Unable to load jobs</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {error}
              </p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <Search className="size-5 text-muted-foreground" />
              </div>

              <h3 className="font-semibold">
                {jobs.length === 0 ? "No jobs yet" : "No jobs found"}
              </h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {jobs.length === 0
                  ? "Create your first job posting to get started."
                  : "No job postings match your current search or filters."}
              </p>

              {jobs.length === 0 ? (
                <Button
                  className="mt-4"
                  onClick={() => navigate("/recruiter/jobs/create")}
                >
                  <Plus className="mr-2 size-4" />
                  Create Job
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("ALL");
                    setTypeFilter("ALL");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-y bg-muted/40">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Job
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Type
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Applicants
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Deadline
                    </th>

                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredJobs.map((job) => {
                    const status = job.isActive ? "ACTIVE" : "CLOSED";

                    return (
                      <tr
                        key={job.id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        {/* Job */}
                        <td className="px-6 py-4">
                          <div className="flex min-w-[230px] items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <BriefcaseBusiness className="size-5" />
                            </div>

                            <div>
                              <p className="font-medium">{job.title}</p>

                              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="size-3.5" />
                                {job.location}
                              </div>

                              <p className="mt-1 text-xs text-muted-foreground">
                                Posted {getPostedLabel(job.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={getJobTypeClasses(job.jobType)}
                          >
                            {getJobTypeLabel(job.jobType)}
                          </Badge>
                        </td>

                        {/* Applicants */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
                            <Users className="size-4" />0
                          </div>
                        </td>

                        {/* Deadline */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <CalendarDays className="size-4" />
                            {formatDate(job.applicationDeadline)}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={getStatusClasses(status)}
                          >
                            {getStatusLabel(status)}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              className="inline-flex size-8 items-center justify-center rounded-md hover:bg-accent"
                              aria-label={`Actions for ${job.title}`}
                            >
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/jobs/${job.id}`)
                                }
                              >
                                <Eye className="mr-2 size-4" />
                                View Job
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/recruiter/jobs/edit/${job.id}`)
                                }
                              >
                                <Edit className="mr-2 size-4" />
                                Edit Job
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={
                                  () => handleDeleteClick(job) //navigate(`/recruiter/jobs/${job.id}`)
                                }
                              >
                                <Edit className="mr-2 size-4" />
                                Deleted Job
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/recruiter/jobs/edit/${job.id}`)
                                }
                              >
                                <BriefcaseBusiness className="mr-2 size-4" />
                                {job.isActive ? "Close Job" : "Reopen Job"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job?</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {jobToDelete?.title}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setJobToDelete(null);
              }}
              disabled={deleting}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDeleteJob}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MyJobs;
