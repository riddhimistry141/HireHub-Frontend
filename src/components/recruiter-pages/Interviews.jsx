import { useMemo, useState, useEffect } from "react";

import {
  CalendarDays,
  Clock3,
  ExternalLink,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  UserRound,
  Video,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusConfig = {
  SCHEDULED: {
    label: "Scheduled",
    variant: "default",
  },

  COMPLETED: {
    label: "Completed",
    variant: "secondary",
  },

  CANCELLED: {
    label: "Cancelled",
    variant: "destructive",
  },

  RESCHEDULED: {
    label: "Rescheduled",
    variant: "outline",
  },
};

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  const [hours, minutes] = time.split(":");

  const date = new Date();

  date.setHours(Number(hours), Number(minutes));

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function RecruiterInterviews() {
  const navigate = useNavigate();

  //const [interviews, setInterviews] = useState(mockInterviews);
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    candidateId: "",
    candidateName: "",
    applicationId: "",
    jobId: "",
    jobTitle: "",
    date: "",
    time: "",
    duration: "45",
    meetingLink: "",
    notes: "",
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${BASE_URL}/applications/recruiter/interviews`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch interviews");
        }

        const formattedInterviews = data.data.map((interview) => ({
          id: interview.id,

          applicationId: interview.applicationId,

          candidateId: interview.application.user.id,

          candidateName: interview.application.user.name,

          candidateEmail: interview.application.user.auth?.email || "",

          jobTitle: interview.application.job.title,

          company: interview.application.job.company?.name || "",

          date: interview.scheduledAt.split("T")[0],

          time: new Date(interview.scheduledAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),

          duration: interview.duration
            ? `${interview.duration} min`
            : "Not specified",

          meetingLink: interview.meetingLink,

          location: interview.location,

          status: interview.status,

          notes: interview.notes,
        }));

        setInterviews(formattedInterviews);

        //get applicat
        const applicationsResponse = await fetch(
          `${BASE_URL}/applications/recruiter`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const applicationsData = await applicationsResponse.json();

        if (!applicationsResponse.ok) {
          throw new Error(
            applicationsData.message || "Failed to fetch applications",
          );
        }

        setApplications(applicationsData.data || []);
      } catch (error) {
        console.error("Fetch interviews error:", error);

        setError(error.message || "Failed to fetch interviews");
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      const matchesSearch =
        interview.candidateName.toLowerCase().includes(search.toLowerCase()) ||
        interview.jobTitle.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || interview.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [interviews, search, statusFilter]);
  //applicastion of status = interview
  const interviewApplications = useMemo(() => {
    return applications.filter(
      (application) => application.status === "INTERVIEW",
    );
  }, [applications]);

  const interviewCandidates = useMemo(() => {
    const candidates = [];

    interviewApplications.forEach((application) => {
      const user = application.user;

      if (!user) {
        return;
      }

      const alreadyExists = candidates.some(
        (candidate) => candidate.id === user.id,
      );

      if (!alreadyExists) {
        candidates.push({
          id: user.id,
          name: user.name,
        });
      }
    });

    return candidates;
  }, [interviewApplications]);

  const selectedCandidateApplications = useMemo(() => {
    if (!formData.candidateId) {
      return [];
    }

    return interviewApplications.filter(
      (application) => application.user?.id === formData.candidateId,
    );
  }, [interviewApplications, formData.candidateId]);

  const scheduledCount = interviews.filter(
    (item) => item.status === "SCHEDULED",
  ).length;

  const completedCount = interviews.filter(
    (item) => item.status === "COMPLETED",
  ).length;

  const rescheduledCount = interviews.filter(
    (item) => item.status === "RESCHEDULED",
  ).length;

  const cancelledCount = interviews.filter(
    (item) => item.status === "CANCELLED",
  ).length;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCandidateChange = (candidateId) => {
    const candidate = interviewCandidates.find(
      (item) => item.id === candidateId,
    );

    const candidateApplications = interviewApplications.filter(
      (application) => application.user?.id === candidateId,
    );

    const firstApplication =
      candidateApplications.length === 1 ? candidateApplications[0] : null;

    setFormData((previous) => ({
      ...previous,
      candidateId: candidateId,
      candidateName: candidate?.name || "",
      applicationId: firstApplication?.id || "",
      jobId: firstApplication?.job?.id || "",
      jobTitle: firstApplication?.job?.title || "",
    }));
  };

  const handleJobChange = (jobId) => {
    const application = selectedCandidateApplications.find(
      (item) => item.job?.id === jobId,
    );

    setFormData((previous) => ({
      ...previous,
      jobId: jobId,
      applicationId: application?.id || "",
      jobTitle: application?.job?.title || "",
    }));
  };

  /* const handleSchedule = async () => {
    /* if (
      !formData.candidateName.trim() ||
      !formData.jobTitle.trim() ||
      !formData.date ||
      !formData.time ||
      !formData.meetingLink.trim()
    ) {
      return;
    } *

    if (
      !formData.candidateId ||
      !formData.applicationId ||
      !formData.jobId ||
      !formData.date ||
      !formData.time ||
      !formData.meetingLink.trim()
    ) {
      toast.error("Please select candidate, job, date, time and meeting link");
      return;
    }

    setSaving(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const newInterview = {
      id: String(Date.now()),
      candidateId: String(Date.now()),
      candidateName: formData.candidateName,
      jobTitle: formData.jobTitle,
      date: formData.date,
      time: formData.time,
      duration: `${formData.duration} min`,
      type: "VIDEO",
      meetingLink: formData.meetingLink,
      status: "SCHEDULED",
      notes: formData.notes,
    };

    setInterviews((previous) => [newInterview, ...previous]);

    setFormData({
      candidateName: "",
      jobTitle: "",
      date: "",
      time: "",
      duration: "45",
      meetingLink: "",
      notes: "",
    });

    setSaving(false);
    setDialogOpen(false);
  }; */

  const handleSchedule = async () => {
    if (
      !formData.candidateId ||
      !formData.applicationId ||
      !formData.jobId ||
      !formData.date ||
      !formData.time ||
      !formData.meetingLink.trim()
    ) {
      toast.error("Please select candidate, job, date, time and meeting link");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      const scheduledAt = new Date(
        `${formData.date}T${formData.time}`,
      ).toISOString();

      const response = await fetch(
        `${BASE_URL}/applications/recruiter/${formData.applicationId}/interview`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            scheduledAt,
            duration: Number(formData.duration),
            meetingLink: formData.meetingLink.trim() || null,
            location: null,
            notes: formData.notes.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to schedule interview");
      }

      toast.success("Interview scheduled successfully");

      setFormData({
        candidateId: "",
        candidateName: "",
        applicationId: "",
        jobId: "",
        jobTitle: "",
        date: "",
        time: "",
        duration: "45",
        meetingLink: "",
        notes: "",
      });

      setDialogOpen(false);

      // Refresh interviews
      const interviewsResponse = await fetch(
        `${BASE_URL}/applications/recruiter/interviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const interviewsData = await interviewsResponse.json();

      if (interviewsResponse.ok) {
        const formattedInterviews = (interviewsData.data || []).map(
          (interview) => ({
            id: interview.id,
            candidateId: interview.application.user.id,
            candidateName: interview.application.user.name,
            candidateEmail: interview.application.user.auth?.email || "",
            jobTitle: interview.application.job.title,
            date: interview.scheduledAt.split("T")[0],
            time: new Date(interview.scheduledAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }),
            duration: interview.duration
              ? `${interview.duration} min`
              : "Not specified",
            type: "VIDEO",
            meetingLink: interview.meetingLink,
            status: interview.status,
            notes: interview.notes,
          }),
        );

        setInterviews(formattedInterviews);
      }
    } catch (error) {
      console.error("Schedule interview error:", error);
      toast.error(error.message || "Failed to schedule interview");
    } finally {
      setSaving(false);
    }
  };

  const updateInterviewStatus = async (interviewId, status) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/applications/recruiter/interviews/${interviewId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update interview status");
      }

      setInterviews((previous) =>
        previous.map((interview) =>
          interview.id === interviewId
            ? {
                ...interview,
                status: data.data.status,
              }
            : interview,
        ),
      );

      toast.success(data.message || "Interview status updated");
    } catch (error) {
      console.error("Update interview status error:", error);

      toast.error(error.message || "Failed to update interview status");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interviews</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage candidate interviews and upcoming meetings.
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Schedule Interview
        </Button>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Scheduled</p>

              <CalendarDays className="size-5 text-primary" />
            </div>

            <p className="mt-2 text-2xl font-bold">{scheduledCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Completed</p>

              <Clock3 className="size-5 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold">{completedCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Rescheduled</p>

              <CalendarDays className="size-5 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold">{rescheduledCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Cancelled</p>

              <CalendarDays className="size-5 text-muted-foreground" />
            </div>

            <p className="mt-2 text-2xl font-bold">{cancelledCount}</p>
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
                placeholder="Search candidate or job..."
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Interviews</SelectItem>

                <SelectItem value="SCHEDULED">Scheduled</SelectItem>

                <SelectItem value="COMPLETED">Completed</SelectItem>

                <SelectItem value="RESCHEDULED">Rescheduled</SelectItem>

                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/*loaging*/}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">
              Loading interviews...
            </p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-destructive">{error}</p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredInterviews.length > 0 ? (
        <>
          {/* Interview List */}
          <div className="space-y-4">
            {filteredInterviews.map((interview) => {
              const status = statusConfig[interview.status];

              return (
                <Card
                  key={interview.id}
                  className="transition-shadow hover:shadow-sm"
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* Candidate */}

                      <div className="flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                          {interview.candidateName
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="font-semibold">
                              {interview.candidateName}
                            </h2>

                            <Badge variant={status.variant}>
                              {status.label}
                            </Badge>
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {interview.jobTitle}
                          </p>
                        </div>
                      </div>

                      {/* Date / Time */}

                      <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:items-center">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="size-4 text-muted-foreground" />

                          <div>
                            <p className="font-medium">
                              {formatDate(interview.date)}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {formatTime(interview.time)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Clock3 className="size-4 text-muted-foreground" />

                          <div>
                            <p className="font-medium">{interview.duration}</p>

                            <p className="text-xs text-muted-foreground">
                              Duration
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}

                      <div className="flex items-center gap-2">
                        {interview.status === "SCHEDULED" && (
                          <Button
                            variant="outline"
                            onClick={() =>
                              window.open(interview.meetingLink, "_blank")
                            }
                          >
                            <Video className="mr-2 size-4" />
                            Join
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex size-9 items-center justify-center rounded-md border hover:bg-muted">
                            <span className="sr-only">Open actions</span>

                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                navigate(
                                  `/recruiter/applicants/${interview.candidateId}`,
                                )
                              }
                            >
                              <UserRound className="mr-2 size-4" />
                              View Applicant
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                window.open(interview.meetingLink, "_blank")
                              }
                            >
                              <ExternalLink className="mr-2 size-4" />
                              Open Meeting
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            {interview.status !== "COMPLETED" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateInterviewStatus(
                                    interview.id,
                                    "COMPLETED",
                                  )
                                }
                              >
                                Mark Completed
                              </DropdownMenuItem>
                            )}

                            {interview.status !== "CANCELLED" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateInterviewStatus(
                                    interview.id,
                                    "CANCELLED",
                                  )
                                }
                              >
                                Cancel Interview
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Notes */}

                    {interview.notes && (
                      <div className="mt-5 rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">
                        {interview.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted">
              <CalendarDays className="size-7 text-muted-foreground" />
            </div>

            <h2 className="mt-4 text-lg font-semibold">No interviews found</h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Try changing your filters or schedule a new interview.
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

      {/* Schedule Dialog */}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>

            <DialogDescription>
              Schedule an interview with a candidate.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Candidate */}

            <div className="space-y-2">
              <Label htmlFor="candidateName">Candidate Name</Label>

              {/* <Input
                id="candidateName"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                placeholder="e.g. Rahul Patel"
              /> */}

              <Select
                value={formData.candidateId}
                onValueChange={handleCandidateChange}
              >
                <SelectTrigger id="candidateName">
                  {/* <SelectValue placeholder="Select candidate" /> */}
                  <SelectValue placeholder="Select candidate">
                    {
                      interviewCandidates.find(
                        (candidate) => candidate.id === formData.candidateId,
                      )?.name
                    }
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {interviewCandidates.length > 0 ? (
                    interviewCandidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-candidates" disabled>
                      No candidates selected for interview
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Job */}

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Position</Label>

              {/* <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
              /> */}

              <Select
                value={formData.jobId}
                onValueChange={handleJobChange}
                disabled={
                  !formData.candidateId ||
                  selectedCandidateApplications.length <= 1
                }
              >
                <SelectTrigger id="jobTitle">
                  {/* <SelectValue placeholder="Select job position" /> */}
                  <SelectValue placeholder="Select job position">
                    {
                      selectedCandidateApplications.find(
                        (application) => application.job?.id === formData.jobId,
                      )?.job?.title
                    }
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {selectedCandidateApplications.map((application) => (
                    <SelectItem
                      key={application.job.id}
                      value={application.job.id}
                    >
                      {application.job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date + Time */}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">Interview Date</Label>

                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Interview Time</Label>

                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Duration */}

            <div className="space-y-2">
              <Label>Duration</Label>

              <Select
                value={formData.duration}
                onValueChange={(value) =>
                  setFormData((previous) => ({
                    ...previous,
                    duration: value,
                  }))
                }
              >
                <SelectTrigger>
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
              <Label htmlFor="meetingLink">Meeting Link</Label>

              <div className="relative">
                <Video className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="meetingLink"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  placeholder="https://meet.example.com/..."
                  className="pl-9"
                />
              </div>
            </div>

            {/* Notes */}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>

              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add interview notes or instructions..."
                className="min-h-[90px] resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button onClick={handleSchedule} disabled={saving}>
              {saving ? "Scheduling..." : "Schedule Interview"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RecruiterInterviews;
