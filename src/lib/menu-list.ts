import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
  target?: string;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  target?: string;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Posts",
          icon: SquarePen,
          submenus: [
            {
              href: "/review",
              label: "All Posts"
            },
            {
              href: "https://lewis.vietnamsourcing.co/wp-admin/edit.php",
              label: "New Post",
              target:"_blank"
            }
          ]
        },
        {
          href: "/categories",
          label: "Categories",
          icon: Bookmark
        },
        {
          href: "/aboutUs",
          label: "About Us",
          icon: Tag
        }
      ]
    },
    {
      groupLabel: "Accouts",
      menus: [
        {
          href: "/users",
          label: "Users",
          icon: Users
        },
      ]
    }
  ];
}
