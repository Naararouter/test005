import { throttle } from "./tools/throttle.js";
import { store } from "./Store.js";
import { MS_FPS_60 } from "./consts.js";

export function trashZoneActivate() {
    let trashZoneHeight = Number(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--trash-zone-height')
            .slice(0, -2)
    );

    const trashZone = document.getElementById('trash')!;
    const trashZoneClasses = trashZone.classList;

    const innerHeight = window.innerHeight;

    document.body.addEventListener('mousemove', throttle((e: MouseEvent) => {
        if (innerHeight - e.clientY <= trashZoneHeight && store.isDragging) {
            if (!trashZoneClasses.contains('drag-over')) {
                trashZoneClasses.add('drag-over');
                store.enableIsTrashOver();
            }
        } else {
            if (trashZoneClasses.contains('drag-over')) {
                trashZoneClasses.remove('drag-over');
                store.disableIsTrashOver();
            }
        }
    }, MS_FPS_60, true));
}
