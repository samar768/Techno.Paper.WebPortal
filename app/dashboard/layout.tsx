"use client"

import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNav } from "@/components/top-nav";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-800 to-purple-600">
      <div className="flex min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col ml-64">
          <TopNav />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
