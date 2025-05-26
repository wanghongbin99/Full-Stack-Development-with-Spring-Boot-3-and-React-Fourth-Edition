// components/VehicleTable.tsx
import React from 'react'

interface Vehicle {
  id: number
  make: string
  model: string
  year: number
}



interface VehicleTableProps {
  readonly vehicles: readonly Vehicle[];
}

export default function VehicleTable({ vehicles }: VehicleTableProps) {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b">品牌</th>
          <th className="py-2 px-4 border-b">型号</th>
          <th className="py-2 px-4 border-b">年份</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((vehicle: Vehicle) => (
          <tr key={vehicle.id} className="hover:bg-gray-50">
            <td className="py-2 px-4 border-b">{vehicle.make}</td>
            <td className="py-2 px-4 border-b">{vehicle.model}</td>
            <td className="py-2 px-4 border-b">{vehicle.year}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}