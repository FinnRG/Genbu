import { KonvaEventObject } from 'konva/lib/Node'
import React, { useRef, useState, useEffect } from 'react'
import { Layer, Line, Stage } from 'react-konva'
import * as Y from 'yjs'
import supabase from '../../clients/supabase'
import { useYjs } from './useYJS'

type DrawTool = 'eraser' | 'pen'

interface LineData {
  tool: DrawTool
  points: number[]
}

interface WhiteboardProps {
  id: string
}

const WhiteBoard: React.FC<WhiteboardProps> = (props) => {
  const isDrawing = useRef(false)
  const [tool, setTool] = useState<DrawTool>('pen')
  const { ydoc: canvasData } = useYjs({
    roomName: props.id
  })
  const lines = canvasData?.getArray<LineData>('lines')
  const [currentLine, setCurrentLine] = useState<LineData|null>(null)

  useEffect(() => {
    const fetchWhiteboard = async (): Promise<void> => {
      const { data } = await supabase.from('whiteboard')
        .select('*')
        .match({ id: props.id })
        .single()

      if (data === undefined) {
        return
      }

      const arr = (data.data as Record<string, any>).data as Uint8Array
      Y.applyUpdate(canvasData!, arr)
    }

    fetchWhiteboard()
  }, [])

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>): void => {
    isDrawing.current = true
    const pos = e.target.getStage()?.getRelativePointerPosition()
    const x = pos?.x === undefined ? 0 : pos?.x
    const y = pos?.y === undefined ? 0 : pos?.y
    setCurrentLine({ tool, points: [x, y] })
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
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 55}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >

        <Layer>
          {lines?.map((line, i) => (
            <DrawLine
              key={i}
              points={line.points}
              tool={line.tool}
            />
          ))}
          {currentLine !== null && (
            <DrawLine
              points={currentLine.points}
              tool={currentLine.tool}
            />
          )}
        </Layer>
      </Stage>

    </div>
  )
}

interface DrawLineProps {
  points: number[]
  tool: DrawTool
}

const DrawLine: React.FC<DrawLineProps> = (props) => {
  return (
    <Line
      points={props.points}
      stroke='#df4b26'
      strokeWidth={5}
      tension={0.5}
      lineCap='round'
      lineJoin='round'
      globalCompositeOperation={
            props.tool === 'eraser' ? 'destination-out' : 'source-over'
        }
    />
  )
}

export default WhiteBoard
