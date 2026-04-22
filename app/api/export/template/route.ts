import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const workbook = XLSX.utils.book_new()

    const templateRows = [
      {
        userId: 1,
        lessonId: '1',
        score: 10,
        completed: true,
        expectedUpdatedAt: '',
      },
    ]

    const instructionRows = [
      {
        note: 'แก้ไขเฉพาะชีต Progress เท่านั้น',
      },
      {
        note: 'คอลัมน์ที่ต้องมี: userId, lessonId, score, completed, expectedUpdatedAt',
      },
      {
        note: 'ถ้าจะแก้ข้อมูลแถวเดิม ควรใช้ expectedUpdatedAt จากไฟล์ export เดิมเพื่อป้องกันข้อมูลทับ',
      },
      {
        note: 'หากเป็นข้อมูลใหม่ สามารถเว้น expectedUpdatedAt ได้',
      },
    ]

    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(instructionRows),
      'Instructions',
    )
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(templateRows),
      'Progress',
    )

    const fileBuffer = XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
    }) as Buffer

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="progress-template.xlsx"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Template export error:', error)

    return NextResponse.json(
      { message: 'ไม่สามารถสร้างไฟล์แม่แบบได้' },
      { status: 500 },
    )
  }
}
