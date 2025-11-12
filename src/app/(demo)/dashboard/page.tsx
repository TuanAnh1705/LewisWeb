"use client";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";

// --- BẮT ĐẦU THÊM MỚI ---
import { motion } from "framer-motion";
import { RevenueChart } from "@/components/admin-panel/charts/revenue-chart";
import { SourcePieChart } from "@/components/admin-panel/charts/source-pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users } from "lucide-react";
// --- KẾT THÚC THÊM MỚI ---

export default function DashboardPage() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { settings, setSettings } = sidebar;

  // Cấu hình animation cho Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Hiệu ứng xuất hiện lần lượt
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        {/* ... (Code Breadcrumb của bạn giữ nguyên) ... */}
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TooltipProvider>
        <div className="flex gap-6 mt-6">
          <Tooltip>
            {/* ... (Code Switch của bạn giữ nguyên) ... */}
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Switch
                  id="disable-sidebar"
                  onCheckedChange={(x) => setSettings({ disabled: x })}
                  checked={settings.disabled}
                />
                <Label htmlFor="disable-sidebar">Disable Sidebar</Label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hide sidebar</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* --- PHẦN STATS VÀ BIỂU ĐỒ MỚI --- */}
      <motion.div
        className="mt-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* Các biểu đồ */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mt-6">
          <motion.div variants={itemVariants}>
            <RevenueChart />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SourcePieChart />
          </motion.div>
        </div>
      </motion.div>
      {/* --- KẾT THÚC PHẦN MỚI --- */}

      
    </ContentLayout>
  );
}