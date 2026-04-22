'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { Quiz } from '@/lib/lessons'
import { CheckCircle, XCircle, Upload, Code, HelpCircle, Send } from 'lucide-react'
import JSConfetti from 'js-confetti'

interface QuizSectionProps {
  quizzes: Quiz[]
  onComplete: (score: number, answers: Record<string, string>) => void
  lessonTitle: string
}

export function QuizSection({ quizzes, onComplete, lessonTitle }: QuizSectionProps) {
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number>>({})
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [totalScore, setTotalScore] = useState(0)
  const [submittedQuizzes, setSubmittedQuizzes] = useState<Set<string>>(new Set())
  const confettiRef = useRef<JSConfetti | null>(null)

  useEffect(() => {
    confettiRef.current = new JSConfetti()
    return () => {
      confettiRef.current = null
    }
  }, [])

  const quiz = quizzes[currentQuiz]

  const handleAnswer = (answer: string | number) => {
    setAnswers((prev) => ({ ...prev, [quiz.id]: answer }))
  }

  const checkAnswer = () => {
    if (submittedQuizzes.has(quiz.id)) return

    let correct = false
    
    if (quiz.type === 'multiple-choice' && quiz.correctAnswer !== undefined) {
      correct = answers[quiz.id] === quiz.correctAnswer
    } else if (quiz.type === 'code' && quiz.expectedOutput) {
      const userCode = String(answers[quiz.id] || '')
      correct = userCode.toLowerCase().includes(quiz.expectedOutput.toLowerCase())
    } else if (quiz.type === 'fill-blank' || quiz.type === 'image-upload') {
      // These need teacher review, auto-pass for now
      correct = true
    }

    setIsCorrect(correct)
    setShowResult(true)
    setSubmittedQuizzes((prev) => new Set(prev).add(quiz.id))

    if (correct) {
      setTotalScore((prev) => prev + quiz.points)
      confettiRef.current?.addConfetti({
        emojis: ['⭐', '🎉', '✨'],
        emojiSize: 50,
        confettiNumber: 30,
      })
    }
  }

  const nextQuiz = () => {
    setShowResult(false)
    setIsCorrect(null)
    
    if (currentQuiz < quizzes.length - 1) {
      setCurrentQuiz((prev) => prev + 1)
    } else {
      // All quizzes completed
      const stringAnswers: Record<string, string> = {}
      Object.entries(answers).forEach(([key, value]) => {
        stringAnswers[key] = String(value)
      })
      onComplete(totalScore, stringAnswers)
    }
  }

  const renderQuizContent = () => {
    switch (quiz.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {quiz.options?.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(index)}
                disabled={submittedQuizzes.has(quiz.id)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  answers[quiz.id] === index
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                } ${submittedQuizzes.has(quiz.id) ? 'cursor-not-allowed' : ''} ${
                  showResult && index === quiz.correctAnswer
                    ? 'bg-[#22c55e] text-white'
                    : ''
                } ${
                  showResult && answers[quiz.id] === index && index !== quiz.correctAnswer
                    ? 'bg-destructive text-white'
                    : ''
                }`}
              >
                <span className="font-medium mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
              </motion.button>
            ))}
          </div>
        )

      case 'code':
        return (
          <div className="space-y-4">
            <div className="bg-muted rounded-xl p-4 font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap text-muted-foreground">
                {quiz.codeTemplate}
              </pre>
            </div>
            <Textarea
              placeholder="เขียนโค้ดของคุณที่นี่..."
              value={String(answers[quiz.id] || '')}
              onChange={(e) => handleAnswer(e.target.value)}
              disabled={submittedQuizzes.has(quiz.id)}
              className="font-mono min-h-[150px] bg-card"
            />
          </div>
        )

      case 'fill-blank':
        return (
          <Textarea
            placeholder="พิมพ์คำตอบของคุณ..."
            value={String(answers[quiz.id] || '')}
            onChange={(e) => handleAnswer(e.target.value)}
            disabled={submittedQuizzes.has(quiz.id)}
            className="min-h-[100px] bg-card"
          />
        )

      case 'image-upload':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                ลากไฟล์มาวางหรือคลิกเพื่ออัปโหลด
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = () => {
                      handleAnswer(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                disabled={submittedQuizzes.has(quiz.id)}
                className="w-full cursor-pointer"
              />
            </div>
            {answers[quiz.id] && typeof answers[quiz.id] === 'string' && answers[quiz.id].toString().startsWith('data:image') && (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={answers[quiz.id] as string}
                  alt="Uploaded preview"
                  className="w-full max-h-64 object-contain bg-muted"
                />
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const getQuizIcon = () => {
    switch (quiz.type) {
      case 'multiple-choice':
        return <HelpCircle className="w-5 h-5" />
      case 'code':
        return <Code className="w-5 h-5" />
      case 'image-upload':
        return <Upload className="w-5 h-5" />
      default:
        return <HelpCircle className="w-5 h-5" />
    }
  }

  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">
          แบบฝึกหัด: {lessonTitle}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            ข้อ {currentQuiz + 1} / {quizzes.length}
          </span>
          <div className="flex gap-1">
            {quizzes.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index < currentQuiz
                    ? 'bg-[#22c55e]'
                    : index === currentQuiz
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            {getQuizIcon()}
          </div>
          <span className="text-sm text-primary font-medium">
            {quiz.points} คะแนน
          </span>
        </div>
        <h4 className="text-lg font-medium text-foreground mb-4">
          {quiz.question}
        </h4>

        {/* Quiz Content */}
        {renderQuizContent()}
      </div>

      {/* Result Feedback */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl mb-4 flex items-center gap-3 ${
              isCorrect
                ? 'bg-[#22c55e]/20 border border-[#22c55e]/30'
                : 'bg-destructive/20 border border-destructive/30'
            }`}
          >
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-[#22c55e]" />
            ) : (
              <XCircle className="w-6 h-6 text-destructive" />
            )}
            <div>
              <div className={`font-medium ${isCorrect ? 'text-[#22c55e]' : 'text-destructive'}`}>
                {isCorrect ? 'ถูกต้อง! 🎉' : 'ไม่ถูกต้อง'}
              </div>
              {!isCorrect && quiz.type === 'multiple-choice' && quiz.correctAnswer !== undefined && (
                <div className="text-sm text-muted-foreground">
                  คำตอบที่ถูกต้องคือ: {quiz.options?.[quiz.correctAnswer as number]}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          คะแนนสะสม: <span className="font-bold text-[#22c55e]">{totalScore}</span>
        </div>
        
        {!submittedQuizzes.has(quiz.id) ? (
          <Button
            onClick={checkAnswer}
            disabled={answers[quiz.id] === undefined}
            className="bg-gradient-to-r from-[#22c55e] to-[#3b82f6]"
          >
            <Send className="w-4 h-4 mr-2" />
            ส่งคำตอบ
          </Button>
        ) : (
          <Button onClick={nextQuiz} variant="outline">
            {currentQuiz < quizzes.length - 1 ? 'ข้อถัดไป' : 'ดูผลลัพธ์'}
          </Button>
        )}
      </div>
    </div>
  )
}
