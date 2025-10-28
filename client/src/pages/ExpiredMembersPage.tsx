import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useMemo } from "react";

export default function ExpiredMembersPage() {
  const { data: members, isLoading: loadingMembers } = trpc.member.list.useQuery();
  const { data: houses, isLoading: loadingHouses } = trpc.house.list.useQuery();

  // สร้าง map สำหรับ houseId -> houseNumber
  const houseMap = useMemo(() => {
    if (!houses) return new Map();
    return new Map(houses.map((h) => [h.id, h.houseNumber]));
  }, [houses]);

  // กรองเฉพาะสมาชิกที่หมดอายุแล้ว และเรียงตามวันหมดอายุ (ล่าสุดก่อน)
  const expiredMembers = useMemo(() => {
    if (!members || !houses) return [];
    const now = new Date();
    const expired = members.filter((member) => {
      if (!member.expirationDate) return false;
      const expDate = new Date(member.expirationDate);
      return expDate < now;
    });
    
    // เรียงตามวันหมดอายุ (ล่าสุดก่อน)
    return expired.sort((a, b) => {
      const dateA = a.expirationDate ? new Date(a.expirationDate).getTime() : 0;
      const dateB = b.expirationDate ? new Date(b.expirationDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [members, houses]);

  const isLoading = loadingMembers || loadingHouses;

  // คำนวณจำนวนวันที่หมดอายุไปแล้ว
  const getDaysExpired = (expirationDate: Date | null) => {
    if (!expirationDate) return null;
    const now = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = now.getTime() - expDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">สมาชิกที่หมดอายุ</h1>
          <p className="text-gray-500 mt-1">รายการสมาชิกที่หมดอายุแล้ว เรียงตามวันหมดอายุล่าสุด</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              รายการสมาชิกที่หมดอายุ ({expiredMembers.length} คน)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500">กำลังโหลด...</p>
            ) : expiredMembers.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">ไม่มีสมาชิกที่หมดอายุ</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลขบ้าน</TableHead>
                      <TableHead>อีเมลสมาชิก</TableHead>
                      <TableHead>วันหมดอายุ</TableHead>
                      <TableHead>หมดอายุมาแล้ว</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>หมายเหตุ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiredMembers.map((member) => {
                      const daysExpired = getDaysExpired(member.expirationDate);
                      return (
                        <TableRow key={member.id} className="bg-red-50/50">
                          <TableCell className="font-semibold">
                            {houseMap.get(member.houseId) || `ID: ${member.houseId}`}
                          </TableCell>
                          <TableCell>{member.memberEmail}</TableCell>
                          <TableCell>
                            {member.expirationDate
                              ? new Date(member.expirationDate).toLocaleDateString("th-TH")
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {daysExpired !== null && (
                              <span className="text-red-600 font-medium">
                                {daysExpired} วัน
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <AlertCircle className="w-3 h-3" />
                              หมดอายุ
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{member.note || "-"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
