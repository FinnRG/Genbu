import { KonvaEventObject } from 'konva/lib/Node'
import React, { useRef, useState, useEffect } from 'react'
import { Layer, Line, Stage } from 'react-konva'
import * as Y from 'yjs'
import supabase from '../../clients/supabase'
import { useYjs } from './useYJS'
import { Tool, WhiteboardControl } from './util'

interface LineData {
  tool: Tool
  points: number[]
  color: string
}

interface WhiteboardProps {
  id: string
  control: WhiteboardControl
}

const WhiteBoard: React.FC<WhiteboardProps> = (props) => {
  const isDrawing = useRef(false)
  const { ydoc: canvasData } = useYjs({
    id: props.id
  })
  const lines = canvasData?.getArray<LineData>('lines')
  const [currentLine, setCurrentLine] = useState<LineData|null>(null)

  const control = props.control

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>): void => {
    isDrawing.current = control.tool === 'pen' || control.tool === 'eraser'
    const pos = e.target.getStage()?.getRelativePointerPosition()
    const x = pos?.x === undefined ? 0 : pos?.x
    const y = pos?.y === undefined ? 0 : pos?.y
    setCurrentLine({ tool: control.tool, points: [x, y], color: control.color })
  }

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>): void => {
    if (!isDrawing.current || currentLine === null) {
      return
    }
    const stage = e.target.getStage()
    const point = stage?.getRelativePointerPosition()

    // add point
    const x = point?.x === undefined ? 0 : point?.x
    const y = point?.y === undefined ? 0 : point?.y
    setCurrentLine({ ...currentLine, points: currentLine.points.concat([x, y]) })
  }

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>): void => {
    if (currentLine === null || lines === undefined) {
      return
    }
    isDrawing.current = false
    lines.push([currentLine])
    setCurrentLine(null)
  }

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight - 55}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      draggable={control.tool === 'drag'}
    >

      <Layer>
        {lines?.map((line, i) => (
          <DrawLine
            key={i}
            data={line}
          />
        ))}
        {currentLine !== null && (
          <DrawLine
            data={currentLine}
          />
        )}
      </Layer>
    </Stage>
  )
}

interface DrawLineProps {
  data: LineData
}

const DrawLine: React.FC<DrawLineProps> = ({ data }) => {
  return (
    <Line
      points={data.points}
      stroke={data.color}
      strokeWidth={5}
      tension={0.5}
      lineCap='round'
      lineJoin='round'
      globalCompositeOperation={
            data.tool === 'eraser' ? 'destination-out' : 'source-over'
        }
    />
  )
}

export default WhiteBoard
