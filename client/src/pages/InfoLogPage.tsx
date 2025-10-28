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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";

export default function InfoLogPage() {
  const { data: infoLogs, isLoading } = trpc.infoLog.list.useQuery();
  const { data: houses } = trpc.house.list.useQuery();
  const { data: availableHouses } = trpc.member.listAvailableHouses.useQuery();
  const utils = trpc.useUtils();
  
  const [editingLog, setEditingLog] = useState<number | null>(null);
  const [editingHouseGroup, setEditingHouseGroup] = useState<string>("");
  
  // สร้าง map สำหรับ houseId -> houseNumber
  const houseMap = useMemo(() => {
    if (!houses) return new Map();
    return new Map(houses.map((h) => [h.id, h.houseNumber]));
  }, [houses]);
  
  const updateMutation = trpc.infoLog.update.useMutation({
    onSuccess: () => {
      utils.infoLog.list.invalidate();
      toast.success("บันทึกข้อมูลสำเร็จ");
      setEditingLog(null);
      setEditingHouseGroup("");
    },
    onError: () => {
      toast.error("บันทึกข้อมูลไม่สำเร็จ");
    },
  });
  
  const deleteMutation = trpc.infoLog.delete.useMutation({
    onSuccess: () => {
      utils.infoLog.list.invalidate();
      toast.success("ลบข้อมูลสำเร็จ");
    },
    onError: () => {
      toast.error("ลบข้อมูลไม่สำเร็จ");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
      deleteMutation.mutate({ id });
    }
  };
  
  const handleEditHouseGroup = (logId: number, currentHouseGroup: string | null) => {
    setEditingLog(logId);
    setEditingHouseGroup(currentHouseGroup || "");
  };
  
  const handleSaveHouseGroup = (logId: number) => {
    if (!editingHouseGroup.trim()) {
      toast.error("กรุณากรอกกลุ่มบ้าน");
      return;
    }
    
    updateMutation.mutate({
      id: logId,
      houseGroup: editingHouseGroup,
    });
  };
  
  const handleCancelEdit = () => {
    setEditingLog(null);
    setEditingHouseGroup("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">InfoLog</h1>
          <p className="text-gray-500 mt-1">ตารางรับข้อมูลดิบจากแอดมิน/บอท</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>รายการข้อมูล InfoLog</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500">กำลังโหลด...</p>
            ) : !infoLogs || infoLogs.length === 0 ? (
              <p className="text-gray-500">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>LINE ID</TableHead>
                      <TableHead>ชื่อลูกค้า</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>กลุ่มบ้าน</TableHead>
                      <TableHead>แพคเกจ</TableHead>
                      <TableHead>ราคา</TableHead>
                      <TableHead>วันที่สมัคร</TableHead>
                      <TableHead>วันหมดอายุ</TableHead>
                      <TableHead>ช่องทาง</TableHead>
                      <TableHead>สถานะซิงก์</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {infoLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.lineId}</TableCell>
                        <TableCell>{log.customerName}</TableCell>
                        <TableCell>{log.email}</TableCell>
                        <TableCell>
                          {editingLog === log.id ? (
                            <div className="flex items-center gap-2">
                              <Select
                                value={editingHouseGroup}
                                onValueChange={(value) => setEditingHouseGroup(value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="เลือกบ้าน" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableHouses?.map((house) => (
                                    <SelectItem key={house.id} value={house.houseNumber}>
                                      {house.houseNumber}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button size="sm" onClick={() => handleSaveHouseGroup(log.id)}>
                                บันทึก
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                ยกเลิก
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>{log.houseGroup || "-"}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditHouseGroup(log.id, log.houseGroup)}
                              >
                                แก้ไข
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{log.package}</TableCell>
                        <TableCell>{log.packagePrice}</TableCell>
                        <TableCell>{log.registrationDate ? new Date(log.registrationDate).toLocaleDateString('th-TH') : '-'}</TableCell>
                        <TableCell>{log.expirationDate ? new Date(log.expirationDate).toLocaleDateString('th-TH') : '-'}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {log.channel}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              log.syncStatus === "ok"
                                ? "bg-green-100 text-green-800"
                                : log.syncStatus === "error"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {log.syncStatus}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(log.id)}
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
