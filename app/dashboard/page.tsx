'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { DecorativeShapes } from '@/components/decorative-shapes'
import { LessonCard } from '@/components/lesson-card'
import { ProgressTracker } from '@/components/progress-tracker'
import { useAppStore, type Student } from '@/lib/store'
import { lessons } from '@/lib/lessons'
import { Rocket, Trophy, Target, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const router = useRouter()
  const { currentUser, isLoggedIn } = useAppStore()

  useEffect(() => {
    if (!isLoggedIn || currentUser?.role !== 'student') {
      router.push('/login')
    }
  }, [isLoggedIn, currentUser, router])

  if (!currentUser || currentUser.role !== 'student') {
    return null
  }

  const student = currentUser as Student
  const completedLessonIds = student.progress.filter((p) => p.completed).map((p) => p.lessonId)

  // Get current lesson info
  const currentLessonData = lessons.find((l) => l.id === student.currentLesson)

  return (
    <div className="min-h-screen bg-background">
      <DecorativeShapes />
      <Navbar />

      <main className="pt-24 pb-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  สวัสดี, {student.name}! 👋
                </h1>
                <p className="text-muted-foreground">
                  รหัสนักเรียน: {student.studentId ?? student.id} | พร้อมเรียนรู้วันนี้หรือยัง?
                </p>
              </div>
              
              {currentLessonData && (
                <Link href={`/lessons/${student.currentLesson}`}>
                  <Button className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6] hover:opacity-90">
                    <Rocket className="w-4 h-4 mr-2" />
                    เรียนต่อ: สัปดาห์ {currentLessonData.week}
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1"
            >
              <ProgressTracker
                currentLesson={student.currentLesson}
                totalScore={student.totalScore}
                completedLessons={completedLessonIds.length}
              />

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#22c55e]/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-[#22c55e]" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round((student.totalScore / 100) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">คะแนนรวม</div>
                </div>

                <div className="bg-card rounded-2xl p-4 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-[#eab308]/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[#eab308]" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {completedLessonIds.length}
                  </div>
                  <div className="text-sm text-muted-foreground">ด่านที่ผ่าน</div>
                </div>
              </div>

              {/* Digital Card Preview */}
              {completedLessonIds.length >= 18 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-6 border border-[#00d4ff]/30"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎉</div>
                    <h3 className="font-bold text-white mb-1">ยินดีด้วย!</h3>
                    <p className="text-sm text-gray-400 mb-4">
                      นามบัตรดิจิทัลของคุณพร้อมแล้ว
                    </p>
                    <Button variant="outline" className="border-[#00d4ff] text-[#00d4ff]">
                      ดูนามบัตร
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Lessons Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  บทเรียนทั้งหมด
                </h2>
                <Link href="/lessons" className="text-sm text-primary hover:underline">
                  ดูทั้งหมด
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {lessons.slice(0, 6).map((lesson, index) => {
                  const isCompleted = completedLessonIds.includes(lesson.id)
                  const isUnlocked = lesson.id === 1 || completedLessonIds.includes(lesson.id - 1)
                  const isCurrent = lesson.id === student.currentLesson
                  const progress = student.progress.find((p) => p.lessonId === lesson.id)

                  return (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <LessonCard
                        lesson={lesson}
                        isUnlocked={isUnlocked}
                        isCompleted={isCompleted}
                        isCurrent={isCurrent}
                        score={progress?.score}
                      />
                    </motion.div>
                  )
                })}
              </div>

              {lessons.length > 6 && (
                <div className="mt-6 text-center">
                  <Link href="/lessons">
                    <Button variant="outline" className="border-primary/30 hover:border-primary">
                      ดูบทเรียนทั้งหมด ({lessons.length} บท)
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
