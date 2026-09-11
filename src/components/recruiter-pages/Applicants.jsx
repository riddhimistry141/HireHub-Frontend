import { useMemo, useState } from "react";

import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Search,
  UserRound,
} from "lucide-react";

import { useNavigate, useSearchParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock applicants for now.
const mockApplicants = [
  {
    id: "1",
    name: "Rahul Patel",
    email: "rahul.patel@example.com",
    jobId: "1",
    jobTitle: "Frontend Developer",
    location: "Ahmedabad",
    experience: "2 years",
    appliedDate: "2026-08-28",
    status: "REVIEWING",
  },
  {
    id: "2",
    name: "Priya Shah",
    email: "priya.shah@example.com",
    jobId: "1",
    jobTitle: "Frontend Developer",
    location: "Surat",
    experience: "1 year",
    appliedDate: "2026-08-27",
    status: "SHORTLISTED",
  },
  {
    id: "3",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    jobId: "1",
    jobTitle: "Frontend Developer",
    location: "Ahmedabad",
    experience: "3 years",
    appliedDate: "2026-08-26",
    status: "INTERVIEW",
  },
  {
    id: "4",
    name: "Neha Patel",
    email: "neha.patel@example.com",
    jobId: "1",
    jobTitle: "Frontend Developer",
    location: "Vadodara",
    experience: "2 years",
    appliedDate: "2026-08-25",
    status: "APPLIED",
  },
  {
    id: "5",
    name: "Karan Mehta",
    email: "karan.mehta@example.com",
    jobId: "1",
    jobTitle: "Frontend Developer",
    location: "Mumbai",
    experience: "4 years",
    appliedDate: "2026-08-23",
    status: "REJECTED",
  },
  {
    id: "6",
    name: "Sneha Desai",
    email: "sneha.desai@example.com",
    jobId: "2",
    jobTitle: "React Developer",
    location: "Surat",
    experience: "2 years",
    appliedDate: "2026-08-29",
    status: "APPLIED",
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

function Applicants() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const selectedJobId = searchParams.get("job");

  const selectedJobApplicants = useMemo(() => {
    if (!selectedJobId) {
      return mockApplicants;
    }

    return mockApplicants.filter(
      (applicant) => applicant.jobId === selectedJobId,
    );
  }, [selectedJobId]);

  const selectedJob = selectedJobApplicants[0]?.jobTitle || "All Applicants";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredApplicants = useMemo(() => {
    return selectedJobApplicants.filter((applicant) => {
      const matchesSearch =
        applicant.name.toLowerCase().includes(search.toLowerCase()) ||
        applicant.email.toLowerCase().includes(search.toLowerCase()) ||
        applicant.jobTitle.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || applicant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [selectedJobApplicants, search, statusFilter]);

  const totalApplicants = selectedJobApplicants.length;

  const reviewingCount = selectedJobApplicants.filter(
    (applicant) => applicant.status === "REVIEWING",
  ).length;

  const shortlistedCount = selectedJobApplicants.filter(
    (applicant) => applicant.status === "SHORTLISTED",
  ).length;

  const interviewCount = selectedJobApplicants.filter(
    (applicant) => applicant.status === "INTERVIEW",
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            variant="ghost"
            className="mb-2 px-0 hover:bg-transparent"
            onClick={() => navigate("/recruiter/jobs")}
          >
            <ChevronLeft className="mr-1 size-4" />
            Back to My Jobs
          </Button>

          <h1 className="text-2xl font-bold tracking-tight">Applicants</h1>

          <p className="mt-1 text-sm text-muted-foreground">{selectedJob}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserRound className="size-4" />
          {totalApplicants} applicants
        </div>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Applicants</p>

            <p className="mt-2 text-2xl font-bold">{totalApplicants}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Reviewing</p>

            <p className="mt-2 text-2xl font-bold">{reviewingCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Shortlisted</p>

            <p className="mt-2 text-2xl font-bold">{shortlistedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Interviews</p>

            <p className="mt-2 text-2xl font-bold">{interviewCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search applicants by name, email or job..."
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>

                <SelectItem value="APPLIED">Applied</SelectItem>

                <SelectItem value="REVIEWING">Reviewing</SelectItem>

                <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>

                <SelectItem value="INTERVIEW">Interview</SelectItem>

                <SelectItem value="REJECTED">Rejected</SelectItem>

                <SelectItem value="HIRED">Hired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applicants */}

      {filteredApplicants.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            {/* Desktop */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead className="border-b bg-muted/40">
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="px-6 py-4 font-medium">Applicant</th>

                    <th className="px-6 py-4 font-medium">Experience</th>

                    <th className="px-6 py-4 font-medium">Location</th>

                    <th className="px-6 py-4 font-medium">Applied</th>

                    <th className="px-6 py-4 font-medium">Status</th>

                    <th className="px-6 py-4 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredApplicants.map((applicant) => {
                    const status = statusConfig[applicant.status];

                    return (
                      <tr
                        key={applicant.id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                              {applicant.name
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0">
                              <p className="font-medium">{applicant.name}</p>

                              <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                                <Mail className="size-3" />
                                {applicant.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm">
                          {applicant.experience}
                        </td>

                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {applicant.location}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarDays className="size-3.5" />
                            {formatDate(applicant.appliedDate)}
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-md hover:bg-muted">
                              <span className="sr-only">Open actions</span>

                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(
                                    `/recruiter/applicants/${applicant.id}`,
                                  )
                                }
                              >
                                <Eye className="mr-2 size-4" />
                                View Applicant
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem>
                                Mark as Reviewing
                              </DropdownMenuItem>

                              <DropdownMenuItem>
                                Shortlist Applicant
                              </DropdownMenuItem>

                              <DropdownMenuItem>
                                Schedule Interview
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

            {/* Mobile */}

            <div className="divide-y md:hidden">
              {filteredApplicants.map((applicant) => {
                const status = statusConfig[applicant.status];

                return (
                  <div key={applicant.id} className="space-y-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {applicant.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {applicant.name}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {applicant.email}
                          </p>
                        </div>
                      </div>

                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <BriefcaseBusiness className="size-4" />
                        {applicant.experience}
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="size-4" />
                        {applicant.location}
                      </div>

                      <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                        <CalendarDays className="size-4" />
                        Applied {formatDate(applicant.appliedDate)}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        navigate(`/recruiter/applicants/${applicant.id}`)
                      }
                    >
                      <Eye className="mr-2 size-4" />
                      View Applicant
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <UserRound className="size-7 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">No applicants found</h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Try changing your search or status filter.
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setSearch("");
                setStatusFilter("ALL");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Applicants;
