
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    jobType: "",
    experience: "",
    salary: "",
    skills: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    applicationDeadline: "",
    isActive: true,
  });

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  const token = localStorage.getItem("token");

  // Fetch job and experience data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setServerError("");

        const [jobResponse, experienceResponse] = await Promise.all([
          fetch(`${BASE_URL}/jobs/${jobId}`),

          fetch(`${BASE_URL}/experiences`),
        ]);

        const jobData = await jobResponse.json();
        const experienceData = await experienceResponse.json();

        if (!jobResponse.ok) {
          throw new Error(
            jobData.message || "Failed to fetch job details"
          );
        }

        if (!experienceResponse.ok) {
          throw new Error(
            experienceData.message || "Failed to fetch experiences"
          );
        }

        const job = jobData.data;

        setFormData({
          title: job.title || "",
          location: job.location || "",
          jobType: job.jobType || "",
          experience: job.experience?.experienceName || "",
          salary: job.salary || "",
          skills: Array.isArray(job.skills)
            ? job.skills.join(", ")
            : "",
          description: job.description || "",
          responsibilities: Array.isArray(job.responsibilities)
            ? job.responsibilities.join("\n")
            : "",
          requirements: Array.isArray(job.requirements)
            ? job.requirements.join("\n")
            : "",
          benefits: Array.isArray(job.benefits)
            ? job.benefits.join("\n")
            : "",
          applicationDeadline: job.applicationDeadline
            ? new Date(job.applicationDeadline)
                .toISOString()
                .split("T")[0]
            : "",
          isActive: job.isActive ?? true,
        });

        setExperiences(experienceData.data || []);
      } catch (error) {
        console.error("Fetch edit job error:", error);
        setServerError(
          error.message || "Failed to load job details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchData();
    }
  }, [jobId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const convertCommaSeparatedToArray = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const convertLinesToArray = (value) => {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (!formData.jobType) {
      newErrors.jobType = "Job type is required.";
    }

    if (!formData.experience) {
      newErrors.experience = "Experience is required.";
    }

    if (!formData.salary.trim()) {
      newErrors.salary = "Salary is required.";
    }

    if (!formData.skills.trim()) {
      newErrors.skills = "At least one skill is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required.";
    }

    if (!formData.responsibilities.trim()) {
      newErrors.responsibilities =
        "Responsibilities are required.";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Requirements are required.";
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline =
        "Application deadline is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setSaving(true);

      const selectedExperience = experiences.find(
        (experience) =>
          experience.experienceName === formData.experience
      );

      if (!selectedExperience) {
        toast.error("Selected experience is invalid.");
        return;
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        experienceId: selectedExperience.id,

        // One salary field
        salary: formData.salary.trim(),

        skills: convertCommaSeparatedToArray(formData.skills),

        responsibilities: convertLinesToArray(
          formData.responsibilities
        ),

        requirements: convertLinesToArray(
          formData.requirements
        ),

        benefits: convertLinesToArray(
          formData.benefits
        ),

        applicationDeadline:
          formData.applicationDeadline,

        isActive: formData.isActive,
      };

      const response = await fetch(
        `${BASE_URL}/jobs/${jobId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update job"
        );
      }

      toast.success("Job updated successfully.");

      navigate("/recruiter/jobs");
    } catch (error) {
      console.error("Update job error:", error);

      toast.error(
        error.message || "Failed to update job."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Loading job...
        </div>
      </div>
    );
  }

  if (serverError) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/recruiter/jobs")}
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to My Jobs
        </Button>

        <Card>
          <CardContent className="flex min-h-[250px] items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground">
                Unable to load job
              </h2>

              <p className="mt-2 text-muted-foreground">
                {serverError}
              </p>

              <Button
                className="mt-5"
                onClick={() => navigate("/recruiter/jobs")}
              >
                Back to My Jobs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            variant="ghost"
            className="mb-3 px-0"
            onClick={() => navigate("/recruiter/jobs")}
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to My Jobs
          </Button>

          <h1 className="text-2xl font-bold text-foreground">
            Edit Job
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Update your job posting details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/recruiter/jobs")}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the main information about this job.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Job Title
              </Label>

              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                aria-invalid={!!errors.title}
              />

              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">
                Location
              </Label>

              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Surat, Gujarat"
                aria-invalid={!!errors.location}
              />

              {errors.location && (
                <p className="text-sm text-destructive">
                  {errors.location}
                </p>
              )}
            </div>

            {/* Job Type + Experience */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Job Type</Label>

                <Select
                  value={formData.jobType}
                  onValueChange={(value) =>
                    handleSelectChange(
                      "jobType",
                      value
                    )
                  }
                >
                  <SelectTrigger
                    aria-invalid={!!errors.jobType}
                  >
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ONSITE">
                      Onsite
                    </SelectItem>

                    <SelectItem value="REMOTE">
                      Remote
                    </SelectItem>

                    <SelectItem value="HYBRID">
                      Hybrid
                    </SelectItem>
                  </SelectContent>
                </Select>

                {errors.jobType && (
                  <p className="text-sm text-destructive">
                    {errors.jobType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Experience</Label>

                <Select
                  value={formData.experience}
                  onValueChange={(value) =>
                    handleSelectChange(
                      "experience",
                      value
                    )
                  }
                >
                  <SelectTrigger
                    aria-invalid={!!errors.experience}
                  >
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>

                  <SelectContent>
                    {experiences.map((experience) => (
                      <SelectItem
                        key={experience.id}
                        value={experience.experienceName}
                      >
                        {experience.experienceName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.experience && (
                  <p className="text-sm text-destructive">
                    {errors.experience}
                  </p>
                )}
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary">
                Salary
              </Label>

              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. ₹4,00,000 - ₹7,00,000 per year"
                aria-invalid={!!errors.salary}
              />

              <p className="text-xs text-muted-foreground">
                Enter the salary or salary range.
              </p>

              {errors.salary && (
                <p className="text-sm text-destructive">
                  {errors.salary}
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">
                Skills
              </Label>

              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, HTML, CSS"
                aria-invalid={!!errors.skills}
              />

              <p className="text-xs text-muted-foreground">
                Separate skills with commas.
              </p>

              {errors.skills && (
                <p className="text-sm text-destructive">
                  {errors.skills}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
            <CardDescription>
              Explain the role and what the selected candidate
              will do.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description
              </Label>

              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the job..."
                rows={6}
                aria-invalid={!!errors.description}
              />

              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <Label htmlFor="responsibilities">
                Responsibilities
              </Label>

              <Textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder={
                  "Develop frontend features\nBuild reusable components\nFix bugs and improve performance"
                }
                rows={6}
                aria-invalid={!!errors.responsibilities}
              />

              <p className="text-xs text-muted-foreground">
                Enter one responsibility per line.
              </p>

              {errors.responsibilities && (
                <p className="text-sm text-destructive">
                  {errors.responsibilities}
                </p>
              )}
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">
                Requirements
              </Label>

              <Textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder={
                  "Good knowledge of JavaScript\nExperience with React\nGood communication skills"
                }
                rows={6}
                aria-invalid={!!errors.requirements}
              />

              <p className="text-xs text-muted-foreground">
                Enter one requirement per line.
              </p>

              {errors.requirements && (
                <p className="text-sm text-destructive">
                  {errors.requirements}
                </p>
              )}
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <Label htmlFor="benefits">
                Benefits
              </Label>

              <Textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                placeholder={
                  "Health insurance\nFlexible working hours\nLearning opportunities"
                }
                rows={5}
              />

              <p className="text-xs text-muted-foreground">
                Enter one benefit per line. This field is optional.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>
              Manage the deadline and visibility of this job.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">
                Application Deadline
              </Label>

              <Input
                id="applicationDeadline"
                name="applicationDeadline"
                type="date"
                value={formData.applicationDeadline}
                onChange={handleChange}
                aria-invalid={
                  !!errors.applicationDeadline
                }
              />

              {errors.applicationDeadline && (
                <p className="text-sm text-destructive">
                  {errors.applicationDeadline}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-3">
              <Label>Job Status</Label>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant={
                    formData.isActive
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      isActive: true,
                    }))
                  }
                >
                  Active
                </Button>

                <Button
                  type="button"
                  variant={
                    !formData.isActive
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      isActive: false,
                    }))
                  }
                >
                  Closed
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Active jobs are visible to job seekers.
                Closed jobs are not shown in the public job list.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/recruiter/jobs")}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditJob;

