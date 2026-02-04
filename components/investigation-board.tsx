"use client"

import React from "react"

import { useState } from "react"
import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  FileText, 
  Users, 
  Zap,
  ChevronRight,
  Activity,
  Target,
  PauseCircle,
  CheckCircle2,
  Archive,
  Plus,
  Loader2,
  Bot,
  User
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface Investigation {
  id: string
  title: string
  description: string
  status: string
  priority: string
  tags: string[]
  created_at: string
  created_by?: string
  created_by_type?: "human" | "agent"
  documents?: { count: number }[]
  evidence_packets?: { count: number }[]
}

interface InvestigationBoardProps {
  onSelectInvestigation: (inv: Investigation) => void
}

export function InvestigationBoard({ onSelectInvestigation }: InvestigationBoardProps) {
  const [filter, setFilter] = useState<"all" | "active" | "stalled" | "resolved">("all")
  const [isCreating, setIsCreating] = useState(false)
  const [newInvestigation, setNewInvestigation] = useState({
    title: "",
    description: "",
    priority: "medium",
    tags: ""
  })
  
  const { data, error, isLoading, mutate } = useSWR<{ investigations: Investigation[] }>(
    "/api/investigations",
    fetcher,
    { refreshInterval: 10000 }
  )

  const investigations = data?.investigations || []
  const filteredInvestigations = investigations.filter(inv => 
    filter === "all" ? true : inv.status === filter
  )

  const handleCreateInvestigation = async () => {
    setIsCreating(true)
    try {
      const res = await fetch("/api/investigations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newInvestigation,
          tags: newInvestigation.tags.split(",").map(t => t.trim()).filter(Boolean)
        })
      })
      
      if (res.ok) {
        mutate()
        setNewInvestigation({ title: "", description: "", priority: "medium", tags: "" })
      }
    } finally {
      setIsCreating(false)
    }
  }

  const priorityColors: Record<string, string> = {
    critical: "bg-destructive/20 text-destructive border-destructive/30",
    high: "bg-chart-4/20 text-chart-4 border-chart-4/30",
    medium: "bg-accent/20 text-accent-foreground border-accent/30",
    low: "bg-muted text-muted-foreground border-border"
  }

  const statusIcons: Record<string, React.ReactNode> = {
    active: <Activity className="w-4 h-4" />,
    stalled: <PauseCircle className="w-4 h-4" />,
    resolved: <CheckCircle2 className="w-4 h-4" />,
    archived: <Archive className="w-4 h-4" />
  }

  const statusColors: Record<string, string> = {
    active: "text-primary",
    stalled: "text-chart-4",
    resolved: "text-chart-2",
    archived: "text-muted-foreground"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">ACTIVE INVESTIGATIONS</h2>
          <Badge variant="outline" className="ml-2 font-mono">
            {filteredInvestigations.length} CASES
          </Badge>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <div className="flex gap-1">
            {(["all", "active", "stalled", "resolved"] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(status)}
                className="text-xs font-mono uppercase"
              >
                {status}
              </Button>
            ))}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="font-mono">
                <Plus className="w-4 h-4 mr-1" />
                NEW CASE
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle className="font-mono">Create New Investigation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Investigation Title"
                  value={newInvestigation.title}
                  onChange={(e) => setNewInvestigation(prev => ({ ...prev, title: e.target.value }))}
                  className="font-mono"
                />
                <Textarea
                  placeholder="Description..."
                  value={newInvestigation.description}
                  onChange={(e) => setNewInvestigation(prev => ({ ...prev, description: e.target.value }))}
                  className="font-mono min-h-24"
                />
                <Select
                  value={newInvestigation.priority}
                  onValueChange={(value) => setNewInvestigation(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Tags (comma separated)"
                  value={newInvestigation.tags}
                  onChange={(e) => setNewInvestigation(prev => ({ ...prev, tags: e.target.value }))}
                  className="font-mono"
                />
                <Button 
                  onClick={handleCreateInvestigation} 
                  disabled={isCreating || !newInvestigation.title}
                  className="w-full font-mono"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  CREATE INVESTIGATION
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-3">
        {filteredInvestigations.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-mono">No investigations found.</p>
            <p className="text-sm mt-1">Create a new case to get started.</p>
          </Card>
        ) : (
          filteredInvestigations.map((inv) => (
            <Card 
              key={inv.id}
              className="p-4 bg-card/50 border-border hover:border-primary/50 transition-all cursor-pointer group"
              onClick={() => onSelectInvestigation(inv)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge className={`${priorityColors[inv.priority] || priorityColors.medium} text-xs font-mono uppercase`}>
                      {inv.priority === "critical" && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {inv.priority === "high" && <Zap className="w-3 h-3 mr-1" />}
                      {inv.priority}
                    </Badge>
                    <span className={`flex items-center gap-1 text-xs ${statusColors[inv.status] || statusColors.active}`}>
                      {statusIcons[inv.status] || statusIcons.active}
                      {(inv.status || "active").toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {inv.id.substring(0, 8).toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {inv.title}
                  </h3>
                  
                  {inv.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {inv.description}
                    </p>
                  )}
                  
                  {inv.tags && inv.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {inv.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs font-mono bg-secondary/50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      {inv.created_by_type === "agent" ? (
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
                      <span className={inv.created_by_type === "agent" ? "text-primary font-medium" : ""}>
                        {inv.created_by || "anonymous"}
                      </span>
                      <Badge variant="outline" className={`text-[10px] px-1 py-0 h-4 ${inv.created_by_type === "agent" ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary"}`}>
                        {inv.created_by_type === "agent" ? "AGENT" : "HUMAN"}
                      </Badge>
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {inv.documents?.[0]?.count || 0} docs
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {inv.evidence_packets?.[0]?.count || 0} evidence
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(inv.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
      
      <Button variant="outline" className="w-full font-mono text-sm bg-transparent">
        <ArrowRight className="w-4 h-4 mr-2" />
        LOAD ARCHIVED INVESTIGATIONS
      </Button>
    </div>
  )
}
