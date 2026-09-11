import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Eye,
  FileText,
  MoreHorizontal,
  Search,
  User,
  Users,
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
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockApplications = [
  {
    id: "APP001",
    applicantId: "1",
    applicantName: "Rahul Patel",
    applicantEmail: "rahul.patel@gmail.com",
    jobId: "1",
    jobTitle: "Frontend Developer",
    company: "TechCorp",
    recruiterName: "Amit Kumar",
    appliedDate: "2026-08-28",
    status: "APPLIED",
  },
  {
    id: "APP002",
    applicantId: "2",
    applicantName: "Priya Shah",
    applicantEmail: "priya.shah@gmail.com",
    jobId: "2",
    jobTitle: "React Developer",
    company: "InnovateLabs",
    recruiterName: "Vikram Shah",
    appliedDate: "2026-08-27",
    status: "REVIEWING",
  },
  {
    id: "APP003",
    applicantId: "3",
    applicantName: "Amit Mehta",
    applicantEmail: "amit.mehta@gmail.com",
    jobId: "3",
    jobTitle: "Node.js Developer",
    company: "CodeWorks",
    recruiterName: "Neha Mehta",
    appliedDate: "2026-08-26",
    status: "SHORTLISTED",
  },
  {
    id: "APP004",
    applicantName: "Neha Patel",
    applicantId: "4",
    applicantEmail: "neha.patel@gmail.com",
    jobId: "4",
    jobTitle: "Full Stack Developer",
    company: "TechCorp",
    recruiterName: "Amit Kumar",
    appliedDate: "2026-08-25",
    status: "INTERVIEW",
  },
  {
    id: "APP005",
    applicantName: "Vikram Shah",
    applicantId: "5",
    applicantEmail: "vikram.shah@gmail.com",
    jobId: "5",
    jobTitle: "Junior React Developer",
    company: "InnovateLabs",
    recruiterName: "Vikram Shah",
    appliedDate: "2026-08-24",
    status: "HIRED",
  },
  {
    id: "APP006",
    applicantName: "Riya Mehta",
    applicantId: "6",
    applicantEmail: "riya.mehta@gmail.com",
    jobId: "6",
    jobTitle: "Software Developer",
    company: "Startup.io",
    recruiterName: "Karan Shah",
    appliedDate: "2026-08-23",
    status: "REJECTED",
  },
];

const statusConfig = {
  APPLIED: {
    label: "Applied",
    className: "bg-blue-100 text-blue-700",
  },
  REVIEWING: {
    label: "Reviewing",
    className: "bg-yellow-100 text-yellow-700",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "bg-purple-100 text-purple-700",
  },
  INTERVIEW: {
    label: "Interview",
    className: "bg-orange-100 text-orange-700",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-100 text-red-700",
  },
  HIRED: {
    label: "Hired",
    className: "bg-green-100 text-green-700",
  },
};

function AdminApplications() {
  const navigate = useNavigate();

  const [applications] = useState(mockApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        application.applicantName.toLowerCase().includes(searchText) ||
        application.applicantEmail.toLowerCase().includes(searchText) ||
        application.jobTitle.toLowerCase().includes(searchText) ||
        application.company.toLowerCase().includes(searchText) ||
        application.recruiterName.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

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

    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Applications</h1>

        <p className="text-muted-foreground">
          Monitor job applications across the HireHub platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-blue-100 p-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Total Applications
              </p>

              <p className="text-2xl font-bold">{totalApplications}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-yellow-100 p-3">
              <Clock3 className="h-5 w-5 text-yellow-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Under Review</p>

              <p className="text-2xl font-bold">{reviewingCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-purple-100 p-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Shortlisted</p>

              <p className="text-2xl font-bold">{shortlistedCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-lg bg-orange-100 p-3">
              <CalendarDays className="h-5 w-5 text-orange-600" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Interviews</p>

              <p className="text-2xl font-bold">{interviewCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applicant, job, company or recruiter..."
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardContent className="p-0">
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Applicant
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Job
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Recruiter
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Applied
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>

                        <div>
                          <p className="font-medium">
                            {application.applicantName}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {application.applicantEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium">{application.jobTitle}</p>

                      <p className="text-xs text-muted-foreground">
                        {application.company}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {application.recruiterName}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {application.appliedDate}
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(application.status)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/admin/applications/${application.id}`,
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Application
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                navigate(`/admin/users/${application.applicantId}`)
                              }
                            >
                              <User className="mr-2 h-4 w-4" />
                              View Applicant
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() => navigate(`/admin/jobs/${application.jobId}`)}>
                              <BriefcaseBusiness className="mr-2 h-4 w-4" />
                              View Job
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="space-y-3 p-4 md:hidden">
            {filteredApplications.map((application) => (
              <div key={application.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>

                    <div>
                      <p className="font-medium">{application.applicantName}</p>

                      <p className="text-xs text-muted-foreground">
                        {application.applicantEmail}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/admin/applications/${application.id}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Application
                      </DropdownMenuItem>

                      <DropdownMenuItem onClick={() => navigate(`/admin/jobs/${application.id}`)}>
                        <BriefcaseBusiness className="mr-2 h-4 w-4" />
                        View Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 space-y-2">
                  <div>
                    <p className="text-sm font-medium">
                      {application.jobTitle}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {application.company}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(application.status)}

                    <span className="text-xs text-muted-foreground">
                      Applied {application.appliedDate}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Recruiter: {application.recruiterName}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty */}
          {filteredApplications.length === 0 && (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">No applications found</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Try changing your search or status filter.
              </p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminApplications;
