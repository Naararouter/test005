import { ENABLE_CLASS, LOADER_NODE, NOTIFY_NODE, STORAGE_KEY } from "./consts.js";

export function callMockApi(method: 'set' | 'get', data?: string) {
    return new Promise<string | null>((resolve, reject) => {
        LOADER_NODE.classList.add(ENABLE_CLASS);
        setTimeout(() => {
            if (method === 'set' && data) {
                localStorage.setItem(`${STORAGE_KEY}_ASYNC`, data);
                resolve('done');
            } else {
                resolve(localStorage.getItem(`${STORAGE_KEY}_ASYNC`));
            }
        }, Math.random() * 10000)
    })
        .then(result => {
            LOADER_NODE.classList.remove(ENABLE_CLASS);
            NOTIFY_NODE.innerHTML = `Data has been ${method === 'set' ? 'saved' : 'loaded'}!`;
            NOTIFY_NODE.classList.add(ENABLE_CLASS, method);
            setTimeout(() => {
                NOTIFY_NODE.classList.remove(ENABLE_CLASS, method);
            }, 2000);
            return result;
        });
}
