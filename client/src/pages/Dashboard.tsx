import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, UserCircle, AlertCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useMemo } from "react";

export default function Dashboard() {
  const { data: allInfoLogs, isLoading: loadingInfoLogs } = trpc.infoLog.list.useQuery();
  const { data: houses, isLoading: loadingHouses } = trpc.house.list.useQuery();
  const { data: members, isLoading: loadingMembers } = trpc.member.list.useQuery();
  
  // เรียง InfoLog ล่าสุดขึ้นบนสุด
  const infoLogs = useMemo(() => {
    if (!allInfoLogs) return [];
    return [...allInfoLogs].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // ล่าสุดก่อน
    });
  }, [allInfoLogs]);

  const stats = [
    {
      title: "ข้อมูล InfoLog",
      value: infoLogs?.length || 0,
      icon: UserCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "จำนวนบ้าน",
      value: houses?.length || 0,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "สมาชิกทั้งหมด",
      value: members?.length || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "บ้านหมดอายุ",
      value: houses?.filter((h) => h.status === "expired").length || 0,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const recentInfoLogs = infoLogs.slice(0, 5);
  const expiredHouses = houses?.filter((h) => h.status === "expired") || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">ภาพรวมระบบจัดการลูกค้าและกลุ่มบ้าน</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {loadingInfoLogs || loadingHouses || loadingMembers ? "..." : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Info Logs */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูล InfoLog ล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingInfoLogs ? (
              <p className="text-gray-500">กำลังโหลด...</p>
            ) : recentInfoLogs.length === 0 ? (
              <p className="text-gray-500">ยังไม่มีข้อมูล</p>
            ) : (
              <div className="space-y-3">
                {recentInfoLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{log.customerName || "ไม่ระบุชื่อ"}</p>
                      <p className="text-sm text-gray-500">
                        {log.email} • กลุ่มบ้าน: {log.houseGroup || "ไม่ระบุ"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.syncStatus === "ok"
                            ? "bg-green-100 text-green-800"
                            : log.syncStatus === "error"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {log.syncStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expired Houses */}
        {expiredHouses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                บ้านที่หมดอายุ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {expiredHouses.map((house) => (
                  <div
                    key={house.id}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">บ้านเลขที่ {house.houseNumber}</p>
                      <p className="text-sm text-gray-500">{house.adminEmail || "ไม่มีอีเมลแอดมิน"}</p>
                    </div>
                    <span className="text-sm text-red-600 font-medium">หมดอายุ</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
