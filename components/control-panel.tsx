"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { BarChart3, Eye, RotateCw, Save, Shield } from "lucide-react"

interface ControlPanelProps {
  type: "intruder" | "feed" | "animal"
  enabled: boolean
  onToggle: () => void
}

export default function ControlPanel({ type, enabled, onToggle }: ControlPanelProps) {
  const [sensitivity, setSensitivity] = useState(75)
  const [alertThreshold, setAlertThreshold] = useState(50)
  const [autoResponse, setAutoResponse] = useState(false)

  // Get panel-specific content based on type
  const getPanelContent = () => {
    switch (type) {
      case "intruder":
        return {
          title: "Intruder Alert Settings",
          description: "Configure detection sensitivity and automated responses for unauthorized entities",
          icon: <Shield className="h-5 w-5 text-destructive" />,
          color: "destructive",
          metrics: [
            { label: "Detection Accuracy", value: "92%" },
            { label: "False Alarms", value: "3%" },
            { label: "Response Time", value: "2.4s" },
          ],
          controls: [
            {
              label: "Siren Alert",
              description: "Trigger audible alarm when intruder detected",
              control: <Switch checked={autoResponse} onCheckedChange={setAutoResponse} />,
            },
            {
              label: "Notification Delay",
              description: "Seconds before sending alert notification",
              control: <Slider defaultValue={[0]} max={10} step={1} className="w-[120px]" />,
            },
          ],
        }
      case "feed":
        return {
          title: "Feed Estimation Settings",
          description: "Configure feed level detection and refill notifications",
          icon: <BarChart3 className="h-5 w-5 text-warning" />,
          color: "warning",
          metrics: [
            { label: "Estimation Accuracy", value: "89%" },
            { label: "Low Feed Alerts", value: "12/day" },
            { label: "Avg. Feed Level", value: "64%" },
          ],
          controls: [
            {
              label: "Auto Refill Request",
              description: "Automatically request feed refill when low",
              control: <Switch checked={autoResponse} onCheckedChange={setAutoResponse} />,
            },
            {
              label: "Low Feed Threshold",
              description: "Alert when feed level falls below",
              control: <Slider defaultValue={[30]} max={50} step={5} className="w-[120px]" />,
            },
          ],
        }
      case "animal":
        return {
          title: "Animal Monitoring Settings",
          description: "Configure animal counting and behavior analysis",
          icon: <Eye className="h-5 w-5 text-primary" />,
          color: "primary",
          metrics: [
            { label: "Counting Accuracy", value: "95%" },
            { label: "Behavior Alerts", value: "5/day" },
            { label: "Animals Tracked", value: "12" },
          ],
          controls: [
            {
              label: "Movement Tracking",
              description: "Track and analyze animal movement patterns",
              control: <Switch checked={autoResponse} onCheckedChange={setAutoResponse} />,
            },
            {
              label: "Count Verification",
              description: "Minutes between animal count verification",
              control: <Slider defaultValue={[15]} max={60} step={5} className="w-[120px]" />,
            },
          ],
        }
    }
  }

  const content = getPanelContent()

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {content.icon}
          <div>
            <h3 className="text-lg font-medium">{content.title}</h3>
            <p className="text-sm text-muted-foreground">{content.description}</p>
          </div>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} aria-label={`Toggle ${type} detection`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {content.metrics.map((metric, index) => (
          <div key={index} className={`p-4 rounded-lg border bg-card/50`}>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{metric.label}</span>
              <span className="text-2xl font-bold">{metric.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Detection Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="sensitivity" className="text-sm">
                Sensitivity
              </label>
              <p className="text-xs text-muted-foreground">Adjust detection sensitivity</p>
            </div>
            <Slider
              id="sensitivity"
              value={[sensitivity]}
              onValueChange={(value) => setSensitivity(value[0])}
              max={100}
              step={5}
              className="w-[120px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="threshold" className="text-sm">
                Alert Threshold
              </label>
              <p className="text-xs text-muted-foreground">Minimum confidence to trigger alert</p>
            </div>
            <Slider
              id="threshold"
              value={[alertThreshold]}
              onValueChange={(value) => setAlertThreshold(value[0])}
              max={100}
              step={5}
              className="w-[120px]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Automation Controls</h4>
        <div className="space-y-3">
          {content.controls.map((control, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-sm">{control.label}</p>
                <p className="text-xs text-muted-foreground">{control.description}</p>
              </div>
              {control.control}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" size="sm">
          <RotateCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}

