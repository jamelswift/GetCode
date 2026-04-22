'use client'

import Link from 'next/link'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { motion } from 'framer-motion'
import { LogOut, User, BookOpen, LayoutDashboard } from 'lucide-react'

export function Navbar() {
  const { currentUser, isLoggedIn, logout } = useAppStore()
  const displayName = (currentUser?.name ?? '').trim() || 'ผู้ใช้'
  const initial = displayName.charAt(0)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#22c55e] to-[#3b82f6] rounded-xl flex items-center justify-center text-xl font-bold text-white">
                C
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#22c55e] to-[#3b82f6] bg-clip-text text-transparent">
                CodeQuest
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground/70 hover:text-foreground transition-colors">
              หน้าแรก
            </Link>
            <Link href="/lessons" className="text-foreground/70 hover:text-foreground transition-colors">
              บทเรียน
            </Link>
            {isLoggedIn && currentUser?.role === 'teacher' && (
              <Link href="/teacher" className="text-foreground/70 hover:text-foreground transition-colors">
                จัดการนักเรียน
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {isLoggedIn && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 border-primary/30 hover:border-primary">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center text-white text-sm font-medium">
                      {initial}
                    </div>
                    <span className="hidden sm:inline">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={currentUser.role === 'teacher' ? '/teacher' : '/dashboard'} className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      แดชบอร์ด
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/lessons" className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      บทเรียน
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      โปรไฟล์
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    ออกจากระบบ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">เข้าสู่ระบบ</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6] hover:opacity-90">
                    ลงทะเบียน
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
