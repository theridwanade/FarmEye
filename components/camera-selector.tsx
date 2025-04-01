import type { Camera as CameraType } from "@/types/camera"
import { Switch } from "@/components/ui/switch"
import { Camera, Plus } from "lucide-react"

interface CameraSelectorProps {
  cameras: CameraType[]
  onToggleCamera: (id: string) => void
}

export default function CameraSelector({ cameras, onToggleCamera }: CameraSelectorProps) {
  return (
    <div className="p-4">
      <div className="space-y-3">
        {cameras.map((camera) => (
          <div key={camera.id} className="flex items-center justify-between p-3 rounded-md border bg-card">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-md ${camera.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
              >
                <Camera className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">{camera.name}</p>
                <p className="text-xs text-muted-foreground">{camera.type}</p>
              </div>
            </div>
            <Switch
              checked={camera.active}
              onCheckedChange={() => onToggleCamera(camera.id)}
              aria-label={`Toggle ${camera.name}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border rounded-md bg-muted/50">
        <h4 className="text-sm font-medium mb-2">Camera Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Enable multiple cameras for better coverage</li>
          <li>• Position cameras at different angles</li>
          <li>• Ensure good lighting for better detection</li>
          <li>• Regularly check camera connections</li>
        </ul>
      </div>
    </div>
  )
}

