import { useState, useCallback, useRef, DragEvent } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
  Background,
  BackgroundVariant,
  Controls,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'

import TextNode, { TextNodeData } from './nodes/TextNode'
import NodesPanel from './NodesPanel'
import SettingsPanel from './SettingsPanel'
import axios from 'axios'

const nodeTypes: NodeTypes = {
  textNode: TextNode,
}

let idCounter = 1
const getNewId = () => `node_${idCounter++}`

interface SavedFlow {
  id: number
  name: string
  nodes: Node<TextNodeData>[]
  edges: Edge[]
}

const FlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<TextNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node<TextNodeData> | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveMessage, setSaveMessage] = useState('')
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false)
  const savedFlowId = useRef<number | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceAlreadyConnected = edges.some(
        (e) => e.source === params.source && e.sourceHandle === params.sourceHandle
      )
      if (sourceAlreadyConnected) return
      setEdges((eds) => addEdge({ ...params, animated: false }, eds))
    },
    [edges, setEdges]
  )

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      const type = event.dataTransfer.getData('application/reactflow')
      if (!type || !rfInstance) return

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node<TextNodeData> = {
        id: getNewId(),
        type,
        position,
        data: { text: 'New message' },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [rfInstance, setNodes]
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<TextNodeData>)
    setMobilePanelOpen(true)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
    setMobilePanelOpen(false)
  }, [])

  const onTextChange = useCallback(
    (nodeId: string, text: string) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, text } } : n))
      )
      setSelectedNode((prev) =>
        prev?.id === nodeId ? { ...prev, data: { ...prev.data, text } } : prev
      )
    },
    [setNodes]
  )

  const showFeedback = (status: 'success' | 'error', message: string) => {
    setSaveStatus(status)
    setSaveMessage(message)
    setTimeout(() => setSaveStatus('idle'), 3000)
  }

  const onSave = useCallback(async () => {
    if (nodes.length > 1) {
      const connectedTargets = new Set(edges.map((e) => e.target))
      const unconnectedNodes = nodes.filter((n) => !connectedTargets.has(n.id))
      if (unconnectedNodes.length > 1) {
        showFeedback('error', 'Cannot save Flow')
        return
      }
    }

    try {
      let response
      if (savedFlowId.current === null) {
        response = await axios.post<SavedFlow>('/api/flows', { name: 'My Flow', nodes, edges })
        savedFlowId.current = response.data.id
      } else {
        response = await axios.put<SavedFlow>(`/api/flows/${savedFlowId.current}`, {
          name: 'My Flow',
          nodes,
          edges,
        })
      }
      showFeedback('success', 'Flow saved!')
    } catch {
      showFeedback('error', 'Save failed')
    }
  }, [nodes, edges])

  const panelVisible = mobilePanelOpen || selectedNode !== null

  return (
    <div className="flex flex-col h-full" style={{ background: '#0c0c0c' }}>
      <header
        className="flex items-center justify-between px-4 md:px-6 py-3 shrink-0 border-b border-[#1e1e1e]"
        style={{ background: '#111' }}
      >
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-[#666] hover:text-[#eee] transition-colors p-1"
            onClick={() => setMobilePanelOpen((p) => !p)}
            aria-label="Toggle panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-[#e5e5e5] font-semibold text-sm tracking-wide hidden sm:block">
            Flow Builder
          </span>
        </div>

        <div className="flex items-center gap-4">
          {saveStatus !== 'idle' && (
            <span
              className={`text-xs font-medium px-3 py-1.5 rounded-lg ${
                saveStatus === 'error'
                  ? 'bg-red-950 text-red-400 border border-red-900'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-900'
              }`}
            >
              {saveMessage}
            </span>
          )}
          <button
            onClick={onSave}
            className="
              bg-[#e5e5e5] hover:bg-white text-[#0c0c0c]
              px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide
              transition-colors duration-150 shrink-0
            "
          >
            Save Changes
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div ref={canvasRef} className="flex-1 min-h-0">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode="Delete"
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="#1f1f1f"
            />
            <Controls />
          </ReactFlow>
        </div>

        <div
          className={`
            border-t border-[#1e1e1e] md:border-t-0 md:border-l
            w-full md:w-64
            transition-all duration-300 ease-in-out
            overflow-y-auto
            ${panelVisible ? 'h-64 md:h-auto' : 'h-0 md:h-auto'}
            md:flex md:flex-col
          `}
          style={{ background: '#111' }}
        >
          {selectedNode ? (
            <SettingsPanel
              selectedNode={selectedNode}
              onTextChange={onTextChange}
              onBack={() => {
                setSelectedNode(null)
                setMobilePanelOpen(false)
              }}
            />
          ) : (
            <NodesPanel />
          )}
        </div>
      </div>
    </div>
  )
}

export default FlowCanvas
