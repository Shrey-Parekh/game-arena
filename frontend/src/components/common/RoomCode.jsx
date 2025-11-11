import { useState } from 'react'
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
      <p className="text-sm font-medium text-slate-600 mb-4">
        Room Code
      </p>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="font-mono text-4xl sm:text-5xl font-semibold tracking-wider text-primary-600 bg-primary-50 px-6 py-4 rounded-xl border border-primary-200">
          {code}
        </div>
        <button
          onClick={handleCopy}
          className={`btn-outline flex items-center gap-2 ${
            copied ? 'bg-success border-success text-white' : ''
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-slate-400 mt-4">
        Share this code with your friends
      </p>
    </div>
  )
}

export default RoomCode
