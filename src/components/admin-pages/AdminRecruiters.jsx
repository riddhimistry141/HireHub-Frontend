import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  Eye,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

function AdminRecruiters() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();

  // ========================================
  // Fetch Recruiters
  // ========================================

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/admin/recruiters`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch recruiters");
      }

      setRecruiters(result.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, []);

  // ========================================
  // Filter Recruiters
  // ========================================

  const filteredRecruiters = useMemo(() => {
    return recruiters.filter((recruiter) => {
      const searchValue = search.toLowerCase().trim();

      const recruiterName = recruiter.name?.toLowerCase() || "";
      const recruiterEmail = recruiter.auth?.email?.toLowerCase() || "";
      const companyName = recruiter.company?.name?.toLowerCase() || "";

      const matchesSearch =
        recruiterName.includes(searchValue) ||
        recruiterEmail.includes(searchValue) ||
        companyName.includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" || recruiter.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [recruiters, search, statusFilter]);

  // ========================================
  // Statistics
  // ========================================

  const totalRecruiters = recruiters.length;

  const approvedRecruiters = recruiters.filter(
    (recruiter) => recruiter.status === "APPROVED",
  ).length;

  const pendingRecruiters = recruiters.filter(
    (recruiter) => recruiter.status === "PENDING",
  ).length;

  const suspendedRecruiters = recruiters.filter(
    (recruiter) => recruiter.status === "SUSPENDED",
  ).length;

  // ========================================
  // Helpers
  // ========================================

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getStatusBadge = (status) => {
    if (status === "APPROVED") {
      return (
        <Badge variant="outline" className="border-green-500/30 text-green-600">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Approved
        </Badge>
      );
    }

    if (status === "PENDING") {
      return (
        <Badge
          variant="outline"
          className="border-yellow-500/30 text-yellow-600"
        >
          <Clock3 className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    }

    if (status === "REJECTED") {
      return (
        <Badge variant="outline" className="border-red-500/30 text-red-600">
          <UserX className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      );
    }

    if (status === "SUSPENDED") {
      return (
        <Badge variant="outline" className="border-red-500/30 text-red-600">
          <UserX className="mr-1 h-3 w-3" />
          Suspended
        </Badge>
      );
    }

    return <Badge variant="outline">{status || "Unknown"}</Badge>;
  };

  // ========================================
  // Update Recruiter Status
  // ========================================

  const updateStatus = async (id, action) => {
    try {
      setActionLoading(id);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/admin/recruiters/${id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update recruiter");
      }

      setSuccessMessage(result.message || "Recruiter updated successfully");

      await fetchRecruiters();

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  // ========================================
  // Loading State
  // ========================================

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[400px] w-full max-w-7xl items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="mt-3 text-sm text-muted-foreground">
            Loading recruiters...
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

      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />

          <span className="text-sm font-medium text-primary">
            Recruiter Management
          </span>
        </div>

        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Recruiters
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage recruiter accounts across HireHub.
        </p>
      </div>

      {/* ========================================
          Error
      ======================================== */}

      {error && (
        <Card className="border-destructive/30">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <p className="text-sm text-destructive">{error}</p>

            <Button variant="outline" size="sm" onClick={fetchRecruiters}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ========================================
          Success
      ======================================== */}

      {successMessage && (
        <Card className="border-green-500/30">
          <CardContent className="flex items-center gap-2 p-4">
            <CheckCircle2 className="h-4 w-4 text-green-600" />

            <p className="text-sm text-green-600">{successMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* ========================================
          Stats
      ======================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total Recruiters
                </p>

                <p className="mt-2 text-3xl font-bold">{totalRecruiters}</p>
              </div>

              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Approved */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {approvedRecruiters}
                </p>
              </div>

              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Pending */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {pendingRecruiters}
                </p>
              </div>

              <Clock3 className="h-5 w-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        {/* Suspended */}

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>

                <p className="mt-2 text-3xl font-bold text-red-600">
                  {suspendedRecruiters}
                </p>
              </div>

              <UserX className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================
          Recruiter Table
      ======================================== */}

      <Card>
        <CardHeader>
          <CardTitle>All Recruiters</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}

          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 h-4 w-4
                -translate-y-1/2 text-muted-foreground"
              />

              <Input
                placeholder="Search by recruiter, email or company..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status */}

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>

                <SelectItem value="PENDING">Pending</SelectItem>

                <SelectItem value="APPROVED">Approved</SelectItem>

                <SelectItem value="REJECTED">Rejected</SelectItem>

                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recruiter</TableHead>

                  <TableHead>Company</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Joined</TableHead>

                  <TableHead className="w-12 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRecruiters.length > 0 ? (
                  filteredRecruiters.map((recruiter) => {
                    const email = recruiter.auth?.email || "No email";

                    const companyName = recruiter.company?.name || "No company";

                    const companyLocation =
                      recruiter.company?.location || "Location not provided";

                    const isActionLoading = actionLoading === recruiter.id;

                    return (
                      <TableRow key={recruiter.id}>
                        {/* Recruiter */}

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>
                                {getInitials(recruiter.name)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <p className="font-medium">{recruiter.name}</p>

                              <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                                {email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Company */}

                        <TableCell>
                          <div>
                            <p className="font-medium">{companyName}</p>

                            <p className="text-xs text-muted-foreground">
                              {companyLocation}
                            </p>
                          </div>
                        </TableCell>

                        {/* Status */}

                        <TableCell>
                          {getStatusBadge(recruiter.status)}
                        </TableCell>

                        {/* Joined */}

                        <TableCell className="text-sm text-muted-foreground">
                          {recruiter.createdAt
                            ? new Date(recruiter.createdAt).toLocaleDateString()
                            : "-"}
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
                                  disabled={isActionLoading}
                                />
                              }
                            >
                              {isActionLoading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}

                              <span className="sr-only">
                                Open recruiter actions
                              </span>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                  Recruiter Actions
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                {/* View */}

                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(
                                      `/admin/recruiters/${recruiter.id}`,
                                    )
                                  }
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Recruiter
                                </DropdownMenuItem>

                                {/* Pending */}

                                {recruiter.status === "PENDING" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateStatus(recruiter.id, "approve")
                                      }
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Approve Recruiter
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={() =>
                                        updateStatus(recruiter.id, "reject")
                                      }
                                    >
                                      <UserX className="mr-2 h-4 w-4" />
                                      Reject Recruiter
                                    </DropdownMenuItem>
                                  </>
                                )}

                                {/* Approved */}

                                {recruiter.status === "APPROVED" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateStatus(recruiter.id, "suspend")
                                    }
                                  >
                                    <UserX className="mr-2 h-4 w-4" />
                                    Suspend Recruiter
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-muted-foreground" />

                        <p className="font-medium">No recruiters found</p>

                        <p className="text-sm text-muted-foreground">
                          Try changing your search or status filter.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Result Count */}

          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {filteredRecruiters.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {recruiters.length}
            </span>{" "}
            recruiters
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminRecruiters;
