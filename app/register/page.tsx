'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DecorativeShapes } from '@/components/decorative-shapes'
import { useAppStore } from '@/lib/store'
import { UserPlus, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAppStore()
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน')
      return
    }

    if (formData.password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message ?? 'ลงทะเบียนไม่สำเร็จ')
        return
      }

      login({
        ...data.user,
        studentId: formData.studentId,
      })
      router.push('/dashboard')
    } catch {
      setError('เกิดข้อผิดพลาดระหว่างเชื่อมต่อเซิร์ฟเวอร์')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      <DecorativeShapes />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          กลับหน้าแรก
        </Link>

        <div className="bg-card rounded-3xl p-8 border border-border shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#22c55e] to-[#3b82f6] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ลงทะเบียนนักเรียน</h1>
            <p className="text-muted-foreground mt-1">สร้างบัญชีเพื่อเริ่มเรียน</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="กรอกชื่อ-นามสกุล"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentId">รหัสนักเรียน</Label>
              <Input
                id="studentId"
                name="studentId"
                type="text"
                placeholder="เช่น 65001"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-12"
              />
              {formData.password && formData.confirmPassword && (
                <div className="flex items-center gap-2 text-sm">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                      <span className="text-[#22c55e]">รหัสผ่านตรงกัน</span>
                    </>
                  ) : (
                    <span className="text-destructive">รหัสผ่านไม่ตรงกัน</span>
                  )}
                </div>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-[#22c55e] to-[#3b82f6] hover:opacity-90"
            >
              {isLoading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
            </Button>
          </form>

          {/* Benefits */}
          <div className="mt-6 p-4 rounded-xl bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">เมื่อลงทะเบียนคุณจะได้:</p>
            <ul className="space-y-1 text-sm">
              {['เข้าถึงบทเรียน 18 สัปดาห์', 'ทำแบบฝึกหัดเก็บคะแนน', 'สร้างนามบัตรดิจิทัล'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-foreground">
                  <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="text-primary hover:underline">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
