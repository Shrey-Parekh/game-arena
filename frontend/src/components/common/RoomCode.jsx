import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'

function RoomCode({ code }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="card text-center">
      <p className="text-xs sm:text-sm font-bold text-textLight mb-3">
        Room Code
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest text-primary bg-primary/10 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-2xl border-4 border-primary"
        >
          {code}
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className={`btn-outline py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base flex items-center gap-2 ${
            copied ? 'bg-success border-success text-white' : ''
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </motion.button>
      </div>
      <p className="text-xs text-textLight mt-3 sm:mt-4">
        Share this code with your friends!
      </p>
    </div>
  )
}

export default RoomCode
