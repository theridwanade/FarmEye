import * as tf from "@tensorflow/tfjs"
import * as cocoSsd from "@tensorflow-models/coco-ssd"

// Configure TensorFlow.js to use WebGL backend for better performance
tf.setBackend("webgl")

// Store the model instance to avoid reloading
let modelPromise: Promise<cocoSsd.ObjectDetection> | null = null

// Load the COCO-SSD model
export async function loadModel(): Promise<cocoSsd.ObjectDetection> {
  if (!modelPromise) {
    console.log("Loading COCO-SSD model...")
    modelPromise = cocoSsd.load({
      base: "lite_mobilenet_v2",
    })
  }
  return modelPromise
}

// Interface for detected objects
export interface DetectedObject {
  class: string
  score: number
  bbox: {
    x: number
    y: number
    width: number
    height: number
  }
}

// Convert COCO-SSD predictions to our DetectedObject format
function convertPredictions(predictions: cocoSsd.DetectedObject[]): DetectedObject[] {
  return predictions.map((prediction) => ({
    class: prediction.class,
    score: prediction.score,
    bbox: {
      x: prediction.bbox[0],
      y: prediction.bbox[1],
      width: prediction.bbox[2],
      height: prediction.bbox[3],
    },
  }))
}

// Detect objects in a video frame using TensorFlow.js
export async function detectObjects(videoElement: HTMLVideoElement): Promise<DetectedObject[]> {
  try {
    if (!videoElement || videoElement.readyState !== 4) {
      return []
    }

    const model = await loadModel()
    const predictions = await model.detect(videoElement)

    return convertPredictions(predictions)
  } catch (error) {
    console.error("Error detecting objects:", error)
    return []
  }
}

// Estimate feed level based on detected objects and image analysis
export async function estimateFeedLevel(videoElement: HTMLVideoElement): Promise<number> {
  try {
    if (!videoElement || videoElement.readyState !== 4) {
      return 0
    }

    // Get all detected objects
    const objects = await detectObjects(videoElement)

    // Find objects that might be feed containers (bowl, cup, etc.)
    const feedContainers = objects.filter((obj) => ["bowl", "cup", "bottle", "container"].includes(obj.class))

    if (feedContainers.length === 0) {
      return 0
    }

    // For a real implementation, we would analyze the pixels within the bounding box
    // to determine the fill level. For now, we'll use a simulated approach.

    // Create a canvas to analyze the image data
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (!context) {
      return 0
    }

    // Get the first feed container
    const container = feedContainers[0]

    // Set canvas size to the bounding box
    canvas.width = container.bbox.width
    canvas.height = container.bbox.height

    // Draw the portion of the video within the bounding box
    context.drawImage(
      videoElement,
      container.bbox.x,
      container.bbox.y,
      container.bbox.width,
      container.bbox.height,
      0,
      0,
      container.bbox.width,
      container.bbox.height,
    )

    // In a real implementation, we would analyze the pixels to determine fill level
    // For now, we'll return a simulated value based on the container's position
    // Lower containers tend to be more filled (in this simulation)
    const verticalPosition = container.bbox.y / videoElement.height
    const estimatedLevel = Math.max(0, Math.min(100, Math.round((1 - verticalPosition) * 100)))

    return estimatedLevel
  } catch (error) {
    console.error("Error estimating feed level:", error)
    return 0
  }
}

// Count animals in the video frame
export async function countAnimals(videoElement: HTMLVideoElement): Promise<number> {
  try {
    if (!videoElement || videoElement.readyState !== 4) {
      return 0
    }

    const objects = await detectObjects(videoElement)

    // Count objects that are likely animals
    const animalClasses = [
      "cat",
      "dog",
      "horse",
      "sheep",
      "cow",
      "elephant",
      "bear",
      "zebra",
      "giraffe",
      "bird",
      "animal",
    ]

    const animalCount = objects.filter((obj) => animalClasses.includes(obj.class)).length

    return animalCount
  } catch (error) {
    console.error("Error counting animals:", error)
    return 0
  }
}

