import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { CheckCircle2, Download, FileText, Trash2, Upload } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function Resume() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [currentResume, setCurrentResume] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  // ==================== FETCH CURRENT RESUME ====================

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${BASE_URL}/resume`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch resume");
        }

        setCurrentResume(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [BASE_URL, navigate]);

  // ==================== FILE VALIDATION ====================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError("");

    if (!file) {
      return;
    }

    // PDF validation
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      event.target.value = "";
      return;
    }

    // 5 MB validation
    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // ==================== UPLOAD RESUME ====================

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setError("");
      setUploading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();

      formData.append("resume", selectedFile);

      const response = await fetch(`${BASE_URL}/resume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload resume");
      }

      // Update current resume immediately
      setCurrentResume(data.data);

      // Clear selected file
      setSelectedFile(null);

      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };
 //#=========Download resuma ============
  const handleDownload = async () => {
    try {
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const response = await fetch(
            `${BASE_URL}/resume/download`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const data = await response.json();
            throw new Error(
                data.message || "Failed to download resume"
            );
        }

        const blob = await response.blob();

        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = currentResume.fileName;

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
        setError(error.message);
    }
};

 //#=============Delete resuma ==========
  const handleDelete = async () => {
  try {
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const response = await fetch(`${BASE_URL}/resume`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to remove resume"
      );
    }

    setCurrentResume(null);
  } catch (error) {
    setError(error.message);
  }
};

  // ==================== REMOVE SELECTED FILE ====================

  const handleRemoveSelected = () => {
    setSelectedFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==================== FORMAT FILE SIZE ====================

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "Unknown size";
    }

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  // ==================== FORMAT DATE ====================

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Page intro */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resume</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage the resume you use when applying for jobs.
        </p>
      </div>

      {/* ==================== CURRENT RESUME ==================== */}

      <Card>
        <CardHeader>
          <CardTitle>Current Resume</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex min-h-24 items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading resume...</p>
            </div>
          ) : currentResume ? (
            <div className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-6" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold">
                      {currentResume.fileName}
                    </p>

                    <Badge
                      variant="secondary"
                      className="text-green-700 dark:text-green-400"
                    >
                      Active
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatFileSize(currentResume.fileSize)} · Updated{" "}
                    {formatDate(currentResume.updatedAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 size-4" />
                  Download
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 size-4" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <FileText className="size-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 font-semibold">No resume uploaded</h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Upload your resume below to use it when applying for jobs.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ==================== UPLOAD ==================== */}

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

            <h3 className="mt-4 font-semibold">Upload your resume</h3>

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

          {/* ==================== SELECTED FILE ==================== */}

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

                <Button size="sm" onClick={handleUpload} disabled={uploading}>
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

          {/* ==================== ERROR ==================== */}

          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* ==================== RESUME TIPS ==================== */}

      <Card>
        <CardHeader>
          <CardTitle>Resume Tips</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />

              <div>
                <p className="text-sm font-medium">Keep it updated</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Keep your skills, projects and experience up to date.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />

              <div>
                <p className="text-sm font-medium">Keep it concise</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Highlight the most relevant experience and skills for your
                  target roles.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />

              <div>
                <p className="text-sm font-medium">Use a professional format</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Use a clean and readable resume layout.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-600 dark:text-green-400" />

              <div>
                <p className="text-sm font-medium">Match the job</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Highlight skills that are relevant to the position you're
                  applying for.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ==================== BOTTOM ACTION ==================== */}

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => navigate("/profile")}>
          Back to Profile
        </Button>
      </div>
    </div>
  );
}

export default Resume;
