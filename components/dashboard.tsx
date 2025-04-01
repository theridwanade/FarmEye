"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, Camera, Cog, Gauge, PanelLeft, PanelRight, Volume2, VolumeX } from "lucide-react"
import CameraFeed from "./camera-feed"
import CameraSelector from "./camera-selector"
import AlertSystem from "./alert-system"
import ControlPanel from "./control-panel"
import type { Alert } from "@/types/alert"
import type { Camera as CameraType } from "@/types/camera"
import { useToast } from "@/hooks/use-toast"
import { Howl } from "howler"

export default function Dashboard() {
  const [cameras, setCameras] = useState<CameraType[]>([])

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showSidebar, setShowSidebar] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [detectionEnabled, setDetectionEnabled] = useState(true)
  const { toast } = useToast()
  const alertAudioRef = useRef<HTMLAudioElement | null>(null)

  // Toggle camera active state
  const toggleCamera = (id: string) => {
    setCameras(cameras.map((camera) => (camera.id === id ? { ...camera, active: !camera.active } : camera)))
  }

  // Add a new alert

  const alertSound = new Howl({
    src: ["/sounds/alert.mp3"],
    volume: 1.0,
  })
  
  const addAlert = (alert: Alert) => {
    setAlerts((prev) => [alert, ...prev].slice(0, 50))
  
    toast({
      title: alert.title,
      description: alert.message,
      variant: alert.type === "danger" ? "destructive" : "default",
    })
  
    if (soundEnabled) {
      alertSound.play()
    }
  }
  

  // Get available cameras
  useEffect(() => {
    async function listCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
  
        // Filter only video input devices (cameras)
        const newCameras = devices
          .filter(device => device.kind === "videoinput")
          .map(device => ({
            id: device.deviceId,
            name: `${device.label}`,
            active: true,
            type: "webcam" as const,
          }));
  
        // Avoid duplicates by ensuring unique IDs
        setCameras(prevCameras => {
          const existingIds = new Set(prevCameras.map(c => c.id));
          const filteredNewCameras = newCameras.filter(c => !existingIds.has(c.id));
          return [...prevCameras, ...filteredNewCameras];
        });
  
      } catch (error) {
        console.error("Error listing cameras:", error);
      }
    }
  
    listCameras();
  }, []);
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Audio element for alerts */}
      <audio ref={alertAudioRef} src="/alert-sound.mp3" />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              aria-label={showSidebar ? "Hide sidebar" : "Show sidebar"}
            >
              {showSidebar ? <PanelLeft /> : <PanelRight />}
            </Button>
            <h1 className="text-xl font-bold">FarmEye Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              aria-label={soundEnabled ? "Mute alerts" : "Enable alert sounds"}
            >
              {soundEnabled ? <Volume2 /> : <VolumeX />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDetectionEnabled(!detectionEnabled)}
              aria-label={detectionEnabled ? "Disable detection" : "Enable detection"}
            >
              {detectionEnabled ? <Bell /> : <BellOff />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Cog />
            </Button>
          </div>
        </header>

        {/* Main dashboard area */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {cameras
              .filter((camera) => camera.active)
              .map((camera) => (
                <CameraFeed key={camera.id} camera={camera} detectionEnabled={detectionEnabled} onAlert={addAlert} />
              ))}

            {cameras.filter((camera) => camera.active).length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg">
                <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No active cameras</h3>
                <p className="text-muted-foreground text-center mt-2">
                  Select a camera from the sidebar to begin monitoring
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-full lg:col-span-2">
            <AlertSystem alerts={alerts} />
            </Card>

            <Card className="col-span-full lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>System Status</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Active Cameras:</span>
                    <span className="font-medium">
                      {cameras.filter((c) => c.active).length} / {cameras.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Detection Status:</span>
                    <span className={`font-medium ${detectionEnabled ? "text-green-500" : "text-red-500"}`}>
                      {detectionEnabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Alert Sounds:</span>
                    <span className={`font-medium ${soundEnabled ? "text-green-500" : "text-yellow-500"}`}>
                      {soundEnabled ? "Enabled" : "Muted"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Alert:</span>
                    <span className="font-medium">
                      {alerts.length > 0 ? new Date(alerts[0].timestamp).toLocaleTimeString() : "None"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-80 border-l bg-card overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Camera Management</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <CameraSelector cameras={cameras} onToggleCamera={toggleCamera} />
          </div>
        </div>
      )}
    </div>
  )
}

