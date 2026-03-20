"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit } from "lucide-react"
import type { UserRecord, UserStatus, UserRole } from "./users-types"

interface UsersTableProps {
  records: UserRecord[]
  onEdit: (user: UserRecord) => void
  onDelete: (user: UserRecord) => void
}

const statusColor: Record<UserStatus, string> = {
  "نشط": "bg-green-100 text-green-800 border-green-300",
  "معطل": "bg-red-100 text-red-800 border-red-300",
}

const roleColor: Record<UserRole, string> = {
  "مشرف": "bg-violet-100 text-violet-800 border-violet-300",
  "مدرب": "bg-blue-100 text-blue-800 border-blue-300",
  "موظف": "bg-slate-100 text-slate-800 border-slate-300",
  "مدير": "bg-amber-100 text-amber-800 border-amber-300",
}

export default function UsersTable({ records, onEdit, onDelete }: UsersTableProps) {
  if (records.length === 0) {
    return (
      <div className="border rounded-md" dir="rtl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16 text-right">#</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">البريد الإلكتروني</TableHead>
              <TableHead className="text-right">الدور</TableHead>
              <TableHead className="text-right">القسم</TableHead>
              <TableHead className="text-right">تاريخ الانضمام</TableHead>
              <TableHead className="text-right">الدورات</TableHead>
              <TableHead className="text-right">الورش</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="w-24 text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                لا يوجد مستخدمين.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="border rounded-md" dir="rtl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-right">#</TableHead>
            <TableHead className="text-right">الاسم</TableHead>
            <TableHead className="text-right">البريد الإلكتروني</TableHead>
            <TableHead className="text-right">الدور</TableHead>
            <TableHead className="text-right">القسم</TableHead>
            <TableHead className="text-right">تاريخ الانضمام</TableHead>
            <TableHead className="text-right">الدورات</TableHead>
            <TableHead className="text-right">الورش</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="w-24 text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell className="text-muted-foreground">{user.email}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleColor[user.role]}`}>
                  {user.role}
                </span>
              </TableCell>
              <TableCell>{user.department}</TableCell>
              <TableCell>{user.joinDate}</TableCell>
              <TableCell>{user.coursesCount}</TableCell>
              <TableCell>{user.workshopsCount}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusColor[user.status]}`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(user)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
