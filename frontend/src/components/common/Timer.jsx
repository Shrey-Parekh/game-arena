import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

function Timer({ duration, onComplete, warning = 10 }) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    setTimeLeft(duration)
    setIsWarning(false)
  }, [duration])

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.()
      return
    }

    if (timeLeft <= warning) {
      setIsWarning(true)
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, warning, onComplete])

  const percentage = (timeLeft / duration) * 100
  const circumference = 2 * Math.PI * 45

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-border"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (percentage / 100) * circumference}
            className={isWarning ? 'text-red-500' : 'text-primary'}
            strokeLinecap="round"
            animate={isWarning ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ duration: 0.5, repeat: isWarning ? Infinity : 0 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl sm:text-3xl font-bold ${isWarning ? 'text-red-500' : 'text-text'}`}>
            {timeLeft}
          </span>
        </div>
      </div>
      {isWarning && (
        <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse font-bold">
          Time running out!
        </p>
      )}
    </div>
  )
}

export default Timer
