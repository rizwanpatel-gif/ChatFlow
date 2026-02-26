import { ChangeEvent } from 'react'
import { Node } from 'reactflow'
import { TextNodeData } from './nodes/TextNode'

interface SettingsPanelProps {
  selectedNode: Node<TextNodeData>
  onTextChange: (nodeId: string, text: string) => void
  onBack: () => void
}

const SettingsPanel = ({ selectedNode, onTextChange, onBack }: SettingsPanelProps) => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(selectedNode.id, e.target.value)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#111' }}>
      <div
        className="flex items-center gap-3 px-4 py-3 border-b border-[#222]"
        style={{ background: '#111' }}
      >
        <button
          onClick={onBack}
          className="text-[#666] hover:text-[#eee] transition-colors text-lg leading-none"
          aria-label="Back"
        >
          ←
        </button>
        <span className="text-sm font-semibold text-[#e5e5e5] tracking-wide">Message</span>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <label
          htmlFor="node-text"
          className="text-[10px] font-bold text-[#555] uppercase tracking-[0.2em]"
        >
          Text
        </label>
        <textarea
          id="node-text"
          rows={5}
          value={selectedNode.data.text}
          onChange={handleChange}
          placeholder="Type your message…"
          className="
            rounded-lg p-3 text-sm text-[#e5e5e5] resize-none
            border border-[#2a2a2a] focus:border-[#555]
            focus:outline-none transition-colors
            placeholder-[#444]
          "
          style={{ background: '#161616' }}
        />
      </div>
    </div>
  )
}

export default SettingsPanel
