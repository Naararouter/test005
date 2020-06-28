import { STORAGE_KEY } from "./consts.js";
import { INoteParams, INoteStore, Note } from "./Note.js";

class NoteStore {
    private dragId = '';
    private isTrashOver = false;
    private items: Record<string, Note> = {};

    get isDragging() {
        return Boolean(this.dragId);
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

    public save = () => {
        const resultState = [];
        for (let key in this.items) {
            resultState.push(this.items[key].toObject());
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(resultState));
    }

    public load = () => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return;

        this.clear();
        try {
            const parsedData = JSON.parse(data);
            parsedData.forEach((dataNote: INoteStore) => {
                this.createNote(dataNote);
            })
        } catch (e) {
            window.console.error('NoteStore error: unexpected json parse error');
        }
    }
}

export const store = new NoteStore();
