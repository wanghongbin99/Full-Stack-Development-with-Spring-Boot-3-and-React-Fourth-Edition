import { z } from 'zod'

export const userRegistrationSchema = z.object({
  firstName: z.string().min(2, '姓名至少2个字符'),
  lastName: z.string().min(2, '姓氏至少2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(8, '密码至少8个字符'),
  phone: z.string().optional(),
  dateOfBirth: z.date().optional()
})

export const vehicleSchema = z.object({
  vin: z.string().length(17, 'VIN码必须是17位'),
  make: z.string().min(1, '制造商不能为空'),
  model: z.string().min(1, '型号不能为空'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().optional(),
  mileage: z.number().optional()
})

export const policySchema = z.object({
  vehicleId: z.string(),
  policyType: z.enum(['COMPREHENSIVE', 'THIRD_PARTY', 'COLLISION']),
  coverageLevel: z.enum(['BASIC', 'STANDARD', 'PREMIUM']),
  startDate: z.date(),
  endDate: z.date()
})