import React from 'react'

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type Tool = 'pen' | 'drag' | 'eraser'

export interface WhiteboardControl {
  color: string
  setColor: SetState<string>
  tool: Tool
  setTool: SetState<Tool>
}
