var $1623e5e7c705b7c7$export$2e2bcd8739ae039 = "mc-ro";


function $3af2587758240bfd$export$4e224afa9c6f52f3(target, fn, type = "WRAPPER") {
    libWrapper.register((0, $1623e5e7c705b7c7$export$2e2bcd8739ae039), target, fn, type);
}



function $889355b5c39241f1$export$b3bd0bc58e36cd63(key, data) {
    key = `${0, $1623e5e7c705b7c7$export$2e2bcd8739ae039}.${key}`;
    if (data) return game.i18n.format(key, data);
    return game.i18n.localize(key);
}
function $889355b5c39241f1$export$a2435eff6fb7f6c1(subKey) {
    return (key, data)=>$889355b5c39241f1$export$b3bd0bc58e36cd63(`${subKey}.${key}`, data);
}


function $d20bc07084c62caf$export$5e14cdade93d6f7b(str, arg1, arg2, arg3) {
    const type = typeof arg1 === "string" ? arg1 : "info";
    const data = typeof arg1 === "object" ? arg1 : typeof arg2 === "object" ? arg2 : undefined;
    const permanent = typeof arg1 === "boolean" ? arg1 : typeof arg2 === "boolean" ? arg2 : arg3 ?? false;
    ui.notifications.notify((0, $889355b5c39241f1$export$b3bd0bc58e36cd63)(str, data), type, {
        permanent: permanent
    });
}
function $d20bc07084c62caf$export$c106dd0671a0fc2d(str, arg1, arg2) {
    $d20bc07084c62caf$export$5e14cdade93d6f7b(str, "warning", arg1, arg2);
}
function $d20bc07084c62caf$export$a80b3bd66acc52ff(str, arg1, arg2) {
    $d20bc07084c62caf$export$5e14cdade93d6f7b(str, "info", arg1, arg2);
}
function $d20bc07084c62caf$export$a3bc9b8ed74fc(str, arg1, arg2) {
    $d20bc07084c62caf$export$5e14cdade93d6f7b(str, "error", arg1, arg2);
}



const $914d3ad081c7a341$export$cb6ddc2b23bc63b2 = (async function() {}).constructor;


const $fab42eb3dee39b5b$var$TOKEN = /"[^"]+"|[^\s"]+/g;
function $fab42eb3dee39b5b$export$660b2ee2d4fb4eff(str) {
    const match = str.match($fab42eb3dee39b5b$var$TOKEN) ?? [];
    return match.map((x)=>{
        x = x.replace(/^"/, "");
        x = x.replace(/"$/, "");
        return Number.isNumeric(x) ? Number(x) : x;
    });
}
function $fab42eb3dee39b5b$export$208ca8297aba2218(tokens) {
    return tokens.map((x)=>typeof x === "string" && x.includes(" ") ? `"${x}"` : x).join(" ");
}


function $453ab70059a13248$export$4efd75b42b486b4d(id, args) {
    let macro;
    if (Number.isNumeric(id)) {
        const macroId = game.user.hotbar[id];
        macro = game.macros.get(macroId);
    } else macro = game.macros.get(id) ?? game.macros.getName(id);
    if (!macro) return (0, $d20bc07084c62caf$export$a3bc9b8ed74fc)("noMacro", {
        id: id.toString()
    });
    if (!macro.canExecute) return (0, $d20bc07084c62caf$export$a3bc9b8ed74fc)("noPermission", {
        name: macro.name
    });
    if (macro.type === "chat") return macro._executeChat();
    const speaker = ChatMessage.implementation.getSpeaker();
    const character = game.user.character;
    const actor = speaker.actor ? game.actors.get(speaker.actor) : null;
    const token = speaker.token && canvas.ready ? canvas.tokens.get(speaker.token) : null;
    const fn = new (0, $914d3ad081c7a341$export$cb6ddc2b23bc63b2)("speaker", "actor", "token", "character", "args", macro.command);
    try {
        return fn.call(macro, speaker, actor, token, character, args);
    } catch  {
        (0, $d20bc07084c62caf$export$a3bc9b8ed74fc)("syntaxError");
    }
}
function $453ab70059a13248$export$cdda5b1be25f9499(wrapped, ...args) {
    const [data] = args;
    if (!data.id || !data.args || !data.name) return wrapped(...args);
    const tokens = data.args.split(",");
    const macroArgs = (0, $fab42eb3dee39b5b$export$208ca8297aba2218)(tokens);
    return `@Macro[${data.id}](${macroArgs}){${data.name}}`;
}



const $cf4c32f03d9bb335$var$MACRO = /^\/m(?:acro)?(?<command>[^\n]*)/i;
function $cf4c32f03d9bb335$export$71b60514aa72a240(log, message, chatData) {
    const match = message.trim().match($cf4c32f03d9bb335$var$MACRO);
    if (!match?.groups) return;
    const args = (0, $fab42eb3dee39b5b$export$660b2ee2d4fb4eff)(match.groups.command);
    if (args.length) {
        const id = args.splice(0, 1)[0];
        (0, $453ab70059a13248$export$4efd75b42b486b4d)(id, args);
    } else (0, $d20bc07084c62caf$export$c106dd0671a0fc2d)("invalid");
    return false;
}




async function $b2da6f75e8fb6bf4$export$ccc731d336e1ce2c(wrapped, ...args) {
    let [content] = args;
    if (!content) return wrapped(...args);
    const regex = /@Macro\[(?<id>[^\]]+)\]\((?<arguments>[^\)]+)\)(?:{(?<label>[^}]+)})?/g;
    let match;
    while(match = regex.exec(content)){
        const id = match.groups.id;
        const macro = game.macros.get(id) ?? game.macros.getName(id);
        if (!macro) continue;
        const args1 = (0, $fab42eb3dee39b5b$export$660b2ee2d4fb4eff)(match.groups.arguments).join(",");
        const label = match.groups.label ?? macro.name;
        const a = `<a class="content-link" draggable="true" data-type="Macro" data-name="${macro.name}" data-id="${macro.id}" data-uuid="${macro.uuid}" data-args="${args1}"><i class="fas fa-terminal"></i>${label}</a>`;
        content = content.replace(match[0], a);
    }
    args[0] = content;
    return wrapped(...args);
}
function $b2da6f75e8fb6bf4$export$eca3d8a5e0023a0f(wrapped, ...args) {
    const data = args[0].currentTarget.dataset;
    if (!data.args || !data.id || !data.name) return wrapped(...args);
    (0, $453ab70059a13248$export$4efd75b42b486b4d)(data.id, data.args.split(","));
}
function $b2da6f75e8fb6bf4$export$cfffc2eca243e15d(wrapped, ...args) {
    const [event] = args;
    const data = event.currentTarget.dataset;
    if (data.type !== "Macro" || !data.id || !data.args || !data.name) return wrapped(...args);
    event.stopPropagation();
    event.originalEvent.dataTransfer.setData("text/plain", JSON.stringify(data));
}



const $b013a5dd6d18443e$var$TEXTEDITOR_ENRICH = "TextEditor.enrichHTML";
const $b013a5dd6d18443e$var$TEXTEDITOR_DRAG = "TextEditor._onDragContentLink";
const $b013a5dd6d18443e$var$MACRO_CLICK = "Macro.prototype._onClickDocumentLink";
const $b013a5dd6d18443e$var$MACRO_CREATE_LINK = "Macro.prototype._createDocumentLink";
Hooks.once("libWrapper.Ready", ()=>{
    (0, $3af2587758240bfd$export$4e224afa9c6f52f3)($b013a5dd6d18443e$var$TEXTEDITOR_ENRICH, (0, $b2da6f75e8fb6bf4$export$ccc731d336e1ce2c));
    (0, $3af2587758240bfd$export$4e224afa9c6f52f3)($b013a5dd6d18443e$var$TEXTEDITOR_DRAG, (0, $b2da6f75e8fb6bf4$export$cfffc2eca243e15d), "MIXED");
    (0, $3af2587758240bfd$export$4e224afa9c6f52f3)($b013a5dd6d18443e$var$MACRO_CLICK, (0, $b2da6f75e8fb6bf4$export$eca3d8a5e0023a0f), "MIXED");
    (0, $3af2587758240bfd$export$4e224afa9c6f52f3)($b013a5dd6d18443e$var$MACRO_CREATE_LINK, (0, $453ab70059a13248$export$cdda5b1be25f9499), "MIXED");
});
Hooks.once("ready", ()=>{
    // @ts-ignore
    game.macros.executeMacro = (0, $453ab70059a13248$export$4efd75b42b486b4d);
});
Hooks.on("chatMessage", (0, $cf4c32f03d9bb335$export$71b60514aa72a240));


//# sourceMappingURL=main.js.map
