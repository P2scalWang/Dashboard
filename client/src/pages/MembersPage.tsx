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
import { Trash2, CheckCircle, XCircle, Save } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MembersPage() {
  const { data: members, isLoading: loadingMembers } = trpc.member.list.useQuery();
  const { data: houses, isLoading: loadingHouses } = trpc.house.list.useQuery();
  const { data: availableHouses } = trpc.member.listAvailableHouses.useQuery();
  const utils = trpc.useUtils();
  
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [selectedHouseId, setSelectedHouseId] = useState<number | null>(null);
  const [filterHouseId, setFilterHouseId] = useState<string>("all");

  const deleteMutation = trpc.member.delete.useMutation({
    onSuccess: () => {
      utils.member.list.invalidate();
      toast.success("ลบข้อมูลสำเร็จ");
    },
    onError: () => {
      toast.error("ลบข้อมูลไม่สำเร็จ");
    },
  });

  const updateMutation = trpc.member.update.useMutation({
    onSuccess: () => {
      utils.member.list.invalidate();
      toast.success("อัปเดตกลุ่มบ้านสำเร็จ");
      setEditingMember(null);
      setSelectedHouseId(null);
    },
    onError: () => {
      toast.error("อัปเดตกลุ่มบ้านไม่สำเร็จ");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("คุณต้องการลบสมาชิกนี้ใช่หรือไม่?")) {
      deleteMutation.mutate({ id });
    }
  };

  // สร้าง map สำหรับ houseId -> houseNumber
  const houseMap = useMemo(() => {
    if (!houses) return new Map();
    return new Map(houses.map((h) => [h.id, h.houseNumber]));
  }, [houses]);

  const handleEditHouse = (memberId: number, currentHouseId: number) => {
    setEditingMember(memberId);
    setSelectedHouseId(currentHouseId);
  };

  const handleSaveHouse = (memberId: number) => {
    if (selectedHouseId === null) {
      toast.error("กรุณาเลือกกลุ่มบ้าน");
      return;
    }
    updateMutation.mutate({
      id: memberId,
      houseId: selectedHouseId,
    });
  };

  const handleCancelEdit = () => {
    setEditingMember(null);
    setSelectedHouseId(null);
  };

  // กรองสมาชิกตามบ้านที่เลือก
  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (filterHouseId === "all") return members;
    return members.filter((m) => m.houseId === Number(filterHouseId));
  }, [members, filterHouseId]);

  const isLoading = loadingMembers || loadingHouses;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">สมาชิกบ้าน</h1>
          <p className="text-gray-500 mt-1">รายการสมาชิกในแต่ละบ้าน</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>รายการสมาชิก</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">กรองตามบ้าน:</span>
                <Select value={filterHouseId} onValueChange={setFilterHouseId}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="เลือกบ้าน" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {houses?.map((house) => (
                      <SelectItem key={house.id} value={house.id.toString()}>
                        {house.houseNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-500">กำลังโหลด...</p>
            ) : !filteredMembers || filteredMembers.length === 0 ? (
              <p className="text-gray-500">ไม่พบข้อมูลสมาชิก</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลขบ้าน</TableHead>
                      <TableHead>อีเมลสมาชิก</TableHead>
                      <TableHead>วันหมดอายุ</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>หมายเหตุ</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          {editingMember === member.id ? (
                            <Select
                              value={selectedHouseId?.toString()}
                              onValueChange={(value) => setSelectedHouseId(Number(value))}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="เลือกบ้าน" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableHouses?.map((house) => (
                                  <SelectItem key={house.id} value={house.id.toString()}>
                                    {house.houseNumber}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <span className="font-semibold">
                              {houseMap.get(member.houseId) || `ID: ${member.houseId}`}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{member.memberEmail}</TableCell>
                        <TableCell>
                          {member.expirationDate
                            ? new Date(member.expirationDate).toLocaleDateString("th-TH")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {member.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3" />
                              ใช้งานอยู่
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <XCircle className="w-3 h-3" />
                              ไม่ใช้งาน
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{member.note || "-"}</TableCell>
                        <TableCell className="text-right">
                          {editingMember === member.id ? (
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleSaveHouse(member.id)}
                                disabled={updateMutation.isPending}
                              >
                                <Save className="w-4 h-4 mr-1" />
                                บันทึก
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={updateMutation.isPending}
                              >
                                ยกเลิก
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditHouse(member.id, member.houseId)}
                              >
                                แก้ไขบ้าน
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(member.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          )}
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
