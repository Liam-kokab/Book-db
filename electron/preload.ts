import { ipcRenderer, contextBridge } from 'electron';
import myAPI from './myAPI/files';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    ipcRenderer.on(channel, (event, ...args1) => listener(event, ...args1));
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    ipcRenderer.invoke(channel, ...omit);
  },
  doAThing1: () => {
    console.log('doing a thing1');
    return 'thing done1';
  },
});

contextBridge.exposeInMainWorld('myAPI', myAPI);
