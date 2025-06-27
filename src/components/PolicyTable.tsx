import React, { useState } from 'react';
import { Policy, Vehicle, PolicyType, CoverageLevel, PolicyStatus } from '@prisma/client';
import EditPolicyModal from './EditPolicyModal'; // Import the new modal

interface PolicyWithRelations extends Policy {
  vehicle: Vehicle; // Assuming vehicle is always included
}

interface PolicyTableProps {
  policies: PolicyWithRelations[];
  onPolicyUpdated: (updatedPolicy: Policy) => void; // Callback for when a policy is updated
  onPolicyRenewed: (newPolicy: Policy) => void; // Callback for when a policy is renewed
}

export default function PolicyTable({ policies, onPolicyUpdated, onPolicyRenewed }: PolicyTableProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyWithRelations | null>(null);

  const handleEditClick = (policy: PolicyWithRelations) => {
    setSelectedPolicy(policy);
    setIsEditModalOpen(true);
  };

  const handlePolicyUpdate = (updatedPolicy: Policy) => {
    onPolicyUpdated(updatedPolicy);
    setIsEditModalOpen(false);
    setSelectedPolicy(null);
  };

  const handleRenewClick = async (policyId: string) => {
    if (!confirm('确定要续保此保单吗？')) return;
    try {
      const response = await fetch(`/api/policies/${policyId}`, {
        method: 'POST', // Use POST for renewal
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to renew policy');
      }

      const newPolicy = await response.json();
      onPolicyRenewed(newPolicy);
      alert('保单续保成功！');
    } catch (err: any) {
      console.error('Error renewing policy:', err);
      alert(`保单续保失败: ${err.message}`);
    }
  };

  return (
    <>
      <table className="min-w-full bg-white border border-gray-300 mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">保单号</th>
            <th className="py-2 px-4 border-b">类型</th>
            <th className="py-2 px-4 border-b">开始日期</th>
            <th className="py-2 px-4 border-b">结束日期</th>
            <th className="py-2 px-4 border-b">保费</th>
            <th className="py-2 px-4 border-b">状态</th>
            <th className="py-2 px-4 border-b">关联车辆</th>
            <th className="py-2 px-4 border-b">操作</th> {/* New column for actions */}
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{policy.policyNumber}</td>
              <td className="py-2 px-4 border-b">{policy.policyType}</td>
              <td className="py-2 px-4 border-b">{new Date(policy.startDate).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">{new Date(policy.endDate).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">¥{Number(policy.premiumAmount).toFixed(2)}</td>
              <td className="py-2 px-4 border-b">{policy.status}</td>
              <td className="py-2 px-4 border-b">
                {policy.vehicle.make} {policy.vehicle.model} ({policy.vehicle.licensePlate || policy.vehicle.vin})
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditClick(policy)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs mr-2"
                >
                  编辑
                </button>
                {policy.status === 'EXPIRED' && ( // Only allow renewal for expired policies
                  <button
                    onClick={() => handleRenewClick(policy.id)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-xs"
                  >
                    续保
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditModalOpen && selectedPolicy && (
        <EditPolicyModal
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handlePolicyUpdate}
          policy={selectedPolicy}
        />
      )}
    </>
  );
}
