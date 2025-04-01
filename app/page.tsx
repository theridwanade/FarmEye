import Dashboard from "@/components/dashboard"
import ModelLoader from "@/components/model-loader"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ModelLoader>
        <Dashboard />
      </ModelLoader>
    </main>
  )
}

