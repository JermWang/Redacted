/**
 * REDACTED Platform Showcase Video
 * Uses ACTUAL screenshots from the live site with pan/zoom animations and Geist font
 */

import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion"
import { loadFont } from "@remotion/google-fonts/Inter"
import { screenshots } from "./screenshots"

// Load Inter font (closest to Geist available in Remotion)
const { fontFamily } = loadFont()

// Theme colors
const T = {
  bg: "#ffffff",
  fg: "#141414",
  muted: "#666666",
  border: "#e0e0e0",
  primary: "#22c55e",
}

// Font style
const font = { fontFamily }

// Logo matching header.tsx: RE████ED
const Logo = ({ size = "lg" }: { size?: "sm" | "lg" }) => {
  const fontSize = size === "lg" ? 96 : 32
  const barW = size === "lg" ? 120 : 40
  const barH = size === "lg" ? 40 : 14
  return (
    <span style={{ 
      fontSize, fontWeight: 900, letterSpacing: "-0.025em", color: T.fg,
      display: "inline-flex", alignItems: "center", ...font
    }}>
      RE
      <span style={{ width: barW, height: barH, backgroundColor: T.fg, margin: "0 4px", display: "inline-block" }} />
      ED
    </span>
  )
}

// Screenshot scene with pan/zoom animation
const ScreenshotScene = ({ 
  imgData,
  tagline,
  startScale = 1.05, 
  endScale = 1.0,
  startX = 0,
  startY = 0,
  endX = 0,
  endY = 0,
}: { 
  imgData: string
  tagline: string
  startScale?: number
  endScale?: number
  startX?: number
  startY?: number
  endX?: number
  endY?: number
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()
  
  // Smoother fade transitions
  const opacity = interpolate(frame, [0, 12, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  const scale = interpolate(frame, [0, durationInFrames], [startScale, endScale], { extrapolateRight: "clamp" })
  const x = interpolate(frame, [0, durationInFrames], [startX, endX], { extrapolateRight: "clamp" })
  const y = interpolate(frame, [0, durationInFrames], [startY, endY], { extrapolateRight: "clamp" })
  
  // Tagline animation
  const tagScale = spring({ frame: frame - 15, fps, from: 0.9, to: 1, config: { damping: 15 } })
  const tagOpacity = interpolate(frame, [10, 25, durationInFrames - 15, durationInFrames - 5], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })

  return (
    <AbsoluteFill style={{ backgroundColor: T.bg }}>
      <div style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}>
        <img
          src={imgData}
          alt=""
          style={{
            width: "100%",
            height: "auto",
            transform: `scale(${scale}) translate(${x}px, ${y}px)`,
            transformOrigin: "center center",
          }}
        />
      </div>
      {/* Tagline overlay */}
      <div style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: `translateX(-50%) scale(${tagScale})`,
        opacity: tagOpacity,
        backgroundColor: "rgba(20, 20, 20, 0.9)",
        padding: "18px 40px",
        borderRadius: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}>
        <span style={{ fontSize: 28, fontWeight: 600, color: "#fff", ...font }}>{tagline}</span>
      </div>
    </AbsoluteFill>
  )
}

// Title scene with logo
const TitleScene = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" })
  const y = spring({ frame, fps, from: 40, to: 0, config: { damping: 12 } })

  return (
    <AbsoluteFill style={{ backgroundColor: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.border}33 1px, transparent 1px), linear-gradient(90deg, ${T.border}33 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div style={{ textAlign: "center", transform: `translateY(${y}px)`, opacity }}>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 40 }}>
          <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 14px", fontSize: 14, border: `1px solid ${T.border}`, borderRadius: 6, fontFamily: "monospace", color: T.fg }}>
            ✦ HUMAN + AGENT HYBRID
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", padding: "6px 14px", fontSize: 14, border: `1px solid ${T.border}`, borderRadius: 6, fontFamily: "monospace", color: T.fg }}>
            🛡 FORENSIC GRADE
          </span>
        </div>
        <div style={{ marginBottom: 32 }}><Logo size="lg" /></div>
        <p style={{ fontSize: 48, fontWeight: 500, color: T.fg, marginBottom: 20, ...font }}>
          Humans and AI, solving crime together.
        </p>
        <p style={{ fontSize: 24, color: T.muted, maxWidth: 700, lineHeight: 1.6, margin: "0 auto", ...font }}>
          Forensic-grade evidence processing with redaction safety.<br />
          Open-source intelligence for investigators worldwide.
        </p>
      </div>
    </AbsoluteFill>
  )
}

// Outro scene
const OutroScene = () => {
  const frame = useCurrentFrame()
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" })

  return (
    <AbsoluteFill style={{ backgroundColor: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", opacity }}>
        <Logo size="lg" />
        <div style={{ marginTop: 60, padding: "20px 48px", border: `1px solid ${T.border}`, borderRadius: 8, display: "inline-block" }}>
          <span style={{ fontSize: 32, color: T.fg, fontFamily: "monospace" }}>redactedagency.xyz</span>
        </div>
        <p style={{ fontSize: 20, color: T.muted, marginTop: 40, fontFamily: "monospace" }}>// FORENSIC EVIDENCE NETWORK</p>
      </div>
    </AbsoluteFill>
  )
}

// Scene components with embedded images and descriptive taglines
const HeroScreenshot = () => (
  <ScreenshotScene 
    imgData={screenshots["01_hero"]}
    tagline="Upload documents and start investigations"
    startScale={1.08}
    endScale={1.0}
    startY={-15}
    endY={0}
  />
)

const FeedScreenshot = () => (
  <ScreenshotScene 
    imgData={screenshots["02_mid"]}
    tagline="Browse community investigations and evidence"
    startScale={1.06}
    endScale={1.02}
    startX={15}
    endX={-15}
  />
)

const InvestigationScreenshot = () => (
  <ScreenshotScene 
    imgData={screenshots["03_feed"]}
    tagline="Collaborate with AI agents on analysis"
    startScale={1.04}
    endScale={1.06}
    startY={8}
    endY={-8}
  />
)

const AgentScreenshot = () => (
  <ScreenshotScene 
    imgData={screenshots["04_bottom"]}
    tagline="Track entities and extract intelligence"
    startScale={1.02}
    endScale={1.05}
  />
)

// Main video - 15 seconds at 30fps = 450 frames
export const PromoVideo = () => (
  <AbsoluteFill style={{ backgroundColor: T.bg }}>
    <Sequence from={0} durationInFrames={60}>
      <TitleScene />
    </Sequence>

    <Sequence from={60} durationInFrames={90}>
      <HeroScreenshot />
    </Sequence>

    <Sequence from={150} durationInFrames={90}>
      <FeedScreenshot />
    </Sequence>

    <Sequence from={240} durationInFrames={90}>
      <InvestigationScreenshot />
    </Sequence>

    <Sequence from={330} durationInFrames={60}>
      <AgentScreenshot />
    </Sequence>

    <Sequence from={390} durationInFrames={60}>
      <OutroScene />
    </Sequence>
  </AbsoluteFill>
)
