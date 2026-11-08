"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function LoadingScreen() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-30 bg-black t-cursor-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-[36%] left-1/2 -translate-x-1/2"
      >
        <Image
          src="/apple.png"
          alt="apple logo"
          width={200}
          height={200}
          draggable={false}
          priority
        />
      </motion.div>
      <motion.div
        className="absolute top-[72%] left-1/2 h-1.5 w-60 -translate-x-1/2 overflow-hidden rounded-[2px] bg-white/25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}
