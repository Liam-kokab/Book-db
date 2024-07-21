export interface ImyAPI {
  readFilesInDir: (string) => Promise<string[]>,
  renderURL: (string) => Promise<string>,
}

declare global {
  interface Window {
    myAPI: IElectronAPI
  }
}
