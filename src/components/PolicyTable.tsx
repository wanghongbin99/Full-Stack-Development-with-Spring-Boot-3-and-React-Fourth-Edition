// components/PolicyTable.tsx
import React from 'react'

interface Policy {
  id: number
  policyNumber: string
  type: string
  startDate: string
  endDate: string
  premiumAmount: number
  status: string
  vehicle: {
    make: string
    model: string
    color: string
    licensePlate: string
  }
}

interface PolicyTableProps {
  policies: Policy[]
}

export default function PolicyTable({ policies }: PolicyTableProps) {
  return (
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
        </tr>
      </thead>
      <tbody>
        {policies.map((policy) => (
          <tr key={policy.id} className="hover:bg-gray-50">
            <td className="py-2 px-4 border-b">{policy.policyNumber}</td>
            <td className="py-2 px-4 border-b">{policy.type}</td>
            <td className="py-2 px-4 border-b">{new Date(policy.startDate).toLocaleDateString()}</td>
            <td className="py-2 px-4 border-b">{new Date(policy.endDate).toLocaleDateString()}</td>
            <td className="py-2 px-4 border-b">¥{policy.premiumAmount}</td>
            <td className="py-2 px-4 border-b">{policy.status}</td>
            <td className="py-2 px-4 border-b">
              {policy.vehicle.make} {policy.vehicle.model} ({policy.vehicle.licensePlate})
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}