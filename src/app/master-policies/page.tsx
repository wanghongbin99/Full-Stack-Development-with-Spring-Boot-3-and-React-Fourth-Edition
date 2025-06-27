import { useEffect, useState } from 'react';
import { MasterPolicy, PolicyStatus, User } from '@prisma/client';

interface MasterPolicyWithRelations extends MasterPolicy {
  holder: User;
  policies: any[]; // Simplified for now
}

export default function MasterPoliciesPage() {
  const [masterPolicies, setMasterPolicies] = useState<MasterPolicyWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMasterPolicies = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/master-policies');
      if (!res.ok) {
        throw new Error('Failed to fetch master policies');
      }
      const data = await res.json();
      setMasterPolicies(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterPolicies();
  }, []);

  if (loading) {
    return <div className="p-6">加载中...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">主保单管理</h1>

        {masterPolicies.length === 0 ? (
          <p>暂无主保单。</p>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">主保单号</th>
                  <th className="py-2 px-4 border-b">持有人</th>
                  <th className="py-2 px-4 border-b">开始日期</th>
                  <th className="py-2 px-4 border-b">结束日期</th>
                  <th className="py-2 px-4 border-b">状态</th>
                  <th className="py-2 px-4 border-b">关联保单数量</th>
                </tr>
              </thead>
              <tbody>
                {masterPolicies.map((mp) => (
                  <tr key={mp.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b text-sm">{mp.masterPolicyNumber}</td>
                    <td className="py-2 px-4 border-b text-sm">{mp.holder.email}</td>
                    <td className="py-2 px-4 border-b text-sm">{new Date(mp.startDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b text-sm">{new Date(mp.endDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b text-sm">{mp.status}</td>
                    <td className="py-2 px-4 border-b text-sm">{mp.policies.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
