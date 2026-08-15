'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { VideoPlayerModal } from '@/components/video-player-modal'
import { PdfViewerModal } from '@/components/pdf-viewer-modal'
import { QuizModal } from '@/components/quiz-modal'
import { CertificateModal } from '@/components/certificate-modal'
import {
  Play,
  FileText,
  HelpCircle,
  Clock,
  User,
  Star,
  BookOpen,
  Sparkles,
  Trash2,
  Plus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'

interface Lesson {
  id: string
