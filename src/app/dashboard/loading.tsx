'use client'

import { motion } from 'framer-motion'

const pulseVariants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' as const },
  },
} satisfies import('framer-motion').Variants

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <motion.div
      variants={pulseVariants}
      initial="initial"
      animate="animate"
      className={`bg-surface-hover rounded-lg ${className}`}
    />
  )
}

export default function DashboardLoading() {
  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-0">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-36" />
        <SkeletonBlock className="h-4 w-56" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface border border-theme rounded-xl p-4 sm:p-5 space-y-3">
            <SkeletonBlock className="h-8 w-8" />
            <SkeletonBlock className="h-6 w-20" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        ))}
      </div>

      <div className="bg-surface border border-theme rounded-xl p-4 sm:p-5">
        <SkeletonBlock className="h-5 w-40 mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-3 w-16" />
              <SkeletonBlock className="h-1.5 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-surface border border-theme rounded-xl p-4 sm:p-5">
            <SkeletonBlock className="h-5 w-32 mb-4" />
            <SkeletonBlock className="h-44 w-full rounded-xl" />
          </div>
        ))}
      </div>

      <div className="bg-surface border border-theme rounded-xl p-4 sm:p-5">
        <SkeletonBlock className="h-5 w-36 mb-4" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-surface-hover/50 rounded-lg">
              <div className="flex-1 space-y-1.5">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-3 w-48" />
              </div>
              <div className="text-right space-y-1.5">
                <SkeletonBlock className="h-4 w-14 rounded-full" />
                <SkeletonBlock className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
