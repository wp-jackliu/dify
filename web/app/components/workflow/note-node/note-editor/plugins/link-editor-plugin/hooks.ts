import {
  useCallback,
  useEffect,
} from 'react'
import {
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
} from 'lexical'
import {
  mergeRegister,
} from '@lexical/utils'
import {
  TOGGLE_LINK_COMMAND,
} from '@lexical/link'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useNoteEditorStore } from '../../store'

export const useOpenLink = () => {
  const [editor] = useLexicalComposerContext()
  const noteEditorStore = useNoteEditorStore()

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          setTimeout(() => {
            const {
              selectedLinkUrl,
              selectedIsLink,
              setLinkAnchorElement,
              setLinkOperatorShow,
            } = noteEditorStore.getState()

            if (selectedIsLink) {
              if ((payload.metaKey || payload.ctrlKey) && selectedLinkUrl) {
                window.open(selectedLinkUrl, '_blank')
                return true
              }
              setLinkAnchorElement(true)

              if (selectedLinkUrl)
                setLinkOperatorShow(true)
              else
                setLinkOperatorShow(false)
            }
            else {
              setLinkAnchorElement()
              setLinkOperatorShow(false)
            }
          })
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor, noteEditorStore])
}

export const useLink = () => {
  const [editor] = useLexicalComposerContext()
  const noteEditorStore = useNoteEditorStore()

  const handleSaveLink = useCallback((url: string) => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url)

    const { setLinkAnchorElement } = noteEditorStore.getState()
    setLinkAnchorElement()
  }, [editor, noteEditorStore])

  const handleUnlink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)

    const { setLinkAnchorElement } = noteEditorStore.getState()
    setLinkAnchorElement()
  }, [editor, noteEditorStore])

  return {
    handleSaveLink,
    handleUnlink,
  }
}