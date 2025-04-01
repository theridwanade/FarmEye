"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Webcam from "react-webcam"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, Camera, CameraOff } from "lucide-react"
import type { Camera as CameraType } from "@/types/camera"
import type { Alert } from "@/types/alert"
import { detectObjects, estimateFeedLevel, countAnimals } from "@/lib/object-detection"
import { Badge } from "@/components/ui/badge"

interface CameraFeedProps {
  camera: CameraType
  detectionEnabled: boolean
  onAlert: (alert: Alert) => void
}

export default function CameraFeed({ camera, detectionEnabled, onAlert }: CameraFeedProps) {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [detections, setDetections] = useState<{
    intruders: number
    feedLevels: { id: string; level: number }[]
    animals: number
  }>({
    intruders: 0,
    feedLevels: [],
    animals: 0,
  })

  // Track previous detections to avoid duplicate alerts
  const prevDetectionsRef = useRef({
    intruders: 0,
    feedLevels: [] as { id: string; level: number }[],
    animals: 0,
  })

  // Detection interval reference
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle detection logic
  const handleDetection = useCallback(async () => {
    if (
      detectionEnabled &&
      webcamRef.current &&
      webcamRef.current.video &&
      canvasRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Clear previous drawings
        context.clearRect(0, 0, canvas.width, canvas.height)

        try {
          // Detect objects in the frame
          const objects = await detectObjects(video)

          // Process detections
          let intruderCount = 0
          const animalCount = await countAnimals(video)
          const feedContainers: { id: string; level: number }[] = []

          // Get feed level if containers are detected
          const feedLevel = await estimateFeedLevel(video)
          if (feedLevel > 0) {
            feedContainers.push({ id: `feed-${camera.id}`, level: feedLevel })
          }

          // Draw bounding boxes and count objects
          objects.forEach((obj, index) => {
            const { class: className, score, bbox } = obj

            // Set colors based on object type
            let color = ""
            if (className === "person" || className === "dog") {
              color = "red"
              intruderCount++
            } else if (
              ["cat", "horse", "sheep", "cow", "elephant", "bear", "zebra", "giraffe", "bird"].includes(
                className,
              )
            ) {
              color = "green"
              // Animal count is handled by countAnimals function
            } else if (["bowl", "cup", "bottle", "container"].includes(className)) {
              color = "blue"
              // Feed level is handled by estimateFeedLevel function
            } else {
              // Other objects get a gray color
              color = "gray"
            }

            if (color) {
              // Draw bounding box
              context.strokeStyle = color
              context.lineWidth = 2
              context.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height)

              // Draw label
              context.fillStyle = color
              context.fillRect(bbox.x, bbox.y - 20, 100, 20)
              context.fillStyle = "white"
              context.font = "12px Arial"
              context.fillText(`${className} (${Math.floor(score * 100)}%)`, bbox.x + 5, bbox.y - 5)
            }
          })

          // Update detections state
          setDetections({
            intruders: intruderCount,
            feedLevels: feedContainers,
            animals: animalCount,
          })

          // Generate alerts based on detections
          // Only alert if the count has changed from previous detection
          if (intruderCount > 0 && intruderCount !== prevDetectionsRef.current.intruders) {
            onAlert({
              id: Date.now().toString(),
              timestamp: new Date(),
              type: "danger",
              category: "intruder",
              title: "Intruder Detected",
              message: `${intruderCount < 1 ? "intruder": "intruders"} detected on ${camera.name}`,
              cameraId: camera.id.slice(0, 7),
            })
          }
          // Check for low feed levels
          feedContainers.forEach((container) => {
            const prevContainer = prevDetectionsRef.current.feedLevels.find((c) => c.id === container.id)

            // Alert if feed level is low and has changed significantly
            if (container.level < 30 && (!prevContainer || Math.abs(prevContainer.level - container.level) > 10)) {
              onAlert({
                id: Date.now().toString(),
                timestamp: new Date(),
                type: "warning",
                category: "feed",
                title: "Low Feed Level",
                message: `Feed container at ${container.level}% capacity on ${camera.name}`,
                cameraId: camera.id,
              })
            }
          })

          // Check for animal count changes
          if (animalCount !== prevDetectionsRef.current.animals && prevDetectionsRef.current.animals > 0) {
            const difference = animalCount - prevDetectionsRef.current.animals

            if (difference !== 0) {
              onAlert({
                id: Date.now().toString(),
                timestamp: new Date(),
                type: difference < 0 ? "danger" : "info",
                category: "animal",
                title: "Animal Count Changed",
                message: `Animal count ${difference < 0 ? "decreased" : "increased"} from ${prevDetectionsRef.current.animals} to ${animalCount} on ${camera.name}`,
                cameraId: camera.id,
              })
            }
          }

          // Update previous detections
          prevDetectionsRef.current = {
            intruders: intruderCount,
            feedLevels: feedContainers,
            animals: animalCount,
          }
        } catch (error) {
          console.error("Detection error:", error)
        }
      }
    }
  }, [detectionEnabled, camera, onAlert])

  // Run detection at intervals
  useEffect(() => {
    // Clear any existing interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current)
      detectionIntervalRef.current = null
    }

    if (detectionEnabled) {
      // Run detection every 500ms for better performance
      detectionIntervalRef.current = setInterval(() => {
        handleDetection()
      }, 500)
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current)
      }
    }
  }, [detectionEnabled, handleDetection])

  // Handle camera loading state
  const handleUserMedia = () => {
    setIsLoading(false)
  }

  return (
    <Card className={`overflow-hidden ${isExpanded ? "fixed inset-4 z-50" : "h-full"}`}>
      <CardHeader className="p-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{camera.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="flex flex-col items-center">
              <Camera className="h-8 w-8 animate-pulse text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Connecting to camera...</p>
            </div>
          </div>
        )}

        <div className="relative aspect-video">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              facingMode: "environment",
            }}
            onUserMedia={handleUserMedia}
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />

          {!detectionEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex flex-col items-center">
                <CameraOff className="h-8 w-8 text-white" />
                <p className="mt-2 text-sm text-white">Detection disabled</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-3 flex justify-between items-center">
        <div className="flex gap-2">
          {detections.intruders > 0 && <Badge variant="destructive">Intruders: {detections.intruders}</Badge>}
          {detections.animals > 0 && <Badge variant="secondary">Animals: {detections.animals}</Badge>}
          {detections.feedLevels.length > 0 && (
            <Badge variant={detections.feedLevels.some((f) => f.level < 30) ? "outline" : "default"}>
              Feed: {detections.feedLevels.map((f) => `${f.level}%`).join(", ")}
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</span>
      </CardFooter>
    </Card>
  )
}

