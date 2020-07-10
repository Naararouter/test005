import { INoteParams, INoteStore, Note } from "./Note.js";
import { callMockApi } from "./MockApi.js";

class NoteStore {
    private dragId = '';
    private isTrashOver = false;
    private items: Record<string, Note> = {};
    private _frontCounter = 0;

    get isDragging() {
        return Boolean(this.dragId);
    }

    get frontCounter() {
        return this._frontCounter;
    }

    public incFrontCounter() {
        this._frontCounter++;
    }

    public createNote(params: INoteParams) {
        const note = new Note(params);
        this.items[note.id] = note;
    }
    public removeNote(id: string) {
        this.items[id].remove();
        delete this.items[id];
    }

    public enableIsTrashOver() {
        this.isTrashOver = true;
    }

    public disableIsTrashOver() {
        this.isTrashOver = false;
    }

    public enableDragging(id: string) {
        this.dragId = id;
    }

    public disableDragging() {
        if (this.isTrashOver) {
            this.removeNote(this.dragId);
        }
        this.dragId = '';
    }

    public clear = () => {
        for (let key in this.items) {
            this.items[key].remove();
        }
    }

    public save = async () => {
        const items = [];
        for (let key in this.items) {
            items.push(this.items[key].toObject());
        }

        await callMockApi('set', JSON.stringify({
            items,
            frontCounter: this._frontCounter
        }))
    }

    public load = async () => {
        const data = await callMockApi('get');
        if (!data) return;

        this.clear();
        try {
            const parsedData = JSON.parse(data);
            parsedData.items.forEach((dataNote: INoteStore) => {
                this.createNote({ ...dataNote, isFromStore: true });
            })
            this._frontCounter = parsedData.frontCounter;
        } catch (e) {
            window.console.error('NoteStore error: unexpected json parse error');
        }
    }
}

export const store = new NoteStore();
