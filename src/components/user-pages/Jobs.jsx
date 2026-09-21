import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  Bookmark,
  ArrowRight,
  Building2,
  Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function getJobTypeLabel(type) {
  const labels = {
    ONSITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
  };

  return labels[type] || type;
}

function getJobTypeClasses(type) {
  const classes = {
    ONSITE:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",

    REMOTE:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300",

    HYBRID:
      "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300",
  };

  return classes[type] || "";
}

function formatPostedDate(date) {
  if (!date) {
    return "";
  }

  const createdDate = new Date(date);

  if (Number.isNaN(createdDate.getTime())) {
    return "";
  }

  const now = new Date();

  const differenceInMilliseconds = now.getTime() - createdDate.getTime();

  const differenceInDays = Math.floor(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );

  if (differenceInDays <= 0) {
    return "Today";
  }

  if (differenceInDays === 1) {
    return "1 day ago";
  }

  if (differenceInDays < 7) {
    return `${differenceInDays} days ago`;
  }

  if (differenceInDays < 14) {
    return "1 week ago";
  }

  const weeks = Math.floor(differenceInDays / 7);

  return `${weeks} weeks ago`;
}

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savedJobs, setSavedJobs] = useState({});
  const [savingJobId, setSavingJobId] = useState(null);

  // Fetch active jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${BASE_URL}/jobs`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch jobs");
        }

        setJobs(data.data || []);
      } catch (error) {
        console.error("Fetch jobs error:", error);

        setError(error.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const loadSavedJobs = async () => {
      const token = localStorage.getItem("token");

      if (!token || jobs.length === 0) {
        return;
      }

      try {
        const savedJobEntries = await Promise.all(
          jobs.map(async (job) => {
            const response = await fetch(`${BASE_URL}/jobs/${job.id}/saved`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || "Failed to check saved job");
            }

            return [job.id, data.saved];
          }),
        );

        setSavedJobs(Object.fromEntries(savedJobEntries));
      } catch (error) {
        console.error("Load saved jobs error:", error);
      }
    };

    loadSavedJobs();
  }, [jobs]);

  const handleSaveJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to save jobs");
        return;
      }

      setSavingJobId(jobId);

      const response = await fetch(`${BASE_URL}/jobs/${jobId}/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save job");
      }

      setSavedJobs((previous) => ({
        ...previous,
        [jobId]: data.saved,
      }));

      toast.success(data.message);
    } catch (error) {
      console.error("Save job error:", error);

      toast.error(error.message || "Failed to save job");
    } finally {
      setSavingJobId(null);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchText = search.trim().toLowerCase();

      const title = job.title?.toLowerCase() || "";

      const company = job.company?.name?.toLowerCase() || "";

      const location = job.location?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        company.includes(searchText);

      const matchesLocation =
        locationFilter === "ALL" || job.location === locationFilter;

      const matchesType = typeFilter === "ALL" || job.jobType === typeFilter;

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, search, locationFilter, typeFilter]);

  const clearFilters = () => {
    setSearch("");
    setLocationFilter("ALL");
    setTypeFilter("ALL");
  };

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Find Your Next Opportunity
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Discover jobs that match your skills and career goals.
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search jobs or companies..."
                className="pl-9"
              />
            </div>

            {/* Location */}
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full lg:w-[210px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Locations</SelectItem>

                <SelectItem value="Ahmedabad, Gujarat">Ahmedabad</SelectItem>

                <SelectItem value="Surat, Gujarat">Surat</SelectItem>

                <SelectItem value="Vadodara, Gujarat">Vadodara</SelectItem>

                <SelectItem value="Mumbai, Maharashtra">Mumbai</SelectItem>

                <SelectItem value="Remote">Remote</SelectItem>
              </SelectContent>
            </Select>

            {/* Job Type */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All Job Types</SelectItem>

                <SelectItem value="ONSITE">On-site</SelectItem>

                <SelectItem value="REMOTE">Remote</SelectItem>

                <SelectItem value="HYBRID">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />

              <span>Loading jobs...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {!loading && error && (
        <Card>
          <CardContent className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <Search className="size-5 text-muted-foreground" />
            </div>

            <h3 className="font-semibold text-foreground">
              Unable to load jobs
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {error}
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loaded content */}
      {!loading && !error && (
        <>
          {/* Results heading */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-foreground">Available Jobs</h2>

              <p className="text-sm text-muted-foreground">
                Showing {filteredJobs.length} of {jobs.length} jobs
              </p>
            </div>
          </div>

          {/* No jobs / no filtered jobs */}
          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                  <Search className="size-5 text-muted-foreground" />
                </div>

                <h3 className="font-semibold text-foreground">
                  {jobs.length === 0 ? "No jobs available" : "No jobs found"}
                </h3>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  {jobs.length === 0
                    ? "There are currently no active jobs available."
                    : "We couldn't find any jobs matching your search or selected filters."}
                </p>

                {jobs.length > 0 && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            /* Job list */
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 className="size-5" />
                        </div>

                        <div className="min-w-0">
                          <CardTitle className="truncate text-base text-foreground">
                            {job.title}
                          </CardTitle>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {job.company?.name || "Company"}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSaveJob(job.id)}
                        disabled={savingJobId === job.id}
                      >
                        <Bookmark
                          className={`size-4 ${
                            savedJobs[job.id] ? "fill-current" : ""
                          }`}
                        />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Job metadata */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-4" />
                        {job.location}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <BriefcaseBusiness className="size-4" />

                        {job.experience?.experienceName || "Not specified"}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock3 className="size-4" />

                        {formatPostedDate(job.createdAt)}
                      </span>
                    </div>

                    {/* Salary + type */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {job.salary || "Salary not specified"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          Salary range
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className={getJobTypeClasses(job.jobType)}
                      >
                        {getJobTypeLabel(job.jobType)}
                      </Badge>
                    </div>

                    {/* Action */}
                    <Button
                      className="w-full"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View Job Details
                      <ArrowRight className="ml-1 size-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Jobs;
