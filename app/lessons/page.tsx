'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { DecorativeShapes } from '@/components/decorative-shapes'
import { LessonCard } from '@/components/lesson-card'
import { useAppStore, type Student } from '@/lib/store'
import { lessons } from '@/lib/lessons'
import { BookOpen, Trophy, Star, Map } from 'lucide-react'

export default function LessonsPage() {
  const router = useRouter()
  const { currentUser, isLoggedIn } = useAppStore()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  if (!currentUser) {
    return null
  }

  const isStudent = currentUser.role === 'student'
  const student = isStudent ? (currentUser as Student) : null
  const completedLessonIds = student?.progress.filter((p) => p.completed).map((p) => p.lessonId) || []

  // Group lessons by phase
  const phases = [
    { name: 'พื้นฐาน HTML & CSS', weeks: [1, 2, 3, 4], color: '#22c55e', icon: '📝' },
    { name: 'Layout & Styling', weeks: [5, 6, 7, 8], color: '#3b82f6', icon: '🎨' },
    { name: 'สอบกลางภาค', weeks: [9], color: '#ef4444', icon: '📋' },
    { name: 'Advanced Features', weeks: [10, 11, 12, 13], color: '#f97316', icon: '✨' },
    { name: 'Deploy & Present', weeks: [14, 15, 16, 17], color: '#8b5cf6', icon: '🚀' },
    { name: 'สอบปลายภาค', weeks: [18], color: '#eab308', icon: '🏆' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DecorativeShapes />
      <Navbar />

      <main className="pt-24 pb-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  แผนที่การเรียน
                </h1>
                <p className="text-muted-foreground">
                  เรียนผ่าน 18 ด่าน เพื่อสร้างนามบัตรดิจิทัล
                </p>
              </div>
            </div>

            {/* Stats Bar */}
            {isStudent && student && (
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#22c55e]/20 text-[#22c55e]">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    ด่านปัจจุบัน: {student.currentLesson}/18
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#eab308]/20 text-[#eab308]">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    คะแนนรวม: {student.totalScore}/100
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3b82f6]/20 text-[#3b82f6]">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    ผ่านแล้ว: {completedLessonIds.length} ด่าน
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Lessons by Phase */}
          <div className="space-y-12">
            {phases.map((phase, phaseIndex) => {
              const phaseLessons = lessons.filter((l) => phase.weeks.includes(l.week))

              return (
                <motion.div
                  key={phase.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: phaseIndex * 0.1 }}
                >
                  {/* Phase Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${phase.color}20` }}
                    >
                      {phase.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{phase.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        สัปดาห์ที่ {phase.weeks.join(', ')}
                      </p>
                    </div>
                    {/* Progress indicator */}
                    {isStudent && (
                      <div className="ml-auto flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          {phaseLessons.filter((l) => completedLessonIds.includes(l.id)).length}/{phaseLessons.length}
                        </div>
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(phaseLessons.filter((l) => completedLessonIds.includes(l.id)).length / phaseLessons.length) * 100}%`,
                              backgroundColor: phase.color,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Phase Lessons Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {phaseLessons.map((lesson, lessonIndex) => {
                      const isCompleted = completedLessonIds.includes(lesson.id)
                      const isUnlocked = lesson.id === 1 || completedLessonIds.includes(lesson.id - 1) || !isStudent
                      const isCurrent = isStudent && lesson.id === student?.currentLesson
                      const progress = student?.progress.find((p) => p.lessonId === lesson.id)

                      return (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: phaseIndex * 0.1 + lessonIndex * 0.05 }}
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
                </motion.div>
              )
            })}
          </div>

          {/* Journey Complete Message */}
          {isStudent && completedLessonIds.length >= 18 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 text-center p-8 bg-gradient-to-r from-[#eab308]/20 to-[#f97316]/20 rounded-3xl border border-[#eab308]/30"
            >
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                ยินดีด้วย! คุณเรียนจบหลักสูตรแล้ว!
              </h2>
              <p className="text-muted-foreground">
                คุณได้รับ {student?.totalScore || 0} คะแนน และพร้อมใช้นามบัตรดิจิทัลของคุณแล้ว
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
