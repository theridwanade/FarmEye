export interface Camera {
  id: string
  name: string
  active: boolean
  type: "webcam" | "ip" | "rtsp"
}

