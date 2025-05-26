// components/AddVehicleModal.tsx
import React, { useState } from 'react'

interface FormData {
  make: string
  model: string
  year: string
  licensePlate: string
  type: string
}

interface AddVehicleModalProps {
  onClose: () => void
  onAdd: (vehicle: FormData) => void
}

export default function AddVehicleModal({ onClose, onAdd }: AddVehicleModalProps) {
  const [formData, setFormData] = useState<FormData>({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    type: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = () => {
    const newVehicle: FormData = {
      make: formData.make,
      model: formData.model,
      year: formData.year,
      licensePlate: formData.licensePlate,
      type: formData.type,
    };
    console.log("Submitting new vehicle:", newVehicle);
    // 调用父组件的回调函数，将新车辆数据传递给父组件
    onAdd(newVehicle);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">添加车辆</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">品牌</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="model" className="block text-sm font-medium mb-1">型号</label>
            <input
              id="model"
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="year" className="block text-sm font-medium mb-1">年份</label>
            <input
              id="year"
              type="number"
              name="year"
              value={formData.year}
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