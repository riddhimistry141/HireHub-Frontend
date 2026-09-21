import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  IndianRupee,
  Loader2,
  MapPin,
  Save,
  Send,
  Wrench,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CreateJob() {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

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
    totalSlots: "",
  });

  const [experiences, setExperiences] = useState([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [experienceError, setExperienceError] = useState("");

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveType, setSaveType] = useState("");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoadingExperiences(true);
        setExperienceError("");

        const response = await fetch(`${BASE_URL}/experiences`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load experiences");
        }

        setExperiences(data.data || []);
      } catch (error) {
        console.error("Fetch experiences error:", error);

        setExperienceError(error.message || "Failed to load experiences");
      } finally {
        setLoadingExperiences(false);
      }
    };

    fetchExperiences();
  }, [BASE_URL]);

  //date clsoing
  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    if (serverError) {
      setServerError("");
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    if (serverError) {
      setServerError("");
    }
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
      newErrors.jobType = "Please select a job type.";
    }

    if (!formData.experience) {
      newErrors.experience = "Please select the required experience.";
    }

    if (!formData.salary.trim()) {
      newErrors.salary = "salary is required.";
    }

    if (!formData.skills.trim()) {
      newErrors.skills = "At least one skill is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Job description is required.";
    }

    if (!formData.responsibilities.trim()) {
      newErrors.responsibilities = "Responsibilities are required.";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Job requirements are required.";
    }

    if (!formData.applicationDeadline) {
      newErrors.applicationDeadline = "Application deadline is required.";
    }

    //total slot validation
    if (
      !Number.isInteger(Number(formData.totalSlots)) ||
      Number(formData.totalSlots) <= 0
    ) {
      toast.error("Total slots must be a positive number");
      return;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const convertLinesToArray = (value) => {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const convertSkillsToArray = (value) => {
    return value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  };

  const handleSubmit = async (type) => {
    setSaveType(type);
    setServerError("");

    if (type === "PUBLISH" && !validateForm()) {
      setSaveType("");
      return;
    }

    setSaving(true);

    try {
      const selectedExperience = experiences.find(
        (experience) => experience.experienceName === formData.experience,
      );

      if (!selectedExperience) {
        setErrors((previous) => ({
          ...previous,
          experience: "Selected experience is invalid.",
        }));

        return;
      }

      if (formData.applicationDeadline) {
        const today = getTodayDate();

        if (formData.applicationDeadline < today) {
          toast.error("Application deadline cannot be before today");
          return;
        }
      }

      const token = localStorage.getItem("token");

      if (!token) {
        setServerError("Authentication required. Please login again.");

        return;
      }

      const payload = {
        title: formData.title.trim(),

        description: formData.description.trim(),

        location: formData.location.trim(),

        jobType: formData.jobType,

        experienceId: selectedExperience.id,

        salary: formData.salary.trim(),

        skills: convertSkillsToArray(formData.skills),

        responsibilities: convertLinesToArray(formData.responsibilities),

        requirements: convertLinesToArray(formData.requirements),

        benefits: convertLinesToArray(formData.benefits),

        applicationDeadline: formData.applicationDeadline,

        totalSlots: Number(formData.totalSlots),

        //isActive: type === "PUBLISH",
        status: type === "PUBLISH" ? "ACTIVE" : "DRAFT",
      };

      const response = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create job");
      }

      navigate("/recruiter/jobs");
    } catch (error) {
      console.error("Create job error:", error);

      setServerError(error.message || "Failed to create job");
    } finally {
      setSaving(false);
      setSaveType("");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent"
        onClick={() => navigate("/recruiter/jobs")}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to My Jobs
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create Job</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a new job posting and find the right candidates.
        </p>
      </div>

      {serverError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BriefcaseBusiness className="size-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Job title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>

            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              aria-invalid={!!errors.title}
            />

            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Surat, Gujarat"
                className="pl-9"
                aria-invalid={!!errors.location}
              />
            </div>

            {errors.location && (
              <p className="text-sm text-destructive">{errors.location}</p>
            )}
          </div>

          {/* Job Type + Experience */}
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Job Type</Label>

              <Select
                value={formData.jobType}
                onValueChange={(value) => handleSelectChange("jobType", value)}
              >
                <SelectTrigger aria-invalid={!!errors.jobType}>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ONSITE">On-site</SelectItem>

                  <SelectItem value="REMOTE">Remote</SelectItem>

                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>

              {errors.jobType && (
                <p className="text-sm text-destructive">{errors.jobType}</p>
              )}
            </div>

            {/* total slot of job to apply */}
            <div className="space-y-2">
              <Label htmlFor="totalSlots">Total Slots</Label>

              <Input
                id="totalSlots"
                type="number"
                min="1"
                placeholder="e.g. 10"
                value={formData.totalSlots}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalSlots: e.target.value,
                  })
                }
              />

              {errors.totalSlots && (
                <p className="text-sm text-destructive">{errors.totalSlots}</p>
              )}

            </div>

            <div className="space-y-2">
              <Label>Experience</Label>

              <Select
                value={formData.experience}
                onValueChange={(value) =>
                  handleSelectChange("experience", value)
                }
                disabled={loadingExperiences || experiences.length === 0}
              >
                <SelectTrigger aria-invalid={!!errors.experience}>
                  <SelectValue
                    placeholder={
                      loadingExperiences
                        ? "Loading experiences..."
                        : "Select experience"
                    }
                  />
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
                <p className="text-sm text-destructive">{errors.experience}</p>
              )}

              {experienceError && (
                <p className="text-sm text-destructive">{experienceError}</p>
              )}
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label>Salary</Label>

            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                placeholder="salary"
                className="pl-9"
                aria-invalid={!!errors.salary}
              />
            </div>

            {errors.salary && (
              <p className="text-sm text-destructive">{errors.salary}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Enter the salary or salary range.
            </p>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>

            <div className="relative">
              <Wrench className="absolute left-3 top-3 size-4 text-muted-foreground" />

              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g. HTML, CSS, JavaScript, React"
                className="pl-9"
                aria-invalid={!!errors.skills}
              />
            </div>

            {errors.skills && (
              <p className="text-sm text-destructive">{errors.skills}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Separate skills using commas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Job Description
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>

            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, team and what the candidate will be working on..."
              className="min-h-[180px] resize-none"
              maxLength={3000}
              aria-invalid={!!errors.description}
            />

            <div className="flex items-center justify-between">
              {errors.description ? (
                <p className="text-sm text-destructive">{errors.description}</p>
              ) : (
                <span />
              )}

              <span className="text-xs text-muted-foreground">
                {formData.description.length}/3000
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle>Responsibilities</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <Textarea
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            placeholder={`Enter responsibilities, one per line.

Example:
Build reusable React components
Integrate REST APIs
Collaborate with designers
Improve application performance`}
            className="min-h-[180px] resize-none"
            aria-invalid={!!errors.responsibilities}
          />

          {errors.responsibilities && (
            <p className="text-sm text-destructive">
              {errors.responsibilities}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            Enter each responsibility on a separate line.
          </p>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <Textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder={`Enter requirements, one per line.

Example:
Strong JavaScript fundamentals
Experience with React
Knowledge of REST APIs
Understanding of Git`}
            className="min-h-[180px] resize-none"
            aria-invalid={!!errors.requirements}
          />

          {errors.requirements && (
            <p className="text-sm text-destructive">{errors.requirements}</p>
          )}

          <p className="text-xs text-muted-foreground">
            Enter each requirement on a separate line.
          </p>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Benefits</CardTitle>
        </CardHeader>

        <CardContent>
          <Textarea
            name="benefits"
            value={formData.benefits}
            onChange={handleChange}
            placeholder={`Enter benefits, one per line.

Example:
Flexible working hours
Health insurance
Learning opportunities
Performance bonuses`}
            className="min-h-[150px] resize-none"
          />

          <p className="mt-2 text-xs text-muted-foreground">
            Benefits are optional.
          </p>
        </CardContent>
      </Card>

      {/* Application deadline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            Application Deadline
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          <Label htmlFor="applicationDeadline">Deadline</Label>

          <Input
            id="applicationDeadline"
            name="applicationDeadline"
            type="date"
            min={getTodayDate()}
            value={formData.applicationDeadline}
            onChange={handleChange}
            aria-invalid={!!errors.applicationDeadline}
          />

          {errors.applicationDeadline && (
            <p className="text-sm text-destructive">
              {errors.applicationDeadline}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="flex flex-col-reverse gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/recruiter/jobs")}
            disabled={saving}
          >
            Cancel
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              disabled={saving}
              onClick={() => handleSubmit("DRAFT")}
            >
              {saving && saveType === "DRAFT" ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              Save as Draft
            </Button>

            <Button
              type="button"
              disabled={saving}
              onClick={() => handleSubmit("PUBLISH")}
            >
              {saving && saveType === "PUBLISH" ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Send className="mr-2 size-4" />
              )}
              Publish Job
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateJob;
