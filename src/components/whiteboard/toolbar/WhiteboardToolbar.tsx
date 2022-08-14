import React from 'react'
import * as ToolbarPrimitive from '@radix-ui/react-toolbar'
import {
  StrikethroughIcon,
  FontBoldIcon,
  FontItalicIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon
} from '@radix-ui/react-icons'
import { styled } from '@stitches/react'
import { teal, blackA, sage } from '@radix-ui/colors'

const StyledToolbar = styled(ToolbarPrimitive.Root, {
  display: 'flex',
  padding: 10,
  width: '100%',
  minWidth: 'max-content',
  marginTop: 10,
  borderRadius: 6,
  backgroundColor: 'white',
  boxShadow: `0 2px 10px ${blackA.blackA7}`
})

const itemStyles = {
  all: 'unset',
  flex: '0 0 auto',
  color: sage.sage11,
  height: 25,
  padding: '0 5px',
  borderRadius: 4,
  display: 'inline-flex',
  fontSize: 13,
  lineHeight: 1,
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': { backgroundColor: teal.teal3, color: teal.teal11 },
  '&:focus': { position: 'relative', boxShadow: `0 0 0 2px ${teal.teal7}` }
}

const StyledButton = styled(
  ToolbarPrimitive.Button,
  {
    ...itemStyles,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'white',
    backgroundColor: teal.teal9
  },
  { '&:hover': { color: 'white', backgroundColor: teal.teal10 } }
)

const StyledLink = styled(
  ToolbarPrimitive.Link,
  {
    ...itemStyles,
    backgroundColor: 'transparent',
    color: sage.sage11,
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  { '&:hover': { backgroundColor: 'transparent', cursor: 'pointer' } }
)

const StyledSeparator = styled(ToolbarPrimitive.Separator, {
  width: 1,
  backgroundColor: sage.sage6,
  margin: '0 10px'
})

const StyledToggleGroup = styled(ToolbarPrimitive.ToggleGroup, {
  display: 'inline-flex',
  borderRadius: 4
})

const StyledToggleItem = styled(ToolbarPrimitive.ToggleItem, {
  ...itemStyles,
  boxShadow: 0,
  backgroundColor: 'white',
  marginLeft: 2,
  '&:first-child': { marginLeft: 0 },
  '&[data-state=on]': { backgroundColor: teal.teal5, color: teal.teal11 }
})

// Exports
export const Toolbar = StyledToolbar
export const ToolbarButton = StyledButton
export const ToolbarSeparator = StyledSeparator
export const ToolbarLink = StyledLink
export const ToolbarToggleGroup = StyledToggleGroup
export const ToolbarToggleItem = StyledToggleItem

const WhiteboardToolbar: React.FC = () => {
  return (
      <Toolbar aria-label='Formatting options'>
        <ToolbarToggleGroup type='multiple' aria-label='Text formatting'>
          <ToolbarToggleItem value='bold' aria-label='Bold'>
            <FontBoldIcon />
          </ToolbarToggleItem>
          <ToolbarToggleItem value='italic' aria-label='Italic'>
            <FontItalicIcon />
          </ToolbarToggleItem>
          <ToolbarToggleItem value='strikethrough' aria-label='Strike through'>
            <StrikethroughIcon />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarToggleGroup type='single' defaultValue='center' aria-label='Text alignment'>
          <ToolbarToggleItem value='left' aria-label='Left aligned'>
            <TextAlignLeftIcon />
          </ToolbarToggleItem>
          <ToolbarToggleItem value='center' aria-label='Center aligned'>
            <TextAlignCenterIcon />
          </ToolbarToggleItem>
          <ToolbarToggleItem value='right' aria-label='Right aligned'>
            <TextAlignRightIcon />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarLink href='#' target='_blank' css={{ marginRight: 10 }}>
          Edited 2 hours ago
        </ToolbarLink>
        <ToolbarButton css={{ marginLeft: 'auto' }}>Share</ToolbarButton>
      </Toolbar>
  )
}

export default WhiteboardToolbar
