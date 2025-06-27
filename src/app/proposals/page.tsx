import { useEffect, useState } from 'react';
import { Proposal, PolicyType, CoverageLevel, ProposalStatus } from '@prisma/client';
import AddPolicyModal from '@/components/AddPolicyModal';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/proposals');
      if (!res.ok) {
        throw new Error('Failed to fetch proposals');
      }
      const data = await res.json();
      setProposals(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  const handleApproveProposal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsPolicyModalOpen(true);
  };

  const handleRejectProposal = async (proposalId: string) => {
    if (!confirm('确定要拒绝此投保申请吗？')) return;
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject proposal');
      }
      fetchProposals(); // Refresh the list
    } catch (err: any) {
      console.error('Error rejecting proposal:', err);
      setError(err.message);
    }
  };

  const handlePolicyAdded = () => {
    setIsPolicyModalOpen(false);
    setSelectedProposal(null);
    fetchProposals(); // Refresh proposals after policy is added
  };

  if (loading) {
    return <div className="p-6">加载中...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">投保申请管理</h1>

        {proposals.length === 0 ? (
          <p>暂无投保申请。</p>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">客户ID</th>
                  <th className="py-2 px-4 border-b">车辆ID</th>
                  <th className="py-2 px-4 border-b">保单类型</th>
                  <th className="py-2 px-4 border-b">承保级别</th>
                  <th className="py-2 px-4 border-b">开始日期</th>
                  <th className="py-2 px-4 border-b">结束日期</th>
                  <th className="py-2 px-4 border-b">状态</th>
                  <th className="py-2 px-4 border-b">备注</th>
                  <th className="py-2 px-4 border-b">操作</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm">{proposal.id}</td>
                    <td className="py-2 px-4 border-b text-sm">{proposal.customerId}</td>
                    <td className="py-2 px-4 border-b text-sm">{proposal.vehicleId}</td>
                    <td className="py-2 px-4 border-b text-sm">{proposal.policyType}</td>
                    <td className="py-2 px-4 border-b text-sm">{proposal.coverageLevel}</td>
                    <td className="py-2 px-4 border-b text-sm">{new Date(proposal.startDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b text-sm">{new Date(proposal.endDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b text-sm">{proposal.status}</td>
                    <td className="py-2 px-4 border-b text-sm">{proposal.notes || '-'}</td>
                    <td className="py-2 px-4 border-b text-sm">
                      {proposal.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApproveProposal(proposal)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs mr-2"
                          >
                            批准
                          </button>
                          <button
                            onClick={() => handleRejectProposal(proposal.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                          >
                            拒绝
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isPolicyModalOpen && selectedProposal && (
        <AddPolicyModal
          onClose={() => setIsPolicyModalOpen(false)}
          onAdd={handlePolicyAdded}
          proposal={selectedProposal}
        />
      )}
    </div>
  );
}
