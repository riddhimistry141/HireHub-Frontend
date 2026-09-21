import { useEffect, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Clock3,
  Loader2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const formatDate = (date) => {
  if (!date) {
    return "Not specified";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const SavedJobs = () => {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to view saved jobs");
      }

      const response = await fetch(`${BASE_URL}/jobs/saved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch saved jobs"
        );
      }

      setSavedJobs(data.data || []);
    } catch (error) {
      console.error("Fetch saved jobs error:", error);
      setError(error.message || "Failed to fetch saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleRemoveSavedJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/jobs/${jobId}/save`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove saved job"
        );
      }

      setSavedJobs((previousJobs) =>
        previousJobs.filter(
          (savedJob) => savedJob.job.id !== jobId
        )
      );

      toast.success("Job removed from saved jobs");
    } catch (error) {
      console.error("Remove saved job error:", error);

      toast.error(
        error.message || "Failed to remove saved job"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Saved Jobs
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Jobs you saved for later.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center">
          <Bookmark className="mx-auto size-10 text-muted-foreground" />

          <h2 className="mt-4 text-lg font-semibold">
            No saved jobs
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Save jobs you're interested in and find them here later.
          </p>

          <button
            type="button"
            onClick={() => navigate("/jobs")}
            className="mt-5 text-sm font-medium text-primary hover:underline"
          >
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          {savedJobs.map((savedJob) => {
            const job = savedJob.job;

            return (
              <div
                key={savedJob.id}
                className="rounded-xl border bg-card p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="size-4" />
                      <span>
                        {job.company?.companyName ||
                          "Company"}
                      </span>
                    </div>

                    <h2 className="mt-2 text-xl font-semibold">
                      {job.title}
                    </h2>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        {job.location}
                      </span>

                      <span className="flex items-center gap-2">
                        <BriefcaseBusiness className="size-4" />
                        {job.jobType}
                      </span>

                      {job.experience?.experienceName && (
                        <span className="flex items-center gap-2">
                          <Clock3 className="size-4" />
                          {job.experience.experienceName}
                        </span>
                      )}
                    </div>

                    {job.salary && (
                      <p className="mt-4 text-sm font-medium">
                        Salary: {job.salary}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-muted-foreground">
                      Deadline:{" "}
                      {formatDate(job.applicationDeadline)}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSavedJob(job.id)
                      }
                      className="inline-flex items-center justify-center rounded-lg border p-2 hover:bg-muted"
                      title="Remove saved job"
                    >
                      <Bookmark className="size-5 fill-current" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/jobs/${job.id}`)
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      View Job
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;