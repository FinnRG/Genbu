import * as Y from 'yjs'

import { useCallback, useEffect, useReducer, useState } from 'react'

import { WebrtcProvider } from 'y-webrtc'

export interface IUseYjsProps {
  roomName: string
}

export function useYjs({ roomName }: IUseYjsProps) {
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null)
  const [provider, setProvider] = useState<WebrtcProvider | null>(null)
  const [type, setType] = useState<Y.Text | null>(null)
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const createProviderInstance = useCallback(() => {
    if (ydoc === null || provider !== null) return
    setProvider(new WebrtcProvider(roomName, ydoc))
  }, [ydoc, provider])

  const createYMap = useCallback(() => {
    if (ydoc === null || type !== null) return
    setType(ydoc.getText(roomName))
  }, [type, provider])

  useEffect(() => {
    if (ydoc === null) setYdoc(new Y.Doc())
    else if (ydoc !== null && provider === null) createProviderInstance()
    if (ydoc !== null && type === null) createYMap()
    ydoc?.on('update', () => {
      forceUpdate()
    })
  }, [ydoc, provider, type])

  return { type, provider, ydoc }
}