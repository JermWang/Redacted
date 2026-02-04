"use client"

import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface HeroSectionProps {
  onGetStarted?: () => void
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div style={{ backgroundColor: '#222', borderBottom: '1px solid #333', padding: '60px 20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
        RE████ED
      </h1>
      <p style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>
        Forensic-grade evidence processing with redaction safety.
      </p>
      {onGetStarted && (
        <Button size="lg" onClick={onGetStarted}>
          <FileText className="w-4 h-4 mr-2" />
          Start Investigation
        </Button>
      )}
    </div>
  )
}
