'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Play, RotateCcw, Lightbulb, Code, Trophy, Star } from 'lucide-react'
import JSConfetti from 'js-confetti'

interface PracticeTask {
  id: string
  title: string
  description: string
  starterCode: string
  expectedPatterns: string[] // patterns to check in code
  hints: string[]
  points: number
}

interface CodePracticeProps {
  tasks: PracticeTask[]
  onComplete: (totalScore: number, submissions: Record<string, { code: string; score: number; correct: boolean }>) => void
  lessonTitle: string
}

export function CodePractice({ tasks, onComplete, lessonTitle }: CodePracticeProps) {
  const [currentTask, setCurrentTask] = useState(0)
  const [code, setCode] = useState(tasks[0]?.starterCode || '')
  const [submissions, setSubmissions] = useState<Record<string, { code: string; score: number; correct: boolean }>>({})
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [currentHint, setCurrentHint] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const confettiRef = useRef<JSConfetti | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    confettiRef.current = new JSConfetti()
    return () => {
      confettiRef.current = null
    }
  }, [])

  useEffect(() => {
    if (tasks[currentTask]) {
      setCode(submissions[tasks[currentTask].id]?.code || tasks[currentTask].starterCode)
    }
  }, [currentTask, tasks, submissions])

  const task = tasks[currentTask]

  const checkCode = () => {
    if (!task || submissions[task.id]) return

    // Check if code contains expected patterns
    const normalizedCode = code.toLowerCase().replace(/\s+/g, ' ')
    const matchedPatterns = task.expectedPatterns.filter(pattern => 
      normalizedCode.includes(pattern.toLowerCase())
    )
    
    const matchPercentage = matchedPatterns.length / task.expectedPatterns.length
    const correct = matchPercentage >= 0.6 // 60% match is considered correct
    const score = correct ? Math.round(task.points * matchPercentage) : 0

    setIsCorrect(correct)
    setShowResult(true)
    setSubmissions(prev => ({
      ...prev,
      [task.id]: { code, score, correct }
    }))

    if (correct) {
      setTotalScore(prev => prev + score)
      confettiRef.current?.addConfetti({
        emojis: ['💻', '🎉', '✨', '⭐'],
        emojiSize: 50,
        confettiNumber: 40,
      })
    }
  }

  const nextTask = () => {
    setShowResult(false)
    setShowHint(false)
    setCurrentHint(0)

    if (currentTask < tasks.length - 1) {
      setCurrentTask(prev => prev + 1)
    } else {
      onComplete(totalScore, submissions)
    }
  }

  const resetCode = () => {
    if (task && !submissions[task.id]) {
      setCode(task.starterCode)
    }
  }

  const showNextHint = () => {
    if (!task) return
    setShowHint(true)
    if (currentHint < task.hints.length - 1) {
      setCurrentHint(prev => prev + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  if (!task) return null

  const isSubmitted = !!submissions[task.id]

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ภาคปฏิบัติ: {lessonTitle}</h3>
              <p className="text-sm text-white/70">ข้อ {currentTask + 1} จาก {tasks.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {tasks.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    submissions[tasks[index]?.id]?.correct
                      ? 'bg-[#22c55e]'
                      : submissions[tasks[index]?.id]
                      ? 'bg-[#ef4444]'
                      : index === currentTask
                      ? 'bg-white'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <div className="px-4 py-2 rounded-full bg-[#fbbf24] text-[#0f172a] font-bold text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              {totalScore} คะแนน
            </div>
          </div>
        </div>

        {/* Task Info */}
        <div className="bg-white/10 rounded-xl p-4">
          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-[#fbbf24]" />
            {task.title}
            <span className="ml-auto text-sm font-normal text-[#22c55e]">+{task.points} คะแนน</span>
          </h4>
          <p className="text-white/80 text-sm">{task.description}</p>
        </div>
      </div>

      {/* Code Editor */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">เขียนโค้ดของคุณ:</span>
            <div className="flex gap-2">
              {!isSubmitted && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showNextHint}
                    className="text-[#f97316] border-[#f97316] hover:bg-[#f97316]/10"
                  >
                    <Lightbulb className="w-4 h-4 mr-1" />
                    คำใบ้
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetCode}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    รีเซ็ต
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted rounded-l-xl flex flex-col items-center py-4 text-xs text-muted-foreground font-mono">
              {code.split('\n').map((_, i) => (
                <div key={i} className="h-6 flex items-center">{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitted}
              className={`w-full min-h-[250px] p-4 pl-14 font-mono text-sm rounded-xl border-2 resize-none code-editor transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-[#22c55e]/5 border-[#22c55e]'
                    : 'bg-[#ef4444]/5 border-[#ef4444]'
                  : 'bg-muted border-border focus:border-primary'
              }`}
              placeholder="พิมพ์โค้ดของคุณที่นี่..."
              spellCheck={false}
            />
          </div>
        </div>

        {/* Hints */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[#fbbf24] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#fbbf24] mb-1">
                      คำใบ้ {currentHint + 1}/{task.hints.length}
                    </p>
                    <p className="text-sm text-foreground">{task.hints[currentHint]}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Feedback */}
        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl mb-4 flex items-center gap-4 ${
                isCorrect
                  ? 'bg-[#22c55e]/10 border-2 border-[#22c55e]'
                  : 'bg-[#ef4444]/10 border-2 border-[#ef4444]'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isCorrect ? 'bg-[#22c55e]' : 'bg-[#ef4444]'
              }`}>
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className={`font-bold text-lg ${isCorrect ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {isCorrect ? 'ยอดเยี่ยม!' : 'ยังไม่ถูกต้อง'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isCorrect 
                    ? `คุณได้รับ ${submissions[task.id]?.score} คะแนน จากข้อนี้` 
                    : 'ลองตรวจสอบโค้ดของคุณอีกครั้ง หรือดูคำใบ้เพิ่มเติม'}
                </p>
              </div>
              {isCorrect && (
                <div className="text-4xl animate-bounce-in">
                  🎉
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {isSubmitted && (
              <span>
                คะแนนข้อนี้: <span className={`font-bold ${isCorrect ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {submissions[task.id]?.score}/{task.points}
                </span>
              </span>
            )}
          </div>
          
          {!isSubmitted ? (
            <Button
              onClick={checkCode}
              disabled={!code.trim()}
              className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6] hover:opacity-90 text-white px-8"
            >
              <Play className="w-4 h-4 mr-2" />
              ตรวจสอบโค้ด
            </Button>
          ) : (
            <Button 
              onClick={nextTask} 
              className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] hover:opacity-90 text-white px-8"
            >
              {currentTask < tasks.length - 1 ? 'ข้อถัดไป' : 'ดูผลลัพธ์'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
