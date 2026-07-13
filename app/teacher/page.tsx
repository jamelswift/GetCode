'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BarChart3,
  BadgeCheck,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileCode2,
  FileSpreadsheet,
  Lightbulb,
  Loader2,
  TrendingDown,
  Upload,
  Users,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { DecorativeShapes } from '@/components/decorative-shapes'
import { useAppStore } from '@/lib/store'
import { lessons } from '@/lib/lessons'

type ImportSummary = {
  totalRows: number
  toCreateCount: number
  toUpdateCount: number
  canApplyCount: number
  updatedCount: number
  createdCount: number
  skippedStaleCount: number
  skippedInvalidCount: number
}

type ImportIssue = {
  rowNumber: number
  reason: string
}

type ImportStaleIssue = {
  rowNumber: number
  userId: number
  lessonId: string
  reason: string
  currentUpdatedAt?: string
  expectedUpdatedAt?: string | null
}

type ImportResponse = {
  message: string
  action: 'preview' | 'commit'
  summary: ImportSummary
  issues: {
    stale: ImportStaleIssue[]
    invalid: ImportIssue[]
  }
}

type QuestionAnalytics = {
  quizId: string
  question: string
  type: string
  correctCount: number
  incorrectCount: number
  totalCount: number
  accuracy: number
}

type WeekAnalytics = {
  lessonId: number
  week: number
  title: string
  submissions: number
  correctCount: number
  incorrectCount: number
  accuracy: number
  assessment: string
  recommendation: string
  questions: QuestionAnalytics[]
}

type WeeklyChartRow = {
  week: number
  label: string
  correctCount: number
  incorrectCount: number
  accuracy: number
  submissions: number
}

const questionTypeLabel: Record<string, string> = {
  'multiple-choice': 'เลือกตอบ',
  code: 'โค้ด',
  'fill-blank': 'เติมคำ',
  'image-upload': 'อัปโหลดรูป',
}

const getQuestionCorrectness = (
  quiz: { type: string; correctAnswer?: string | number; expectedOutput?: string },
  answer: string,
) => {
  if (quiz.type === 'multiple-choice' && quiz.correctAnswer !== undefined) {
    return answer === String(quiz.correctAnswer)
  }

  if (quiz.type === 'code' && quiz.expectedOutput) {
    return answer.toLowerCase().includes(quiz.expectedOutput.toLowerCase())
  }

  if (quiz.type === 'fill-blank' || quiz.type === 'image-upload') {
    return true
  }

  return false
}

const formatAccuracy = (value: number) => `${value.toFixed(0)}%`

const getWeekAssessment = (accuracy: number, submissions: number) => {
  if (submissions === 0) {
    return 'ยังไม่มีข้อมูลการส่งงาน'
  }

  if (accuracy >= 85) {
    return 'ทำได้ดีมาก'
  }

  if (accuracy >= 70) {
    return 'อยู่ในเกณฑ์ดี'
  }

  if (accuracy >= 50) {
    return 'ควรทบทวน'
  }

  return 'ต้องแก้ไขเร่งด่วน'
}

const getAssessmentColor = (accuracy: number) => {
  if (accuracy >= 85) return '#22c55e'
  if (accuracy >= 70) return '#3b82f6'
  if (accuracy >= 50) return '#f97316'
  return '#ef4444'
}

export default function TeacherPage() {
  const router = useRouter()
  const { currentUser, isLoggedIn, setStudents } = useAppStore()
  const students = useAppStore((state) => state.students)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState('')
  const [previewResult, setPreviewResult] = useState<ImportResponse | null>(null)
  const [commitResult, setCommitResult] = useState<ImportResponse | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(null)

  useEffect(() => {
    if (!isLoggedIn || currentUser?.role !== 'teacher') {
      router.push('/login')
      return
    }

    const loadStudents = async () => {
      try {
        const response = await fetch('/api/students')
        if (!response.ok) return

        const data = (await response.json()) as { students?: typeof students }
        if (Array.isArray(data.students)) {
          setStudents(data.students)
        }
      } catch {
        // Keep the current in-memory data if the server fetch fails.
      }
    }

    void loadStudents()
  }, [isLoggedIn, currentUser, router])

  if (!currentUser || currentUser.role !== 'teacher') {
    return null
  }

  const handleExport = () => {
    window.location.href = '/api/export'
  }

  const handleTemplateDownload = () => {
    window.location.href = '/api/export/template'
  }

  const formatDateTime = (value?: string) => {
    if (!value) return 'ยังไม่ระบุเวลา'

    try {
      return new Intl.DateTimeFormat('th-TH', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(value))
    } catch {
      return value
    }
  }

  const isImageValue = (value: string) => value.startsWith('data:image/') || value.startsWith('http')

  const studentsWithSubmissions = students
    .map((student) => ({
      ...student,
      submittedLessons: student.progress.filter((progress) => Boolean(progress.submissionData)),
    }))
    .filter((student) => student.submittedLessons.length > 0)
    .sort((left, right) => right.submittedLessons.length - left.submittedLessons.length)

  const activeStudent =
    studentsWithSubmissions.find((student) => student.id === selectedStudentId) ??
    studentsWithSubmissions[0] ??
    null

  const submissionCount = studentsWithSubmissions.reduce(
    (total, student) => total + student.submittedLessons.length,
    0,
  )

  const weeklyAnalytics = useMemo(() => {
    const classSize = students.length

    return lessons
      .map<WeekAnalytics>((lesson) => {
        const lessonSubmissions = students
          .map((student) =>
            student.progress.find(
              (progress) => progress.lessonId === lesson.id && Boolean(progress.submissionData),
            ),
          )
          .filter((progress): progress is NonNullable<typeof progress> => Boolean(progress))

        const questions = lesson.quizzes.map<QuestionAnalytics>((quiz) => {
          let correctCount = 0
          let incorrectCount = 0

          lessonSubmissions.forEach((progress) => {
            const answers = progress.submissionData?.answers ?? {}
            const rawAnswer = answers[quiz.id]

            if (rawAnswer === undefined || rawAnswer === null || rawAnswer === '') {
              incorrectCount += 1
              return
            }

            if (getQuestionCorrectness(quiz, String(rawAnswer))) {
              correctCount += 1
            } else {
              incorrectCount += 1
            }
          })

          const totalCount = correctCount + incorrectCount

          return {
            quizId: quiz.id,
            question: quiz.question,
            type: quiz.type,
            correctCount,
            incorrectCount,
            totalCount,
            accuracy: totalCount > 0 ? (correctCount / totalCount) * 100 : 0,
          }
        })

        const correctCount = questions.reduce((sum, question) => sum + question.correctCount, 0)
        const incorrectCount = questions.reduce((sum, question) => sum + question.incorrectCount, 0)
        const totalCount = correctCount + incorrectCount
        const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0
        const weakestQuestion = [...questions].sort((left, right) => left.accuracy - right.accuracy)[0]

        let recommendation = 'ยังไม่มีข้อมูลให้สรุป'

        if (lessonSubmissions.length === 0) {
          recommendation = 'ยังไม่มีนักเรียนส่งงานในสัปดาห์นี้ ควรแจ้งติดตามหรือนัดสอนเสริม'
        } else if (accuracy >= 85) {
          recommendation = 'ผลลัพธ์ดีมาก ควรต่อยอดด้วยโจทย์ยากขึ้นหรือให้ฝึกอธิบายเหตุผลของคำตอบ'
        } else if (accuracy >= 70) {
          recommendation = weakestQuestion
            ? `ทบทวน ${weakestQuestion.question} และให้ทำแบบฝึกหัดซ้ำอีก 1 รอบ`
            : 'ทบทวนแนวคิดหลักของสัปดาห์นี้อีกครั้ง'
        } else {
          const weakQuestions = questions
            .filter((question) => question.totalCount > 0)
            .sort((left, right) => left.accuracy - right.accuracy)
            .slice(0, 2)
            .map((question) => question.question)

          recommendation = weakQuestions.length > 0
            ? `ควรสอนซ้ำเรื่อง ${weakQuestions.join(' และ ')} พร้อมยกตัวอย่างทีละขั้น`
            : 'ควรสอนทบทวนและให้ฝึกทำโจทย์เพิ่มเติม'
        }

        return {
          lessonId: lesson.id,
          week: lesson.week,
          title: lesson.title,
          submissions: lessonSubmissions.length,
          correctCount,
          incorrectCount,
          accuracy,
          assessment: getWeekAssessment(accuracy, lessonSubmissions.length),
          recommendation,
          questions,
        }
      })
      .sort((left, right) => left.week - right.week)
  }, [students])

  const weeklyChartData: WeeklyChartRow[] = weeklyAnalytics.map((item) => ({
    week: item.week,
    label: `สัปดาห์ ${item.week}`,
    correctCount: item.correctCount,
    incorrectCount: item.incorrectCount,
    accuracy: item.accuracy,
    submissions: item.submissions,
  }))

  const answeredQuestions = weeklyAnalytics.reduce(
    (sum, week) => sum + week.correctCount + week.incorrectCount,
    0,
  )
  const totalCorrectAnswers = weeklyAnalytics.reduce((sum, week) => sum + week.correctCount, 0)
  const overallAccuracy = answeredQuestions > 0 ? (totalCorrectAnswers / answeredQuestions) * 100 : 0
  const weakWeeks = weeklyAnalytics.filter((week) => week.submissions > 0 && week.accuracy < 70)
  const topWeakQuestions = weeklyAnalytics
    .flatMap((week) =>
      week.questions.map((question) => ({
        week: week.week,
        lessonTitle: week.title,
        ...question,
      })),
    )
    .filter((question) => question.totalCount > 0)
    .sort((left, right) => left.accuracy - right.accuracy)
    .slice(0, 5)

  const selectedWeek =
    weeklyAnalytics.find((week) => week.week === selectedWeekId) ??
    weeklyAnalytics.find((week) => week.submissions > 0) ??
    weeklyAnalytics[0] ??
    null

  const selectedWeekQuestionChart = selectedWeek?.questions.map((question) => ({
    quizId: question.quizId,
    label: question.question,
    correctCount: question.correctCount,
    incorrectCount: question.incorrectCount,
    totalCount: question.totalCount,
    accuracy: question.accuracy,
    type: question.type,
  })) ?? []

  const chartTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload?: WeeklyChartRow }>
  }) => {
    if (!active || !payload?.length) return null

    const row = payload[0]?.payload

    if (!row) return null

    return (
      <div className="rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-xl">
        <div className="font-medium text-foreground">{row.label}</div>
        <div className="text-muted-foreground">ส่งงานแล้ว {row.submissions} คน</div>
        <div className="text-[#22c55e]">ถูก {row.correctCount}</div>
        <div className="text-destructive">ผิด {row.incorrectCount}</div>
        <div className="text-foreground/80">ความถูกต้อง {formatAccuracy(row.accuracy)}</div>
      </div>
    )
  }

  const selectedWeekTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{ payload?: { label: string; correctCount: number; incorrectCount: number; accuracy: number } }>
  }) => {
    if (!active || !payload?.length) return null

    const row = payload[0]?.payload

    if (!row) return null

    return (
      <div className="rounded-xl border border-border bg-background px-3 py-2 text-sm shadow-xl">
        <div className="font-medium text-foreground">{row.label}</div>
        <div className="text-[#22c55e]">ถูก {row.correctCount}</div>
        <div className="text-destructive">ผิด {row.incorrectCount}</div>
        <div className="text-foreground/80">ความถูกต้อง {formatAccuracy(row.accuracy)}</div>
      </div>
    )
  }

  const uploadWithAction = async (
    action: 'preview' | 'commit',
  ): Promise<ImportResponse> => {
    const formData = new FormData()
    formData.append('file', selectedFile as File)
    formData.append('action', action)

    const response = await fetch('/api/import', {
      method: 'POST',
      body: formData,
    })

    const data = (await response.json()) as ImportResponse & { message?: string }

    if (!response.ok) {
      throw new Error(data.message ?? 'อัปโหลดไฟล์ไม่สำเร็จ')
    }

    return data
  }

  const handlePreview = async () => {
    if (!selectedFile) {
      setError('กรุณาเลือกไฟล์ .xlsx ก่อนพรีวิว')
      return
    }

    setError('')
    setCommitResult(null)
    setIsPreviewing(true)

    try {
      const data = await uploadWithAction('preview')
      setPreviewResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ไม่สามารถพรีวิวไฟล์ได้')
    } finally {
      setIsPreviewing(false)
    }
  }

  const handleImport = async () => {
    if (!selectedFile) {
      setError('กรุณาเลือกไฟล์ .xlsx ก่อนอัปโหลด')
      return
    }

    setError('')
    setIsImporting(true)

    try {
      const data = await uploadWithAction('commit')
      setCommitResult(data)
      setSelectedFile(null)
      setPreviewResult(null)
    } catch {
      setError('เกิดข้อผิดพลาดระหว่างเชื่อมต่อเซิร์ฟเวอร์')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DecorativeShapes />
      <Navbar />

      <main className="pt-24 pb-12 px-4 relative z-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-3xl p-6 border border-border shadow-xl"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              จัดการคะแนนผ่าน Excel
            </h1>
            <p className="text-muted-foreground">
              ดาวน์โหลดคะแนนและความคืบหน้าจากระบบ แล้วอัปโหลดกลับมาเพื่ออัปเดตแบบกลุ่ม
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card rounded-3xl p-6 border border-border space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">1) Export ข้อมูล</h2>
                <p className="text-sm text-muted-foreground">
                  ระบบจะสร้างไฟล์ที่มี 2 ชีต: Users และ Progress
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleExport} className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6] hover:opacity-90">
                  <Download className="w-4 h-4 mr-2" />
                  ดาวน์โหลดข้อมูลจริง
                </Button>
                <Button onClick={handleTemplateDownload} variant="outline" className="border-primary/30 hover:border-primary">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  ดาวน์โหลดไฟล์แม่แบบ
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-3xl p-6 border border-border space-y-4"
          >
            <div>
              <h2 className="text-xl font-semibold text-foreground">2) Import เพื่ออัปเดตคะแนน</h2>
              <p className="text-sm text-muted-foreground">
                อัปโหลดไฟล์ .xlsx แล้วพรีวิวก่อนบันทึกจริงทุกครั้ง
              </p>
            </div>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null
                setSelectedFile(file)
                setPreviewResult(null)
                setCommitResult(null)
                setError('')
              }}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-primary hover:file:bg-primary/20"
            />

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button
                onClick={handlePreview}
                disabled={isPreviewing || isImporting || !selectedFile}
                variant="outline"
                className="border-primary/30 hover:border-primary"
              >
                {isPreviewing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังพรีวิว...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview ก่อนบันทึก
                  </>
                )}
              </Button>

              <Button
                onClick={handleImport}
                disabled={isImporting || !selectedFile || !previewResult}
                className="bg-gradient-to-r from-[#3b82f6] to-[#f97316] hover:opacity-90"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    กำลังนำเข้า...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    ยืนยันนำเข้าและบันทึกจริง
                  </>
                )}
              </Button>

              {selectedFile && (
                <span className="text-sm text-muted-foreground">ไฟล์ที่เลือก: {selectedFile.name}</span>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive text-sm">
                {error}
              </div>
            )}

            {previewResult && (
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Eye className="w-4 h-4 text-primary" />
                  ผล Preview (ยังไม่บันทึกลงฐานข้อมูล)
                </div>
                <p className="text-foreground/90">จำนวนแถวทั้งหมด: {previewResult.summary.totalRows}</p>
                <p className="text-foreground/90">แถวที่พร้อมสร้างใหม่: {previewResult.summary.toCreateCount}</p>
                <p className="text-foreground/90">แถวที่พร้อมอัปเดต: {previewResult.summary.toUpdateCount}</p>
                <p className="text-foreground/90">แถวที่นำเข้าได้จริงตอนนี้: {previewResult.summary.canApplyCount}</p>
                <p className="text-foreground/90">ข้ามเพราะข้อมูลเก่า (stale): {previewResult.summary.skippedStaleCount}</p>
                <p className="text-foreground/90">ข้ามเพราะข้อมูลไม่ครบ/ไม่ถูกต้อง: {previewResult.summary.skippedInvalidCount}</p>
              </div>
            )}

            {commitResult && (
              <div className="rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/10 p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                  นำเข้าข้อมูลเรียบร้อย
                </div>
                <p className="text-foreground/90">จำนวนแถวทั้งหมด: {commitResult.summary.totalRows}</p>
                <p className="text-foreground/90">อัปเดตแล้ว: {commitResult.summary.updatedCount}</p>
                <p className="text-foreground/90">สร้างใหม่: {commitResult.summary.createdCount}</p>
                <p className="text-foreground/90">ข้ามเพราะข้อมูลเก่า (stale): {commitResult.summary.skippedStaleCount}</p>
                <p className="text-foreground/90">ข้ามเพราะข้อมูลไม่ครบ/ไม่ถูกต้อง: {commitResult.summary.skippedInvalidCount}</p>
              </div>
            )}

            {previewResult && previewResult.issues.stale.length > 0 && (
              <div className="rounded-xl border border-[#f97316]/30 bg-[#f97316]/10 p-4 space-y-2 text-sm">
                <p className="font-medium text-foreground">ตัวอย่างแถวที่เสี่ยงข้อมูลทับ (แสดงสูงสุด 20 รายการ)</p>
                {previewResult.issues.stale.map((issue) => (
                  <p key={`${issue.rowNumber}-${issue.userId}-${issue.lessonId}`} className="text-foreground/90">
                    แถว {issue.rowNumber}: userId={issue.userId}, lessonId={issue.lessonId} - {issue.reason}
                  </p>
                ))}
              </div>
            )}

            {previewResult && previewResult.issues.invalid.length > 0 && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 space-y-2 text-sm">
                <p className="font-medium text-foreground">ตัวอย่างแถวที่ข้อมูลไม่ถูกต้อง (แสดงสูงสุด 20 รายการ)</p>
                {previewResult.issues.invalid.map((issue) => (
                  <p key={`${issue.rowNumber}-${issue.reason}`} className="text-foreground/90">
                    แถว {issue.rowNumber}: {issue.reason}
                  </p>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="bg-card rounded-3xl p-6 border border-border space-y-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  3) ดูงานที่นักเรียนส่ง
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  ดูรูปภาพและโค้ดที่นักเรียนส่งจากแบบฝึกหัดในแต่ละบทได้จากที่นี่
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm md:min-w-[320px]">
                <div className="rounded-2xl border border-border bg-muted/40 p-3">
                  <div className="text-muted-foreground">นักเรียนที่มีงานส่ง</div>
                  <div className="text-xl font-bold text-foreground">{studentsWithSubmissions.length}</div>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-3">
                  <div className="text-muted-foreground">รายการงานทั้งหมด</div>
                  <div className="text-xl font-bold text-foreground">{submissionCount}</div>
                </div>
              </div>
            </div>

            {studentsWithSubmissions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                ยังไม่มีงานส่งจากนักเรียนในระบบ
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
                <div className="space-y-3">
                  {studentsWithSubmissions.map((student) => {
                    const latestSubmission = [...student.submittedLessons].sort((left, right) => {
                      const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0
                      const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0
                      return rightTime - leftTime
                    })[0]

                    const isSelected = student.id === activeStudent?.id

                    return (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-semibold text-foreground">{student.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {student.studentId ?? student.id}
                            </div>
                          </div>
                          <div className="rounded-full bg-background px-3 py-1 text-xs font-medium text-foreground border border-border">
                            {student.submittedLessons.length} งาน
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarClock className="w-3.5 h-3.5" />
                          ล่าสุด: {latestSubmission ? formatDateTime(latestSubmission.submittedAt) : 'ยังไม่ระบุเวลา'}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs text-primary">
                          <span>{latestSubmission ? `สัปดาห์ ${latestSubmission.lessonId}` : 'ยังไม่มีข้อมูลล่าสุด'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    )
                  })}
                </div>

                <div className="rounded-3xl border border-border bg-muted/20 p-5">
                  {!activeStudent ? (
                    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground">
                      เลือกนักเรียนเพื่อดูรายละเอียดงานที่ส่ง
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
                            <BookOpen className="w-5 h-5 text-primary" />
                            {activeStudent.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {activeStudent.studentId ?? activeStudent.id} · {activeStudent.email}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          งานที่ส่งแล้ว {activeStudent.submittedLessons.length} รายการ
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[...activeStudent.submittedLessons]
                          .sort((left, right) => {
                            const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0
                            const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0
                            return rightTime - leftTime
                          })
                          .map((progress) => {
                            const lesson = lessons.find((item) => item.id === progress.lessonId)
                            const submissionData = progress.submissionData
                            const entries = Object.entries(submissionData?.answers ?? {})

                            return (
                              <div
                                key={`${activeStudent.id}-${progress.lessonId}`}
                                className="rounded-2xl border border-border bg-card p-4 space-y-4"
                              >
                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                  <div>
                                    <div className="font-semibold text-foreground flex items-center gap-2">
                                      <FileCode2 className="w-4 h-4 text-primary" />
                                      {lesson?.title ?? `บทเรียน ${progress.lessonId}`}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                      ส่งเมื่อ {formatDateTime(progress.submittedAt)}
                                    </div>
                                  </div>
                                  <div className="text-xs rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 w-fit">
                                    คะแนน {progress.score}
                                  </div>
                                </div>

                                {progress.teacherFeedback && (
                                  <div className="rounded-xl border border-[#22c55e]/20 bg-[#22c55e]/10 p-3 text-sm text-foreground">
                                    <span className="font-medium text-[#22c55e]">หมายเหตุครู: </span>
                                    {progress.teacherFeedback}
                                  </div>
                                )}

                                {entries.length === 0 ? (
                                  <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                                    ไม่มีข้อมูลคำตอบแนบมากับงานนี้
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    {entries.map(([quizId, answer]) => {
                                      const quiz = lesson?.quizzes.find((item) => item.id === quizId)
                                      const answerText = String(answer)
                                      const isImageAnswer = isImageValue(answerText)
                                      const isCodeAnswer = quiz?.type === 'code'

                                      return (
                                        <div key={quizId} className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                                          <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                            <div className="text-sm font-medium text-foreground">
                                              {quiz?.question ?? quizId}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {quiz?.type ?? 'unknown'}
                                            </div>
                                          </div>

                                          {isImageAnswer ? (
                                            <div className="overflow-hidden rounded-xl border border-border bg-background">
                                              <img
                                                src={answerText}
                                                alt={quiz?.question ?? 'Student upload'}
                                                className="h-auto w-full max-h-[420px] object-contain bg-black/5"
                                              />
                                            </div>
                                          ) : isCodeAnswer ? (
                                            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
                                              <code className="font-mono whitespace-pre-wrap break-words">{answerText}</code>
                                            </pre>
                                          ) : (
                                            <div className="rounded-xl border border-border bg-background p-3 text-sm text-foreground whitespace-pre-wrap break-words">
                                              {answerText}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.17 }}
            className="bg-card rounded-3xl p-6 border border-border space-y-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  4) สถิติการทำแบบฝึกหัดรายสัปดาห์
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  กราฟนี้สรุปคำตอบถูก/ผิดของแต่ละสัปดาห์ พร้อมให้ข้อเสนอแนะสำหรับการสอนซ้ำ
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm md:min-w-[360px]">
                <div className="rounded-2xl border border-border bg-muted/40 p-3">
                  <div className="text-muted-foreground">ความถูกต้องเฉลี่ย</div>
                  <div className="text-xl font-bold text-foreground">{formatAccuracy(overallAccuracy)}</div>
                </div>
                <div className="rounded-2xl border border-border bg-muted/40 p-3">
                  <div className="text-muted-foreground">สัปดาห์ที่ต้องทบทวน</div>
                  <div className="text-xl font-bold text-foreground">{weakWeeks.length}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
              <div className="rounded-3xl border border-border bg-muted/20 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-foreground">กราฟถูก/ผิดรายสัปดาห์</div>
                    <div className="text-xs text-muted-foreground">สีเขียวคือคำตอบถูก สีแดงคือคำตอบผิด</div>
                  </div>
                </div>

                {weeklyChartData.length === 0 || weeklyChartData.every((row) => row.correctCount + row.incorrectCount === 0) ? (
                  <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-border bg-background text-sm text-muted-foreground">
                    ยังไม่มีข้อมูลคำตอบสำหรับสร้างกราฟ
                  </div>
                ) : (
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyChartData} barCategoryGap={12}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                        <Tooltip content={chartTooltip} />
                        <Bar dataKey="correctCount" name="ถูก" stackId="score" radius={[8, 8, 0, 0]}>
                          {weeklyChartData.map((entry) => (
                            <Cell key={`correct-${entry.week}`} fill="#22c55e" />
                          ))}
                        </Bar>
                        <Bar dataKey="incorrectCount" name="ผิด" stackId="score" radius={[8, 8, 0, 0]}>
                          {weeklyChartData.map((entry) => (
                            <Cell key={`incorrect-${entry.week}`} fill="#ef4444" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-3xl border border-border bg-muted/20 p-4">
                <div>
                  <div className="font-medium text-foreground flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-[#22c55e]" />
                    สรุปการประเมิน
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ระบบจะประเมินจากความถูกต้องของคำตอบที่ส่งเข้ามาในแต่ละสัปดาห์
                  </div>
                </div>

                {weeklyAnalytics.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                    ยังไม่มีข้อมูลสำหรับประเมินผล
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {weeklyAnalytics.map((week) => {
                      const isSelected = selectedWeek?.week === week.week

                      return (
                      <button
                        key={week.week}
                        type="button"
                        onClick={() => setSelectedWeekId(week.week)}
                        className={`w-full rounded-2xl border p-4 space-y-3 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-border bg-background hover:border-primary/50 hover:bg-muted/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="font-medium text-foreground">สัปดาห์ {week.week}</div>
                            <div className="text-xs text-muted-foreground">{week.title}</div>
                          </div>
                          <span
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: `${getAssessmentColor(week.accuracy)}20`,
                              color: getAssessmentColor(week.accuracy),
                            }}
                          >
                            {week.assessment}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>ส่งงาน {week.submissions} คน</span>
                          <span>ความถูกต้อง {formatAccuracy(week.accuracy)}</span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#3b82f6]"
                            style={{ width: `${Math.min(week.accuracy, 100)}%` }}
                          />
                        </div>

                        <div className="text-sm text-foreground/90">{week.recommendation}</div>
                      </button>
                      )
                    })}

                    <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                      มีสถิติทั้งหมด {weeklyAnalytics.length} สัปดาห์ เลือกสัปดาห์ใดก็ได้เพื่อดูกราฟรายข้อและข้อเสนอแนะเพิ่มเติม
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedWeek && (
              <div className="rounded-3xl border border-border bg-muted/20 p-4 space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-medium text-foreground flex items-center gap-2">
                      <Eye className="w-4 h-4 text-primary" />
                      รายละเอียดสัปดาห์ {selectedWeek.week}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      แตะที่สัปดาห์อื่นเพื่อเปลี่ยนข้อมูลด้านล่างได้ทันที
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ส่งงาน {selectedWeek.submissions} คน · ความถูกต้อง {formatAccuracy(selectedWeek.accuracy)}
                  </div>
                </div>

                {selectedWeekQuestionChart.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                    ไม่มีข้อมูลคำตอบรายข้อสำหรับสัปดาห์นี้
                  </div>
                ) : (
                  <div className="h-[280px] w-full rounded-2xl border border-border bg-background p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedWeekQuestionChart} layout="vertical" margin={{ left: 12, right: 12 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                        <YAxis
                          type="category"
                          dataKey="label"
                          tickLine={false}
                          axisLine={false}
                          width={120}
                          fontSize={11}
                        />
                        <Tooltip content={selectedWeekTooltip} />
                        <Bar dataKey="correctCount" stackId="question" name="ถูก" radius={[0, 8, 8, 0]}>
                          {selectedWeekQuestionChart.map((entry) => (
                            <Cell key={`question-correct-${entry.quizId}`} fill="#22c55e" />
                          ))}
                        </Bar>
                        <Bar dataKey="incorrectCount" stackId="question" name="ผิด" radius={[0, 8, 8, 0]}>
                          {selectedWeekQuestionChart.map((entry) => (
                            <Cell key={`question-incorrect-${entry.quizId}`} fill="#ef4444" />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {selectedWeek.questions.map((question) => (
                    <div key={`selected-${question.quizId}`} className="rounded-2xl border border-border bg-background p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium text-foreground">{question.question}</div>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-foreground">
                          {questionTypeLabel[question.type] ?? question.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>ถูก {question.correctCount}</span>
                        <span>ผิด {question.incorrectCount}</span>
                        <span>{formatAccuracy(question.accuracy)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-[#22c55e]"
                          style={{ width: `${Math.min(question.accuracy, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <TrendingDown className="w-4 h-4 text-[#f97316]" />
                ข้อที่นักเรียนพลาดบ่อยที่สุด
              </div>

              {topWeakQuestions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                  ยังไม่มีข้อมูลคำถามที่ใช้นับสถิติได้
                </div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {topWeakQuestions.map((question) => (
                    <div key={`${question.week}-${question.quizId}`} className="rounded-2xl border border-border bg-background p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            สัปดาห์ {question.week} · {question.lessonTitle}
                          </div>
                          <div className="text-sm text-foreground/90 mt-1">{question.question}</div>
                        </div>
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
                          {questionTypeLabel[question.type] ?? question.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="rounded-xl border border-border bg-muted/30 p-3">
                          <div className="text-muted-foreground">ถูก</div>
                          <div className="text-lg font-bold text-[#22c55e]">{question.correctCount}</div>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/30 p-3">
                          <div className="text-muted-foreground">ผิด</div>
                          <div className="text-lg font-bold text-destructive">{question.incorrectCount}</div>
                        </div>
                        <div className="rounded-xl border border-border bg-muted/30 p-3">
                          <div className="text-muted-foreground">อัตราถูก</div>
                          <div className="text-lg font-bold text-foreground">{formatAccuracy(question.accuracy)}</div>
                        </div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-[#22c55e]"
                          style={{ width: `${Math.min(question.accuracy, 100)}%` }}
                        />
                      </div>

                      <div className="text-xs text-muted-foreground">
                        วิเคราะห์จากคำตอบที่ส่งได้ทั้งหมด {question.totalCount} รายการ
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <Lightbulb className="w-4 h-4 text-[#eab308]" />
                ข้อเสนอแนะสำหรับการสอนซ้ำ
              </div>

              {weeklyAnalytics.filter((week) => week.submissions > 0).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                  ยังไม่มีข้อมูลพอสำหรับแนะนำการสอนซ้ำ
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {weeklyAnalytics.map((week) => (
                    <div key={`feedback-${week.week}`} className="rounded-2xl border border-border bg-background p-4 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-medium text-foreground">สัปดาห์ {week.week}</div>
                          <div className="text-xs text-muted-foreground">{week.title}</div>
                        </div>
                        <div className="text-xs rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1">
                          {week.submissions} งานส่ง
                        </div>
                      </div>

                      <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm text-foreground/90">
                        {week.recommendation}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        ประเมิน: {week.assessment} · ความถูกต้อง {formatAccuracy(week.accuracy)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="rounded-3xl border border-[#f97316]/30 bg-[#f97316]/10 p-6"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#f97316] mt-0.5" />
              <div className="space-y-2 text-sm text-foreground/90">
                <p className="font-medium text-foreground">ข้อควรระวังเรื่องข้อมูลทับกัน</p>
                <p>
                  ไฟล์ Excel เป็นข้อมูล snapshot ณ เวลาที่ export หากมีการเปลี่ยนคะแนนในระบบหลังจากนั้น
                  แล้วนำไฟล์เก่ามา import กลับ อาจเกิดการทับข้อมูลได้
                </p>
                <p>
                  ระบบนี้มีการเช็ก expectedUpdatedAt เพื่อลดความเสี่ยง แต่การแก้คะแนนรายวันควรทำผ่านหน้าเว็บโดยตรงจะปลอดภัยที่สุด
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
