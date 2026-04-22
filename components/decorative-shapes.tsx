'use client'

import { motion } from 'framer-motion'

export function DecorativeShapes() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top left star */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 bg-[#ef4444] shape-star"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Top right circle */}
      <motion.div
        className="absolute top-20 right-20 w-16 h-16 bg-[#22c55e] rounded-full"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Yellow triangle */}
      <motion.div
        className="absolute top-1/4 right-10 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[35px] border-b-[#eab308]"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Blue blob left */}
      <motion.div
        className="absolute top-1/3 left-5 w-24 h-24 bg-[#3b82f6] shape-blob opacity-50"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Orange circle bottom right */}
      <motion.div
        className="absolute bottom-20 right-10 w-12 h-12 bg-[#f97316] rounded-full"
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Green triangle bottom left */}
      <motion.div
        className="absolute bottom-40 left-20 w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[40px] border-b-[#22c55e]"
        animate={{ rotate: [0, 180] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Small dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-white rounded-full opacity-30"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
      
      {/* Red wavy line (simplified as circles) */}
      <motion.div
        className="absolute top-16 left-32 flex gap-1"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-[#ef4444] rounded-full"
          />
        ))}
      </motion.div>
    </div>
  )
}
