import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ITEMS_PER_PAGE = 4;

function AdminJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingJobId, setUpdatingJobId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // ========================================
  // Fetch Jobs
  // ========================================

  const fetchJobs = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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

      setJobs(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ========================================
  // Update Job Status
  // ========================================

  const updateJobStatus = async (jobId, status) => {
    try {
      setUpdatingJobId(jobId);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update job status");
      }

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: data.data.status,
              }
            : job,
        ),
      );
    } catch (error) {
      console.error("Error updating job status:", error);
      setError(error.message || "Failed to update job status");
    } finally {
      setUpdatingJobId(null);
    }
  };

  // ========================================
  // Filter Jobs
  // ========================================

  const filteredJobs = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return jobs.filter((job) => {
      // Do not show draft jobs in Admin UI.
      if (job.status !== "ACTIVE" && job.status !== "CLOSED") {
        return false;
      }

      const matchesSearch =
        !searchValue ||
        job.title?.toLowerCase().includes(searchValue) ||
        job.company?.name?.toLowerCase().includes(searchValue) ||
        job.location?.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  // ========================================
  // Statistics
  // ========================================

  const visibleJobs = useMemo(() => {
    return jobs.filter(
      (job) => job.status === "ACTIVE" || job.status === "CLOSED",
    );
  }, [jobs]);

  const totalJobs = visibleJobs.length;

  const activatedJobs = visibleJobs.filter(
    (job) => job.status === "ACTIVE",
  ).length;

  const deactivatedJobs = visibleJobs.filter(
    (job) => job.status === "CLOSED",
  ).length;

  // ========================================
  // Pagination
  // ========================================

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredJobs, currentPage]);

  const startResult =
    filteredJobs.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endResult = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredJobs.length,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ========================================
  // Helpers
  // ========================================

  const getJobTypeBadge = (type) => {
    const labels = {
      ONSITE: "Onsite",
      REMOTE: "Remote",
      HYBRID: "Hybrid",
    };

    return (
      <Badge variant="secondary">
        {labels[type] || type || "—"}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    if (status === "ACTIVE") {
      return (
        <Badge
          variant="outline"
          className="border-green-500/30 text-green-600"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Activated
        </Badge>
      );
    }

    if (status === "CLOSED") {
      return (
        <Badge
          variant="outline"
          className="border-red-500/30 text-red-600"
        >
          <XCircle className="mr-1 h-3 w-3" />
          Deactivated
        </Badge>
      );
    }

    return null;
  };

  // ========================================
  // Handle Status Change
  // ========================================

  const handleStatusChange = (job) => {
    if (job.status === "ACTIVE") {
      setSelectedJob(job);
      setConfirmDialogOpen(true);
      return;
    }

    updateJobStatus(job.id, "ACTIVE");
  };

  const confirmDeactivateJob = async () => {
    if (!selectedJob) {
      return;
    }

    await updateJobStatus(selectedJob.id, "CLOSED");

    setConfirmDialogOpen(false);
    setSelectedJob(null);
  };

  // ========================================
  // Loading State
  // ========================================

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-7xl items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />

          <p className="mt-3 text-sm text-muted-foreground">
            Loading jobs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* ========================================
          Header
      ======================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

        <Button
          variant="outline"
          onClick={() => fetchJobs(true)}
          disabled={refreshing}
          className="w-full sm:w-auto"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* ========================================
          Error
      ======================================== */}

      {error && (
        <Card className="border-destructive/30">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-destructive">{error}</p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setError("")}
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ========================================
          Stats
      ======================================== */}

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Jobs
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {totalJobs}
                </p>
              </div>

              <BriefcaseBusiness className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Activated */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Activated Jobs
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {activatedJobs}
                </p>
              </div>

              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Deactivated */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Deactivated Jobs
                </p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {deactivatedJobs}
                </p>
              </div>

              <XCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================
          Jobs
      ======================================== */}

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
                onChange={(event) => setSearch(event.target.value)}
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
                <SelectItem value="ALL">All Status</SelectItem>

                <SelectItem value="ACTIVE">Activated</SelectItem>

                <SelectItem value="CLOSED">Deactivated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}

          {(search || statusFilter !== "ALL") && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Filters:
              </span>

              {search && (
                <Badge variant="secondary">
                  Search: {search}
                </Badge>
              )}

              {statusFilter !== "ALL" && (
                <Badge variant="secondary">
                  Status:{" "}
                  {statusFilter === "ACTIVE"
                    ? "Activated"
                    : "Deactivated"}
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}

          {/* Table */}

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
                {paginatedJobs.length > 0 ? (
                  paginatedJobs.map((job) => {
                    const isUpdating = updatingJobId === job.id;

                    return (
                      <TableRow key={job.id}>
                        {/* Job */}

                        <TableCell>
                          <div className="min-w-44">
                            <p className="font-medium">
                              {job.title}
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              {job.location ||
                                "Location not specified"}
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
                          {getStatusBadge(job.status)}
                        </TableCell>

                        {/* Posted */}

                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {job.createdAt
                            ? new Date(
                                job.createdAt,
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
                                  disabled={isUpdating}
                                />
                              }
                            >
                              {isUpdating ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}

                              <span className="sr-only">
                                Open job actions
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
                                      `/admin/jobs/${job.id}`,
                                    )
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Job
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {/* Activate / Deactivate */}

                                <DropdownMenuItem
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleStatusChange(job)
                                  }
                                >
                                  {job.status === "ACTIVE" ? (
                                    <>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Deactivate Job
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Activate Job
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-52 text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-full bg-muted p-3">
                          <BriefcaseBusiness className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <div>
                          <p className="font-medium">
                            {search || statusFilter !== "ALL"
                              ? "No matching jobs"
                              : "No jobs found"}
                          </p>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {search || statusFilter !== "ALL"
                              ? "Try changing your search or filters."
                              : "There are currently no jobs to display."}
                          </p>
                        </div>

                        {(search || statusFilter !== "ALL") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearch("");
                              setStatusFilter("ALL");
                            }}
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ========================================
              Footer / Pagination
          ======================================== */}

          {filteredJobs.length > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {startResult}–{endResult}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredJobs.length}
                </span>{" "}
                jobs
              </div>

              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((page) => page - 1)
                    }
                  >
                    <ChevronLeft className="h-4 w-4" />

                    <span className="sr-only">
                      Previous page
                    </span>
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <Button
                        key={page}
                        variant={
                          currentPage === page
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className="h-8 min-w-8"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((page) => page + 1)
                    }
                  >
                    <ChevronRight className="h-4 w-4" />

                    <span className="sr-only">
                      Next page
                    </span>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========================================
          Deactivate Confirmation
      ======================================== */}

      <AlertDialog
        open={confirmDialogOpen}
        onOpenChange={(open) => {
          setConfirmDialogOpen(open);

          if (!open) {
            setSelectedJob(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deactivate this job?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to deactivate{" "}
              <span className="font-medium text-foreground">
                {selectedJob?.title}
              </span>
              ? Candidates will no longer be able to apply for this
              job while it is deactivated.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedJob(null);
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDeactivateJob}
              disabled={updatingJobId === selectedJob?.id}
            >
              {updatingJobId === selectedJob?.id
                ? "Deactivating..."
                : "Deactivate Job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminJobs;