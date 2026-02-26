import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

export interface TextNodeData {
  text: string
}

const TextNode = ({ data, selected }: NodeProps<TextNodeData>) => {
  return (
    <div
      className={`rounded-xl overflow-hidden min-w-[220px] max-w-[260px] border transition-all duration-150 ${
        selected ? 'border-white' : 'border-[#2a2a2a]'
      }`}
      style={{ background: '#161616' }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[#444] !border-2 !border-[#161616]"
      />

      <div
        className="px-3 py-2 flex items-center gap-2 border-b border-[#2a2a2a]"
        style={{ background: '#1f1f1f' }}
      >
        <span className="text-sm leading-none">💬</span>
        <span className="text-[#e5e5e5] font-semibold text-xs flex-1 tracking-wider uppercase">
          Send Message
        </span>
        <span className="text-[#444] text-xs font-light">✕</span>
      </div>

      <div className="px-3 py-3 text-sm min-h-[40px] break-words leading-relaxed">
        {data.text ? (
          <span className="text-[#ccc]">{data.text}</span>
        ) : (
          <span className="text-[#444] italic text-xs">Empty message</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[#e5e5e5] !border-2 !border-[#161616]"
      />
    </div>
  )
}

export default memo(TextNode)
