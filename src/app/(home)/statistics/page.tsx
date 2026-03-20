"use client"

import * as React from "react"
import {
  Bar, BarChart, CartesianGrid, XAxis, YAxis,
  Pie, PieChart, Label,
  Line, LineChart,
  Area, AreaChart,
} from "recharts"
import {
  GraduationCap, Presentation, Users, TrendingUp, TrendingDown,
  Award, Clock, Target, BookOpen, UserCheck,
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
import { Progress } from "@/components/ui/progress"

// ─── KPI Cards ──────────────────────────────────────────────────────────────

const kpiCards = [
  { title: "إجمالي الدورات", value: 30, icon: GraduationCap, trend: "+12%", up: true, color: "text-blue-600", desc: "مقارنة بالربع السابق" },
  { title: "إجمالي ورش العمل", value: 25, icon: Presentation, trend: "+8%", up: true, color: "text-violet-600", desc: "مقارنة بالربع السابق" },
  { title: "إجمالي المتدربين", value: 184, icon: Users, trend: "+22%", up: true, color: "text-emerald-600", desc: "مقارنة بالربع السابق" },
  { title: "معدل الإكمال", value: "78%", icon: Target, trend: "-3%", up: false, color: "text-amber-600", desc: "مقارنة بالربع السابق" },
  { title: "ساعات التدريب", value: "1,240", icon: Clock, trend: "+15%", up: true, color: "text-rose-600", desc: "إجمالي الساعات المنفذة" },
  { title: "الشهادات الممنوحة", value: 96, icon: Award, trend: "+18%", up: true, color: "text-teal-600", desc: "شهادات إتمام الدورات" },
]

// ─── Monthly Trend (Line Chart) ─────────────────────────────────────────────

const monthlyTrend = [
  { month: "يناير", enrollments: 73, completions: 45 },
  { month: "فبراير", enrollments: 87, completions: 58 },
  { month: "مارس", enrollments: 103, completions: 72 },
  { month: "أبريل", enrollments: 79, completions: 61 },
  { month: "مايو", enrollments: 122, completions: 85 },
  { month: "يونيو", enrollments: 109, completions: 78 },
  { month: "يوليو", enrollments: 96, completions: 70 },
  { month: "أغسطس", enrollments: 68, completions: 52 },
  { month: "سبتمبر", enrollments: 118, completions: 88 },
  { month: "أكتوبر", enrollments: 137, completions: 95 },
  { month: "نوفمبر", enrollments: 128, completions: 92 },
  { month: "ديسمبر", enrollments: 108, completions: 80 },
]

const trendConfig = {
  enrollments: { label: "التسجيلات", color: "var(--chart-1)" },
  completions: { label: "الإتمام", color: "var(--chart-2)" },
} satisfies ChartConfig

// ─── Category Distribution (Pie) ────────────────────────────────────────────

const categoryDistribution = [
  { category: "technical", label: "تقنية", count: 12, fill: "var(--color-technical)" },
  { category: "management", label: "إدارية", count: 8, fill: "var(--color-management)" },
  { category: "financial", label: "مالية", count: 5, fill: "var(--color-financial)" },
  { category: "legal", label: "قانونية", count: 3, fill: "var(--color-legal)" },
  { category: "selfdev", label: "تطوير ذاتي", count: 4, fill: "var(--color-selfdev)" },
]

const categoryConfig = {
  count: { label: "العدد" },
  technical: { label: "تقنية", color: "var(--chart-1)" },
  management: { label: "إدارية", color: "var(--chart-2)" },
  financial: { label: "مالية", color: "var(--chart-3)" },
  legal: { label: "قانونية", color: "var(--chart-4)" },
  selfdev: { label: "تطوير ذاتي", color: "var(--chart-5)" },
} satisfies ChartConfig

// ─── Department Participation (Bar) ─────────────────────────────────────────

const departmentData = [
  { dept: "تقنية المعلومات", courses: 28, workshops: 18 },
  { dept: "الموارد البشرية", courses: 22, workshops: 15 },
  { dept: "المالية", courses: 18, workshops: 10 },
  { dept: "التسويق", courses: 15, workshops: 12 },
  { dept: "العمليات", courses: 20, workshops: 14 },
  { dept: "خدمة العملاء", courses: 12, workshops: 8 },
  { dept: "القانونية", courses: 8, workshops: 5 },
  { dept: "الإدارة العليا", courses: 6, workshops: 4 },
]

const deptConfig = {
  courses: { label: "الدورات", color: "var(--chart-1)" },
  workshops: { label: "ورش العمل", color: "var(--chart-2)" },
} satisfies ChartConfig

// ─── Training Hours Area Chart ──────────────────────────────────────────────

const trainingHours = [
  { month: "يناير", hours: 85 },
  { month: "فبراير", hours: 102 },
  { month: "مارس", hours: 120 },
  { month: "أبريل", hours: 95 },
  { month: "مايو", hours: 140 },
  { month: "يونيو", hours: 125 },
  { month: "يوليو", hours: 110 },
  { month: "أغسطس", hours: 78 },
  { month: "سبتمبر", hours: 132 },
  { month: "أكتوبر", hours: 148 },
  { month: "نوفمبر", hours: 138 },
  { month: "ديسمبر", hours: 115 },
]

const hoursConfig = {
  hours: { label: "ساعات التدريب", color: "var(--chart-1)" },
} satisfies ChartConfig

// ─── Top Courses ────────────────────────────────────────────────────────────

const topCourses = [
  { name: "تطوير تطبيقات الويب", enrolled: 42, capacity: 50 },
  { name: "إدارة المشاريع PMP", enrolled: 38, capacity: 40 },
  { name: "أمن المعلومات والشبكات", enrolled: 35, capacity: 40 },
  { name: "الذكاء الاصطناعي", enrolled: 32, capacity: 35 },
  { name: "التسويق الرقمي", enrolled: 28, capacity: 30 },
]

// ─── Top Instructors ────────────────────────────────────────────────────────

const topInstructors = [
  { name: "أحمد الكاظمي", courses: 6, rating: 4.8 },
  { name: "سارة العلي", courses: 5, rating: 4.9 },
  { name: "محمد الحسيني", courses: 5, rating: 4.7 },
  { name: "فاطمة الموسوي", courses: 4, rating: 4.6 },
  { name: "نور الهاشمي", courses: 4, rating: 4.8 },
]

// ─── Page ───────────────────────────────────────────────────────────────────

export default function StatisticsPage() {
  const totalCategory = React.useMemo(() => categoryDistribution.reduce((acc, curr) => acc + curr.count, 0), [])

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">الإحصائيات والتحليلات</h1>
        <p className="text-muted-foreground mt-1">نظرة شاملة على أداء التدريب والتطوير</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {card.up ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs font-medium ${card.up ? "text-green-600" : "text-red-600"}`}>
                  {card.trend}
                </span>
                <span className="text-xs text-muted-foreground">{card.desc}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2: Trend Line + Category Pie */}
      <div className="flex gap-4">
        <Card className="flex-[7]">
          <CardHeader>
            <CardTitle>اتجاه التسجيلات والإتمام</CardTitle>
            <CardDescription>مقارنة شهرية بين التسجيلات الجديدة وحالات الإتمام</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trendConfig} className="aspect-auto h-[280px] w-full">
              <LineChart accessibilityLayer data={monthlyTrend} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="enrollments" stroke="var(--color-enrollments)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="completions" stroke="var(--color-completions)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex-[3] flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>توزيع التصنيفات</CardTitle>
            <CardDescription>الدورات حسب التصنيف</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={categoryConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={categoryDistribution} dataKey="count" nameKey="category" innerRadius={60} strokeWidth={5}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                            <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">{totalCategory}</tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">تصنيف</tspan>
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
              التقني الأكثر طلباً <TrendingUp className="h-4 w-4" />
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Row 3: Department Bar + Training Hours Area */}
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>المشاركة حسب القسم</CardTitle>
            <CardDescription>عدد المسجلين في الدورات وورش العمل لكل قسم</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={deptConfig} className="aspect-auto h-[280px] w-full">
              <BarChart accessibilityLayer data={departmentData} margin={{ left: 12, right: 12 }} layout="vertical">
                <CartesianGrid horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis dataKey="dept" type="category" tickLine={false} axisLine={false} width={100} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="courses" fill="var(--color-courses)" radius={[0, 4, 4, 0]} />
                <Bar dataKey="workshops" fill="var(--color-workshops)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>ساعات التدريب الشهرية</CardTitle>
            <CardDescription>إجمالي ساعات التدريب المنفذة شهرياً</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={hoursConfig} className="aspect-auto h-[280px] w-full">
              <AreaChart accessibilityLayer data={trainingHours} margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="hours" fill="var(--color-hours)" fillOpacity={0.2} stroke="var(--color-hours)" strokeWidth={2} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Top Courses + Top Instructors */}
      <div className="flex gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              أكثر الدورات طلباً
            </CardTitle>
            <CardDescription>الدورات الأعلى تسجيلاً</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCourses.map((course) => {
              const percent = Math.round((course.enrolled / course.capacity) * 100)
              return (
                <div key={course.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{course.name}</span>
                    <span className="text-muted-foreground">{course.enrolled}/{course.capacity}</span>
                  </div>
                  <Progress value={percent} className="h-2" />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              أفضل المدربين
            </CardTitle>
            <CardDescription>المدربين الأعلى تقييماً</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topInstructors.map((instructor, i) => (
              <div key={instructor.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{instructor.name}</p>
                    <p className="text-xs text-muted-foreground">{instructor.courses} دورات</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold">{instructor.rating}</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
