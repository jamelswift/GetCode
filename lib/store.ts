import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher'
  avatar?: string
  studentId?: string
  createdAt: string
}

export interface LessonProgress {
  lessonId: number
  completed: boolean
  score: number
  submittedAt?: string
  teacherFeedback?: string
  submissionData?: {
    code?: string
    imageUrl?: string
    answers?: Record<string, string>
  }
}

export interface Student extends User {
  role: 'student'
  progress: LessonProgress[]
  totalScore: number
  currentLesson: number
  digitalCard?: {
    completed: boolean
    previewUrl?: string
  }
}

interface AppState {
  currentUser: User | Student | null
  students: Student[]
  isLoggedIn: boolean
  
  // Actions
  login: (user: User | Student) => void
  logout: () => void
  updateProgress: (studentId: string, lessonId: number, progress: Partial<LessonProgress>) => void
  addStudent: (student: Student) => void
  getStudentById: (id: string) => Student | undefined
  getAllStudents: () => Student[]
}

const toStudentShape = (user: User | Student): Student => {
  const maybeStudent = user as Student

  return {
    ...user,
    role: 'student',
    progress: Array.isArray(maybeStudent.progress) ? maybeStudent.progress : [],
    totalScore:
      typeof maybeStudent.totalScore === 'number'
        ? maybeStudent.totalScore
        : Array.isArray(maybeStudent.progress)
          ? maybeStudent.progress.reduce((sum, p) => sum + p.score, 0)
          : 0,
    currentLesson:
      typeof maybeStudent.currentLesson === 'number'
        ? maybeStudent.currentLesson
        : 1,
  }
}

// Demo students data
const demoStudents: Student[] = [
  {
    id: 'student-1',
    name: 'สมชาย ใจดี',
    email: 'somchai@student.com',
    role: 'student',
    studentId: '65001',
    createdAt: new Date().toISOString(),
    progress: [
      { lessonId: 1, completed: true, score: 8 },
      { lessonId: 2, completed: true, score: 9 },
      { lessonId: 3, completed: true, score: 7 },
    ],
    totalScore: 24,
    currentLesson: 4,
  },
  {
    id: 'student-2',
    name: 'สมหญิง รักเรียน',
    email: 'somying@student.com',
    role: 'student',
    studentId: '65002',
    createdAt: new Date().toISOString(),
    progress: [
      { lessonId: 1, completed: true, score: 10 },
      { lessonId: 2, completed: true, score: 10 },
    ],
    totalScore: 20,
    currentLesson: 3,
  },
  {
    id: 'student-3',
    name: 'วิชัย เก่งมาก',
    email: 'wichai@student.com',
    role: 'student',
    studentId: '65003',
    createdAt: new Date().toISOString(),
    progress: [
      { lessonId: 1, completed: true, score: 9 },
    ],
    totalScore: 9,
    currentLesson: 2,
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      students: demoStudents,
      isLoggedIn: false,

      login: (user) =>
        set((state) => {
          if (user.role !== 'student') {
            return { currentUser: user, isLoggedIn: true }
          }

          const normalizedStudent = toStudentShape(user)
          const exists = state.students.some((student) => student.id === normalizedStudent.id)
          const students = exists
            ? state.students.map((student) =>
                student.id === normalizedStudent.id ? normalizedStudent : student,
              )
            : [...state.students, normalizedStudent]

          return {
            currentUser: normalizedStudent,
            students,
            isLoggedIn: true,
          }
        }),
      
      logout: () => set({ currentUser: null, isLoggedIn: false }),
      
      updateProgress: (studentId, lessonId, progressUpdate) => {
        set((state) => {
          const applyProgressUpdate = (student: Student): Student => {
            const existingProgressIndex = student.progress.findIndex(
              (p) => p.lessonId === lessonId,
            )

            let newProgress: LessonProgress[]
            if (existingProgressIndex >= 0) {
              newProgress = student.progress.map((p, index) =>
                index === existingProgressIndex ? { ...p, ...progressUpdate } : p,
              )
            } else {
              newProgress = [
                ...student.progress,
                { lessonId, completed: false, score: 0, ...progressUpdate },
              ]
            }

            const totalScore = newProgress.reduce((sum, p) => sum + p.score, 0)
            const completedIds = newProgress.filter((p) => p.completed).map((p) => p.lessonId)
            const maxCompleted = completedIds.length > 0 ? Math.max(...completedIds) : 0

            return {
              ...student,
              progress: newProgress,
              totalScore,
              currentLesson: Math.min(maxCompleted + 1, 18),
            }
          }

          let studentFound = false
          const updatedStudents = state.students.map((student) => {
            if (student.id !== studentId) return student
            studentFound = true
            return applyProgressUpdate(student)
          })

          const currentIsTargetStudent =
            state.currentUser?.id === studentId && state.currentUser.role === 'student'

          if (!studentFound && currentIsTargetStudent && state.currentUser) {
            updatedStudents.push(applyProgressUpdate(toStudentShape(state.currentUser)))
          }

          const updatedCurrentUser = currentIsTargetStudent
            ? updatedStudents.find((s) => s.id === studentId) ?? state.currentUser
            : state.currentUser

          return { students: updatedStudents, currentUser: updatedCurrentUser }
        })
      },
      
      addStudent: (student) => {
        set((state) => ({
          students: [...state.students, student],
        }))
      },
      
      getStudentById: (id) => {
        return get().students.find((s) => s.id === id)
      },
      
      getAllStudents: () => {
        return get().students
      },
    }),
    {
      name: 'codequest-storage',
      version: 2,
      migrate: (persistedState: unknown) => {
        const state = persistedState as Partial<AppState> | undefined

        if (!state || typeof state !== 'object') {
          return {
            currentUser: null,
            students: demoStudents,
            isLoggedIn: false,
          }
        }

        const currentUser =
          state.currentUser && typeof state.currentUser === 'object'
            ? (state.currentUser as User | Student)
            : null
        const students = Array.isArray(state.students) ? state.students : demoStudents
        const isLoggedIn = Boolean(state.isLoggedIn && currentUser)

        return {
          ...state,
          currentUser,
          students,
          isLoggedIn,
        }
      },
    }
  )
)
