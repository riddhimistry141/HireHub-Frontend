import { useRef, useState } from "react";

import {
  CheckCircle2,
  Download,
  FileText,
  Trash2,
  Upload,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function Resume() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const currentResume = {
    name: "Riddhi_Mistry_Resume.pdf",
    size: "1.8 MB",
    updated: "2 days ago",
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    setError("");
    setUploading(true);

    // Mock upload for now.
    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    );

    setUploading(false);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveSelected = () => {
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page intro */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Resume
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage the resume you use when applying for jobs.
        </p>
      </div>

      {/* Current Resume */}
      <Card>
        <CardHeader>
          <CardTitle>Current Resume</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-6" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold">
                    {currentResume.name}
                  </p>

                  <Badge
                    variant="secondary"
                    className="text-green-700 dark:text-green-400"
                  >
                    Active
                  </Badge>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {currentResume.size} · Updated{" "}
                  {currentResume.updated}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 size-4" />
                Download
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Resume</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <label
            htmlFor="resume-upload"
            className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Upload className="size-6" />
            </div>

            <h3 className="mt-4 font-semibold">
              Upload your resume
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Click to browse and select your resume
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              PDF only · Maximum size 5 MB
            </p>

            <Input
              ref={fileInputRef}
              id="resume-upload"
              type="file"
              accept="application/pdf"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>

          {/* Selected file */}
          {selectedFile && (
            <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {selectedFile.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveSelected}
                  disabled={uploading}
                >
                  Remove
                </Button>

                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 size-4" />
                      Upload Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm font-medium text-destructive">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Resume tips */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Tips</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />

              <div>
                <p className="text-sm font-medium">
                  Keep it updated
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Keep your skills, projects and experience
                  up to date.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />

              <div>
                <p className="text-sm font-medium">
                  Keep it concise
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Highlight the most relevant experience
                  and skills for your target roles.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />

              <div>
                <p className="text-sm font-medium">
                  Use a professional format
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Use a clean and readable resume layout.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />

              <div>
                <p className="text-sm font-medium">
                  Match the job
                </p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Highlight skills that are relevant to the
                  position you're applying for.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom action */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => navigate("/profile")}
        >
          Back to Profile
        </Button>
      </div>
    </div>
  );
}

export default Resume;