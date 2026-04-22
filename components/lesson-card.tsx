'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Lesson } from '@/lib/lessons'
import { Lock, CheckCircle, PlayCircle } from 'lucide-react'

interface LessonCardProps {
  lesson: Lesson
  isUnlocked: boolean
  isCompleted: boolean
  isCurrent: boolean
  score?: number
}

export function LessonCard({ lesson, isUnlocked, isCompleted, isCurrent, score }: LessonCardProps) {
  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle className="w-6 h-6 text-white" />
    }
    if (!isUnlocked) {
      return <Lock className="w-6 h-6 text-white/50" />
    }
    if (isCurrent) {
      return <PlayCircle className="w-6 h-6 text-white" />
    }
    return null
  }

  const getStatusText = () => {
    if (isCompleted) return 'เสร็จสิ้น'
    if (!isUnlocked) return 'ล็อค'
    if (isCurrent) return 'เรียนต่อ'
    return 'พร้อมเรียน'
  }

  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.02, y: -5 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={isUnlocked ? `/lessons/${lesson.id}` : '#'}
        className={`block ${!isUnlocked ? 'cursor-not-allowed' : ''}`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
            isUnlocked
              ? 'bg-card hover:shadow-xl hover:shadow-primary/20'
              : 'bg-muted opacity-60'
          } ${isCurrent ? 'ring-2 ring-primary animate-pulse-glow' : ''}`}
        >
          {/* Week Badge */}
          <div className="absolute top-4 right-4">
            <div
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: lesson.color }}
            >
              สัปดาห์ {lesson.week}
            </div>
          </div>

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
            style={{ backgroundColor: `${lesson.color}20` }}
          >
            {lesson.icon}
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {lesson.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {lesson.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: isCompleted ? '#22c55e' : isUnlocked ? lesson.color : '#6b7280' }}
              >
                {getStatusIcon()}
              </div>
              <span className={`text-sm font-medium ${isCompleted ? 'text-[#22c55e]' : isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                {getStatusText()}
              </span>
            </div>
            
            {/* Score */}
            {isCompleted && score !== undefined && (
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-[#22c55e]">{score}</span>
                <span className="text-sm text-muted-foreground">/{lesson.maxScore}</span>
              </div>
            )}
            
            {/* Max Score Preview */}
            {!isCompleted && isUnlocked && (
              <div className="text-sm text-muted-foreground">
                {lesson.maxScore} คะแนน
              </div>
            )}
          </div>

          {/* Progress Line for Current Lesson */}
          {isCurrent && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/30">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: '30%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
