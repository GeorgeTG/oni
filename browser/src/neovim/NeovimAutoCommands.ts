/**
 * NeovimAutoCommands.ts
 *
 * Strongly typed interface to Neovim's autocommands
 * - To add a new autocommand, make sure it is registered in `init.vim` in the `OniEventListeners` augroup
 */

import { Event, IEvent } from "oni-types"

import { BufferEventContext, EventContext } from "./EventContext"
import { NeovimInstance } from "./NeovimInstance"

export interface INeovimAutoCommands {
    // Autocommands
    onBufEnter: IEvent<BufferEventContext>
    onBufWipeout: IEvent<BufferEventContext>
    onBufWinEnter: IEvent<BufferEventContext>
    onBufDelete: IEvent<BufferEventContext>
    onBufUnload: IEvent<BufferEventContext>
    onBufWritePost: IEvent<EventContext>
    onFileTypeChanged: IEvent<EventContext>
    onWinEnter: IEvent<EventContext>
    onCursorMoved: IEvent<EventContext>
    onCursorMovedI: IEvent<EventContext>
    onVimResized: IEvent<EventContext>

    executeAutoCommand(autoCommand: string): Promise<void>
}

export class NeovimAutoCommands {
    // Autocommand events
    private _nameToEvent: { [key: string]: Event<EventContext | BufferEventContext> }
    private _onBufEnterEvent = new Event<BufferEventContext>("NeovimAutoCommands::onBufEnterEvent")
    private _onBufWritePostEvent = new Event<EventContext>("NeovimAutoCommands::onBufWritePostEvent")
    private _onBufWipeoutEvent = new Event<BufferEventContext>("NeovimAutoCommands::onBufWipeoutEvent")
    private _onBufDeleteEvent = new Event<BufferEventContext>("NeovimAutoCommands::onBufDeleteEvent")
    private _onBufUnloadEvent = new Event<BufferEventContext>("NeovimAutoCommands::onBufUnloadEvent")
    private _onBufWinEnterEvent = new Event<BufferEventContext>("NeovimAutoCommands::onBufWinEnterEvent")
    private _onFileTypeChangedEvent = new Event<EventContext>("NeovimAutoCommands::onFileTypeChangedEvent")
    private _onWinEnterEvent = new Event<EventContext>("NeovimAutoCommands::onWinEnterEvent")
    private _onCursorMovedEvent = new Event<EventContext>("NeovimAutoCommands::onCursorMovedEvent")
    private _onCursorMovedIEvent = new Event<EventContext>("NeovimAutoCommands::onCursorMovedIEvent")
    private _onVimResizedEvent = new Event<EventContext>("NeovimAutoCommands::onVimResizedEvent")

    public get onBufEnter(): IEvent<BufferEventContext> {
        return this._onBufEnterEvent
    }

    public get onBufDelete(): IEvent<BufferEventContext> {
        return this._onBufDeleteEvent
    }

    public get onBufUnload(): IEvent<BufferEventContext> {
        return this._onBufUnloadEvent
    }

    public get onBufWritePost(): IEvent<EventContext> {
        return this._onBufWritePostEvent
    }

    public get onBufWinEnter(): IEvent<BufferEventContext> {
        return this._onBufWinEnterEvent
    }

    public get onBufWipeout(): IEvent<BufferEventContext> {
        return this._onBufWipeoutEvent
    }

    public get onFileTypeChanged(): IEvent<EventContext> {
        return this._onFileTypeChangedEvent
    }

    public get onWinEnter(): IEvent<EventContext> {
        return this._onWinEnterEvent
    }

    public get onCursorMoved(): IEvent<EventContext> {
        return this._onCursorMovedEvent
    }

    public get onCursorMovedI(): IEvent<EventContext> {
        return this._onCursorMovedIEvent
    }

    public get onVimResized(): IEvent<EventContext> {
        return this._onVimResizedEvent
    }

    constructor(private _neovimInstance: NeovimInstance) {
        this._nameToEvent = {
            BufEnter: this._onBufEnterEvent,
            BufWritePost: this._onBufWritePostEvent,
            BufWinEnter: this._onBufWinEnterEvent,
            BufWipeout: this._onBufWipeoutEvent,
            BufUnload: this._onBufUnloadEvent,
            BufDelete: this._onBufDeleteEvent,
            CursorMoved: this._onCursorMovedEvent,
            CursorMovedI: this._onCursorMovedIEvent,
            FileType: this._onFileTypeChangedEvent,
            WinEnter: this._onWinEnterEvent,
            VimResized: this._onVimResizedEvent,
        }
    }

    public notifyAutocommand(autoCommandName: string, context: EventContext): void {
        const evt = this._nameToEvent[autoCommandName]

        if (!evt) {
            return
        }

        evt.dispatch(context)
    }

    public async executeAutoCommand(autoCommand: string): Promise<void> {
        if (!this._neovimInstance.isInitialized) {
            return
        }

        const doesAutoCommandExist = await this._neovimInstance.eval(`exists('#${autoCommand}')`)

        if (doesAutoCommandExist) {
            await this._neovimInstance.command(`doautocmd <nomodeline> ${autoCommand}`)
        }
    }
}
