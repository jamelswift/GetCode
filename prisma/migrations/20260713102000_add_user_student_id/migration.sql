ALTER TABLE "User"
ADD COLUMN     "studentId" TEXT;

CREATE UNIQUE INDEX "User_studentId_key" ON "User"("studentId");
