'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import {
  Search,
  BookOpen,
  Award,
} from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  walletBalance: number
  createdAt: string
}

interface Enrollment {
  id: string
  course: { id: string; title: string; thumbnail: string }
  progressPercent: number
  enrolledAt: string
}

interface StudentData extends User {
  enrollments: Enrollment[]
  certificatesCount: number
}

export default function AdminStudents() {
  const { t } = useLanguage()
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
    fetchStudents()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/students')
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter((s) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans" dir="rtl">
      <Navbar currentUser={user} />
      <div className="flex-1 flex">
        <Sidebar role="ADMIN" activeTab="students" />
        <main className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto min-w-0">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div><h1 className="text-xl font-black">{t('students')}</h1><p className="text-xs text-slate-500 mt-1">{t('studentManagement')}</p></div>
              <div className="relative w-full sm:w-80"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('search')} className="w-full pr-9 pl-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none" /></div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {loading ? <div className="p-8 text-center text-sm text-slate-500">{t('loading')}</div> : filteredStudents.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">{t('noStudents')}</div> : (
              <div className="overflow-x-auto"><table className="w-full text-right text-xs"><thead><tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500"><th className="py-3 px-4">{t('student')}</th><th className="py-3 px-4">{t('email')}</th><th className="py-3 px-4">{t('walletBalance')}</th><th className="py-3 px-4">{t('enrolledCourses')}</th><th className="py-3 px-4">{t('certificates')}</th></tr></thead><tbody>{filteredStudents.map((s) => (<React.Fragment key={s.id}><tr className="border-b border-slate-100 dark:border-slate-800/60"><td className="py-3 px-4 font-bold">{s.name}</td><td className="py-3 px-4 text-slate-500">{s.email}</td><td className="py-3 px-4">{s.walletBalance}</td><td className="py-3 px-4"><button onClick={() => setExpandedStudent(expandedStudent === s.id ? null : s.id)} className="font-bold text-brand-purple">{s.enrollments?.length || 0}</button></td><td className="py-3 px-4"><span className="inline-flex items-center gap-1"><Award className="w-4 h-4 text-brand-orange" />{s.certificatesCount || 0}</span></td></tr>{expandedStudent === s.id && (<tr key={`${s.id}-details`}><td colSpan={5} className="px-4 py-4 bg-slate-50 dark:bg-slate-800/30"><h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">{t('enrolledCourses')}:</h4><div className="space-y-2">{(s.enrollments || []).map((e) => <div key={e.id} className="flex items-center justify-between rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3"><div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-brand-purple" /><span className="font-bold">{e.course?.title}</span></div><span className="text-slate-500">{e.progressPercent}%</span></div>)}</div></td></tr>)}</React.Fragment>))}</tbody></table></div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
