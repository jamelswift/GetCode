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
import { LogIn, User, GraduationCap, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAppStore()
  const [role, setRole] = useState<'student' | 'teacher' | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!role) {
      setError('กรุณาเลือกประเภทผู้ใช้')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message ?? 'เข้าสู่ระบบไม่สำเร็จ')
        return
      }

      login(data.user)
      router.push(role === 'teacher' ? '/teacher' : '/dashboard')
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
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">เข้าสู่ระบบ</h1>
            <p className="text-muted-foreground mt-1">ยินดีต้อนรับกลับมา!</p>
          </div>

          {/* Role Selection */}
          {!role ? (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground mb-4">เลือกประเภทผู้ใช้</p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole('student')}
                className="w-full p-6 rounded-2xl bg-gradient-to-r from-[#22c55e]/20 to-[#22c55e]/10 border border-[#22c55e]/30 hover:border-[#22c55e] transition-all flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-[#22c55e] flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">นักเรียน</div>
                  <div className="text-sm text-muted-foreground">เข้าสู่ระบบเพื่อเรียนรู้</div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole('teacher')}
                className="w-full p-6 rounded-2xl bg-gradient-to-r from-[#3b82f6]/20 to-[#3b82f6]/10 border border-[#3b82f6]/30 hover:border-[#3b82f6] transition-all flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-[#3b82f6] flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">ครูผู้สอน</div>
                  <div className="text-sm text-muted-foreground">เข้าสู่ระบบเพื่อจัดการ</div>
                </div>
              </motion.button>
            </div>
          ) : (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleLogin}
              className="space-y-4"
            >
              {/* Role Indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      role === 'student' ? 'bg-[#22c55e]' : 'bg-[#3b82f6]'
                    }`}
                  >
                    {role === 'student' ? (
                      <GraduationCap className="w-4 h-4 text-white" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {role === 'student' ? 'นักเรียน' : 'ครูผู้สอน'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRole(null)}
                  className="text-sm text-primary hover:underline"
                >
                  เปลี่ยน
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={role === 'teacher' ? 'teacher@school.com' : 'student@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="รหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              {role === 'teacher' && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-sm text-foreground/90">
                  บัญชีครูเริ่มต้น: Wipatsasicha0702@gmail.com / Wicha0702
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-[#22c55e] to-[#3b82f6] hover:opacity-90"
              >
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </Button>
            </motion.form>
          )}

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{' '}
            <Link href="/register" className="text-primary hover:underline">
              ลงทะเบียน
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
