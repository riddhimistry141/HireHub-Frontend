import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

function Dashboard() {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [applicationsResponse, savedJobsResponse, resumeResponse] =
          await Promise.all([
            fetch(`${BASE_URL}/applications/my`, {
              headers,
            }),

            fetch(`${BASE_URL}/jobs/saved`, {
              headers,
            }),

            fetch(`${BASE_URL}/resume`, {
              headers,
            }),
          ]);

        const applicationsData = await applicationsResponse.json();
        const savedJobsData = await savedJobsResponse.json();
        const resumeData = await resumeResponse.json();

        if (!applicationsResponse.ok) {
          throw new Error(
            applicationsData.message || "Failed to fetch applications",
          );
        }

        if (!savedJobsResponse.ok) {
          throw new Error(
            savedJobsData.message || "Failed to fetch saved jobs",
          );
        }

        if (!resumeResponse.ok) {
          throw new Error(resumeData.message || "Failed to fetch resume");
        }

        setApplications(applicationsData.data || []);
        setSavedJobs(savedJobsData.data || []);
        setResume(resumeData.data || null);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setError(error.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [BASE_URL, navigate]);

  const user = JSON.parse(localStorage.getItem("user"));

  const name = user?.name || "User";

  const totalApplications = applications.length;

  const totalInterviews = applications.filter(
    (application) =>
      application.status === "INTERVIEW" && application.interview,
  ).length;

  const totalSavedJobs = savedJobs.length;

  const recentApplications = applications.slice(0, 3);

  const formatStatus = (status) => {
  const statusLabels = {
    APPLIED: "Applied",
    REVIEWING: "Under Review",
    SHORTLISTED: "Shortlisted",
    INTERVIEW: "Interview",
    HIRED: "Hired",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
  };

  return statusLabels[status] || status;
};

  return (
    <div className="space-y-6">
      {/* ================= WELCOME ================= */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {name}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's an overview of your career activity.
        </p>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Applications */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <BriefcaseBusiness className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                totalApplications
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Total applications
            </p>
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviews</CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <CalendarDays className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                totalInterviews
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Upcoming interviews
            </p>
          </CardContent>
        </Card>

        {/* Saved Jobs */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <Bookmark className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                totalSavedJobs
              )}
            </div>

            <p className="mt-1 text-xs text-muted-foreground">Jobs saved</p>
          </CardContent>
        </Card>
      </div>

      {/* ================= RECENT APPLICATIONS ================= */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Applications</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest job applications
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/applications")}
          >
            View all
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <div className="divide-y">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  You haven't applied for any jobs yet.
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate("/jobs")}
                >
                  Browse Jobs
                </Button>
              </div>
            ) : (
              recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="cursor-pointer flex flex-col gap-3 rounded-lg py-4 transition-colors hover:bg-muted/50 first:pt-0 sm:flex-row sm:items-center sm:justify-between py-3 px-6"
                  onClick={() => navigate(`/applications/${application.id}`)}
                >
                  <div className="min-w-0">
                    <h3 className="truncate font-medium">
                      {application.job?.title || "Unknown Job"}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {application.job?.company?.name || "Company"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{formatStatus(application.status)}</Badge>

                    <span className="text-xs text-muted-foreground">
                      {new Date(application.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ================= UPCOMING INTERVIEW ================= */}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Upcoming Interview</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Your next scheduled interview
            </p>
          </div>

          <CalendarDays className="size-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : !applications.find(
              (application) =>
                application.status === "INTERVIEW" &&
                application.interview?.status === "SCHEDULED",
            ) ? (
            <div className="py-6 text-center">
              <p className="text-sm text-muted-foreground">
                No upcoming interviews.
              </p>
            </div>
          ) : (
            (() => {
              const interviewApplication = applications.find(
                (application) =>
                  application.status === "INTERVIEW" &&
                  application.interview?.status === "SCHEDULED",
              );

              return (
                <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {interviewApplication.job?.title || "Interview"}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {interviewApplication.job?.company?.name || "Company"}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {new Date(
                          interviewApplication.interview.scheduledAt,
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      <span>•</span>

                      <span>
                        {new Date(
                          interviewApplication.interview.scheduledAt,
                        ).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {interviewApplication.interview.duration && (
                        <>
                          <span>•</span>

                          <span>
                            {interviewApplication.interview.duration} min
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/applications/${interviewApplication.id}`)
                    }
                  >
                    View Interview
                    <ArrowRight className="ml-1 size-4" />
                  </Button>
                </div>
              );
            })()
          )}
        </CardContent>
      </Card>

      {/* ================= RECENT RESUME ================= */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Resume</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest resume information
            </p>
          </div>

          <Button variant="ghost" size="sm" onClick={() => navigate("/resume")}>
            View resume
            <ArrowRight className="ml-1 size-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Resume file */}
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="truncate font-medium">
                {resume?.fileName || "No resume uploaded"}
              </p>

              <p className="text-sm text-muted-foreground">
                {resume?.updatedAt
                  ? `Last updated: ${new Date(
                      resume.updatedAt,
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}`
                  : "Upload your resume to get started"}
              </p>
            </div>
          </div>

          {/* Profile completion */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">Resume Status</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {resume
                  ? "Your resume is ready to use for applications."
                  : "No resume uploaded yet."}
              </p>
            </div>

            <Badge variant={resume ? "secondary" : "outline"}>
              {resume ? "Active" : "Missing"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
