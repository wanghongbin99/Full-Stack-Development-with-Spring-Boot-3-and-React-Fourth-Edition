// components/AddPolicyModal.tsx
import React, { useState } from 'react'

interface FormData {
  policyNumber: string
  type: string
  startDate: string
  endDate: string
  premium: string
  status: string
  carId: string
}

interface AddPolicyModalProps {
  readonly onClose: () => void
  readonly onAdd: (policy: FormData) => void
}

export default function AddPolicyModal({ onClose, onAdd }: AddPolicyModalProps) {
  const [formData, setFormData] = useState<FormData>({
    policyNumber: '',
    type: '',
    startDate: '',
    endDate: '',
    premium: '',
    status: '',
    carId: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/policies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        premium: parseFloat(formData.premium),
        carId: parseInt(formData.carId)
      })
    })

    if (res.ok) {
      const newPolicy = await res.json()
      onAdd(newPolicy)
    } else {
      alert('添加失败，请重试')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">添加保单</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">保单号</label>
            <input
              type="text"
              name="policyNumber"
              value={formData.policyNumber}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-sm font-medium mb-1">类型</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">请选择</option>
              <option value="交强险">交强险</option>
              <option value="商业险">商业险</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">开始日期</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">结束日期</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">保费</label>
            <input
              type="number"
              step="0.01"
              name="premium"
              value={formData.premium}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">状态</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">请选择</option>
              <option value="生效中">生效中</option>
              <option value="已过期">已过期</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">关联车辆 ID</label>
            <input
              type="number"
              name="carId"
              value={formData.carId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}