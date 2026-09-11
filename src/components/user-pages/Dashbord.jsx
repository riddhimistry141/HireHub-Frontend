import {
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
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

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const name = user?.data?.name || "User";

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
            <CardTitle className="text-sm font-medium">
              Applications
            </CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <BriefcaseBusiness className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              8
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Total applications
            </p>
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Interviews
            </CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <CalendarDays className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              2
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Upcoming interviews
            </p>
          </CardContent>
        </Card>

        {/* Saved Jobs */}
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saved Jobs
            </CardTitle>

            <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
              <Bookmark className="size-5" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              12
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Jobs saved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ================= RECENT APPLICATIONS ================= */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              Recent Applications
            </CardTitle>

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
            {/* Application 1 */}
            <div className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">
                  Frontend Developer
                </h3>

                <p className="text-sm text-muted-foreground">
                  ABC Technologies
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-950">
                  Applied
                </Badge>

                <span className="text-xs text-muted-foreground">
                  2 days ago
                </span>
              </div>
            </div>

            {/* Application 2 */}
            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">
                  React Developer
                </h3>

                <p className="text-sm text-muted-foreground">
                  XYZ Technologies
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="border-green-200 bg-green-50 text-green-700 hover:bg-green-50 dark:border-green-800 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-950">
                  Shortlisted
                </Badge>

                <span className="text-xs text-muted-foreground">
                  5 days ago
                </span>
              </div>
            </div>

            {/* Application 3 */}
            <div className="flex flex-col gap-3 py-4 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">
                  Node.js Developer
                </h3>

                <p className="text-sm text-muted-foreground">
                  Tech Company
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300 dark:hover:bg-amber-950">
                  Under Review
                </Badge>

                <span className="text-xs text-muted-foreground">
                  1 week ago
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================= RECENT RESUME ================= */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              Recent Resume
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest resume information
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/resume")}
          >
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
                Riddhi_Mistry_Resume.pdf
              </p>

              <p className="text-sm text-muted-foreground">
                Last updated: 2 days ago
              </p>
            </div>
          </div>

          {/* Profile completion */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Profile completion
              </span>

              <span className="font-medium text-primary">
                80%
              </span>
            </div>

            <div
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow="80"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Profile completion"
            >
              <div className="h-full w-[80%] rounded-full bg-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;