import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  RefreshCw,
  ShieldCheck,
  User,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function AdminRecruiterDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [recruiter, setRecruiter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    fetchRecruiter();
  }, [id]);

  const fetchRecruiter = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/admin/recruiters/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch recruiter details"
        );
      }

      setRecruiter(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusAction = async (action) => {
    try {
      setActionLoading(true);
      setActionError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/admin/recruiters/${id}/${action}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update recruiter"
        );
      }

      setRecruiter(data.data);
    } catch (error) {
      setActionError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "APPROVED") {
      return (
        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          APPROVED
        </Badge>
      );
    }

    if (status === "PENDING") {
      return (
        <Badge variant="secondary">
          PENDING
        </Badge>
      );
    }

    if (status === "REJECTED") {
      return (
        <Badge variant="destructive">
          REJECTED
        </Badge>
      );
    }

    if (status === "SUSPENDED") {
      return (
        <Badge variant="destructive">
          SUSPENDED
        </Badge>
      );
    }

    return <Badge>{status}</Badge>;
  };

  const getInitials = (name) => {
    if (!name) {
      return "R";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading recruiter details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <UserRoundX className="h-10 w-10 text-muted-foreground" />

        <h2 className="mt-4 text-xl font-semibold">
          Unable to load recruiter
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {error}
        </p>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/recruiters")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button onClick={fetchRecruiter}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!recruiter) {
    return null;
  }

  const company = recruiter.company;
  const email = recruiter.auth?.email;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => navigate("/admin/recruiters")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Recruiters
      </Button>

      {/* Action Error */}
      {actionError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
              {getInitials(recruiter.name)}
            </div>

            {/* Recruiter */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">
                  {recruiter.name}
                </h1>

                <Badge variant="outline">
                  {recruiter.role?.roleName || "RECRUITER"}
                </Badge>

                {getStatusBadge(recruiter.status)}
              </div>

              <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {email || "—"}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {company?.name && (
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {company.name}
                  </span>
                )}

                {company?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {company.location}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {recruiter.status === "PENDING" && (
                <>
                  <Button
                    disabled={actionLoading}
                    onClick={() =>
                      handleStatusAction("approve")
                    }
                  >
                    {actionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserRoundCheck className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>

                  <Button
                    variant="destructive"
                    disabled={actionLoading}
                    onClick={() =>
                      handleStatusAction("reject")
                    }
                  >
                    <UserRoundX className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </>
              )}

              {recruiter.status === "APPROVED" && (
                <Button
                  variant="destructive"
                  disabled={actionLoading}
                  onClick={() =>
                    handleStatusAction("suspend")
                  }
                >
                  {actionLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserRoundX className="mr-2 h-4 w-4" />
                  )}
                  Suspend
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recruiter Information + Company Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recruiter Information */}
        <Card>
          <CardHeader>
            <CardTitle>Recruiter Information</CardTitle>
            <CardDescription>
              Personal information associated with this recruiter account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <InfoRow
              icon={User}
              label="Name"
              value={recruiter.name}
            />

            <Separator />

            <InfoRow
              icon={Mail}
              label="Email"
              value={email}
            />

            <Separator />

            <InfoRow
              icon={CalendarDays}
              label="Joined"
              value={formatDate(recruiter.createdAt)}
            />
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Company profile associated with this recruiter.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <InfoRow
              icon={Building2}
              label="Company"
              value={company?.name}
            />

            <Separator />

            <InfoRow
              icon={MapPin}
              label="Location"
              value={company?.location}
            />

            <Separator />

            <InfoRow
              icon={Globe}
              label="Website"
              value={company?.website}
            />
          </CardContent>
        </Card>
      </div>

      {/* Company Description */}
      <Card>
        <CardHeader>
          <CardTitle>Company Description</CardTitle>
        </CardHeader>

        <CardContent>
          {company?.description ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {company.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No company description has been added.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Platform access and recruiter permissions.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <InfoRow
              icon={ShieldCheck}
              label="Role"
              value={recruiter.role?.roleName}
            />

            <InfoRow
              icon={CheckCircle2}
              label="Status"
              value={recruiter.status}
            />

            <InfoRow
              icon={CalendarDays}
              label="Joined"
              value={formatDate(recruiter.createdAt)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="break-words text-sm font-medium">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default AdminRecruiterDetails;