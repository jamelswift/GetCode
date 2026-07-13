import type { Prisma } from '@prisma/client'

export type SubmissionData = {
  code?: string
  imageUrl?: string
  answers?: Record<string, string>
}

type ProgressRecord = {
  lessonId: string
  score: number | null
  completed: boolean
  updatedAt: Date
  submittedAt?: Date | null
  teacherFeedback?: string | null
  submissionData?: Prisma.JsonValue | null
}

type StudentRecord = {
  id: number
  studentId?: string | null
  name: string | null
  email: string
  createdAt: Date
  progress: ProgressRecord[]
}

function toSubmissionData(value: Prisma.JsonValue | null | undefined): SubmissionData | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined
  }

  return value as SubmissionData
}

function mapLessonId(lessonId: string): number | null {
  const parsedLessonId = Number.parseInt(lessonId, 10)
  return Number.isNaN(parsedLessonId) ? null : parsedLessonId
}

function mapProgressRecord(progress: ProgressRecord) {
  const lessonId = mapLessonId(progress.lessonId)
  if (lessonId === null) {
    return null
  }

  return {
    lessonId,
    completed: progress.completed,
    score: progress.score ?? 0,
    submittedAt: (progress.submittedAt ?? progress.updatedAt).toISOString(),
    teacherFeedback: progress.teacherFeedback ?? undefined,
    submissionData: toSubmissionData(progress.submissionData),
  }
}

export function mapStudentRecord(user: StudentRecord) {
  const mappedProgress = user.progress
    .map(mapProgressRecord)
    .filter((progress): progress is NonNullable<typeof progress> => Boolean(progress))

  const totalScore = mappedProgress.reduce((sum, progress) => sum + progress.score, 0)
  const completedLessonIds = mappedProgress
    .filter((progress) => progress.completed)
    .map((progress) => progress.lessonId)
  const maxCompleted = completedLessonIds.length > 0 ? Math.max(...completedLessonIds) : 0

  return {
    id: String(user.id),
    name: user.name ?? '',
    email: user.email,
    role: 'student' as const,
    studentId: user.studentId ?? String(user.id),
    createdAt: user.createdAt.toISOString(),
    progress: mappedProgress,
    totalScore,
    currentLesson: Math.min(maxCompleted + 1, 18),
  }
}