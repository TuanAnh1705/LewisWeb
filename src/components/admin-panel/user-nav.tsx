"use client";

import { useEffect, useState } from "react";
// import Link from "next/link"; // Đã xoá do lỗi biên dịch
import { LayoutGrid, LogOut, User } from "lucide-react";
// import { useRouter } from "next/navigation"; // Đã xoá do lỗi biên dịch
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface UserInfo {
  // Đã thêm id và role để khớp với API /api/me
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export function UserNav() {
  const [user, setUser] = useState<UserInfo | null>(null);
  // const router = useRouter(); // Đã xoá do lỗi biên dịch

  useEffect(() => {
    // --- PHẦN SỬA LỖI ---
    // const token = Cookies.get("token"); // <-- XOÁ DÒNG NÀY
    // if (!token) return; // <-- XOÁ DÒNG NÀY

    // Chỉ cần gọi thẳng API. 
    // Trình duyệt sẽ tự động đính kèm cookie httpOnly.
    // Server (api/me) sẽ xử lý việc xác thực.
    axios
      .get("/api/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        // api/me sẽ trả 401 nếu token không hợp lệ hoặc hết hạn,
        // nó sẽ được bắt ở đây.
        toast.error("Please login to continue");
        // router.push("/login"); // Đã xoá
        window.location.href = "/login"; // Thay thế bằng điều hướng "cứng"
      });
  }, []); // Xoá router khỏi dependency array

  async function handleLogout() {
    try {
      await axios.post("/api/logout");
      Cookies.remove("token"); // Mặc dù logout API đã xoá, client xoá lại để chắc chắn
      toast.success("Logout Successfully");
      // router.refresh(); // Đã xoá
      // router.push("/login"); // Đã xoá
      window.location.href = "/login"; // Thay thế bằng điều hướng "cứng"
    } catch {
      toast.error("Cannot Logout!");
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    const first = parts[0]?.[0] || "";
    const last = parts[parts.length - 1]?.[0] || "";
    return (first + last).toUpperCase();
  };

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8 flex items-center justify-center text-sm font-semibold bg-muted">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user?.fullName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.fullName || "Login?"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            {/* Thay thế Link bằng thẻ <a> */}
            <a href="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              Dashboard
            </a>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            {/* Thay thế Link bằng thẻ <a> */}
            <a href="/account" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              Account
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="hover:cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-3 text-muted-foreground" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

