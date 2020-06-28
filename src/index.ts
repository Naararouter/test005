import { ROOT_NODE } from "./consts.js";
import { store } from "./Store.js";
import { trashZoneActivate } from "./TrashZone.js";

const toolbarSave = document.getElementById('save')!;
const toolbarLoad = document.getElementById('load')!;

toolbarSave.onclick = store.save;
toolbarLoad.onclick = store.load;

ROOT_NODE.onmousedown = function (e) {
    store.createNote({x: e.clientX, y: e.clientY});
}

trashZoneActivate();
store.load();
