import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  MoreHorizontal,
  RefreshCw,
  Search,
  User,
  Users,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ITEMS_PER_PAGE = 4;

const statusConfig = {
  APPLIED: {
    label: "Applied",
    icon: Clock3,
    className: "border-blue-500/40 text-blue-600",
  },

  REVIEWING: {
    label: "Reviewing",
    icon: Clock3,
    className: "border-yellow-500/40 text-yellow-600",
  },

  SHORTLISTED: {
    label: "Shortlisted",
    icon: CheckCircle2,
    className: "border-purple-500/40 text-purple-600",
  },

  INTERVIEW: {
    label: "Interview",
    icon: CalendarDays,
    className: "border-orange-500/40 text-orange-600",
  },

  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "border-red-500/40 text-red-600",
  },

  HIRED: {
    label: "Hired",
    icon: CheckCircle2,
    className: "border-green-500/40 text-green-600",
  },

  WITHDRAWN: {
    label: "Withdrawn",
    icon: XCircle,
    className: "border-muted-foreground/30 text-muted-foreground",
  },
};

function AdminApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchApplications = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch applications");
      }

      setApplications(data.data || []);
    } catch (error) {
      console.error("Error fetching admin applications:", error);

      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const candidates = useMemo(() => {
    const candidateMap = new Map();

    applications.forEach((application) => {
      const userId = application.user?.id;

      if (!userId) {
        return;
      }

      if (!candidateMap.has(userId)) {
        candidateMap.set(userId, {
          applicantId: userId,
          applicantName: application.user?.name || "Unknown",
          applicantEmail: application.user?.auth?.email || "",
          applications: [],
        });
      }

      candidateMap.get(userId).applications.push(application);
    });

    return Array.from(candidateMap.values())
      .map((candidate) => {
        const sortedApplications = [...candidate.applications].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        return {
          ...candidate,
          applications: sortedApplications,
          latestApplication: sortedApplications[0],
        };
      })
      .sort(
        (a, b) =>
          new Date(b.latestApplication.createdAt) -
          new Date(a.latestApplication.createdAt),
      );
  }, [applications]);

  
  const filteredCandidates = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const latestApplication = candidate.latestApplication;

      const applicantName = candidate.applicantName?.toLowerCase() || "";

      const applicantEmail = candidate.applicantEmail?.toLowerCase() || "";

      const jobTitle = latestApplication?.job?.title?.toLowerCase() || "";

      const companyName =
        latestApplication?.job?.company?.name?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        applicantName.includes(searchValue) ||
        applicantEmail.includes(searchValue) ||
        jobTitle.includes(searchValue) ||
        companyName.includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" || latestApplication?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, search, statusFilter]);

  
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE),
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredCandidates.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCandidates, currentPage]);

  
  const totalApplications = applications.length;

  const reviewingCount = applications.filter(
    (application) => application.status === "REVIEWING",
  ).length;

  const shortlistedCount = applications.filter(
    (application) => application.status === "SHORTLISTED",
  ).length;

  const interviewCount = applications.filter(
    (application) => application.status === "INTERVIEW",
  ).length;

  const getStatusBadge = (status) => {
    const config = statusConfig[status];

    if (!config) {
      return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }

    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`gap-1 ${config.className}`}>
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setCurrentPage(1);
  };

  const startResult =
    filteredCandidates.length === 0
      ? 0
      : (currentPage - 1) * ITEMS_PER_PAGE + 1;

  const endResult = Math.min(
    currentPage * ITEMS_PER_PAGE,
    filteredCandidates.length,
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />

            <span className="text-sm font-medium text-primary">
              Application Management
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Applications
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor job applications across the HireHub platform.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchApplications(true)}
          disabled={loading || refreshing}
          className="w-full sm:w-auto"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />

          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <span>{error}</span>

          <Button variant="ghost" size="sm" onClick={() => setError("")}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Applications"
          value={totalApplications}
          icon={FileText}
        />

        <StatCard label="Under Review" value={reviewingCount} icon={Clock3} />

        <StatCard label="Shortlisted" value={shortlistedCount} icon={Users} />

        <StatCard
          label="Interviews"
          value={interviewCount}
          icon={CalendarDays}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search applicant, job or company..."
                className="h-9 pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-full md:w-[190px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>

                <SelectItem value="APPLIED">Applied</SelectItem>

                <SelectItem value="REVIEWING">Reviewing</SelectItem>

                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>

                <SelectItem value="INTERVIEW">Interview</SelectItem>

                <SelectItem value="HIRED">Hired</SelectItem>

                <SelectItem value="REJECTED">Rejected</SelectItem>

                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex min-h-52 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />

                <p className="text-sm text-muted-foreground">
                  Loading applications...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                        Applicant
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                        Latest Job
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                        Applied
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                        Status
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground">
                        Applications
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedCandidates.length > 0 ? (
                      paginatedCandidates.map((candidate, index) => {
                        const application = candidate.latestApplication;

                        return (
                          <tr
                            key={candidate.applicantId}
                            className="border-b last:border-0 hover:bg-muted/20"
                          >
                            {/* Applicant */}
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                  <User className="h-4 w-4 text-primary" />
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">
                                    {candidate.applicantName}
                                  </p>

                                  <p className="max-w-[200px] truncate text-xs text-muted-foreground">
                                    {candidate.applicantEmail ||
                                      "Email not available"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            {/* Latest Job */}
                            <td className="px-5 py-3.5">
                              <p className="max-w-[220px] truncate text-sm font-medium">
                                {application?.job?.title || "—"}
                              </p>

                              <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                                {application?.job?.company?.name || "—"}
                              </p>
                            </td>
                            {/* Applied */}
                            <td className="px-5 py-3.5 text-sm text-muted-foreground">
                              {formatDate(application?.createdAt)}
                            </td>
                            {/* Status */}
                            <td className="px-5 py-3.5">
                              {getStatusBadge(application?.status)}
                            </td>
                            {/* Application count */}
                            <td className="px-5 py-3.5 text-sm">
                              <div className="group relative inline-flex">
                                <span className="cursor-help font-medium underline decoration-dotted underline-offset-4">
                                  {candidate.applications.length}
                                </span>

                                <div
                                  className={`pointer-events-none absolute left-1/2 z-50 hidden w-64 -translate-x-1/2 rounded-md border bg-popover p-3 text-popover-foreground shadow-md group-hover:block ${
                                    index === 0
                                      ? "top-full mt-2"
                                      : "bottom-full mb-2"
                                  }`}
                                >
                                  <p className="mb-2 text-xs font-semibold">
                                    Applied Jobs
                                  </p>

                                  <div className="max-h-40 space-y-1.5 overflow-y-auto">
                                    {candidate.applications.map(
                                      (application) => (
                                        <div
                                          key={application.id}
                                          className="text-xs text-muted-foreground"
                                        >
                                          •{" "}
                                          {application.job?.title ||
                                            "Unknown Job"}
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            {/* Actions */}
                            <td className="px-5 py-3.5 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
                                  <MoreHorizontal className="h-4 w-4" />

                                  <span className="sr-only">Open actions</span>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() =>
                                      navigate(
                                        `/admin/applicants/${candidate.applicantId}`,
                                      )
                                    }
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Applicant
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  <DropdownMenuItem
                                    onClick={() =>
                                      navigate(
                                        `/admin/jobs/${application.job.id}`,
                                      )
                                    }
                                  >
                                    <BriefcaseBusiness className="mr-2 h-4 w-4" />
                                    View Latest Job
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <EmptyState
                        colSpan={6}
                        hasFilters={search || statusFilter !== "ALL"}
                        onClear={clearFilters}
                      />
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="space-y-3 p-4 md:hidden">
                {paginatedCandidates.length > 0 ? (
                  paginatedCandidates.map((candidate) => {
                    const application = candidate.latestApplication;

                    return (
                      <div
                        key={candidate.applicantId}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <User className="h-4 w-4 text-primary" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {candidate.applicantName}
                              </p>

                              <p className="truncate text-xs text-muted-foreground">
                                {candidate.applicantEmail ||
                                  "Email not available"}
                              </p>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-muted">
                              <MoreHorizontal className="h-4 w-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/admin/applicants/${candidate.applicantId}`,
                                  )
                                }
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Applicant
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/admin/jobs/${application.job.id}`)
                                }
                              >
                                <BriefcaseBusiness className="mr-2 h-4 w-4" />
                                View Latest Job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div>
                            <p className="text-sm font-medium">
                              {application?.job?.title || "—"}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {application?.job?.company?.name || "—"}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {getStatusBadge(application?.status)}

                            <span className="text-xs text-muted-foreground">
                              Applied {formatDate(application?.createdAt)}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            Total applications: {candidate.applications.length}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <p className="mt-3 text-sm font-medium">
                      {search || statusFilter !== "ALL"
                        ? "No matching applications"
                        : "No applications found"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {search || statusFilter !== "ALL"
                        ? "Try changing your search or filters."
                        : "There are currently no applications to display."}
                    </p>

                    {(search || statusFilter !== "ALL") && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              {filteredCandidates.length > 0 && (
                <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Showing {startResult}–{endResult} of{" "}
                    {filteredCandidates.length} applicants
                  </p>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((page) => page - 1)}
                      >
                        Previous
                      </Button>

                      <span className="min-w-[70px] text-center text-xs text-muted-foreground">
                        Page {currentPage} of {totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((page) => page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className="rounded-md bg-muted p-2.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">{label}</p>

          <p className="mt-0.5 text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ colSpan, hasFilters, onClear }) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-52 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-full bg-muted p-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <p className="text-sm font-medium">
              {hasFilters
                ? "No matching applications"
                : "No applications found"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {hasFilters
                ? "Try changing your search or filters."
                : "There are currently no applications to display."}
            </p>
          </div>

          {hasFilters && (
            <Button variant="outline" size="sm" onClick={onClear}>
              Clear Filters
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

export default AdminApplications;
