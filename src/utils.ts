const TOKEN = /"[^"]+"|[^\s"]+/g

export function tokenize(str: string) {
    const match = str.match(TOKEN) ?? []
    return match.map(x => {
        x = x.replace(/^"/, '')
        x = x.replace(/"$/, '')
        return Number.isNumeric(x) ? Number(x) : x
    })
}

export function detokenize(tokens: Array<string | number>) {
    return tokens.map(x => (typeof x === 'string' && x.includes(' ') ? `"${x}"` : x)).join(' ')
}
