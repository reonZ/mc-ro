# FoundryVTT McRo

This module will offer the ability to add arguments to chat and inline macros. The arguments will be passed to the macro in the form of an array of string or number in a parameter named `args`.

Macros can be called using a number representing the slot in the hotbar, using the macro id or using the macro name. If the macro name or any argument contains spaces, you need to enclose them with double-quotes.

Macros called with this module are still subject to user permissions.

# Chat

You can add arguments simply by separating them with a space while using the macro chat command.

    /macro "Macro Name" arg1 arg2 "arg 3"

In the macro, you can access those arguments by using `args[0]`, `args[1]` and `args[2]`

# Inline

You can create an inline macro with arguments in any document (could also be used in the chat directly). A different icon ![](./readme/icon.webp) will be used to highlight inline macros that contain arguments.

Note: Inline macro are fully draggable and will carry over their arguments.

    @Macro[Macro Name](arg1 arg2 "arg 3")

Just like a regular inline macro link, you can also set a label for it.

    @Macro[Macro Name]("Hello World!!" 42){Macro Label}

-   `args[0]` would be equal to the string `Hello World!!`
-   `args[1]` would be equal to the number `42`.

# API

A new `executeMacro` function has been added to be used with extra arguments, this is useful if you want to call a macro with arguments from within another macro.

```js
/**
 * @param {number | string} id can be a hotbar slot, a macro id or a macro name
 * @param {Array<string | number>} args passed to the macro
 * @returns {Promise<unknow>} macros are async and can return anything
 */
game.macros.executeMacro(id, args)
```

# CHANGELOG

You can see the changelog [HERE](./CHANGELOG.md)