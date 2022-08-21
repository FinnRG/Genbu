import { ActionIcon, Paper, ThemeIcon, Popover, Text, Button, ColorPicker, Group, ColorSwatch, Divider } from '@mantine/core'
import { IconArrowsMove, IconEraser, IconLayoutSidebarLeftExpand, IconPencil } from '@tabler/icons'
import React from 'react'
import { getIconColor } from '../../util'
import { SetState, Tool, WhiteboardControl } from '../util'

interface WhiteboardToolbarProps {
  control: WhiteboardControl
}

interface ToolSetterOut {
  variant: 'filled' | 'outline'
  onClick: () => void
}

function toolSetter (control: WhiteboardControl, tool: Tool): ToolSetterOut {
  return {
    variant: control.tool === tool ? 'filled' : 'outline',
    onClick: () => { control.setTool(tool) }
  }
}

interface FolderViewButtonProps {
  setFolderViewOpened: SetState<boolean>
}

const FolderViewButton: React.FC<FolderViewButtonProps> = ({ setFolderViewOpened }) => {
  return (
    <ActionIcon size='lg' onClick={() => setFolderViewOpened(true)}>
      <IconLayoutSidebarLeftExpand />
    </ActionIcon>
  )
}

const PenButton: React.FC<WhiteboardToolbarProps> = ({ control }) => {
  return (
    <>
      <ActionIcon size='lg' {...toolSetter(control, 'pen')}>
        <IconPencil />
      </ActionIcon>
      <Popover position='bottom' withArrow shadow='md'>
        <Popover.Target>
          <ColorSwatch
            color={control.color}
          />
        </Popover.Target>
        <Popover.Dropdown>
          <ColorPicker
            value={control.color}
            onChange={control.setColor}
          />
        </Popover.Dropdown>
      </Popover>
    </>
  )
}

const DragButton: React.FC<WhiteboardToolbarProps> = ({ control }) => {
  return (
    <ActionIcon size='lg' {...toolSetter(control, 'drag')}>
      <IconArrowsMove />
    </ActionIcon>
  )
}

const EraserButton: React.FC<WhiteboardToolbarProps> = ({ control }) => {
  return (
    <ActionIcon size='lg' {...toolSetter(control, 'eraser')}>
      <IconEraser />
    </ActionIcon>
  )
}

const WhiteboardToolbar: React.FC<WhiteboardToolbarProps & FolderViewButtonProps> = ({ control, setFolderViewOpened }) => {
  return (
    <Paper p='md' shadow='xs' withBorder>
      <Group>
        <FolderViewButton setFolderViewOpened={setFolderViewOpened} />
        <Divider orientation='vertical' />
        <DragButton control={control} />
        <Divider orientation='vertical' />
        <PenButton control={control} />
        <Divider orientation='vertical' />
        <EraserButton control={control} />
      </Group>
    </Paper>
  )
}

export default WhiteboardToolbar
