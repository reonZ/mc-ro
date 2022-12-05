import { executeMacro } from './macro'
import { tokenize } from './utils'

export async function enrichHTML(wrapped: typeof TextEditor['enrichHTML'], ...args: Parameters<typeof TextEditor['enrichHTML']>) {
    let [content] = args
    if (!content) return wrapped(...args)

    const regex = /@Macro\[(?<id>[^\]]+)\]\((?<arguments>[^\)]+)\)(?:{(?<label>[^}]+)})?/g

    let match: RegExpExecArray | null
    while ((match = regex.exec(content))) {
        const id = match.groups!.id
        const macro = game.macros.get(id) ?? game.macros.getName(id)
        if (!macro) continue

        const args = tokenize(match.groups!.arguments).join(',')
        const label = match.groups!.label ?? macro.name

        const a = `<a class="content-link" draggable="true" data-type="Macro" data-name="${macro.name}" data-id="${macro.id}" data-uuid="${macro.uuid}" data-args="${args}"><i class="fas fa-terminal"></i>${label}</a>`
        content = content.replace(match[0], a)
    }

    args[0] = content
    return wrapped(...args)
}

export function onMacroClick(wrapped: Macro['_onClickDocumentLink'], ...args: Parameters<Macro['_onClickDocumentLink']>) {
    const data = (args[0].currentTarget as HTMLElement).dataset
    if (!data.args || !data.id || !data.name) return wrapped(...args)
    executeMacro(data.id, data.args.split(','))
}

export function onDragLink(
    wrapped: typeof TextEditor['_onDragContentLink'],
    ...args: Parameters<typeof TextEditor['_onDragContentLink']>
) {
    const [event] = args
    const data = event.currentTarget.dataset
    if (data.type !== 'Macro' || !data.id || !data.args || !data.name) return wrapped(...args)

    event.stopPropagation()
    event.originalEvent.dataTransfer!.setData('text/plain', JSON.stringify(data))
}
