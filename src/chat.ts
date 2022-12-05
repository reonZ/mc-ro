import { warn } from './@utils/foundry/notifications'
import { executeMacro } from './macro'
import { tokenize } from './utils'

const MACRO = /^\/m(?:acro)?(?<command>[^\n]*)/i

export function onChatMessage(log: ChatLog, message: string, chatData: ChatData) {
    const match = message.trim().match(MACRO)
    if (!match?.groups) return

    const args = tokenize(match.groups.command)
    if (args.length) {
        const id = args.splice(0, 1)[0]
        executeMacro(id, args)
    } else {
        warn('invalid')
    }

    return false
}
