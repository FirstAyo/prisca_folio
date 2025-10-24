import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function EmailCopy({ email }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <button
      onClick={copy}
      className="btn border-[hsl(var(--border))] dark:border-neutral-700 hover:bg-neutral-50 hover:text-black dark:hover:bg-neutral-800"
      aria-live="polite"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      <span>{copied ? 'Copied!' : 'Copy my email'}</span>
    </button>
  )
}