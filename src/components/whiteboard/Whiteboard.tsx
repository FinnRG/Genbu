import { KonvaEventObject } from 'konva/lib/Node'
import React, { useRef, useState, useEffect } from 'react'
import { Layer, Line, Stage, Text } from 'react-konva'
import * as Y from 'yjs'
import supabase from '../../clients/supabase'

type DrawTool = 'eraser' | 'pen'

interface LineData {
  tool: DrawTool
  points: number[]
}

const WhiteBoard: React.FC = () => {
  const isDrawing = useRef(false)
  const [tool, setTool] = useState<DrawTool>('pen')
  const [lines, setLines] = useState<LineData[]>([])
  const [currentLine, setCurrentLine] = useState<LineData|null>(null)

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
    if (currentLine === null) {
      return
    }
    isDrawing.current = false
    setLines([...lines, currentLine])
    setCurrentLine(null)

    supabase.from('whiteboards')
      .update({ data: [...lines, currentLine] })
      .match({ id: '924e29b2-68fb-4b09-a31b-c48ad1de8ef2' })
      .then(() => {})
  }

  useEffect(() => {
    supabase.from('whiteboards')
      .select('data')
      .match({ id: '924e29b2-68fb-4b09-a31b-c48ad1de8ef2' })
      .then((e) => setLines(e.data === null ? [] : e.data[0].data))
  }, [])

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
          <Text text='start drawing' x={5} y={5} />
          {lines.map((line, i) => (
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
