'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { DecorativeShapes } from '@/components/decorative-shapes'
import { QuizSection } from '@/components/quiz-section'
import { useAppStore, type Student } from '@/lib/store'
import { getLessonById, type Lesson } from '@/lib/lessons'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, 
  BookOpen, 
  Target, 
  CheckCircle, 
  PlayCircle,
  ClipboardList,
  ChevronRight,
  Award
} from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

type PageProps = {
  params: Promise<{ id: string }>
}

export default function LessonDetailPage({ params }: PageProps) {
  const router = useRouter()
  const { currentUser, isLoggedIn, updateProgress } = useAppStore()
  const [activeTab, setActiveTab] = useState<'theory' | 'practice' | 'quiz'>('theory')
  const [showCompletion, setShowCompletion] = useState(false)
  
  const resolvedParams = use(params)
  const lessonId = parseInt(resolvedParams.id)
  const lesson = getLessonById(lessonId)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  if (!currentUser || !lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-foreground mb-2">ไม่พบบทเรียน</h2>
          <Link href="/lessons">
            <Button variant="outline">กลับไปหน้าบทเรียน</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isStudent = currentUser.role === 'student'
  const student = isStudent ? (currentUser as Student) : null
  const progress = student?.progress.find((p) => p.lessonId === lessonId)
  const isCompleted = progress?.completed || false

  const handleQuizComplete = (score: number, answers: Record<string, string>) => {
    if (isStudent && student) {
      updateProgress(student.id, lessonId, {
        completed: true,
        score,
        submittedAt: new Date().toISOString(),
        submissionData: { answers },
      })
      setShowCompletion(true)
    }
  }

  const tabs = [
    { id: 'theory' as const, label: 'ทฤษฎี', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'practice' as const, label: 'ปฏิบัติ', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'quiz' as const, label: 'แบบฝึกหัด', icon: <ClipboardList className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DecorativeShapes />
      <Navbar />

      <main className="pt-24 pb-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/lessons" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าบทเรียน
          </Link>

          {/* Lesson Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 md:p-8 border border-border mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Icon */}
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shrink-0"
                style={{ backgroundColor: `${lesson.color}20` }}
              >
                {lesson.icon}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: lesson.color }}
                  >
                    สัปดาห์ {lesson.week}
                  </span>
                  {isCompleted && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#22c55e] text-white flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      เสร็จแล้ว
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {lesson.title}
                </h1>
                <p className="text-muted-foreground mb-4">{lesson.description}</p>

                {/* Objectives */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                    <div className="text-xs text-[#22c55e] font-medium mb-1">ความรู้ (K)</div>
                    <div className="text-sm text-foreground">{lesson.objectives.knowledge}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20">
                    <div className="text-xs text-[#3b82f6] font-medium mb-1">ทักษะ (S)</div>
                    <div className="text-sm text-foreground">{lesson.objectives.skill}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f97316]/10 border border-[#f97316]/20">
                    <div className="text-xs text-[#f97316] font-medium mb-1">เจตคติ (A)</div>
                    <div className="text-sm text-foreground">{lesson.objectives.attitude}</div>
                  </div>
                </div>
              </div>

              {/* Score Badge */}
              <div className="text-center shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#eab308] to-[#f97316] flex items-center justify-center">
                  <div className="text-white">
                    <Target className="w-6 h-6 mx-auto mb-1" />
                    <div className="text-lg font-bold">{lesson.maxScore}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">คะแนนเต็ม</div>
                {progress?.score !== undefined && (
                  <div className="text-lg font-bold text-[#22c55e] mt-1">
                    ได้ {progress.score}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                }`}
              >
                {tab.icon}
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'theory' && (
              <motion.div
                key="theory"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-card rounded-2xl p-6 md:p-8 border border-border prose prose-invert max-w-none"
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold text-foreground mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-muted-foreground mb-4">{children}</ol>,
                    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                    code: ({ className, children }) => {
                      const isBlock = className?.includes('language-')
                      if (isBlock) {
                        return (
                          <pre className="bg-muted rounded-xl p-4 overflow-x-auto mb-4">
                            <code className="text-sm font-mono text-foreground">{children}</code>
                          </pre>
                        )
                      }
                      return <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-primary">{children}</code>
                    },
                    pre: ({ children }) => <>{children}</>,
                  }}
                >
                  {lesson.theoryContent}
                </ReactMarkdown>

                <div className="mt-8 flex justify-end">
                  <Button onClick={() => setActiveTab('practice')} className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6]">
                    ไปส่วนปฏิบัติ
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === 'practice' && (
              <motion.div
                key="practice"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-card rounded-2xl p-6 md:p-8 border border-border prose prose-invert max-w-none"
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold text-foreground mt-6 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-muted-foreground mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 text-muted-foreground mb-4">{children}</ol>,
                    li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
                    code: ({ className, children }) => {
                      const isBlock = className?.includes('language-')
                      if (isBlock) {
                        return (
                          <pre className="bg-muted rounded-xl p-4 overflow-x-auto mb-4">
                            <code className="text-sm font-mono text-foreground">{children}</code>
                          </pre>
                        )
                      }
                      return <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-primary">{children}</code>
                    },
                    pre: ({ children }) => <>{children}</>,
                  }}
                >
                  {lesson.practiceContent}
                </ReactMarkdown>

                <div className="mt-8 flex justify-end">
                  <Button onClick={() => setActiveTab('quiz')} className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6]">
                    ทำแบบฝึกหัด
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {isCompleted ? (
                  <div className="bg-card rounded-2xl p-8 border border-border text-center">
                    <div className="w-20 h-20 rounded-full bg-[#22c55e]/20 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-[#22c55e]" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      คุณทำแบบฝึกหัดนี้เสร็จแล้ว!
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      คุณได้ {progress?.score || 0} คะแนนจาก {lesson.maxScore} คะแนน
                    </p>
                    {lessonId < 18 && (
                      <Link href={`/lessons/${lessonId + 1}`}>
                        <Button className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6]">
                          ไปบทเรียนถัดไป
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <QuizSection
                    quizzes={lesson.quizzes}
                    onComplete={handleQuizComplete}
                    lessonTitle={lesson.title}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Completion Modal */}
          <AnimatePresence>
            {showCompletion && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowCompletion(false)}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-card rounded-3xl p-8 max-w-md w-full text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-[#22c55e] to-[#3b82f6] flex items-center justify-center mx-auto mb-6"
                  >
                    <Award className="w-12 h-12 text-white" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    🎉 ยินดีด้วย!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    คุณผ่านบทเรียนสัปดาห์ที่ {lesson.week} แล้ว!
                  </p>

                  <div className="flex justify-center gap-3">
                    <Button variant="outline" onClick={() => setShowCompletion(false)}>
                      ปิด
                    </Button>
                    {lessonId < 18 && (
                      <Link href={`/lessons/${lessonId + 1}`}>
                        <Button className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6]">
                          บทถัดไป
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
