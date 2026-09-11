import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Globe,
  MapPin,
  Pencil,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function CompanyProfile() {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [company, setCompany] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logo: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch company
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(`${BASE_URL}/company`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        // No company yet
        if (response.status === 404) {
          setCompany(null);
          return;
        }

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch company");
        }

        setCompany(result.data);

        setFormData({
          name: result.data.name || "",
          description: result.data.description || "",
          website: result.data.website || "",
          location: result.data.location || "",
          logo: result.data.logo || "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const method = company ? "PATCH" : "POST";

      const response = await fetch(`${BASE_URL}/company`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          website: formData.website.trim(),
          location: formData.location.trim(),
          logo: formData.logo.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save company");
      }

      setCompany(result.data);

      setFormData({
        name: result.data.name || "",
        description: result.data.description || "",
        website: result.data.website || "",
        location: result.data.location || "",
        logo: result.data.logo || "",
      });

      setIsEditing(false);

      setSuccess(
        company
          ? "Company profile updated successfully."
          : "Company profile created successfully.",
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (company) {
      setFormData({
        name: company.name || "",
        description: company.description || "",
        website: company.website || "",
        location: company.location || "",
        logo: company.logo || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        website: "",
        location: "",
        logo: "",
      });
    }

    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <Card>
          <CardContent className="flex min-h-40 items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Loading company profile...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Company Profile
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage your company information
            </p>
          </div>
        </div>

        {company && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Company
          </Button>
        )}
      </div>

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Success */}
      {success && (
        <Card>
          <CardContent className="flex items-center gap-2 pt-6">
            <CheckCircle2 className="h-4 w-4 text-primary" />

            <p className="text-sm text-muted-foreground">{success}</p>
          </CardContent>
        </Card>
      )}

      {!company && !isEditing ? (
        /* No Company */
        <Card>
          <CardContent className="flex min-h-80 flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full border border-border bg-muted p-4">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>

            <h2 className="text-xl font-semibold">
              Create Your Company Profile
            </h2>

            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Add your company information so candidates can learn more about
              the organization behind your job postings.
            </p>

            <Button
              className="mt-6"
              onClick={() => {
                setError("");
                setSuccess("");
                setIsEditing(true);
              }}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Create Company Profile
            </Button>
          </CardContent>
        </Card>
      ) : isEditing ? (
        /* Edit/Create */
        <Card>
          <CardHeader>
            <CardTitle>
              {company ? "Edit Company Profile" : "Create Company Profile"}
            </CardTitle>

            <CardDescription>
              Provide information about your company.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>

                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter company name"
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Company Website</Label>

                <Input
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Company Location</Label>

                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ahmedabad, Gujarat"
                />
              </div>

              {/* Logo */}
              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo URL</Label>

                <Input
                  id="logo"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Company Description</Label>

              <Textarea
                id="description"
                name="description"
                rows={6}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell candidates about your company..."
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />

                {saving
                  ? "Saving..."
                  : company
                    ? "Update Company"
                    : "Create Company"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Company Details */
        <>
          {/* Company Header */}
          <Card className="overflow-hidden">
            <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/10 to-background" />

            <CardContent className="-mt-12 pb-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-end gap-4">
                  <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border-4 border-background bg-muted shadow-md">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{company.name}</h2>

                      <Badge>Company</Badge>
                    </div>

                    {company.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {company.location}
                      </div>
                    )}
                  </div>
                </div>

                <Badge variant="outline" className="w-fit">
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                  Company Profile
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Company Information
              </CardTitle>

              <CardDescription>
                Information visible to candidates.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Company Name
                  </p>

                  <p className="mt-1 font-medium">{company.name}</p>
                </div>

                {/* Location */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Location
                  </p>

                  <p className="mt-1 flex items-center gap-1 font-medium">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {company.location || "Not provided"}
                  </p>
                </div>

                {/* Website */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Website
                  </p>

                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Globe className="h-4 w-4" />
                      {company.website}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Not provided
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Description
                </p>

                <p className="mt-2 leading-7 text-muted-foreground">
                  {company.description || "No company description provided."}
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default CompanyProfile;
