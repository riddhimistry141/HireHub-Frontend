import { useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Send,
  Upload,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const jobs = {
  "1": {
    title: "Frontend Developer",
    company: "ABC Technologies",
    location: "Ahmedabad, Gujarat",
  },

  "2": {
    title: "React Developer",
    company: "XYZ Technologies",
    location: "Surat, Gujarat",
  },

  "3": {
    title: "Node.js Developer",
    company: "Tech Company",
    location: "Remote",
  },
};

function ApplyJob() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const job = jobs[jobId];

  const [resume, setResume] = useState("current");
  const [coverLetter, setCoverLetter] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!job) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <h2 className="text-lg font-semibold">
              Job not found
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              The job you're trying to apply for doesn't exist.
            </p>

            <Button
              className="mt-5"
              onClick={() => navigate("/jobs")}
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!resume) {
      setError("Please select a resume.");
      return;
    }

    if (!agreed) {
      setError(
        "Please confirm that the information provided is accurate."
      );
      return;
    }

    setLoading(true);

    // Temporary frontend-only submission
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardContent className="flex flex-col items-center p-8 text-center sm:p-10">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <CheckCircle2 className="size-8" />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Application Submitted!
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Your application for{" "}
              <span className="font-medium text-foreground">
                {job.title}
              </span>{" "}
              at{" "}
              <span className="font-medium text-foreground">
                {job.company}
              </span>{" "}
              has been submitted successfully.
            </p>

            <div className="mt-6 w-full rounded-lg border bg-muted/40 p-4 text-left">
              <p className="text-sm font-medium">
                What happens next?
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                The recruiter will review your application
                and update your application status.
              </p>
            </div>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/jobs")}
              >
                Browse More Jobs
              </Button>

              <Button
                className="flex-1"
                onClick={() => navigate("/applications")}
              >
                View Applications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent"
        onClick={() => navigate(`/jobs/${jobId}`)}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back to Job Details
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Apply for {job.title}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {job.company} · {job.location}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Resume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Select Resume
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <RadioGroup
              value={resume}
              onValueChange={setResume}
            >
              <div className="flex items-center space-x-3 rounded-lg border p-4">
                <RadioGroupItem
                  value="current"
                  id="current-resume"
                />

                <Label
                  htmlFor="current-resume"
                  className="flex flex-1 cursor-pointer items-center gap-3"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="size-5" />
                  </div>

                  <div>
                    <p className="font-medium">
                      Riddhi_Mistry_Resume.pdf
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Updated 2 days ago
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate("/resume")}
            >
              <Upload className="mr-2 size-4" />
              Manage Resume
            </Button>
          </CardContent>
        </Card>

        {/* Cover letter */}
        <Card>
          <CardHeader>
            <CardTitle>Cover Letter</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <Label htmlFor="cover-letter">
              Tell the recruiter why you're a good fit
              <span className="ml-1 text-muted-foreground">
                (Optional)
              </span>
            </Label>

            <Textarea
              id="cover-letter"
              value={coverLetter}
              onChange={(event) =>
                setCoverLetter(event.target.value)
              }
              placeholder="Write a short message to the recruiter..."
              className="min-h-45 resize-none"
              maxLength={1000}
            />

            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">
                {coverLetter.length}/1000
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation */}
        <Card>
          <CardHeader>
            <CardTitle>Application Confirmation</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-start gap-3 rounded-lg border p-4">
              <Checkbox
                id="confirmation"
                checked={agreed}
                onCheckedChange={setAgreed}
                aria-invalid={!!error}
              />

              <Label
                htmlFor="confirmation"
                className="cursor-pointer text-sm leading-6"
              >
                I confirm that the information provided in
                my application is accurate and complete.
              </Label>
            </div>

            {error && (
              <p className="mt-3 text-sm font-medium text-destructive">
                {error}
              </p>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* Submit */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/jobs/${jobId}`)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 size-4" />
                Submit Application
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ApplyJob;