'use client'

import { motion } from 'framer-motion'
import { Trophy, Star, Target, Zap } from 'lucide-react'
import { getTotalMaxScore } from '@/lib/lessons'

interface ProgressTrackerProps {
  currentLesson: number
  totalScore: number
  completedLessons: number
}

export function ProgressTracker({ currentLesson, totalScore, completedLessons }: ProgressTrackerProps) {
  const totalLessons = 18
  const maxScore = getTotalMaxScore()
  const progressPercent = (completedLessons / totalLessons) * 100

  const stats = [
    {
      icon: <Target className="w-5 h-5" />,
      label: 'ด่านปัจจุบัน',
      value: currentLesson,
      max: totalLessons,
      color: '#22c55e',
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: 'คะแนนรวม',
      value: totalScore,
      max: maxScore,
      color: '#eab308',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'เสร็จแล้ว',
      value: completedLessons,
      max: totalLessons,
      color: '#3b82f6',
    },
  ]

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[#eab308]" />
          ความคืบหน้า
        </h2>
        <div className="text-sm text-muted-foreground">
          {progressPercent.toFixed(0)}% สำเร็จ
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 bg-muted rounded-full overflow-hidden mb-6">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#22c55e] to-[#3b82f6] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Milestone markers */}
        {[25, 50, 75].map((milestone) => (
          <div
            key={milestone}
            className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-card/50"
            style={{ left: `${milestone}%` }}
          />
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div
              className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <div style={{ color: stat.color }}>{stat.icon}</div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {stat.value}
              <span className="text-sm text-muted-foreground font-normal">/{stat.max}</span>
            </div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Completion Badge */}
      {completedLessons === totalLessons && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-6 p-4 bg-gradient-to-r from-[#eab308]/20 to-[#f97316]/20 rounded-xl border border-[#eab308]/30 text-center"
        >
          <div className="text-3xl mb-2">🏆</div>
          <div className="font-bold text-[#eab308]">ยินดีด้วย! คุณเรียนจบแล้ว!</div>
          <div className="text-sm text-muted-foreground">นามบัตรดิจิทัลของคุณพร้อมแล้ว</div>
        </motion.div>
      )}
    </div>
  )
}
