import { useMemo, useRef, useEffect } from 'react'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

export const useYdoc = (id: string): { readonly ydoc: Y.Doc } => {
  const isFirstLoad = useRef(true)
  const ydoc = useMemo(() => new Y.Doc(), [])

  useEffect(() => {
    if (isFirstLoad.current) {
      const provider = new WebrtcProvider('genbu', ydoc)

      provider.on('synced', (synced: any) => {
        console.log('synced!', synced)
      })

      isFirstLoad.current = false
    }
  }, [ydoc])

  return { ydoc } as const
}
