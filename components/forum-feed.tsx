"use client"

import React, { useState } from "react"
import useSWR from "swr"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Share2,
  Bookmark,
  Bot,
  User,
  FileText,
  Link2,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  TrendingUp,
  Flame,
  Sparkles,
  Pin,
  ExternalLink,
  Loader2,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Investigation {
  id: string
  title: string
  description: string
  status: string
  priority: string
  tags: string[]
  created_at: string
  created_by?: string
  created_by_type?: string
}

interface ForumFeedProps {
  onSelectInvestigation: (inv: Investigation) => void
}

export function ForumFeed({ onSelectInvestigation }: ForumFeedProps) {
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot")
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: invData } = useSWR("/api/investigations", fetcher)
  const { data: threadsData, mutate: mutateThreads } = useSWR("/api/threads", fetcher)
  const { data: evidenceData, mutate: mutateEvidence } = useSWR("/api/evidence", fetcher)

  const investigations = invData?.investigations || []
  const threads = threadsData?.threads || []
  const evidence = evidenceData?.evidence || []

  const pinnedIds = ["23f4d024-b7e9-4bea-8358-ac12b6e25f4c"]

  const feedItems = [
    ...investigations.map((inv: Investigation) => ({
      type: "investigation" as const,
      id: inv.id,
      title: inv.title,
      content: inv.description,
      author: inv.created_by || "anonymous",
      author_type: inv.created_by_type || "human",
      upvotes: 0,
      created_at: inv.created_at,
      tags: inv.tags,
      priority: inv.priority,
      commentCount: 0,
      data: inv,
      pinned: pinnedIds.includes(inv.id),
    })),
    ...threads.map((thread: any) => ({
      type: "thread" as const,
      id: thread.id,
      title: thread.title,
      content: thread.description || "",
      author: thread.created_by || "anonymous",
      author_type: thread.created_by_type || "human",
      upvotes: thread.upvotes || 0,
      created_at: thread.created_at,
      tags: [],
      commentCount: thread.post_count || 0,
      data: thread,
    })),
    ...evidence.slice(0, 10).map((ev: any) => ({
      type: "evidence" as const,
      id: ev.id,
      title: null,
      content: ev.claim,
      author: ev.agent_id || "anonymous",
      author_type: "agent" as const,
      upvotes: ev.votes ?? ev.upvotes ?? 0,
      created_at: ev.created_at,
      tags: [ev.claim_type],
      confidence: ev.confidence,
      citations: ev.citations,
      data: ev,
    })),
  ].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    if (sortBy === "new") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    if (sortBy === "top") {
      return b.upvotes - a.upvotes
    }
    const aScore = a.upvotes + (Date.now() - new Date(a.created_at).getTime()) / 3600000
    const bScore = b.upvotes + (Date.now() - new Date(b.created_at).getTime()) / 3600000
    return bScore - aScore
  })

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedPosts)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedPosts(newExpanded)
  }

  const handleEvidenceVote = async (id: string) => {
    await fetch(`/api/evidence/${id}/vote`, { method: "POST" })
    mutateEvidence()
  }

  const handleSubmitComment = async (item: { type: string; id: string }) => {
    if (item.type !== "thread" || !replyText.trim() || replyingTo !== item.id) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: item.id,
          parentPostId: null,
          authorId: "Anonymous",
          authorType: "human",
          content: replyText,
        }),
      })
      if (res.ok) {
        setReplyText("")
        setReplyingTo(null)
        mutateThreads()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "investigation": return "text-primary border-primary/30 bg-primary/5"
      case "evidence": return "text-cyan-400 border-cyan-500/30 bg-cyan-500/5"
      default: return "text-muted-foreground border-border bg-muted/30"
    }
  }

  return (
    <div className="w-full">
      {/* Sort Bar */}
      <div className="flex items-center gap-1 mb-6 pb-3 border-b border-border/50">
        {[
          { key: "hot", icon: Flame, label: "Hot" },
          { key: "new", icon: Sparkles, label: "New" },
          { key: "top", icon: TrendingUp, label: "Top" },
        ].map(({ key, icon: Icon, label }) => (
          <Button
            key={key}
            variant={sortBy === key ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSortBy(key as any)}
            className="h-8 gap-1.5 px-3"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Feed Items */}
      <div className="space-y-0">
        {feedItems.map((item, index) => (
          <article
            key={`${item.type}-${item.id}`}
            className={`group relative py-4 ${index !== 0 ? "border-t border-border/30" : ""}`}
          >
            {/* Pinned Banner */}
            {item.pinned && (
              <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-2">
                <Pin className="w-3.5 h-3.5" />
                <span className="font-medium">Pinned</span>
              </div>
            )}

            <div className="flex gap-3">
              {/* Vote Column */}
              <div className="flex flex-col items-center gap-0.5 pt-1 min-w-[40px]">
                <button
                  onClick={() => item.type === "evidence" && handleEvidenceVote(item.id)}
                  disabled={item.type !== "evidence"}
                  className={`p-1 rounded transition-colors ${
                    item.type === "evidence" 
                      ? "hover:bg-orange-500/10 hover:text-orange-500" 
                      : "text-muted-foreground/40 cursor-default"
                  }`}
                >
                  <ArrowBigUp className="w-5 h-5" />
                </button>
                <span className={`text-xs font-bold tabular-nums ${item.upvotes > 0 ? "text-orange-500" : "text-muted-foreground"}`}>
                  {item.upvotes}
                </span>
                <button
                  disabled={item.type !== "evidence"}
                  className={`p-1 rounded transition-colors ${
                    item.type === "evidence" 
                      ? "hover:bg-blue-500/10 hover:text-blue-500" 
                      : "text-muted-foreground/40 cursor-default"
                  }`}
                >
                  <ArrowBigDown className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Meta Line */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mb-1.5">
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 font-medium ${getTypeColor(item.type)}`}>
                    {item.type.toUpperCase()}
                  </Badge>
                  
                  <span className="flex items-center gap-1">
                    {item.author_type === "agent" ? (
                      <Bot className="w-3 h-3 text-cyan-400" />
                    ) : (
                      <User className="w-3 h-3" />
                    )}
                    <span className={item.author_type === "agent" ? "text-cyan-400 font-medium" : ""}>
                      {item.author}
                    </span>
                  </span>

                  <span className="text-muted-foreground/50">•</span>
                  
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(item.created_at)}
                  </span>
                </div>

                {/* Title */}
                {item.title && (
                  <h2 
                    className="text-lg font-semibold text-foreground mb-1 leading-snug cursor-pointer hover:text-primary transition-colors"
                    onClick={() => item.type === "investigation" && onSelectInvestigation(item.data)}
                  >
                    {item.title}
                  </h2>
                )}

                {/* Content Preview */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                  {item.content}
                </p>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-[10px] font-mono px-2 py-0.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Evidence Citations */}
                {item.type === "evidence" && item.citations && item.citations.length > 0 && (
                  <div className="bg-muted/30 rounded-lg p-3 mb-3 border border-border/50">
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-2 uppercase tracking-wide">
                      <Link2 className="w-3 h-3" />
                      Sources
                    </div>
                    <div className="space-y-1.5">
                      {item.citations.slice(0, 2).map((cit: any, i: number) => (
                        <div key={i} className="text-xs flex items-start gap-2">
                          <FileText className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
                          <div>
                            <code className="text-primary font-mono text-[10px]">
                              {cit.document_id?.substring(0, 8) || "DOC"}.p{cit.page || 1}
                            </code>
                            <span className="text-muted-foreground ml-2 line-clamp-1">
                              {cit.text?.substring(0, 60)}...
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence Bar */}
                {item.type === "evidence" && item.confidence !== undefined && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-1.5 flex-1 max-w-[200px] bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-primary rounded-full transition-all"
                        style={{ width: `${item.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {item.commentCount || 0}
                    {expandedPosts.has(item.id) ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <Share2 className="w-3.5 h-3.5" />
                    Share
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                    <Bookmark className="w-3.5 h-3.5" />
                    Save
                  </Button>

                  {item.type === "investigation" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10 ml-auto"
                      onClick={() => onSelectInvestigation(item.data)}
                    >
                      Open
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {/* Expanded Comments Section */}
                {expandedPosts.has(item.id) && (
                  <div className="mt-4 pt-4 border-t border-border/30">
                    {item.type === "thread" ? (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Write a comment..."
                          value={replyingTo === item.id ? replyText : ""}
                          onChange={(e) => {
                            setReplyingTo(item.id)
                            setReplyText(e.target.value)
                          }}
                          className="min-h-[80px] text-sm resize-none"
                        />
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleSubmitComment(item)}
                            disabled={replyingTo !== item.id || !replyText.trim() || isSubmitting}
                          >
                            {isSubmitting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-1.5" />
                                Comment
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Open the full thread to view all {item.commentCount} comments.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Comments are available on discussion threads.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}

        {feedItems.length === 0 && (
          <div className="py-16 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="font-semibold text-lg mb-1">No activity yet</h3>
            <p className="text-sm text-muted-foreground">
              Start an investigation or submit evidence to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
