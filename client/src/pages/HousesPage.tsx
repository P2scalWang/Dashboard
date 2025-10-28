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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

export default function HousesPage() {
  const { data: houses, isLoading } = trpc.house.listWithMemberCount.useQuery();
  const utils = trpc.useUtils();
  
  const deleteMutation = trpc.house.delete.useMutation({
    onSuccess: () => {
      utils.house.list.invalidate();
      toast.success("ลบข้อมูลสำเร็จ");
    },
    onError: () => {
      toast.error("ลบข้อมูลไม่สำเร็จ");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("คุณต้องการลบบ้านนี้ใช่หรือไม่?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      expired: "bg-red-100 text-red-800",
      moved: "bg-blue-100 text-blue-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">รายชื่อรวม</h1>
          <p className="text-gray-500 mt-1">ตารางบ้านหลัก/แอดมินของบ้าน</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายการบ้าน</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500">กำลังโหลด...</p>
            ) : !houses || houses.length === 0 ? (
              <p className="text-gray-500">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลขบ้าน</TableHead>
                      <TableHead>อีเมลแอดมิน</TableHead>
                      <TableHead>วันที่สมัคร</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>หมายเหตุ</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {houses.map((house) => (
                      <TableRow key={house.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{house.houseNumber}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              house.memberCount >= 5
                                ? "bg-red-100 text-red-800"
                                : house.memberCount >= 3
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {house.memberCount}/5
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{house.adminEmail || "-"}</TableCell>
                        <TableCell>
                          {house.registrationDate
                            ? new Date(house.registrationDate).toLocaleDateString("th-TH")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                              house.status
                            )}`}
                          >
                            {house.status}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{house.note || "-"}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(house.id)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
