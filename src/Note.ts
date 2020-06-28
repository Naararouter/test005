import { ROOT_NODE, MS_FPS_60, DEFAULT_COLOR } from "./consts.js";
import { throttle } from "./tools/throttle.js";
import { store } from "./Store.js";
import { bringToFrontIconLayout } from "./icons/bringToFront.js";

export interface INoteStore {
    id: string;
    textAreaStyles: {
        width?: string;
        height?: string;
    }
    value: string;
    color: string;
    zIndex: string;
}

export interface INoteParamsBase extends INoteStore {
    x: number;
    y: number;
}

export type INoteParams = Partial<INoteParamsBase>;

export class Note {
    private isDrag = false;
    private lastX = 0;
    private lastY = 0;
    private offsetMouseX = 0;
    private offsetMouseY = 0;

    private wrapNode: HTMLSpanElement | null = null;
    private headerNode: HTMLDivElement | null = null;
    private textAreaNode: HTMLTextAreaElement | null = null;
    private colorInputNode: HTMLInputElement | null = null;

    private bodyListener: (() => void) | null = null;

    private readonly _id: string = '';

    constructor(params: INoteParams) {
        const { x = 0, y = 0, id } = params;
        this._id = id || Math.random().toString().substring(2);
        this.lastX = x;
        this.lastY = y;
        this.createNodes(params);
        this.createHandlers();
    }

    get id() {
        return this._id;
    }

    private createHandlers() {
        if (this.headerNode && this.wrapNode && this.textAreaNode) {
            this.wrapNode.onmousedown = (e) => {
                e.stopPropagation();
            }
            this.headerNode.onmousedown = (e) => {
                store.enableDragging(this.id);
                this.isDrag = true;
                this.offsetMouseX = e.clientX - this.lastX;
                this.offsetMouseY = e.clientY - this.lastY;
            }
            this.headerNode.oncontextmenu = (e) => {
                e.preventDefault();
                return false;
            }
            this.headerNode.onmouseup = (e) => {
                store.disableDragging();
                this.isDrag = false;
            }
            this.bodyListener = throttle((e: MouseEvent) => {
                if (!this.isDrag) return;

                if (this.wrapNode) {
                    this.lastX = e.clientX - this.offsetMouseX;
                    this.lastY = e.clientY - this.offsetMouseY;
                    this.wrapNode.style.transform = `translate(${this.lastX}px, ${this.lastY}px)`;
                }
            }, MS_FPS_60, true);

            document.body.addEventListener('mousemove', this.bodyListener);
        } else {
            throw Error('Note constructor: unexpected error');
        }
    }

    private createNodes({ x = 0, y = 0, value, textAreaStyles, color, zIndex }: INoteParams) {
        const wrap = document.createElement('span');
        wrap.classList.add('note');
        let transform = 'translate(';
        transform += x > 0 ? `${x}px` : '0px';
        transform += y > 0 ? `, ${y}px)` : ', 0px)';
        // as I found, in the modern browser we won't call an unnecessary layout trashing until
        // node wasn't placed in real DOM like in 110 line;
        wrap.style.transform = transform;
        if (color) wrap.style.backgroundColor = color;
        if (zIndex) wrap.style.zIndex = zIndex;

        const noteHeader = document.createElement('div');
        noteHeader.classList.add('note-header');
        this.headerNode = noteHeader;

        const colorInput = this.createColorInput(color);
        const textarea = this.createTextArea(value, textAreaStyles);
        const bringToFrontIcon = this.creatBringToFrontIcon();

        noteHeader.appendChild(colorInput);
        noteHeader.appendChild(bringToFrontIcon);
        wrap.appendChild(noteHeader);
        wrap.appendChild(textarea);

        ROOT_NODE.appendChild(wrap);
        this.wrapNode = wrap;
    }

    private creatBringToFrontIcon() {
        const container = document.createElement('div');
        container.insertAdjacentHTML('afterbegin', bringToFrontIconLayout);
        const svg = container.children[0] as HTMLElement;
        svg.onclick = () => {
            const wrap = this.wrapNode;
            if (wrap && (!wrap.style.zIndex || +wrap.style.zIndex < store.frontCounter)) {
                store.incFrontCounter();
                wrap.style.zIndex = `${store.frontCounter}`;
            }
        }
        return svg;
    }

    private createColorInput(color: string | undefined) {
        const colorInput = document.createElement('input');
        colorInput.classList.add('note-color');
        colorInput.setAttribute('type', 'color');
        colorInput.onchange = (e) => {
            if (this.wrapNode && e.target) this.wrapNode.style.backgroundColor = e.target.value;
        }
        colorInput.value = color || DEFAULT_COLOR;
        this.colorInputNode = colorInput;
        return colorInput;
    }

    private createTextArea(value: string | undefined, textAreaStyles?: INoteStore["textAreaStyles"]) {
        const textarea = document.createElement('textarea');
        textarea.classList.add('note-text');
        if (value) textarea.value = value;
        if (textAreaStyles?.width && textAreaStyles.height) {
            textarea.style.width = textAreaStyles.width;
            textarea.style.height = textAreaStyles.height;
        }
        this.textAreaNode = textarea;
        return textarea;
    }

    private removeBodyListener() {
        if (this.bodyListener) {
            document.body.removeEventListener('mousemove', this.bodyListener);
        }
    }

    public remove() {
        this.wrapNode?.remove();
        this.removeBodyListener();
        this.wrapNode = null;
        this.headerNode = null;
        this.textAreaNode = null;
        this.colorInputNode = null;
    }

    public toObject() {
        const textAreaStyles = this.textAreaNode?.style;
        return {
            id: this._id,
            x: this.lastX,
            y: this.lastY,
            textAreaStyles: {
                width: textAreaStyles?.width,
                height: textAreaStyles?.height,
            },
            color: this.colorInputNode?.value,
            value: this.textAreaNode?.value,
            zIndex: this.wrapNode?.style.zIndex
        };
    }
}
