export interface Alert {
  id: string
  timestamp: Date
  type: "info" | "warning" | "danger"
  category: "intruder" | "feed" | "animal"
  title: string
  message: string
  cameraId: string
}

