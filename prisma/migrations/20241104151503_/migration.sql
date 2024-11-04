-- CreateTable
CREATE TABLE "Manga" (
    "id" TEXT NOT NULL,
    "sourceMediaId" TEXT,
    "sourceConnectionId" TEXT,
    "sourceId" TEXT NOT NULL,
    "anilistId" INTEGER,
    "coverImage" TEXT,
    "title" TEXT[],

    CONSTRAINT "Manga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sourceConnectionId" TEXT NOT NULL,
    "sourceMediaId" TEXT,
    "sourceChapterId" TEXT,
    "sourceId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_mangaId_sourceChapterId_key" ON "Chapter"("mangaId", "sourceChapterId");

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
