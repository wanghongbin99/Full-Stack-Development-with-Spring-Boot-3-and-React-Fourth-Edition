// app/dashboard/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PolicyTable from "@/components/PolicyTable";
import AddPolicyModal from "@/components/AddPolicyModal";
import VehicleTable from "@/components/VehicleTable";
import AddVehicleModal from "@/components/AddVehicleModal";
import { Policy, Vehicle } from "@prisma/client";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  // 如果未登录，跳转到首页或登录页
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // 获取车辆数据
  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      setVehicles(data);
    };

    if (status === "authenticated") {
      fetchVehicles();
    }
  }, [status]);

  // 获取保单数据
  useEffect(() => {
    const fetchPolicies = async () => {
      const res = await fetch("/api/policies");
      const data = await res.json();
      setPolicies(data);
    };

    if (status === "authenticated") {
      fetchPolicies();
    }
  }, [status]);

  // 新增车辆回调
  const handleAddVehicle = async (newVehicle: Vehicle) => {
    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVehicle),
      });

      if (!response.ok) {
        throw new Error("Failed to add vehicle");
      }

      const savedVehicle = await response.json();
      setVehicles((prev) => [...prev, savedVehicle]);
      setIsVehicleModalOpen(false);
    } catch (error) {
      console.error("Error adding vehicle:", error);
    }
  };

  // 新增保单回调
  const handleAddPolicy = (newPolicy: Policy) => {
    setPolicies((prev) => [...prev, newPolicy]);
    setIsPolicyModalOpen(false);
  };

  if (status === "loading") {
    return <div>加载中...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">保险管理系统</h1>
          <div>
            <span className="text-sm text-gray-600">
              欢迎，{session.user?.name || "用户"}
            </span>
            <button
              onClick={() => router.push("/api/auth/signout")}
              className="ml-4 text-sm text-red-500 hover:underline"
            >
              登出
            </button>
          </div>
        </header>

        {/* 车辆管理 */}
        <section className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">车辆列表</h2>
            <button
              onClick={() => setIsVehicleModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
              + 添加车辆
            </button>
          </div>
          <VehicleTable vehicles={vehicles} />
        </section>

        {/* 保单管理 */}
        <section className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">保单列表</h2>
            <button
              onClick={() => setIsPolicyModalOpen(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            >
              + 添加保单
            </button>
          </div>
          <PolicyTable policies={policies} />
        </section>
      </div>

      {/* 模态框 */}
      {isVehicleModalOpen && (
        <AddVehicleModal
          onClose={() => setIsVehicleModalOpen(false)}
          onAdd={handleAddVehicle}
        />
      )}
      {isPolicyModalOpen && (
        <AddPolicyModal
          onClose={() => setIsPolicyModalOpen(false)}
          onAdd={handleAddPolicy}
        />
      )}
    </div>
  );
}
