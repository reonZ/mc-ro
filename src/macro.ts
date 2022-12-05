import { error } from './@utils/foundry/notifications'
import { AsyncFunction } from './@utils/function'
import { detokenize } from './utils'

export function executeMacro(id: string | number, args: Array<string | number>) {
    let macro: Macro | undefined
    if (Number.isNumeric(id)) {
        const macroId = game.user.hotbar[id]
        macro = game.macros.get(macroId)
    } else {
        macro = game.macros.get(id) ?? game.macros.getName(id)
    }

    if (!macro) return error('noMacro', { id: id.toString() })
    if (!macro.canExecute) return error('noPermission', { name: macro.name })
    if (macro.type === 'chat') return macro._executeChat()

    const speaker = ChatMessage.implementation.getSpeaker()
    const character = game.user.character
    const actor = speaker.actor ? game.actors.get(speaker.actor) : null
    const token = speaker.token && canvas.ready ? canvas.tokens.get(speaker.token) : null

    const fn = new AsyncFunction('speaker', 'actor', 'token', 'character', 'args', macro.command)
    try {
        return fn.call(macro, speaker, actor, token, character, args)
    } catch {
        error('syntaxError')
    }
}

export function createLink(wrapped: Macro['_createDocumentLink'], ...args: Parameters<Macro['_createDocumentLink']>) {
    const [data] = args
    if (!data.id || !data.args || !data.name) return wrapped(...args)

    const tokens = data.args.split(',')
    const macroArgs = detokenize(tokens)

    return `@Macro[${data.id}](${macroArgs}){${data.name}}`
}
