import { useState } from 'react'

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
      <p className="text-sm text-text/70 mb-2">Room Code</p>
      <div className="flex items-center justify-center gap-4">
        <div className="font-mono text-4xl font-bold tracking-widest text-primary">
          {code}
        </div>
        <button
          onClick={handleCopy}
          className="btn-outline py-2 px-4 text-sm"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <p className="text-xs text-text/50 mt-2">
        Share this code with your friends to join
      </p>
    </div>
  )
}

export default RoomCode
