"use client"

import * as React from "react"
import { Pie, PieChart, Label } from "recharts"
import {
  GraduationCap,
  Presentation,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ─── Summary Cards Data ─────────────────────────────────────────────────────

const summaryCards = [
  { title: "إجمالي الدورات", value: 30, icon: GraduationCap, change: "+5 هذا الشهر", color: "text-blue-600" },
  { title: "ورش العمل", value: 25, icon: Presentation, change: "+3 هذا الشهر", color: "text-violet-600" },
  { title: "الموظفين المسجلين", value: 184, icon: Users, change: "+22 هذا الشهر", color: "text-emerald-600" },
  { title: "نسبة الإكمال", value: "78%", icon: CheckCircle2, change: "+4% عن الشهر السابق", color: "text-amber-600" },
]

// ─── Category Distribution Pie Chart ────────────────────────────────────────

const categoryData = [
  { category: "technical", label: "تقنية", count: 12, fill: "var(--color-technical)" },
  { category: "management", label: "إدارية", count: 8, fill: "var(--color-management)" },
  { category: "financial", label: "مالية", count: 5, fill: "var(--color-financial)" },
  { category: "legal", label: "قانونية", count: 3, fill: "var(--color-legal)" },
  { category: "selfdev", label: "تطوير ذاتي", count: 4, fill: "var(--color-selfdev)" },
]

const categoryChartConfig = {
  count: { label: "العدد" },
  technical: { label: "تقنية", color: "var(--chart-1)" },
  management: { label: "إدارية", color: "var(--chart-2)" },
  financial: { label: "مالية", color: "var(--chart-3)" },
  legal: { label: "قانونية", color: "var(--chart-4)" },
  selfdev: { label: "تطوير ذاتي", color: "var(--chart-5)" },
} satisfies ChartConfig

// ─── Recent Activity Data ───────────────────────────────────────────────────

const recentActivity = [
  { id: 1, action: "تسجيل في دورة", employee: "أحمد الكاظمي", target: "تطوير تطبيقات الويب", date: "2025-03-20", type: "enrollment" },
  { id: 2, action: "إكمال ورشة", employee: "سارة العلي", target: "التفكير الإبداعي وحل المشكلات", date: "2025-03-19", type: "completion" },
  { id: 3, action: "إضافة دورة جديدة", employee: "المشرف", target: "الذكاء الاصطناعي والتعلم الآلي", date: "2025-03-19", type: "new" },
  { id: 4, action: "تسجيل في ورشة", employee: "فاطمة الموسوي", target: "أمن المعلومات للموظفين", date: "2025-03-18", type: "enrollment" },
  { id: 5, action: "إكمال دورة", employee: "علي الجبوري", target: "إدارة المشاريع الاحترافية PMP", date: "2025-03-18", type: "completion" },
  { id: 6, action: "تسجيل في دورة", employee: "نور الهاشمي", target: "المحاسبة المالية المتقدمة", date: "2025-03-17", type: "enrollment" },
  { id: 7, action: "إلغاء تسجيل", employee: "حسن الربيعي", target: "القانون التجاري والعقود", date: "2025-03-17", type: "cancellation" },
  { id: 8, action: "إكمال ورشة", employee: "زينب العامري", target: "إدارة الوقت والأولويات", date: "2025-03-16", type: "completion" },
  { id: 9, action: "تسجيل في دورة", employee: "عمر الشمري", target: "أمن المعلومات والشبكات", date: "2025-03-16", type: "enrollment" },
  { id: 10, action: "إضافة ورشة جديدة", employee: "المشرف", target: "بناء ثقافة الابتكار", date: "2025-03-15", type: "new" },
]

const activityBadge: Record<string, { label: string; className: string }> = {
  enrollment: { label: "تسجيل", className: "bg-blue-100 text-blue-800 border-blue-300" },
  completion: { label: "إكمال", className: "bg-green-100 text-green-800 border-green-300" },
  new: { label: "جديد", className: "bg-violet-100 text-violet-800 border-violet-300" },
  cancellation: { label: "إلغاء", className: "bg-red-100 text-red-800 border-red-300" },
}

// ─── Pie Chart Component ────────────────────────────────────────────────────

function CategoryPieChart() {
  const total = React.useMemo(() => categoryData.reduce((acc, curr) => acc + curr.count, 0), [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>توزيع الدورات حسب التصنيف</CardTitle>
        <CardDescription>التصنيفات الحالية للدورات</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={categoryChartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={categoryData} dataKey="count" nameKey="category" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {total}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          دورة
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          التصنيف التقني الأكثر طلباً <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          إجمالي الدورات النشطة في النظام
        </div>
      </CardFooter>
    </Card>
  )
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity + Pie Chart Row */}
      <div className="flex gap-4">
        {/* Recent Activity Table */}
        <Card className="flex-[7]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              النشاطات الأخيرة
            </CardTitle>
            <CardDescription>آخر العمليات على الدورات وورش العمل</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الإجراء</TableHead>
                    <TableHead className="text-right">الموظف</TableHead>
                    <TableHead className="text-right">الدورة / الورشة</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => {
                    const badge = activityBadge[activity.type]
                    return (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
                            {badge.label}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{activity.action}</TableCell>
                        <TableCell>{activity.employee}</TableCell>
                        <TableCell>{activity.target}</TableCell>
                        <TableCell className="text-muted-foreground">{activity.date}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart — Category Distribution */}
        <div className="flex-[3]">
          <CategoryPieChart />
        </div>
      </div>
    </div>
  )
}
