"use client"

import { useState } from "react"
import type { Alert } from "@/types/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

interface AlertSystemProps {
  alerts: Alert[]
}

export default function AlertSystem({ alerts }: AlertSystemProps) {
  const [activeTab, setActiveTab] = useState("all")

  // Filter alerts based on active tab
  const filteredAlerts = activeTab === "all" ? alerts : alerts.filter((alert) => alert.category === activeTab)

  // Get counts for each category
  const counts = {
    all: alerts.length,
    intruder: alerts.filter((a) => a.category === "intruder").length,
    feed: alerts.filter((a) => a.category === "feed").length,
    animal: alerts.filter((a) => a.category === "animal").length,
  }

  return (
    <div className="h-80 w-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Judah Alerts</h2>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all" className="relative">
              All
              {counts.all > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {counts.all}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="intruder" className="relative">
              Intruder
              {counts.intruder > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                  {counts.intruder}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="feed" className="relative">
              Feed
              {counts.feed > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-warning text-[10px] text-warning-foreground">
                  {counts.feed}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="animal" className="relative">
              Animal
              {counts.animal > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-info text-[10px] text-info-foreground">
                  {counts.animal}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="m-0">
          <AlertList alerts={filteredAlerts} />
        </TabsContent>
        <TabsContent value="intruder" className="m-0">
          <AlertList alerts={filteredAlerts} />
        </TabsContent>
        <TabsContent value="feed" className="m-0">
          <AlertList alerts={filteredAlerts} />
        </TabsContent>
        <TabsContent value="animal" className="m-0">
          <AlertList alerts={filteredAlerts} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AlertList({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Info className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No alerts to display</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(80vh-140px)]">
      <div className="p-4 space-y-3">
        {alerts.map((alert, i) => (
          <div
            key={`${alert.id + i}`}
            className={`p-3 rounded-md border ${
              alert.type === "danger"
                ? "bg-destructive/10 border-destructive/20"
                : alert.type === "warning"
                  ? "bg-warning/10 border-warning/20"
                  : "bg-card border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {alert.type === "danger" ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : alert.type === "warning" ? (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                ) : (
                  <Info className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-xs font-medium">Camera: {alert.cameraId}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

