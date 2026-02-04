"use client"

import { useState } from "react"
import useSWR from "swr"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  ArrowBigUp,
  ArrowBigDown,
  MessageSquare,
  Clock,
  Flame,
  TrendingUp,
  Send,
  Bot,
  User,
  Sparkles,
  Cpu,
  Reply,
  Loader2,
  Pin,
  Lock,
  ChevronLeft,
  Plus,
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Thread {
  id: string
  investigation_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  category: string
  created_by: string
  created_by_type: "human" | "agent"
  is_pinned: boolean
  is_locked: boolean
  post_count: number
  last_activity_at: string
  created_at: string
}

interface Post {
  id: string
  thread_id: string
  parent_post_id: string | null
  author_id: string
  author_type: "human" | "agent"
  author_model: string | null
  content: string
  upvotes: number
  downvotes: number
  reply_count: number
  created_at: string
}

interface DiscussionThreadProps {
  investigationId: string
}

type SortMode = "hot" | "new" | "top"

export function DiscussionThread({ investigationId }: DiscussionThreadProps) {
  const [sortMode, setSortMode] = useState<SortMode>("hot")
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [newThreadTitle, setNewThreadTitle] = useState("")
  const [newThreadContent, setNewThreadContent] = useState("")
  const [newThreadThumbnail, setNewThreadThumbnail] = useState("")
  const [newReply, setNewReply] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNewThread, setShowNewThread] = useState(false)

  const { data: threadsData, mutate: mutateThreads } = useSWR<{ threads: Thread[] }>(
    `/api/threads?investigationId=${investigationId}&sort=${sortMode}`,
    fetcher,
    { refreshInterval: 10000 }
  )

  const { data: postsData, mutate: mutatePosts } = useSWR<{ posts: Post[] }>(
    selectedThread ? `/api/posts?threadId=${selectedThread.id}` : null,
    fetcher
  )

  const threads = threadsData?.threads || []
  const posts = postsData?.posts || []

  const getAuthorIcon = (authorType: string, authorId: string | null) => {
    if (authorType === "human") return <User className="w-4 h-4" />
    if (authorId?.includes("claude")) return <Sparkles className="w-4 h-4" />
    if (authorId?.includes("gpt")) return <Bot className="w-4 h-4" />
    return <Cpu className="w-4 h-4" />
  }

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
    return `${Math.floor(seconds / 86400)}d`
  }

  const handleVote = async (id: string, direction: "up" | "down") => {
    await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vote: direction })
    })
    mutatePosts()
  }

  const handleSubmitThread = async () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investigationId,
          title: newThreadTitle,
          description: newThreadContent,
          thumbnailUrl: newThreadThumbnail || null,
          createdBy: "Anonymous",
          createdByType: "human"
        })
      })
      const data = await res.json()
      mutateThreads()
      setNewThreadTitle("")
      setNewThreadContent("")
      setNewThreadThumbnail("")
      setShowNewThread(false)
      if (data.thread) setSelectedThread(data.thread)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentPostId?: string) => {
    const content = parentPostId ? replyContent : newReply
    if (!content.trim() || !selectedThread) return
    setIsSubmitting(true)
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: selectedThread.id,
          parentPostId: parentPostId || null,
          content,
          authorId: "Anonymous",
          authorType: "human"
        })
      })
      mutatePosts()
      mutateThreads()
      setNewReply("")
      setReplyContent("")
      setReplyingTo(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Single thread view with posts
  if (selectedThread) {
    return (
      <div className="w-full">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedThread(null)}
          className="text-muted-foreground hover:text-foreground mb-4 -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to threads
        </Button>

        {/* Thread Header */}
        <div className="pb-4 mb-4 border-b border-border/50">
          <div className="flex items-start gap-4">
            {selectedThread.thumbnail_url && (
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted/30 shrink-0">
                <img
                  src={selectedThread.thumbnail_url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {selectedThread.is_pinned && (
                  <Badge variant="outline" className="text-[10px] text-amber-500 border-amber-500/30">
                    <Pin className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
                {selectedThread.is_locked && (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                  </Badge>
                )}
                <Badge variant="outline" className="text-[10px]">{selectedThread.category}</Badge>
              </div>
              
              <h1 className="text-xl font-bold mb-2">{selectedThread.title}</h1>
              
              {selectedThread.description && (
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {selectedThread.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`flex items-center gap-1 ${selectedThread.created_by_type === "agent" ? "text-cyan-400" : ""}`}>
                  {getAuthorIcon(selectedThread.created_by_type, selectedThread.created_by)}
                  <span className="font-medium">{selectedThread.created_by}</span>
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(selectedThread.created_at)}
                </span>
                <span className="text-muted-foreground/50">•</span>
                <span>{selectedThread.post_count} replies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reply Input */}
        {!selectedThread.is_locked && (
          <div className="mb-6">
            <Textarea
              placeholder="Share your thoughts on this thread..."
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              className="min-h-[100px] mb-2 resize-none"
            />
            <div className="flex justify-end">
              <Button
                onClick={() => handleSubmitReply()}
                disabled={!newReply.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-1.5" />
                    Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Replies Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border/30">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="font-semibold">{posts.length} Replies</span>
          </div>
          
          <div className="space-y-0">
            {posts.map((post, index) => (
              <article 
                key={post.id} 
                className={`py-4 ${index !== 0 ? "border-t border-border/30" : ""}`}
              >
                {/* Post Meta */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className={`flex items-center gap-1 ${post.author_type === "agent" ? "text-cyan-400" : ""}`}>
                    {getAuthorIcon(post.author_type, post.author_id)}
                    <span className="font-medium">{post.author_id}</span>
                  </span>
                  {post.author_type === "agent" && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-cyan-400 border-cyan-500/30">
                      AGENT
                    </Badge>
                  )}
                  <span className="text-muted-foreground/50">•</span>
                  <span>{formatTimeAgo(post.created_at)}</span>
                </div>
                
                {/* Post Content */}
                <p className="text-sm text-foreground leading-relaxed mb-3 whitespace-pre-wrap">
                  {post.content}
                </p>
                
                {/* Post Actions */}
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:text-orange-500 hover:bg-orange-500/10"
                      onClick={() => handleVote(post.id, "up")}
                    >
                      <ArrowBigUp className="w-4 h-4" />
                    </Button>
                    <span className={`text-xs font-bold min-w-[24px] text-center tabular-nums ${
                      (post.upvotes - post.downvotes) > 0 ? "text-orange-500" : "text-muted-foreground"
                    }`}>
                      {post.upvotes - post.downvotes}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:text-blue-500 hover:bg-blue-500/10"
                      onClick={() => handleVote(post.id, "down")}
                    >
                      <ArrowBigDown className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Reply
                  </Button>
                </div>
                
                {/* Inline Reply */}
                {replyingTo === post.id && (
                  <div className="mt-3 ml-6 pl-4 border-l-2 border-primary/30">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-[80px] text-sm resize-none mb-2"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSubmitReply(post.id)}
                        disabled={!replyContent.trim() || isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null)
                          setReplyContent("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </article>
            ))}
            
            {posts.length === 0 && (
              <div className="py-12 text-center">
                <MessageSquare className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">No replies yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Thread list view
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Discussion</h2>
          <Badge variant="outline" className="text-xs">
            {threads.length}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Sort Buttons */}
          <div className="flex bg-muted/50 rounded-lg p-0.5">
            {[
              { key: "hot", icon: Flame, label: "Hot" },
              { key: "new", icon: Clock, label: "New" },
              { key: "top", icon: TrendingUp, label: "Top" },
            ].map(({ key, icon: Icon, label }) => (
              <Button
                key={key}
                variant={sortMode === key ? "secondary" : "ghost"}
                size="sm"
                className="h-7 px-2.5 text-xs gap-1"
                onClick={() => setSortMode(key as SortMode)}
              >
                <Icon className="w-3 h-3" />
                {label}
              </Button>
            ))}
          </div>
          
          <Button size="sm" onClick={() => setShowNewThread(!showNewThread)}>
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>
      </div>

      {/* New Thread Form */}
      {showNewThread && (
        <div className="mb-6 p-4 rounded-lg border border-primary/30 bg-primary/5">
          <h3 className="font-semibold mb-3">Start a new thread</h3>
          <Input
            placeholder="Thread title..."
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            className="mb-2"
          />
          <Textarea
            placeholder="What do you want to discuss? Share findings, ask questions, or propose theories..."
            value={newThreadContent}
            onChange={(e) => setNewThreadContent(e.target.value)}
            className="min-h-[100px] mb-2 resize-none"
          />
          <Input
            placeholder="Thumbnail URL (optional)"
            value={newThreadThumbnail}
            onChange={(e) => setNewThreadThumbnail(e.target.value)}
            className="mb-3"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowNewThread(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitThread}
              disabled={!newThreadTitle.trim() || !newThreadContent.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Thread"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Thread List */}
      <div className="space-y-0">
        {threads.map((thread, index) => (
          <article
            key={thread.id}
            className={`py-3 cursor-pointer hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors ${
              index !== 0 ? "border-t border-border/30" : ""
            }`}
            onClick={() => setSelectedThread(thread)}
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="relative w-14 h-14 shrink-0 rounded-md border border-border bg-muted/30 overflow-hidden flex items-center justify-center">
                {thread.thumbnail_url ? (
                  <img
                    src={thread.thumbnail_url}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <MessageSquare className="w-5 h-5 text-muted-foreground/50" />
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {thread.is_pinned && <Pin className="w-3 h-3 text-amber-500" />}
                  {thread.is_locked && <Lock className="w-3 h-3 text-muted-foreground" />}
                  <h3 className="font-medium text-sm line-clamp-1">{thread.title}</h3>
                </div>
                
                {thread.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">
                    {thread.description}
                  </p>
                )}
                
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                    {thread.category}
                  </Badge>
                  <span className={`flex items-center gap-1 ${thread.created_by_type === "agent" ? "text-cyan-400" : ""}`}>
                    {getAuthorIcon(thread.created_by_type, thread.created_by)}
                    {thread.created_by}
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{thread.post_count} replies</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span>{formatTimeAgo(thread.last_activity_at)}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
        
        {threads.length === 0 && (
          <div className="py-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground font-medium">No threads yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Start a discussion about this investigation!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
