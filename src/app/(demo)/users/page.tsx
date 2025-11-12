"use client"

import Link from "next/link";

import PlaceholderContent from "@/components/demo/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserInfo {
  id: number;
  fullName: string;
  email: string;
  role: string;
}


export default function UsersPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        toast.error("Please login to continue");
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    const first = parts[0]?.[0] || "";
    const last = parts[parts.length - 1]?.[0] || "";
    return (first + last).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-slate-500">
        No user data found.
      </div>
    );
  }



  return (
    <ContentLayout title="Users">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-2xl mx-auto py-12 px-6">
        <Card className="p-8 flex flex-col items-center text-center space-y-6">
          <Avatar className="h-24 w-24 text-3xl font-semibold bg-muted">
            <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-semibold">{user.fullName}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>

          <div className="text-lg text-slate-500">
            <p>
              <span className="font-medium text-slate-700">User ID:</span>{" "}
              {user.id}
            </p>
            <p>
              <span className="font-medium text-slate-700">Role:</span>{" "}
              {user.role}
            </p>
          </div>
        </Card>
      </div>
    </ContentLayout>
  );
}
