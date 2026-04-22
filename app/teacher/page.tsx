'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  Eye,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { DecorativeShapes } from '@/components/decorative-shapes'
import { useAppStore } from '@/lib/store'

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

export default function TeacherPage() {
  const router = useRouter()
  const { currentUser, isLoggedIn } = useAppStore()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState('')
  const [previewResult, setPreviewResult] = useState<ImportResponse | null>(null)
  const [commitResult, setCommitResult] = useState<ImportResponse | null>(null)

  useEffect(() => {
    if (!isLoggedIn || currentUser?.role !== 'teacher') {
      router.push('/login')
    }
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
            transition={{ delay: 0.15 }}
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
