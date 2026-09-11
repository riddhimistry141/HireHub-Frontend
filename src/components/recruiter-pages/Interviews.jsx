import { useMemo, useState } from "react";

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

const mockInterviews = [
  {
    id: "1",
    candidateId: "3",
    candidateName: "Amit Kumar",
    jobTitle: "Frontend Developer",
    date: "2026-09-08",
    time: "11:00",
    duration: "45 min",
    type: "VIDEO",
    meetingLink: "https://meet.example.com/amit",
    status: "SCHEDULED",
    notes: "Technical interview focused on React and JavaScript.",
  },

  {
    id: "2",
    candidateId: "7",
    candidateName: "Neha Patel",
    jobTitle: "React Developer",
    date: "2026-09-09",
    time: "14:30",
    duration: "30 min",
    type: "VIDEO",
    meetingLink: "https://meet.example.com/neha",
    status: "SCHEDULED",
    notes: "Initial technical discussion.",
  },

  {
    id: "3",
    candidateId: "8",
    candidateName: "Karan Mehta",
    jobTitle: "Node.js Developer",
    date: "2026-09-04",
    time: "10:30",
    duration: "45 min",
    type: "VIDEO",
    meetingLink: "https://meet.example.com/karan",
    status: "COMPLETED",
    notes: "Backend technical round completed.",
  },

  {
    id: "4",
    candidateId: "9",
    candidateName: "Sneha Desai",
    jobTitle: "React Developer",
    date: "2026-09-03",
    time: "15:00",
    duration: "30 min",
    type: "VIDEO",
    meetingLink: "https://meet.example.com/sneha",
    status: "CANCELLED",
    notes: "Candidate requested cancellation.",
  },

  {
    id: "5",
    candidateId: "10",
    candidateName: "Rahul Shah",
    jobTitle: "Full Stack Developer",
    date: "2026-09-10",
    time: "12:00",
    duration: "45 min",
    type: "VIDEO",
    meetingLink: "https://meet.example.com/rahul",
    status: "RESCHEDULED",
    notes: "Interview moved from September 7.",
  },
];

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

  const [interviews, setInterviews] = useState(mockInterviews);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    candidateName: "",
    jobTitle: "",
    date: "",
    time: "",
    duration: "45",
    meetingLink: "",
    notes: "",
  });

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

  const handleSchedule = async () => {
    if (
      !formData.candidateName.trim() ||
      !formData.jobTitle.trim() ||
      !formData.date ||
      !formData.time ||
      !formData.meetingLink.trim()
    ) {
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
  };

  const updateInterviewStatus = (interviewId, status) => {
    setInterviews((previous) =>
      previous.map((interview) =>
        interview.id === interviewId
          ? {
              ...interview,
              status,
            }
          : interview,
      ),
    );
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

      {/* Interview List */}

      {filteredInterviews.length > 0 ? (
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

                          <Badge variant={status.variant}>{status.label}</Badge>
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
                                updateInterviewStatus(interview.id, "COMPLETED")
                              }
                            >
                              Mark Completed
                            </DropdownMenuItem>
                          )}

                          {interview.status !== "CANCELLED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateInterviewStatus(interview.id, "CANCELLED")
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

              <Input
                id="candidateName"
                name="candidateName"
                value={formData.candidateName}
                onChange={handleChange}
                placeholder="e.g. Rahul Patel"
              />
            </div>

            {/* Job */}

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Position</Label>

              <Input
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
              />
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
