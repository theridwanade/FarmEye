"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { loadModel } from "@/lib/object-detection"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface ModelLoaderProps {
  children: React.ReactNode
}

export default function ModelLoader({ children }: ModelLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadAIModel = async () => {
      try {
        // Simulate progress steps
        setProgress(10)

        // Initialize TensorFlow.js
        setProgress(30)

        // Load the COCO-SSD model
        await loadModel()

        setProgress(100)

        // Small delay to show 100% progress
        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false)
          }
        }, 500)
      } catch (err) {
        console.error("Failed to load AI model:", err)
        if (isMounted) {
          setError("Failed to load AI model. Please refresh the page and try again.")
        }
      }
    }

    loadAIModel()

    return () => {
      isMounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Loading FarmEye AI</h2>
                <p className="text-muted-foreground mt-1">
                  Initializing TensorFlow.js and loading object detection models
                </p>
              </div>

              <Progress value={progress} className="h-2" />

              <div className="text-center text-sm text-muted-foreground">
                {progress < 30 && "Initializing TensorFlow.js..."}
                {progress >= 30 && progress < 90 && "Loading COCO-SSD model..."}
                {progress >= 90 && "Finalizing setup..."}
              </div>

              {error && <div className="text-center text-destructive text-sm mt-4">{error}</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

