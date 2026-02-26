import { DragEvent } from 'react'

const AVAILABLE_NODES = [
  { type: 'textNode', label: 'Message', icon: '💬' },
]

const NodesPanel = () => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto" style={{ background: '#111' }}>
      <p className="text-[10px] text-[#555] font-bold uppercase tracking-[0.2em]">Nodes</p>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
        {AVAILABLE_NODES.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className="
              border border-[#2a2a2a] rounded-xl p-4
              flex flex-col items-center gap-2
              cursor-grab active:cursor-grabbing
              hover:border-[#444] hover:bg-[#1a1a1a]
              transition-all duration-150 select-none
            "
            style={{ background: '#161616' }}
          >
            <span className="text-2xl leading-none">{node.icon}</span>
            <span className="text-xs font-medium text-[#aaa] tracking-wide">{node.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NodesPanel
