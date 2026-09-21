import { useEffect, useMemo, useState } from "react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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
  WITHDRAWN: {
    label: "Withdrawn",
    variant: "secondary",
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

  const [applications, setApplications] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //interview
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  //const [interviewDate, setInterviewDate] = useState("");
  //const [interviewTime, setInterviewTime] = useState("");
  //const [interviewNotes, setInterviewNotes] = useState("");

  const [schedulingInterview, setSchedulingInterview] = useState(false);

  const [interviewForm, setInterviewForm] = useState({
    date: "",
    time: "",
    duration: "45",
    meetingLink: "",
    location: "",
    notes: "",
  });

  /*
   * Fetch recruiter applications
   */
  useEffect(() => {
    let ignore = false;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication token not found");
        }

        const response = await fetch(`${BASE_URL}/applications/recruiter`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch applicants");
        }

        if (!ignore) {
          setApplications(result.data || []);
        }
      } catch (error) {
        console.error("Fetch recruiter applications error:", error);

        if (!ignore) {
          setError(error.message || "Failed to fetch applicants");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchApplications();

    return () => {
      ignore = true;
    };
  }, []);

  const updateApplicantStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/applications/recruiter/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update application status");
      }

      setApplications((prevApplicants) =>
        prevApplicants.map((applicant) =>
          applicant.id === applicationId
            ? {
                ...applicant,
                status: data.data.status,
              }
            : applicant,
        ),
      );

      toast.success(data.message || "Application status updated");
    } catch (error) {
      console.error("Update applicant status error:", error);
      toast.error(error.message || "Failed to update application status");
    }
  };

  /*
   * Convert backend application data into the
   * structure already used by the existing UI.
   */
  const applicants = useMemo(() => {
    return applications.map((application) => ({
      id: application.id,
      name: application.user?.name || "Unknown Applicant",
      email: application.user?.auth?.email || "No email",
      jobId: application.job?.id,
      jobTitle: application.job?.title || "Unknown Job",
      location: application.job?.location || "Not specified",
      experience:
        application.job?.experience?.experienceName || "Not specified",
      appliedDate: application.createdAt,
      status: application.status,
    }));
  }, [applications]);

  /*
   * Filter by selected job from ?job=JOB_ID
   */
  const selectedJobApplicants = useMemo(() => {
    if (!selectedJobId) {
      return applicants;
    }

    return applicants.filter((applicant) => applicant.jobId === selectedJobId);
  }, [applicants, selectedJobId]);

  const selectedJob = selectedJobApplicants[0]?.jobTitle || "All Applicants";

  /*
   * Search + status filtering
   */
  const filteredApplicants = useMemo(() => {
    return selectedJobApplicants.filter((applicant) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        applicant.name.toLowerCase().includes(searchValue) ||
        applicant.email.toLowerCase().includes(searchValue) ||
        applicant.jobTitle.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" || applicant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [selectedJobApplicants, search, statusFilter]);

  /*
   * Statistics
   */
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

  const openScheduleInterview = (applicant) => {
    setSelectedApplicant(applicant);

    setInterviewForm({
      date: "",
      time: "",
      duration: "45",
      meetingLink: "",
      location: "",
      notes: "",
    });

    setScheduleDialogOpen(true);
  };

  const handleInterviewFormChange = (event) => {
    const { name, value } = event.target;

    setInterviewForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleScheduleInterview = async () => {
    if (!selectedApplicant) {
      return;
    }

    if (!interviewForm.date || !interviewForm.time) {
      toast.error("Interview date and time are required");
      return;
    }

    setSchedulingInterview(true);

    try {
      const token = localStorage.getItem("token");

      const scheduledAt = new Date(
        `${interviewForm.date}T${interviewForm.time}`,
      ).toISOString();

      const response = await fetch(
        `${BASE_URL}/applications/recruiter/${selectedApplicant.id}/interview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            scheduledAt,
            duration: Number(interviewForm.duration),
            meetingLink: interviewForm.meetingLink.trim() || null,
            location: interviewForm.location.trim() || null,
            notes: interviewForm.notes.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to schedule interview");
      }

      // Update applicant status immediately in the UI
      setApplications((previousApplicants) =>
        previousApplicants.map((applicant) =>
          applicant.id === selectedApplicant.id
            ? {
                ...applicant,
                status: "INTERVIEW",
              }
            : applicant,
        ),
      );

      toast.success(data.message || "Interview scheduled successfully");

      setScheduleDialogOpen(false);
      setSelectedApplicant(null);
    } catch (error) {
      console.error("Schedule interview error:", error);

      toast.error(error.message || "Failed to schedule interview");
    } finally {
      setSchedulingInterview(false);
    }
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="mx-auto max-w-7xl">
        <Card>
          <CardContent className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <p className="font-medium">Loading applicants...</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Please wait while we fetch the applications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  /*
   * Error state
   */
  if (error) {
    return (
      <div className="mx-auto max-w-7xl">
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <UserRound className="size-7 text-destructive" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">
              Failed to load applicants
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {error}
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
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

                    <th className="px-6 py-4 font-medium">Job Position</th>

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
                    const status = statusConfig[applicant.status] || {
                      label: applicant.status,
                      variant: "secondary",
                    };

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
                          {applicant.jobTitle}
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

                              <DropdownMenuItem
                                onClick={() =>
                                  updateApplicantStatus(
                                    applicant.id,
                                    "REVIEWING",
                                  )
                                }
                              >
                                Mark as Reviewing
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  updateApplicantStatus(
                                    applicant.id,
                                    "SHORTLISTED",
                                  )
                                }
                              >
                                Shortlist Applicant
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => openScheduleInterview(applicant)}
                              >
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
                const status = statusConfig[applicant.status] || {
                  label: applicant.status,
                  variant: "secondary",
                };

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
      ;{/* schedule Interview dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>

            <DialogDescription>
              {/* Schedule an interview with{" "}
              <span className="font-medium text-foreground">
                {selectedApplicant?.name}
              </span> */}{" "}
              Schedule an interview for the selected applicant. .
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Candidate Name */}
            <div className="space-y-2">
              <Label htmlFor="candidate-name">Candidate Name</Label>

              <Input
                id="candidate-name"
                value={selectedApplicant?.name || ""}
                disabled
              />
            </div>

            {/* Job Position */}
            <div className="space-y-2">
              <Label htmlFor="job-position">Job Position</Label>

              <Input
                id="job-position"
                value={selectedApplicant?.jobTitle || ""}
                disabled
              />
            </div>
          </div>

          <div className="space-y-5">
            {/* Date + Time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="interview-date">Interview Date</Label>

                <Input
                  id="interview-date"
                  name="date"
                  type="date"
                  value={interviewForm.date}
                  onChange={handleInterviewFormChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interview-time">Interview Time</Label>

                <Input
                  id="interview-time"
                  name="time"
                  type="time"
                  value={interviewForm.time}
                  onChange={handleInterviewFormChange}
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="interview-duration">Duration</Label>

              <Select
                value={interviewForm.duration}
                onValueChange={(value) =>
                  setInterviewForm((previous) => ({
                    ...previous,
                    duration: value,
                  }))
                }
              >
                <SelectTrigger id="interview-duration">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>

                  <SelectItem value="45">45 minutes</SelectItem>

                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meeting Link */}
            <div className="space-y-2">
              <Label htmlFor="interview-meeting-link">Meeting Link</Label>

              <Input
                id="interview-meeting-link"
                name="meetingLink"
                type="url"
                value={interviewForm.meetingLink}
                onChange={handleInterviewFormChange}
                placeholder="https://meet.google.com/..."
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="interview-location">Location</Label>

              <Input
                id="interview-location"
                name="location"
                value={interviewForm.location}
                onChange={handleInterviewFormChange}
                placeholder="Office / Google Meet / Other"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="interview-notes">Notes</Label>

              <Textarea
                id="interview-notes"
                name="notes"
                value={interviewForm.notes}
                onChange={handleInterviewFormChange}
                placeholder="Add interview instructions or notes..."
                className="min-h-[90px] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setScheduleDialogOpen(false)}
              disabled={schedulingInterview}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleScheduleInterview}
              disabled={
                schedulingInterview ||
                !interviewForm.date ||
                !interviewForm.time
              }
            >
              {schedulingInterview ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Applicants;
