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

      login: (user) => set({ currentUser: user, isLoggedIn: true }),
      
      logout: () => set({ currentUser: null, isLoggedIn: false }),
      
      updateProgress: (studentId, lessonId, progressUpdate) => {
        set((state) => {
          const updatedStudents = state.students.map((student) => {
            if (student.id === studentId) {
              const existingProgressIndex = student.progress.findIndex(
                (p) => p.lessonId === lessonId
              )
              
              let newProgress: LessonProgress[]
              if (existingProgressIndex >= 0) {
                newProgress = student.progress.map((p, index) =>
                  index === existingProgressIndex ? { ...p, ...progressUpdate } : p
                )
              } else {
                newProgress = [
                  ...student.progress,
                  { lessonId, completed: false, score: 0, ...progressUpdate },
                ]
              }
              
              const totalScore = newProgress.reduce((sum, p) => sum + p.score, 0)
              const currentLesson = Math.max(...newProgress.filter(p => p.completed).map(p => p.lessonId), 0) + 1
              
              return {
                ...student,
                progress: newProgress,
                totalScore,
                currentLesson: Math.min(currentLesson, 18),
              }
            }
            return student
          })
          
          // Also update currentUser if it's the same student
          const updatedCurrentUser = state.currentUser?.id === studentId
            ? updatedStudents.find(s => s.id === studentId) || state.currentUser
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
    }
  )
)
