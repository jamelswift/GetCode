'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { DecorativeShapes } from '@/components/decorative-shapes'
import { useAppStore } from '@/lib/store'
import { 
  Rocket, 
  Code, 
  Palette, 
  Smartphone, 
  Trophy, 
  Users,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'

export default function HomePage() {
  const { isLoggedIn, currentUser } = useAppStore()

  const features = [
    {
      icon: <Code className="w-8 h-8" />,
      title: 'เรียน HTML & CSS',
      description: 'เริ่มต้นจากพื้นฐาน ไม่ต้องมีความรู้มาก่อน',
      color: '#22c55e',
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: 'ออกแบบสร้างสรรค์',
      description: 'ใช้ความคิดสร้างสรรค์ออกแบบนามบัตรของตัวเอง',
      color: '#3b82f6',
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'Responsive Design',
      description: 'เรียนรู้การทำเว็บให้แสดงผลได้ทุกอุปกรณ์',
      color: '#f97316',
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'เก็บคะแนน 100 คะแนน',
      description: 'ทำแบบฝึกหัดเก็บคะแนนผ่านด่านต่างๆ',
      color: '#eab308',
    },
  ]

  const weeklyLessons = [
    { week: '1-4', title: 'พื้นฐาน HTML & CSS', icon: '📝' },
    { week: '5-8', title: 'Layout & Styling', icon: '🎨' },
    { week: '9', title: 'สอบกลางภาค', icon: '📋' },
    { week: '10-13', title: 'Advanced Features', icon: '✨' },
    { week: '14-17', title: 'Deploy & Present', icon: '🚀' },
    { week: '18', title: 'สอบปลายภาค', icon: '🏆' },
  ]

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <DecorativeShapes />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-6">
              <Rocket className="w-4 h-4" />
              <span className="text-sm font-medium">เรียนฟรี 18 สัปดาห์</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
              เรียนสร้าง
              <span className="bg-gradient-to-r from-[#22c55e] via-[#3b82f6] to-[#f97316] bg-clip-text text-transparent">
                {' '}เว็บไซต์{' '}
              </span>
              <br />
              แบบสนุกๆ
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              เรียนรู้การสร้างเว็บไซต์ผ่านการทำ
              <span className="text-[#22c55e] font-semibold"> นามบัตรดิจิทัล </span>
              ของตัวเองใน 18 สัปดาห์ สำหรับนักเรียน ปวช.1 ไม่ต้องมีความรู้มาก่อน!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isLoggedIn ? (
                <Link href={currentUser?.role === 'teacher' ? '/teacher' : '/dashboard'}>
                  <Button size="lg" className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6] hover:opacity-90 text-lg px-8 py-6">
                    ไปที่แดชบอร์ด
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button size="lg" className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6] hover:opacity-90 text-lg px-8 py-6">
                      เริ่มเรียนเลย
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                      เข้าสู่ระบบ
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 mt-16"
          >
            {[
              { number: '18', label: 'สัปดาห์' },
              { number: '100', label: 'คะแนนเต็ม' },
              { number: '1', label: 'นามบัตรดิจิทัล' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#22c55e] to-[#3b82f6] bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              เรียนอะไรบ้าง? 🤔
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              เนื้อหาครอบคลุมทุกอย่างที่จำเป็นสำหรับการสร้างเว็บไซต์
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-card p-6 rounded-2xl border border-border hover:border-primary/30 transition-all"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <div style={{ color: feature.color }}>{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 bg-card/50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              แผนการเรียน 18 สัปดาห์ 📚
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              เรียนทีละขั้นตอน จากง่ายไปยาก จบแล้วได้นามบัตรดิจิทัล!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyLessons.map((lesson, index) => (
              <motion.div
                key={lesson.week}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-2xl border border-border relative overflow-hidden group hover:border-primary/30 transition-all"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                <div className="text-3xl mb-3">{lesson.icon}</div>
                <div className="text-sm text-primary font-medium mb-1">
                  สัปดาห์ที่ {lesson.week}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {lesson.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Goal Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                เป้าหมาย: สร้าง
                <span className="text-[#22c55e]"> นามบัตรดิจิทัล </span>
                ของตัวเอง 💼
              </h2>
              <p className="text-muted-foreground mb-6">
                เมื่อเรียนจบ 18 สัปดาห์ นักเรียนทุกคนจะมีนามบัตรดิจิทัลของตัวเอง
                ที่สามารถแชร์ให้คนอื่นดูได้บนอินเทอร์เน็ต พร้อมฟีเจอร์ครบครัน!
              </p>
              
              <div className="space-y-3">
                {[
                  'รูปโปรไฟล์และข้อมูลส่วนตัว',
                  'ลิงก์ไปยังโซเชียลมีเดีย',
                  'QR Code สำหรับแชร์',
                  'Dark Mode และ Animation',
                  'Responsive ดูได้ทุกอุปกรณ์',
                  'Deploy ออนไลน์พร้อมใช้งาน',
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="w-5 h-5 text-[#22c55e]" />
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Mock Digital Card Preview */}
              <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-card/95 p-8 shadow-2xl">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#22c55e] via-[#3b82f6] to-[#f97316]" />
                <div className="absolute -right-10 top-10 h-28 w-28 rounded-full bg-[#3b82f6]/10 blur-2xl" />
                <div className="absolute -left-10 bottom-8 h-28 w-28 rounded-full bg-[#22c55e]/10 blur-2xl" />

                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#22c55e] via-[#3b82f6] to-[#06b6d4] mx-auto mb-4 flex items-center justify-center ring-4 ring-[#3b82f6]/10">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground text-center mb-1">
                  ชื่อของคุณ
                </h3>
                <p className="text-[#3b82f6] text-center text-sm font-medium mb-4">
                  นักเรียน ปวช.1
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <span>📧</span> email@example.com
                  </p>
                  <p className="flex items-center gap-2">
                    <span>📱</span> 08X-XXX-XXXX
                  </p>
                </div>
                <div className="flex justify-center gap-3 mt-4">
                  {['📘', '📸', '💬'].map((icon, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-primary/10 text-foreground/80 flex items-center justify-center border border-border/60">
                      {icon}
                    </div>
                  ))}
                </div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-[#eab308] flex items-center justify-center shadow-lg shadow-[#eab308]/20 ring-4 ring-background"
                  animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Star className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-[#22c55e]/20 via-[#3b82f6]/20 to-[#f97316]/20 rounded-3xl p-12 border border-primary/20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            พร้อมเริ่มเรียนแล้วหรือยัง? 🚀
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            ลงทะเบียนวันนี้และเริ่มต้นเดินทางสู่การเป็นนักพัฒนาเว็บไซต์
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6] hover:opacity-90 text-lg px-8 py-6">
              เริ่มเรียนฟรี
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border relative z-10">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>© 2024 CodeQuest - E-Learning Platform</p>
          <p className="mt-1">รายวิชา: การสร้างเว็บไซต์ (21901-2002) | ปวช.1</p>
        </div>
      </footer>
    </div>
  )
}
