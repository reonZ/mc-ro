import { registerWrapper } from './@utils/libwrapper'
import { onChatMessage } from './chat'
import { onDragLink, enrichHTML, onMacroClick } from './html'
import { createLink, executeMacro } from './macro'

const TEXTEDITOR_ENRICH = 'TextEditor.enrichHTML'
const TEXTEDITOR_DRAG = 'TextEditor._onDragContentLink'
const MACRO_CLICK = 'Macro.prototype._onClickDocumentLink'
const MACRO_CREATE_LINK = 'Macro.prototype._createDocumentLink'

Hooks.once('libWrapper.Ready', () => {
    registerWrapper(TEXTEDITOR_ENRICH, enrichHTML)
    registerWrapper(TEXTEDITOR_DRAG, onDragLink, 'MIXED')
    registerWrapper(MACRO_CLICK, onMacroClick, 'MIXED')
    registerWrapper(MACRO_CREATE_LINK, createLink, 'MIXED')
})

Hooks.once('ready', () => {
    patchPf2e()
    // @ts-ignore
    game.macros.executeMacro = executeMacro
})

Hooks.on('chatMessage', onChatMessage)

function patchPf2e() {
    if (game.system.id !== 'pf2e') return
    if (isNewerVersion(game.system.version, '4.4.2')) return
    if (!game.pf2e || !game.pf2e.TextEditor) return

    // @ts-ignore
    game.pf2e.TextEditor.enrichHTML = (...args: Parameters<typeof TextEditorPF2e['enrichHTML']>) => {
        return TextEditor.enrichHTML(...args)
    }
}
