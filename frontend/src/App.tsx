import FlowCanvas from './components/FlowCanvas'

/**
 * Root application component.
 * The entire app is a full-screen flow builder canvas.
 */
function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <FlowCanvas />
    </div>
  )
}

export default App
