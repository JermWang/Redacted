/**
 * REDACTED Platform Showcase Video
 * 
 * This video uses ONLY authentic elements from the Redacted codebase:
 * - Colors from globals.css (dark theme)
 * - Logo pattern from header.tsx (RE████ED)
 * - Tagline from hero-section.tsx
 * - Features from hero-section.tsx
 * - Real badges from hero-section.tsx
 * - Font: Geist (as defined in theme)
 * 
 * NO fabricated data, NO placeholder content, NO invented UI.
 */

import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
  Img,
  staticFile,
} from "remotion"

// Authentic colors from globals.css dark theme
const THEME = {
  background: "#141414", // oklch(0.08 0 0) approximation
  foreground: "#f2f2f2", // oklch(0.95 0 0) approximation
  muted: "#999999", // oklch(0.60 0 0) approximation
  border: "#404040", // oklch(0.25 0 0) approximation
  card: "#1f1f1f", // oklch(0.12 0 0) approximation
}

// Real logo component matching header.tsx exactly
const Logo: React.FC<{ size?: "sm" | "lg" }> = ({ size = "lg" }) => {
  const fontSize = size === "lg" ? 140 : 48
  const barWidth = size === "lg" ? 160 : 56
  const barHeight = size === "lg" ? 56 : 20

  return (
    <span
      style={{
        fontSize,
        fontWeight: 900,
        letterSpacing: "-0.02em",
        color: THEME.foreground,
        display: "flex",
        alignItems: "center",
      }}
    >
      RE
      <span
        style={{
          display: "inline-block",
          width: barWidth,
          height: barHeight,
          backgroundColor: THEME.foreground,
          margin: "0 4px",
        }}
      />
      ED
    </span>
  )
}

// Real badge component matching hero-section.tsx
const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 16px",
      fontSize: 14,
      fontFamily: "monospace",
      border: `1px solid ${THEME.border}`,
      borderRadius: 6,
      color: THEME.foreground,
      backgroundColor: "transparent",
    }}
  >
    {children}
  </span>
)

// Scene 1: Title - Authentic hero section content
const TitleScene: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" })
  const y = spring({ frame, fps, from: 40, to: 0, config: { damping: 12 } })
  const taglineOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  const badgeOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.background, justifyContent: "center", alignItems: "center" }}>
      {/* Subtle grid - matches ascii-shader map mode aesthetic */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(${THEME.border}22 1px, transparent 1px),
            linear-gradient(90deg, ${THEME.border}22 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div style={{ textAlign: "center", transform: `translateY(${y}px)`, opacity }}>
        {/* Badges - exact text from hero-section.tsx */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40, opacity: badgeOpacity }}>
          <Badge>✦ HUMAN + AGENT HYBRID</Badge>
          <Badge>🛡 FORENSIC GRADE</Badge>
        </div>

        {/* Logo - exact pattern from header.tsx */}
        <div style={{ marginBottom: 32 }}>
          <Logo size="lg" />
        </div>

        {/* Tagline - exact text from hero-section.tsx line 109 */}
        <p style={{ fontSize: 48, fontWeight: 500, color: THEME.foreground, opacity: taglineOpacity, marginBottom: 20 }}>
          Humans and AI, solving crime together.
        </p>

        {/* Subtitle - exact text from hero-section.tsx lines 113-114 */}
        <p style={{ fontSize: 24, color: THEME.muted, opacity: taglineOpacity, maxWidth: 700, lineHeight: 1.6 }}>
          Forensic-grade evidence processing with redaction safety.
          <br />
          Open-source intelligence for investigators worldwide.
        </p>
      </div>
    </AbsoluteFill>
  )
}

// Scene 2-5: Features - exact text from hero-section.tsx features array (lines 45-69)
const FeatureScene: React.FC<{ 
  iconSymbol: string
  title: string 
  description: string 
}> = ({ iconSymbol, title, description }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({ frame, fps, from: 0.95, to: 1, config: { damping: 15 } })
  const opacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" })

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.background, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", top: 60, left: 80 }}>
        <Logo size="sm" />
      </div>

      <div style={{ transform: `scale(${scale})`, opacity, textAlign: "center", padding: 80, maxWidth: 1000 }}>
        <div style={{ fontSize: 80, marginBottom: 32 }}>{iconSymbol}</div>
        <h2 style={{ fontSize: 64, fontWeight: 700, color: THEME.foreground, marginBottom: 24 }}>
          {title}
        </h2>
        <p style={{ fontSize: 28, color: THEME.muted, lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </AbsoluteFill>
  )
}

// Scene 6: Outro - Static end screen with real URL
const OutroScene: React.FC = () => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" })

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.background, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", opacity }}>
        <Logo size="lg" />
        
        <div style={{ marginTop: 60, padding: "20px 48px", border: `1px solid ${THEME.border}`, borderRadius: 8, display: "inline-block" }}>
          <span style={{ fontSize: 32, color: THEME.foreground, fontFamily: "monospace" }}>
            redactedagency.xyz
          </span>
        </div>

        <p style={{ fontSize: 20, color: THEME.muted, marginTop: 40, fontFamily: "monospace" }}>
          // FORENSIC EVIDENCE NETWORK
        </p>
      </div>
    </AbsoluteFill>
  )
}

export const PromoVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.background }}>
      {/* Scene 1: Title (0-5s) */}
      <Sequence from={0} durationInFrames={150}>
        <TitleScene />
      </Sequence>

      {/* Scene 2: Feature - Redaction Safe (5-10s) - from hero-section.tsx line 46-50 */}
      <Sequence from={150} durationInFrames={150}>
        <FeatureScene
          iconSymbol="�"
          title="Redaction Safe"
          description="HARD RULES enforced by validation layer. Never identify or infer redacted individuals."
        />
      </Sequence>

      {/* Scene 3: Feature - Chunk Citations (10-15s) - from hero-section.tsx line 51-55 */}
      <Sequence from={300} durationInFrames={150}>
        <FeatureScene
          iconSymbol="📄"
          title="Chunk Citations"
          description="Every claim traced to source text. DOC_ID.PAGE.START-END format for verification."
        />
      </Sequence>

      {/* Scene 4: Feature - Multi-Agent (15-20s) - from hero-section.tsx line 56-60 */}
      <Sequence from={450} durationInFrames={150}>
        <FeatureScene
          iconSymbol="🤖"
          title="Multi-Agent"
          description="Claude, GPT-4, Gemini cooperation. Bring your own API keys. No gatekeeping."
        />
      </Sequence>

      {/* Scene 5: Feature - Audit Grade (20-25s) - from hero-section.tsx line 61-65 */}
      <Sequence from={600} durationInFrames={150}>
        <FeatureScene
          iconSymbol="�"
          title="Audit Grade"
          description="Independently verifiable output. Content hashing and forensic chain of custody."
        />
      </Sequence>

      {/* Scene 6: Outro (25-30s) */}
      <Sequence from={750} durationInFrames={150}>
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  )
}
