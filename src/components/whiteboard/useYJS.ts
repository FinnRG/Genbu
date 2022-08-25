import * as Y from 'yjs'

import { useCallback, useEffect, useReducer, useState } from 'react'

import { WebrtcProvider } from 'y-webrtc'
import supabase from '../../clients/supabase'
import { useDebouncedState, useForceUpdate } from '@mantine/hooks'

export interface IUseYjsProps {
  id: string
}

export const useYjs = ({ id }: IUseYjsProps) => {
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null)
  const [provider, setProvider] = useState<WebrtcProvider | null>(null)
  const forceUpdate = useForceUpdate()
  const [debounce, setDebounce] = useDebouncedState(0, 600)

  const createProviderInstance = useCallback(() => {
    if (ydoc === null || provider !== null) return
    setProvider(new WebrtcProvider(`genbu:${id}`, ydoc))
  }, [ydoc, provider])

  const fetchWhiteboard = async (): Promise<string> => {
    const { data } = await supabase.from('whiteboard')
      .select('*')
      .match({ id })
      .single()

    if (data === undefined) {
      return ''
    }

    return data.updateVector
  }

  const setWhiteboard = async (): Promise<void> => {
    fetchWhiteboard().then((data: string) => {
      const newDoc = new Y.Doc()
      const arr = Uint8Array.from(data.split(',').map(x => parseInt(x, 10)))
      Y.applyUpdate(newDoc, arr)
      setYdoc(newDoc)
    })
  }

  useEffect(() => {
    if (ydoc === null) {
      setWhiteboard()
    } else if (ydoc !== null && provider === null) createProviderInstance()
  }, [ydoc, provider])

  ydoc?.on('update', () => {
    forceUpdate()
    setDebounce(1 + debounce)
  })

  useEffect(() => {
    if (ydoc === null) { return }
    const updateVector = (Y.encodeStateAsUpdate(ydoc)).join(',')
    supabase.from('whiteboard')
      .update({ updateVector })
      .match({ id })
      .then((data) => 'Synced')
  }, [debounce])

  useEffect(() => {
    provider?.disconnect()
    ydoc?.destroy()
    setWhiteboard()
    createProviderInstance()
  }, [id])

  return { provider, ydoc }
}
