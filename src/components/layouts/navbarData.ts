import {
  Settings2,
  SquareTerminal,
  LucideIcon,
  FileText,
  BookOpen,
  Users,
  ChartPie,
  Megaphone,
  ClipboardList,
  UserCheck,
  CalendarDays,
  ClipboardCheck,
} from "lucide-react";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
  roles?: string[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface NavbarData {
  sections: NavSection[];
}

export const navbarData: NavbarData = {
  sections: [
    {
      label: "الرئيسية",
      items: [
        {
          title: "لوحة التحكم",
          url: "/",
          icon: SquareTerminal,
        },
      ],
    },
    {
      label: "إدارة التدريب",
      items: [
        {
          title: "البرامج التدريبية",
          url: "/programs",
          icon: BookOpen,
        },
        {
          title: "المدربين",
          url: "/instructors",
          icon: UserCheck,
        },
        {
          title: "جدولة الدورات",
          url: "/scheduling",
          icon: CalendarDays,
        },
        {
          title: "التقييمات",
          url: "/assessments",
          icon: ClipboardCheck,
        },
      ],
    },
    {
      label: "التسجيل والترشيح",
      items: [
        {
          title: "الإعلانات التدريبية",
          url: "/announcements",
          icon: Megaphone,
        },
        {
          title: "طلبات الالتحاق",
          url: "/enrollment-requests",
          icon: ClipboardList,
        },
      ],
    },
    {
      label: "التقارير والإحصائيات",
      items: [
        {
          title: "التقارير",
          url: "/reports",
          icon: FileText,
        },
        {
          title: "الإحصائيات",
          url: "/statistics",
          icon: ChartPie,
        },
      ],
    },
    {
      label: "إدارة النظام",
      items: [
        {
          title: "المستخدمين",
          url: "/users",
          icon: Users,
        },
        {
          title: "الإعدادات",
          url: "/settings",
          icon: Settings2,
        },
      ],
    },
  ],
};

export function filterNavItemsByRole(items: NavItem[], userRole?: string): NavItem[] {
  if (!userRole) return [];

  return items
    .filter(item => !item.roles || item.roles.length === 0 || item.roles.includes(userRole))
    .map(item => ({
      ...item,
      items: item.items ? filterNavItemsByRole(item.items, userRole) : undefined,
    }));
}

export function getFilteredNavbarData(userRole?: string): NavbarData {
  const sections = navbarData.sections
    .map(section => ({
      ...section,
      items: filterNavItemsByRole(section.items, userRole),
    }))
    .filter(section => section.items.length > 0);

  return { sections };
}

export function generateRouteLabels(data: NavbarData): Record<string, string> {
  const labels: Record<string, string> = {};

  const extract = (items: NavItem[]) => {
    items.forEach(item => {
      labels[item.url] = item.title.trim();
      if (item.items) extract(item.items);
    });
  };

  data.sections.forEach(section => extract(section.items));

  return labels;
}
