import React, { useState, useEffect } from 'react';
import { Policy, PolicyType, CoverageLevel, Vehicle } from '@prisma/client';

interface EditPolicyModalProps {
  onClose: () => void;
  onUpdate: (updatedPolicy: Policy) => void;
  policy: Policy; // The policy to be edited
}

export default function EditPolicyModal({ onClose, onUpdate, policy }: EditPolicyModalProps) {
  const [policyNumber, setPolicyNumber] = useState(policy.policyNumber);
  const [policyType, setPolicyType] = useState<PolicyType>(policy.policyType);
  const [coverageLevel, setCoverageLevel] = useState<CoverageLevel>(policy.coverageLevel);
  const [premiumAmount, setPremiumAmount] = useState(policy.premiumAmount.toString());
  const [deductible, setDeductible] = useState(policy.deductible.toString());
  const [startDate, setStartDate] = useState(new Date(policy.startDate).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(policy.endDate).toISOString().split('T')[0]);
  const [status, setStatus] = useState(policy.status);
  const [vehicleId, setVehicleId] = useState(policy.vehicleId);
  const [customerId, setCustomerId] = useState(policy.customerId);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('/api/vehicles');
        if (!res.ok) {
          throw new Error('Failed to fetch vehicles');
        }
        const data = await res.json();
        setVehicles(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoadingVehicles(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPolicyData = {
      policyNumber,
      customerId,
      vehicleId,
      agentId: policy.agentId, // Keep existing agentId
      policyType,
      coverageLevel,
      premiumAmount: parseFloat(premiumAmount),
      deductible: parseFloat(deductible),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      status,
    };

    try {
      const response = await fetch(`/api/policies/${policy.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPolicyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update policy');
      }

      const savedPolicy = await response.json();
      onUpdate(savedPolicy);
      onClose();
    } catch (err: any) {
      console.error('Error updating policy:', err);
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">编辑保单</h2>
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="policyNumber">
              保单号
            </label>
            <input
              type="text"
              id="policyNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vehicleId">
              关联车辆
            </label>
            {loadingVehicles ? (
              <div>加载车辆中...</div>
            ) : vehicles.length === 0 ? (
              <div className="text-red-500">请先添加车辆</div>
            ) : (
              <select
                id="vehicleId"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                required
              >
                <option value="">选择车辆</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} ({v.licensePlate || v.vin})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="policyType">
              保单类型
            </label>
            <select
              id="policyType"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={policyType}
              onChange={(e) => setPolicyType(e.target.value as PolicyType)}
              required
            >
              <option value="">选择类型</option>
              {Object.values(PolicyType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="coverageLevel">
              承保级别
            </label>
            <select
              id="coverageLevel"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={coverageLevel}
              onChange={(e) => setCoverageLevel(e.target.value as CoverageLevel)}
              required
            >
              <option value="">选择级别</option>
              {Object.values(CoverageLevel).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="premiumAmount">
              保费金额
            </label>
            <input
              type="number"
              id="premiumAmount"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={premiumAmount}
              onChange={(e) => setPremiumAmount(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deductible">
              免赔额
            </label>
            <input
              type="number"
              id="deductible"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={deductible}
              onChange={(e) => setDeductible(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
              开始日期
            </label>
            <input
              type="date"
              id="startDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
              结束日期
            </label>
            <input
              type="date"
              id="endDate"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              状态
            </label>
            <select
              id="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">选择状态</option>
              <option value="ACTIVE">活跃</option>
              <option value="EXPIRED">过期</option>
              <option value="CANCELLED">已取消</option>
              <option value="SUSPENDED">已暂停</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              更新保单
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
