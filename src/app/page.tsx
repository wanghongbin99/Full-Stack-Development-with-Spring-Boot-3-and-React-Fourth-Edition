import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          车辆保险管理系统
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          专业的车辆保险管理平台，为您提供全方位的保险服务
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link href="/auth/login">登录</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/register">注册</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}