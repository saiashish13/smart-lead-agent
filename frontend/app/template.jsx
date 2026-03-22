"use client"

import { motion } from "framer-motion"

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ 
        type: "spring",
        stiffness: 260,
        damping: 20,
        mass: 0.5,
      }}
      className="min-h-screen w-full"
    >
      {children}
    </motion.div>
  )
}
