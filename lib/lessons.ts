export interface Quiz {
  id: string
  question: string
  type: 'multiple-choice' | 'code' | 'fill-blank' | 'image-upload'
  options?: string[]
  correctAnswer?: string | number
  codeTemplate?: string
  expectedOutput?: string
  points: number
}

export interface Lesson {
  id: number
  week: number
  title: string
  titleEn: string
  description: string
  objectives: {
    knowledge: string
    skill: string
    attitude: string
  }
  theoryContent: string
  practiceContent: string
  videoUrl?: string
  quizzes: Quiz[]
  maxScore: number
  icon: string
  color: string
  unlockRequirement?: number // lesson id that must be completed
}

export const lessons: Lesson[] = [
  {
    id: 1,
    week: 1,
    title: 'หลักการทำงานของเว็บไซต์',
    titleEn: 'How Websites Work',
    description: 'เรียนรู้สถาปัตยกรรม Client/Server, ติดตั้ง VS Code, และออกแบบ Wireframe นามบัตรดิจิทัล',
    objectives: {
      knowledge: 'อธิบายหลักการทำงานของเว็บไซต์ได้',
      skill: 'ออกแบบโครงร่าง (Wireframe) นามบัตรดิจิทัลได้',
      attitude: 'ส่งผลงานการออกแบบตรงตามเวลาที่กำหนด',
    },
    theoryContent: `
# 🌐 เว็บไซต์ทำงานอย่างไร?

## Client-Server Model
เมื่อคุณเปิดเว็บไซต์ สิ่งที่เกิดขึ้นคือ:

1. **Client (คุณ)** - เบราว์เซอร์ของคุณส่งคำขอไปยังเซิร์ฟเวอร์
2. **Server** - คอมพิวเตอร์ที่เก็บเว็บไซต์ ส่งข้อมูลกลับมา
3. **Response** - เบราว์เซอร์แสดงผลเว็บไซต์ให้คุณเห็น

## 🛠️ เครื่องมือที่เราจะใช้

### Visual Studio Code
- โปรแกรมเขียนโค้ดฟรีที่นิยมที่สุด
- มี Extensions ช่วยเขียนโค้ดมากมาย
- รองรับภาษาไทย

### Live Server
- Extension สำหรับดูผลลัพธ์แบบเรียลไทม์
- แก้ไขโค้ดแล้วเห็นผลทันที

## 📐 Wireframe คืออะไร?
Wireframe คือภาพร่างโครงสร้างเว็บไซต์ก่อนลงมือเขียนโค้ดจริง เหมือนพิมพ์เขียวของบ้าน!
    `,
    practiceContent: `
# 💪 ลงมือทำ: ออกแบบ Wireframe นามบัตร

## ขั้นตอนที่ 1: ติดตั้ง VS Code
1. ไปที่ https://code.visualstudio.com/
2. กดดาวน์โหลดและติดตั้ง
3. ติดตั้ง Extension "Live Server"

## ขั้นตอนที่ 2: วาด Wireframe
วาดโครงร่างนามบัตรดิจิทัลของคุณ ควรมี:
- ✅ รูปโปรไฟล์
- ✅ ชื่อ-นามสกุล
- ✅ ตำแหน่ง/สถานะ
- ✅ ข้อมูลติดต่อ (อีเมล, เบอร์โทร)
- ✅ ลิงก์โซเชียลมีเดีย
    `,
    quizzes: [
      {
        id: 'q1-1',
        question: 'Client ในระบบ Client-Server หมายถึงอะไร?',
        type: 'multiple-choice',
        options: [
          'เซิร์ฟเวอร์ที่เก็บเว็บไซต์',
          'เบราว์เซอร์ของผู้ใช้งาน',
          'สายเคเบิลอินเทอร์เน็ต',
          'โปรแกรม VS Code'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q1-2',
        question: 'Wireframe มีประโยชน์อย่างไร?',
        type: 'multiple-choice',
        options: [
          'ทำให้เว็บโหลดเร็วขึ้น',
          'ช่วยวางแผนโครงสร้างก่อนเขียนโค้ด',
          'เป็นภาษาเขียนโค้ด',
          'ใช้แทรกรูปภาพ'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q1-3',
        question: 'อัปโหลดภาพ Wireframe นามบัตรดิจิทัลของคุณ',
        type: 'image-upload',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '🚀',
    color: '#22c55e',
  },
  {
    id: 2,
    week: 2,
    title: 'โครงสร้าง HTML เบื้องต้น',
    titleEn: 'Basic HTML Structure',
    description: 'เรียนรู้โครงสร้างเอกสาร HTML และการจัดการข้อความ',
    objectives: {
      knowledge: 'ระบุโครงสร้างพื้นฐานของ HTML ได้',
      skill: 'เขียนรหัสคำสั่ง HTML เพื่อสร้างข้อความได้',
      attitude: 'ปฏิบัติงานด้วยความรอบคอบ',
    },
    theoryContent: `
# 📄 โครงสร้าง HTML

## HTML คืออะไร?
HTML (HyperText Markup Language) เป็นภาษาที่ใช้สร้างโครงสร้างเว็บไซต์

## โครงสร้างพื้นฐาน

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>หัวข้อเว็บ</title>
  </head>
  <body>
    <!-- เนื้อหาเว็บไซต์อยู่ตรงนี้ -->
  </body>
</html>
\`\`\`

## 📌 Tag สำคัญ
- \`<html>\` - ครอบทั้งหมด
- \`<head>\` - ข้อมูลเกี่ยวกับเว็บ
- \`<body>\` - เนื้อหาที่แสดงผล
- \`<h1>\` ถึง \`<h6>\` - หัวข้อ
- \`<p>\` - ย่อหน้า
    `,
    practiceContent: `
# 💪 ลงมือทำ: สร้างไฟล์ HTML แรก

## สร้างไฟล์ index.html

\`\`\`html
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>นามบัตร - [ชื่อของคุณ]</title>
</head>
<body>
  <h1>ชื่อของคุณ</h1>
  <p>นักเรียน ปวช.1</p>
  <p>สนใจด้านการพัฒนาเว็บไซต์</p>
</body>
</html>
\`\`\`

ลองเปลี่ยนข้อความเป็นข้อมูลของตัวเอง!
    `,
    quizzes: [
      {
        id: 'q2-1',
        question: 'Tag ใดใช้สำหรับหัวข้อใหญ่ที่สุด?',
        type: 'multiple-choice',
        options: ['<p>', '<h1>', '<h6>', '<title>'],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q2-2',
        question: 'เนื้อหาที่จะแสดงบนเว็บเขียนไว้ใน Tag ใด?',
        type: 'multiple-choice',
        options: ['<head>', '<html>', '<body>', '<title>'],
        correctAnswer: 2,
        points: 2,
      },
      {
        id: 'q2-3',
        question: 'เขียนโค้ด HTML แสดงชื่อและคำอธิบายของคุณ',
        type: 'code',
        codeTemplate: `<!DOCTYPE html>
<html>
<head>
  <title>นามบัตรของฉัน</title>
</head>
<body>
  <!-- เขียนโค้ดของคุณตรงนี้ -->
  
</body>
</html>`,
        expectedOutput: '<h1>',
        points: 6,
      },
    ],
    maxScore: 10,
    icon: '📝',
    color: '#3b82f6',
    unlockRequirement: 1,
  },
  {
    id: 3,
    week: 3,
    title: 'การแทรกมัลติมีเดียและลิงก์',
    titleEn: 'Images and Links',
    description: 'เรียนรู้การแทรกรูปภาพและสร้างจุดเชื่อมโยง',
    objectives: {
      knowledge: 'อธิบายการอ้างอิงตำแหน่งไฟล์รูปภาพได้',
      skill: 'แทรกรูปภาพและสร้างลิงก์เชื่อมโยงได้',
      attitude: 'มีความรับผิดชอบต่องาน',
    },
    theoryContent: `
# 🖼️ รูปภาพและลิงก์

## การแทรกรูปภาพ
\`\`\`html
<img src="รูปของฉัน.jpg" alt="รูปโปรไฟล์">
\`\`\`

### Attributes สำคัญ:
- \`src\` - ที่อยู่ไฟล์รูป
- \`alt\` - คำอธิบายรูป (สำคัญมาก!)
- \`width\` / \`height\` - ขนาด

## การสร้างลิงก์
\`\`\`html
<a href="https://facebook.com">Facebook</a>
\`\`\`

### เปิดหน้าต่างใหม่:
\`\`\`html
<a href="https://line.me" target="_blank">LINE</a>
\`\`\`
    `,
    practiceContent: `
# 💪 ลงมือทำ: เพิ่มรูปและลิงก์

## เพิ่มรูปโปรไฟล์
1. หารูปของตัวเองมา 1 รูป
2. ตั้งชื่อไฟล์เป็นภาษาอังกฤษ เช่น profile.jpg
3. ใส่ในโค้ด

\`\`\`html
<img src="profile.jpg" alt="รูปของฉัน" width="150">
\`\`\`

## เพิ่มลิงก์โซเชียล
\`\`\`html
<a href="https://facebook.com/yourprofile" target="_blank">
  Facebook
</a>
\`\`\`
    `,
    quizzes: [
      {
        id: 'q3-1',
        question: 'Attribute ใดใช้ระบุที่อยู่ไฟล์รูปภาพ?',
        type: 'multiple-choice',
        options: ['alt', 'src', 'href', 'link'],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q3-2',
        question: 'target="_blank" ทำหน้าที่อะไร?',
        type: 'multiple-choice',
        options: [
          'เปลี่ยนสีลิงก์',
          'เปิดลิงก์ในหน้าต่างใหม่',
          'ซ่อนลิงก์',
          'ลบลิงก์'
        ],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q3-3',
        question: 'เขียนโค้ดแทรกรูปและลิงก์โซเชียลมีเดีย',
        type: 'code',
        codeTemplate: `<!-- เขียนโค้ดแทรกรูปโปรไฟล์ -->


<!-- เขียนโค้ดลิงก์ไปยัง Facebook หรือ Instagram -->

`,
        expectedOutput: '<img',
        points: 6,
      },
    ],
    maxScore: 10,
    icon: '🖼️',
    color: '#f97316',
    unlockRequirement: 2,
  },
  {
    id: 4,
    week: 4,
    title: 'หลักการ CSS และการจัดการสี',
    titleEn: 'CSS Basics & Colors',
    description: 'เรียนรู้โครงสร้าง CSS และการกำหนดสี',
    objectives: {
      knowledge: 'อธิบายหลักการเรียกใช้งาน CSS ได้',
      skill: 'เขียน CSS เพื่อเปลี่ยนสีองค์ประกอบได้',
      attitude: 'มีความคิดสร้างสรรค์ในการเลือกสี',
    },
    theoryContent: `
# 🎨 CSS - ตกแต่งเว็บให้สวยงาม

## CSS คืออะไร?
CSS (Cascading Style Sheets) ใช้ตกแต่งเว็บไซต์ให้สวยงาม

## วิธีใช้ CSS
\`\`\`html
<style>
  h1 {
    color: blue;
    background-color: yellow;
  }
</style>
\`\`\`

## การกำหนดสี
1. **ชื่อสี**: red, blue, green
2. **Hex Code**: #FF0000, #0000FF
3. **RGB**: rgb(255, 0, 0)
    `,
    practiceContent: `
# 💪 ลงมือทำ: ใส่สีให้นามบัตร

## เพิ่ม CSS ในหัวข้อ <head>
\`\`\`html
<style>
  body {
    background-color: #1a1a2e;
    color: white;
  }
  
  h1 {
    color: #00d4ff;
  }
</style>
\`\`\`

เลือกสีที่ชอบและทดลองเปลี่ยน!
    `,
    quizzes: [
      {
        id: 'q4-1',
        question: 'CSS ย่อมาจากอะไร?',
        type: 'multiple-choice',
        options: [
          'Computer Style Sheet',
          'Cascading Style Sheets',
          'Creative Style System',
          'Color Style Set'
        ],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q4-2',
        question: '#FF0000 เป็นสีอะไร?',
        type: 'multiple-choice',
        options: ['น้ำเงิน', 'เขียว', 'แดง', 'เหลือง'],
        correctAnswer: 2,
        points: 2,
      },
      {
        id: 'q4-3',
        question: 'เขียน CSS กำหนดสีพื้นหลังและสีตัวอักษร',
        type: 'code',
        codeTemplate: `<style>
  body {
    /* กำหนดสีพื้นหลัง */
    
    /* กำหนดสีตัวอักษร */
    
  }
</style>`,
        expectedOutput: 'background',
        points: 6,
      },
    ],
    maxScore: 10,
    icon: '🎨',
    color: '#ec4899',
    unlockRequirement: 3,
  },
  {
    id: 5,
    week: 5,
    title: 'การกำหนดขนาดและขอบด้วย CSS',
    titleEn: 'CSS Size & Borders',
    description: 'เรียนรู้การกำหนดขนาดและปรับแต่งขอบ',
    objectives: {
      knowledge: 'ระบุคำสั่งจัดการขนาดและรูปทรงได้',
      skill: 'ปรับแต่งรูปภาพให้เป็นทรงกลมและมีกรอบได้',
      attitude: 'ให้ความร่วมมือในชั้นเรียน',
    },
    theoryContent: `
# 📐 ขนาดและขอบ

## กำหนดขนาด
\`\`\`css
img {
  width: 150px;
  height: 150px;
}
\`\`\`

## กำหนดขอบ
\`\`\`css
img {
  border: 3px solid #00d4ff;
  border-radius: 50%; /* ทำให้เป็นวงกลม */
}
\`\`\`

## Box Model
- padding - ระยะห่างภายใน
- margin - ระยะห่างภายนอก
    `,
    practiceContent: `
# 💪 ลงมือทำ: ปรับแต่งรูปโปรไฟล์

## ทำรูปโปรไฟล์เป็นวงกลม
\`\`\`css
img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #00d4ff;
}
\`\`\`
    `,
    quizzes: [
      {
        id: 'q5-1',
        question: 'border-radius: 50% ทำให้เกิดผลอะไร?',
        type: 'multiple-choice',
        options: [
          'ขอบหนาขึ้น 50%',
          'รูปทรงกลายเป็นวงกลม',
          'ขนาดเล็กลง 50%',
          'สีเปลี่ยนเป็นสีดำ'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q5-2',
        question: 'padding คืออะไร?',
        type: 'multiple-choice',
        options: [
          'ระยะห่างภายนอก',
          'ระยะห่างภายใน',
          'ความหนาของขอบ',
          'สีพื้นหลัง'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q5-3',
        question: 'อัปโหลดภาพหน้าจอนามบัตรที่มีรูปโปรไฟล์เป็นวงกลม',
        type: 'image-upload',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '⭕',
    color: '#8b5cf6',
    unlockRequirement: 4,
  },
  {
    id: 6,
    week: 6,
    title: 'การจัดวางด้วย Flexbox',
    titleEn: 'Flexbox Layout',
    description: 'เรียนรู้การจัดวางองค์ประกอบด้วย Flexbox',
    objectives: {
      knowledge: 'อธิบายหลักการ Flexbox ได้',
      skill: 'จัดวางองค์ประกอบให้อยู่กึ่งกลางได้',
      attitude: 'แก้ไขปัญหาอย่างมีสติ',
    },
    theoryContent: `
# 📦 Flexbox - จัดวางอย่างง่าย

## Flexbox คืออะไร?
วิธีจัดวางองค์ประกอบที่ทันสมัยและยืดหยุ่น

## คำสั่งพื้นฐาน
\`\`\`css
.container {
  display: flex;
  justify-content: center; /* จัดแนวนอน */
  align-items: center;     /* จัดแนวตั้ง */
}
\`\`\`

## justify-content
- center - ตรงกลาง
- space-between - กระจายห่างเท่ากัน
- flex-start - ชิดซ้าย
- flex-end - ชิดขวา
    `,
    practiceContent: `
# 💪 ลงมือทำ: จัดกลางนามบัตร

## จัดให้นามบัตรอยู่กลางหน้าจอ
\`\`\`css
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
\`\`\`
    `,
    quizzes: [
      {
        id: 'q6-1',
        question: 'คำสั่งใดใช้เปิดใช้งาน Flexbox?',
        type: 'multiple-choice',
        options: [
          'flex: true',
          'display: flex',
          'flexbox: on',
          'use-flex: yes'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q6-2',
        question: 'justify-content: center ทำหน้าที่อะไร?',
        type: 'multiple-choice',
        options: [
          'จัดแนวตั้งให้ตรงกลาง',
          'จัดแนวนอนให้ตรงกลาง',
          'เพิ่มขนาดองค์ประกอบ',
          'เปลี่ยนสีพื้นหลัง'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q6-3',
        question: 'เขียน CSS จัดให้ div อยู่กึ่งกลาง',
        type: 'code',
        codeTemplate: `.card {
  /* เขียนโค้ดจัดกึ่งกลางด้วย Flexbox */
  
}`,
        expectedOutput: 'display: flex',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '📦',
    color: '#06b6d4',
    unlockRequirement: 5,
  },
  {
    id: 7,
    week: 7,
    title: 'การจัดแต่งตัวอักษร',
    titleEn: 'Typography Styling',
    description: 'เรียนรู้การจัดรูปแบบตัวอักษรด้วย CSS',
    objectives: {
      knowledge: 'ระบุคำสั่งจัดรูปแบบตัวอักษรได้',
      skill: 'ปรับแต่งฟอนต์และการจัดวางข้อความได้',
      attitude: 'มีความละเอียดรอบคอบ',
    },
    theoryContent: `
# ✒️ จัดแต่งตัวอักษร

## คุณสมบัติสำคัญ
\`\`\`css
h1 {
  font-family: 'Kanit', sans-serif;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  letter-spacing: 2px;
}
\`\`\`

## Google Fonts
เพิ่มฟอนต์สวยๆ จาก Google:
\`\`\`html
<link href="https://fonts.googleapis.com/css2?family=Kanit&display=swap" rel="stylesheet">
\`\`\`
    `,
    practiceContent: `
# 💪 ลงมือทำ: ใส่ฟอนต์สวยๆ

## เพิ่ม Google Fonts
1. ไปที่ fonts.google.com
2. เลือกฟอนต์ที่ชอบ
3. คัดลอกโค้ดมาใส่

ลองใช้ฟอนต์ "Kanit" สำหรับภาษาไทย!
    `,
    quizzes: [
      {
        id: 'q7-1',
        question: 'คำสั่งใดใช้เปลี่ยนขนาดตัวอักษร?',
        type: 'multiple-choice',
        options: ['font-family', 'font-size', 'font-weight', 'text-align'],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q7-2',
        question: 'text-align: center ทำอะไร?',
        type: 'multiple-choice',
        options: [
          'เปลี่ยนสีตัวอักษร',
          'จัดข้อความให้อยู่กลาง',
          'ทำตัวหนา',
          'เพิ่มระยะห่างระหว่างบรรทัด'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q7-3',
        question: 'อัปโหลดภาพนามบัตรที่ใช้ฟอนต์จาก Google Fonts',
        type: 'image-upload',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '✒️',
    color: '#f59e0b',
    unlockRequirement: 6,
  },
  {
    id: 8,
    week: 8,
    title: 'การสร้าง Card Layout',
    titleEn: 'Card Layout Design',
    description: 'เรียนรู้การสร้างกล่อง Card สำหรับนามบัตร',
    objectives: {
      knowledge: 'อธิบายการใช้ Box Shadow ได้',
      skill: 'สร้างกล่อง Card พร้อมเงาได้',
      attitude: 'มีความคิดสร้างสรรค์',
    },
    theoryContent: `
# 🃏 Card Layout

## สร้างกล่อง Card
\`\`\`css
.card {
  background: #1a1a2e;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
\`\`\`

## Box Shadow
\`\`\`css
box-shadow: x-offset y-offset blur spread color;
\`\`\`
- x-offset: เลื่อนซ้าย-ขวา
- y-offset: เลื่อนบน-ล่าง
- blur: ความเบลอ
- spread: ขนาดเงา
    `,
    practiceContent: `
# 💪 ลงมือทำ: สร้าง Card นามบัตร

## สร้าง div ครอบเนื้อหา
\`\`\`html
<div class="card">
  <img src="profile.jpg" alt="รูปของฉัน">
  <h1>ชื่อของฉัน</h1>
  <p>คำอธิบาย</p>
</div>
\`\`\`

## CSS สำหรับ Card
\`\`\`css
.card {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  padding: 40px;
  border-radius: 25px;
  box-shadow: 0 15px 40px rgba(0,212,255,0.2);
  max-width: 350px;
}
\`\`\`
    `,
    quizzes: [
      {
        id: 'q8-1',
        question: 'box-shadow ใช้ทำอะไร?',
        type: 'multiple-choice',
        options: [
          'เปลี่ยนสีพื้นหลัง',
          'สร้างเงาให้องค์ประกอบ',
          'เพิ่มขอบ',
          'ปรับความโปร่งใส'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q8-2',
        question: 'padding คือระยะห่างแบบใด?',
        type: 'multiple-choice',
        options: [
          'ระยะห่างภายใน (จากขอบถึงเนื้อหา)',
          'ระยะห่างภายนอก (จากองค์ประกอบอื่น)',
          'ความกว้างขององค์ประกอบ',
          'ความสูงขององค์ประกอบ'
        ],
        correctAnswer: 0,
        points: 3,
      },
      {
        id: 'q8-3',
        question: 'อัปโหลดภาพ Card นามบัตรพร้อมเงา',
        type: 'image-upload',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '🃏',
    color: '#10b981',
    unlockRequirement: 7,
  },
  {
    id: 9,
    week: 9,
    title: 'สอบกลางภาค',
    titleEn: 'Midterm Exam',
    description: 'ทดสอบความรู้จากสัปดาห์ที่ 1-8',
    objectives: {
      knowledge: 'ทบทวนความรู้ทั้งหมด',
      skill: 'แสดงทักษะการเขียนโค้ด',
      attitude: 'มีความซื่อสัตย์ในการสอบ',
    },
    theoryContent: `
# 📝 สอบกลางภาค

## เนื้อหาที่สอบ
1. หลักการทำงานของเว็บไซต์
2. โครงสร้าง HTML
3. การแทรกรูปและลิงก์
4. CSS พื้นฐาน
5. Flexbox
6. Typography
7. Card Layout

## คะแนนเต็ม 20 คะแนน
- ปรนัย 10 ข้อ (10 คะแนน)
- เขียนโค้ด 2 ข้อ (10 คะแนน)
    `,
    practiceContent: `
# 📋 ข้อสอบกลางภาค

ทำข้อสอบให้เสร็จภายในเวลาที่กำหนด

**หมายเหตุ:** ห้ามเปิดดูเฉลยหรือปรึกษากัน
    `,
    quizzes: [
      {
        id: 'q9-1',
        question: 'Tag ใดใช้สร้างลิงก์?',
        type: 'multiple-choice',
        options: ['<link>', '<a>', '<href>', '<url>'],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q9-2',
        question: 'CSS ใช้ทำอะไร?',
        type: 'multiple-choice',
        options: [
          'สร้างโครงสร้างเว็บ',
          'ตกแต่งเว็บให้สวยงาม',
          'เขียนโปรแกรม',
          'จัดการฐานข้อมูล'
        ],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q9-3',
        question: 'display: flex ใช้ทำอะไร?',
        type: 'multiple-choice',
        options: [
          'ซ่อนองค์ประกอบ',
          'เปิดใช้งาน Flexbox',
          'เปลี่ยนสี',
          'เพิ่มขนาด'
        ],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q9-4',
        question: 'alt attribute ใน <img> มีไว้ทำอะไร?',
        type: 'multiple-choice',
        options: [
          'ระบุขนาดรูป',
          'อธิบายรูปสำหรับ Screen Reader',
          'เปลี่ยนสีรูป',
          'หมุนรูป'
        ],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q9-5',
        question: 'เขียนโค้ด HTML และ CSS สร้าง Card นามบัตรอย่างง่าย',
        type: 'code',
        codeTemplate: `<!DOCTYPE html>
<html>
<head>
  <style>
    /* เขียน CSS ตรงนี้ */
    
  </style>
</head>
<body>
  <!-- เขียน HTML ตรงนี้ -->
  
</body>
</html>`,
        expectedOutput: 'class=',
        points: 10,
      },
    ],
    maxScore: 20,
    icon: '📝',
    color: '#ef4444',
    unlockRequirement: 8,
  },
  {
    id: 10,
    week: 10,
    title: 'Responsive Design เบื้องต้น',
    titleEn: 'Responsive Design Basics',
    description: 'เรียนรู้การทำเว็บให้แสดงผลได้ทุกอุปกรณ์',
    objectives: {
      knowledge: 'อธิบายหลักการ Responsive Design ได้',
      skill: 'ใช้ Media Query ปรับแต่งเว็บได้',
      attitude: 'คำนึงถึงผู้ใช้ทุกอุปกรณ์',
    },
    theoryContent: `
# 📱 Responsive Design

## ทำไมต้อง Responsive?
เว็บต้องแสดงผลได้ดีทั้งบนคอมพิวเตอร์ แท็บเล็ต และมือถือ

## Viewport Meta Tag
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

## Media Query
\`\`\`css
/* สำหรับมือถือ */
@media (max-width: 768px) {
  .card {
    width: 90%;
    padding: 20px;
  }
}
\`\`\`
    `,
    practiceContent: `
# 💪 ลงมือทำ: ทำนามบัตร Responsive

## เพิ่ม Viewport Meta Tag
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

## เพิ่ม Media Query
\`\`\`css
@media (max-width: 600px) {
  .card {
    width: 95%;
    padding: 15px;
  }
  
  h1 {
    font-size: 20px;
  }
}
\`\`\`

ลองย่อหน้าต่างเบราว์เซอร์ดู!
    `,
    quizzes: [
      {
        id: 'q10-1',
        question: 'Responsive Design คืออะไร?',
        type: 'multiple-choice',
        options: [
          'เว็บที่โหลดเร็ว',
          'เว็บที่ปรับตัวตามขนาดหน้าจอ',
          'เว็บที่มีสีสวย',
          'เว็บที่มีแอนิเมชัน'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q10-2',
        question: '@media ใช้ทำอะไร?',
        type: 'multiple-choice',
        options: [
          'แทรกรูปภาพ',
          'กำหนดเงื่อนไขขนาดหน้าจอ',
          'เพิ่มเสียง',
          'เชื่อมต่อฐานข้อมูล'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q10-3',
        question: 'อัปโหลดภาพหน้าจอนามบัตรบนมือถือ (ย่อหน้าต่าง)',
        type: 'image-upload',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '📱',
    color: '#6366f1',
    unlockRequirement: 9,
  },
  {
    id: 11,
    week: 11,
    title: 'CSS Animation เบื้องต้น',
    titleEn: 'CSS Animation Basics',
    description: 'เรียนรู้การสร้างแอนิเมชันด้วย CSS',
    objectives: {
      knowledge: 'อธิบายหลักการ CSS Animation ได้',
      skill: 'สร้างแอนิเมชันง่ายๆ ได้',
      attitude: 'มีความคิดสร้างสรรค์',
    },
    theoryContent: `
# ✨ CSS Animation

## Transition - เปลี่ยนแปลงอย่างนุ่มนวล
\`\`\`css
.button {
  background: blue;
  transition: all 0.3s ease;
}

.button:hover {
  background: red;
  transform: scale(1.1);
}
\`\`\`

## Keyframes - แอนิเมชันซับซ้อน
\`\`\`css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.icon {
  animation: bounce 2s infinite;
}
\`\`\`
    `,
    practiceContent: `
# 💪 ลงมือทำ: เพิ่ม Animation

## เพิ่ม Hover Effect
\`\`\`css
.card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0,212,255,0.4);
}
\`\`\`

## เพิ่ม Glow Animation
\`\`\`css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(0,212,255,0.3); }
  50% { box-shadow: 0 0 40px rgba(0,212,255,0.6); }
}

.card {
  animation: glow 3s infinite;
}
\`\`\`
    `,
    quizzes: [
      {
        id: 'q11-1',
        question: 'transition ใช้ทำอะไร?',
        type: 'multiple-choice',
        options: [
          'เปลี่ยนสี',
          'ทำให้การเปลี่ยนแปลงเกิดขึ้นอย่างนุ่มนวล',
          'หมุนองค์ประกอบ',
          'ซ่อนองค์ประกอบ'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q11-2',
        question: ':hover ทำงานเมื่อใด?',
        type: 'multiple-choice',
        options: [
          'เมื่อคลิก',
          'เมื่อเลื่อนเมาส์ไปวางบนองค์ประกอบ',
          'เมื่อโหลดหน้าเว็บ',
          'เมื่อกดปุ่ม Enter'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q11-3',
        question: 'เขียน CSS สร้าง hover effect ให้ปุ่ม',
        type: 'code',
        codeTemplate: `.button {
  background: #00d4ff;
  padding: 10px 20px;
  /* เพิ่ม transition */
  
}

.button:hover {
  /* เพิ่ม effect เมื่อ hover */
  
}`,
        expectedOutput: 'transition',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '✨',
    color: '#a855f7',
    unlockRequirement: 10,
  },
  {
    id: 12,
    week: 12,
    title: 'การใช้ไอคอน',
    titleEn: 'Using Icons',
    description: 'เรียนรู้การใช้ Font Awesome และ SVG Icons',
    objectives: {
      knowledge: 'อธิบายวิธีใช้ Icon Library ได้',
      skill: 'แทรกไอคอนในเว็บได้',
      attitude: 'เลือกใช้ไอคอนอย่างเหมาะสม',
    },
    theoryContent: `
# 🎯 การใช้ไอคอน

## Font Awesome
\`\`\`html
<!-- เพิ่มใน <head> -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

<!-- ใช้งาน -->
<i class="fas fa-envelope"></i> อีเมล
<i class="fab fa-facebook"></i> Facebook
\`\`\`

## ไอคอนที่ใช้บ่อย
- \`fa-envelope\` - อีเมล
- \`fa-phone\` - โทรศัพท์
- \`fa-facebook\` - Facebook
- \`fa-instagram\` - Instagram
- \`fa-line\` - LINE
    `,
    practiceContent: `
# 💪 ลงมือทำ: เพิ่มไอคอน

## เพิ่มไอคอนในนามบัตร
\`\`\`html
<div class="contact">
  <p><i class="fas fa-envelope"></i> email@example.com</p>
  <p><i class="fas fa-phone"></i> 08X-XXX-XXXX</p>
</div>

<div class="social">
  <a href="#"><i class="fab fa-facebook"></i></a>
  <a href="#"><i class="fab fa-instagram"></i></a>
  <a href="#"><i class="fab fa-line"></i></a>
</div>
\`\`\`
    `,
    quizzes: [
      {
        id: 'q12-1',
        question: 'Font Awesome คืออะไร?',
        type: 'multiple-choice',
        options: [
          'ฟอนต์ภาษาไทย',
          'ไลบรารีไอคอน',
          'เครื่องมือแก้บัก',
          'โปรแกรมเขียนโค้ด'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q12-2',
        question: 'class "fab" ใช้สำหรับไอคอนประเภทใด?',
        type: 'multiple-choice',
        options: [
          'ไอคอนทั่วไป',
          'ไอคอน Brand/Logo',
          'ไอคอนลูกศร',
          'ไอคอนสี'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q12-3',
        question: 'อัปโหลดภาพนามบัตรที่มีไอคอน',
        type: 'image-upload',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '🎯',
    color: '#0ea5e9',
    unlockRequirement: 11,
  },
  {
    id: 13,
    week: 13,
    title: 'QR Code Generator',
    titleEn: 'QR Code Integration',
    description: 'เรียนรู้การสร้างและใช้งาน QR Code',
    objectives: {
      knowledge: 'อธิบายหลักการ QR Code ได้',
      skill: 'สร้าง QR Code ลงในนามบัตรได้',
      attitude: 'ประยุกต์ใช้เทคโนโลยีอย่างเหมาะสม',
    },
    theoryContent: `
# 📲 QR Code

## QR Code คืออะไร?
รหัสที่สแกนได้ด้วยกล้องมือถือ นำไปสู่ลิงก์หรือข้อมูล

## สร้าง QR Code ฟรี
1. ไปที่ qr-code-generator.com
2. ใส่ URL ที่ต้องการ
3. ดาวน์โหลดรูป QR Code

## ใส่ใน HTML
\`\`\`html
<img src="my-qrcode.png" alt="Scan เพื่อดูข้อมูลเพิ่มเติม" width="100">
\`\`\`
    `,
    practiceContent: `
# 💪 ลงมือทำ: เพิ่ม QR Code

## ขั้นตอน
1. ไปที่ qr-code-generator.com
2. ใส่ลิงก์ Facebook หรือ LINE ของคุณ
3. ดาวน์โหลด QR Code
4. ใส่ในนามบัตร

\`\`\`html
<div class="qr-section">
  <img src="qrcode.png" alt="Scan me!" width="80">
  <p>สแกนเพื่อติดต่อ</p>
</div>
\`\`\`
    `,
    quizzes: [
      {
        id: 'q13-1',
        question: 'QR Code มีประโยชน์อย่างไร?',
        type: 'multiple-choice',
        options: [
          'ทำให้เว็บโหลดเร็วขึ้น',
          'ให้ผู้ใช้สแกนเข้าถึงข้อมูลได้ง่าย',
          'ป้องกันไวรัส',
          'เพิ่มความสวยงาม'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q13-2',
        question: 'QR Code สามารถเก็บข้อมูลประเภทใดได้?',
        type: 'multiple-choice',
        options: [
          'URL เท่านั้น',
          'ข้อความเท่านั้น',
          'URL, ข้อความ, เบอร์โทร และอื่นๆ',
          'รูปภาพเท่านั้น'
        ],
        correctAnswer: 2,
        points: 3,
      },
      {
        id: 'q13-3',
        question: 'อัปโหลดภาพนามบัตรที่มี QR Code',
        type: 'image-upload',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '📲',
    color: '#14b8a6',
    unlockRequirement: 12,
  },
  {
    id: 14,
    week: 14,
    title: 'การอัปโหลดเว็บไซต์',
    titleEn: 'Deploying Your Website',
    description: 'เรียนรู้การอัปโหลดเว็บขึ้นออนไลน์',
    objectives: {
      knowledge: 'อธิบายขั้นตอนการ Deploy เว็บได้',
      skill: 'อัปโหลดเว็บขึ้น Hosting ได้',
      attitude: 'มีความรับผิดชอบต่อผลงาน',
    },
    theoryContent: `
# 🚀 Deploy เว็บขึ้นออนไลน์

## Hosting คืออะไร?
ที่เก็บเว็บไซต์บนอินเทอร์เน็ต ให้คนอื่นเข้าถึงได้

## ตัวเลือก Hosting ฟรี
1. **GitHub Pages** - ฟรี ใช้ง่าย
2. **Netlify** - ฟรี มีฟีเจอร์เยอะ
3. **Vercel** - ฟรี เร็วมาก

## ขั้นตอนใช้ GitHub Pages
1. สร้าง Repository ใน GitHub
2. อัปโหลดไฟล์ HTML, CSS
3. เปิด Settings > Pages
4. ได้ลิงก์เว็บของคุณ!
    `,
    practiceContent: `
# 💪 ลงมือทำ: อัปโหลดนามบัตร

## ขั้นตอน Deploy ด้วย GitHub Pages
1. สมัคร GitHub (ถ้ายังไม่มี)
2. สร้าง Repository ใหม่
3. อัปโหลดไฟล์ทั้งหมด
4. ไปที่ Settings > Pages
5. เลือก Source เป็น main branch
6. รอ 1-2 นาที

**ลิงก์เว็บของคุณ:**
\`https://username.github.io/repository-name\`
    `,
    quizzes: [
      {
        id: 'q14-1',
        question: 'Hosting คืออะไร?',
        type: 'multiple-choice',
        options: [
          'โปรแกรมเขียนโค้ด',
          'ที่เก็บเว็บไซต์บนอินเทอร์เน็ต',
          'ภาษาเขียนเว็บ',
          'เครื่องมือออกแบบ'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q14-2',
        question: 'GitHub Pages ให้บริการอะไร?',
        type: 'multiple-choice',
        options: [
          'เขียนโค้ด',
          'โฮสต์เว็บไซต์แบบ Static ฟรี',
          'สร้างฐานข้อมูล',
          'แปลภาษา'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q14-3',
        question: 'วางลิงก์เว็บนามบัตรที่ Deploy แล้ว',
        type: 'fill-blank',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '🚀',
    color: '#f43f5e',
    unlockRequirement: 13,
  },
  {
    id: 15,
    week: 15,
    title: 'Dark Mode Toggle',
    titleEn: 'Dark Mode Feature',
    description: 'เรียนรู้การสร้างปุ่มสลับ Dark Mode',
    objectives: {
      knowledge: 'อธิบายหลักการ Dark Mode ได้',
      skill: 'สร้างปุ่มสลับ Dark Mode ได้',
      attitude: 'คำนึงถึงประสบการณ์ผู้ใช้',
    },
    theoryContent: `
# 🌙 Dark Mode

## ทำไมต้องมี Dark Mode?
- ลดแสงสว่างในที่มืด
- ประหยัดแบตเตอรี่ (OLED)
- หลายคนชอบใช้

## หลักการทำงาน
1. สร้าง CSS สำหรับ Dark Mode
2. ใช้ JavaScript สลับ Class

\`\`\`css
body {
  background: white;
  color: black;
}

body.dark-mode {
  background: #1a1a2e;
  color: white;
}
\`\`\`

\`\`\`javascript
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
}
\`\`\`
    `,
    practiceContent: `
# 💪 ลงมือทำ: เพิ่ม Dark Mode

## เพิ่มปุ่มสลับ
\`\`\`html
<button onclick="toggleDarkMode()">🌙 Dark Mode</button>
\`\`\`

## เพิ่ม JavaScript
\`\`\`html
<script>
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
</script>
\`\`\`

## เพิ่ม CSS Dark Mode
\`\`\`css
body.dark-mode {
  background: #0a1628;
  color: #ffffff;
}

body.dark-mode .card {
  background: #1e293b;
}
\`\`\`
    `,
    quizzes: [
      {
        id: 'q15-1',
        question: 'classList.toggle() ทำอะไร?',
        type: 'multiple-choice',
        options: [
          'เพิ่ม class เสมอ',
          'ลบ class เสมอ',
          'สลับ class (เพิ่มถ้าไม่มี, ลบถ้ามี)',
          'เปลี่ยนชื่อ class'
        ],
        correctAnswer: 2,
        points: 3,
      },
      {
        id: 'q15-2',
        question: 'Dark Mode มีข้อดีอะไร?',
        type: 'multiple-choice',
        options: [
          'ทำให้เว็บโหลดเร็วขึ้น',
          'ลดความเมื่อยล้าของตาในที่มืด',
          'เพิ่มความปลอดภัย',
          'ทำให้เขียนโค้ดง่ายขึ้น'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q15-3',
        question: 'อัปโหลดภาพหน้าจอ Dark Mode และ Light Mode',
        type: 'image-upload',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '🌙',
    color: '#6366f1',
    unlockRequirement: 14,
  },
  {
    id: 16,
    week: 16,
    title: 'ปรับปรุงและเพิ่มเติม',
    titleEn: 'Polish & Improve',
    description: 'ปรับปรุงนามบัตรให้สมบูรณ์แบบ',
    objectives: {
      knowledge: 'วิเคราะห์จุดที่ต้องปรับปรุงได้',
      skill: 'แก้ไขและพัฒนาผลงานได้',
      attitude: 'มีความพยายามในการพัฒนา',
    },
    theoryContent: `
# ✨ ปรับปรุงผลงาน

## Checklist ตรวจสอบ
- [ ] รูปโปรไฟล์ชัดเจน
- [ ] ข้อมูลครบถ้วน
- [ ] สีสันสวยงาม
- [ ] Responsive ทุกอุปกรณ์
- [ ] ลิงก์ใช้งานได้
- [ ] มี Animation
- [ ] มีไอคอน
- [ ] มี QR Code
- [ ] มี Dark Mode

## เทคนิคการปรับปรุง
1. ขอความเห็นจากเพื่อน
2. ทดสอบบนอุปกรณ์ต่างๆ
3. เปรียบเทียบกับตัวอย่างที่ดี
    `,
    practiceContent: `
# 💪 ลงมือทำ: ปรับปรุงนามบัตร

## สิ่งที่ต้องทำ
1. ตรวจสอบตาม Checklist
2. แก้ไขจุดที่ยังไม่สมบูรณ์
3. เพิ่มฟีเจอร์ที่ยังไม่มี
4. ทดสอบบนมือถือ

## ส่งงาน
อัปโหลดภาพหน้าจอและลิงก์เว็บที่อัปเดตแล้ว
    `,
    quizzes: [
      {
        id: 'q16-1',
        question: 'การทำ Responsive สำคัญอย่างไร?',
        type: 'multiple-choice',
        options: [
          'ทำให้โค้ดสั้นลง',
          'ทำให้เว็บแสดงผลได้ดีบนทุกอุปกรณ์',
          'ทำให้เว็บโหลดเร็วขึ้น',
          'ทำให้สีสวยขึ้น'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q16-2',
        question: 'ก่อนส่งงานควรทำอะไร?',
        type: 'multiple-choice',
        options: [
          'ลบโค้ดทั้งหมด',
          'ตรวจสอบและทดสอบให้เรียบร้อย',
          'เปลี่ยนภาษา',
          'ปิดคอมพิวเตอร์'
        ],
        correctAnswer: 1,
        points: 3,
      },
      {
        id: 'q16-3',
        question: 'อัปโหลดภาพหน้าจอนามบัตรที่ปรับปรุงแล้ว',
        type: 'image-upload',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '✨',
    color: '#84cc16',
    unlockRequirement: 15,
  },
  {
    id: 17,
    week: 17,
    title: 'การนำเสนอผลงาน',
    titleEn: 'Project Presentation',
    description: 'นำเสนอนามบัตรดิจิทัลต่อชั้นเรียน',
    objectives: {
      knowledge: 'อธิบายผลงานของตนเองได้',
      skill: 'นำเสนอผลงานได้อย่างมั่นใจ',
      attitude: 'รับฟังและให้ความเห็นอย่างสร้างสรรค์',
    },
    theoryContent: `
# 🎤 การนำเสนอผลงาน

## สิ่งที่ต้องนำเสนอ
1. แนะนำตัวเอง
2. แสดงนามบัตรดิจิทัล
3. อธิบายฟีเจอร์ที่ทำ
4. เล่าปัญหาที่พบและวิธีแก้ไข
5. สิ่งที่ภูมิใจที่สุด

## เกณฑ์การให้คะแนน
- ความสวยงาม (3 คะแนน)
- ฟีเจอร์ครบถ้วน (3 คะแนน)
- การนำเสนอ (2 คะแนน)
- ความคิดสร้างสรรค์ (2 คะแนน)
    `,
    practiceContent: `
# 💪 เตรียมตัวนำเสนอ

## เตรียม
1. ทบทวนผลงาน
2. เตรียมคำพูด
3. ฝึกซ้อมนำเสนอ

## ในวันนำเสนอ
- พูดให้ชัดเจน
- แสดง Demo ให้ดู
- ตอบคำถามได้

**เวลานำเสนอ: 3-5 นาที/คน**
    `,
    quizzes: [
      {
        id: 'q17-1',
        question: 'อัปโหลดไฟล์ Slide นำเสนอ (ถ้ามี)',
        type: 'image-upload',
        points: 3,
      },
      {
        id: 'q17-2',
        question: 'วางลิงก์นามบัตรดิจิทัลที่เสร็จสมบูรณ์',
        type: 'fill-blank',
        points: 3,
      },
      {
        id: 'q17-3',
        question: 'อัปโหลดภาพหน้าจอนามบัตรที่เสร็จสมบูรณ์',
        type: 'image-upload',
        points: 4,
      },
    ],
    maxScore: 10,
    icon: '🎤',
    color: '#f97316',
    unlockRequirement: 16,
  },
  {
    id: 18,
    week: 18,
    title: 'สอบปลายภาค',
    titleEn: 'Final Exam',
    description: 'ทดสอบความรู้ทั้งหมดและส่งผลงานนามบัตรดิจิทัล',
    objectives: {
      knowledge: 'แสดงความรู้ที่เรียนมาทั้งหมด',
      skill: 'สร้างนามบัตรดิจิทัลสมบูรณ์แบบ',
      attitude: 'มีความรับผิดชอบต่อผลงาน',
    },
    theoryContent: `
# 🏆 สอบปลายภาค

## เนื้อหาที่สอบ
ทุกหัวข้อที่เรียนมาทั้ง 17 สัปดาห์

## คะแนน 20 คะแนน
- ปรนัย 10 ข้อ (10 คะแนน)
- ส่งผลงานนามบัตรดิจิทัล (10 คะแนน)

## เกณฑ์ประเมินนามบัตร
- HTML ถูกต้อง (2 คะแนน)
- CSS สวยงาม (2 คะแนน)
- Responsive (2 คะแนน)
- ฟีเจอร์ครบ (2 คะแนน)
- ความคิดสร้างสรรค์ (2 คะแนน)
    `,
    practiceContent: `
# 🏆 ส่งผลงานสุดท้าย

## Checklist นามบัตรดิจิทัล
- [ ] โครงสร้าง HTML ถูกต้อง
- [ ] มีรูปโปรไฟล์
- [ ] มีข้อมูลติดต่อ
- [ ] มีลิงก์โซเชียลมีเดีย
- [ ] มีไอคอน
- [ ] มี QR Code
- [ ] CSS สวยงาม
- [ ] Animation
- [ ] Responsive
- [ ] Dark Mode
- [ ] Deploy ออนไลน์แล้ว

**ยินดีด้วย! คุณสำเร็จหลักสูตรแล้ว! 🎉**
    `,
    quizzes: [
      {
        id: 'q18-1',
        question: 'HTML ใช้สำหรับ?',
        type: 'multiple-choice',
        options: [
          'ตกแต่งเว็บ',
          'สร้างโครงสร้างเว็บ',
          'เขียนโปรแกรม',
          'จัดการฐานข้อมูล'
        ],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q18-2',
        question: 'CSS ใช้สำหรับ?',
        type: 'multiple-choice',
        options: [
          'สร้างโครงสร้างเว็บ',
          'ตกแต่งเว็บให้สวยงาม',
          'เชื่อมต่อฐานข้อมูล',
          'ทำ Animation เท่านั้น'
        ],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q18-3',
        question: 'Flexbox ใช้ทำอะไร?',
        type: 'multiple-choice',
        options: [
          'เปลี่ยนสี',
          'จัดวางองค์ประกอบ',
          'แทรกรูป',
          'สร้างลิงก์'
        ],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q18-4',
        question: 'Media Query ใช้ทำอะไร?',
        type: 'multiple-choice',
        options: [
          'แทรกวิดีโอ',
          'ทำ Responsive',
          'เล่นเพลง',
          'สร้างฐานข้อมูล'
        ],
        correctAnswer: 1,
        points: 2,
      },
      {
        id: 'q18-5',
        question: 'วางลิงก์นามบัตรดิจิทัลที่เสร็จสมบูรณ์',
        type: 'fill-blank',
        points: 5,
      },
      {
        id: 'q18-6',
        question: 'อัปโหลดภาพหน้าจอนามบัตรที่เสร็จสมบูรณ์',
        type: 'image-upload',
        points: 5,
      },
    ],
    maxScore: 20,
    icon: '🏆',
    color: '#eab308',
    unlockRequirement: 17,
  },
]

export const getTotalMaxScore = () => {
  return lessons.reduce((sum, lesson) => sum + lesson.maxScore, 0)
}

export const getLessonById = (id: number) => {
  return lessons.find((lesson) => lesson.id === id)
}

export const isLessonUnlocked = (lessonId: number, completedLessons: number[]) => {
  const lesson = getLessonById(lessonId)
  if (!lesson) return false
  if (!lesson.unlockRequirement) return true
  return completedLessons.includes(lesson.unlockRequirement)
}
