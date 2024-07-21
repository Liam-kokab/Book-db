import { STORAGE_PATH_VALUE_NAME } from '../../app.config';
import { parseJson, stringifyJson } from '../json';
import { debounce } from '../debounce';
import { TState } from '../types';

const STORAGE_FILE = 'storage.txt';
const MAX_BACKUP_FILES = 10;
export enum EBackupType {
  START = 'start',
  INTERVAL = 'interval',
}

const getTimeStampSeconds = () => Math.floor(Date.now() / 1000);

export const doesDirExist = async (): Promise<boolean> => window.myAPI.doesDirExist(localStorage.getItem(STORAGE_PATH_VALUE_NAME) || '');

export const getStateFromStorage = async (): Promise<Partial<TState>> => {
  const storagePath = localStorage.getItem(STORAGE_PATH_VALUE_NAME) || '';
  try {
    const stateAsString = await window.myAPI.readFile(`${storagePath}/${STORAGE_FILE}`);
    return parseJson<Partial<TState>>(stateAsString);
  } catch (e) {
    console.log('Error reading state from storage', e);
    return {} as Partial<TState>;
  }
};

export const createBackup = async (backupType: EBackupType) => {
  const storagePath = localStorage.getItem(STORAGE_PATH_VALUE_NAME) || '';
  try {
    await window.myAPI.createDirIfNotExist(`${storagePath}/${backupType}`);
    await window.myAPI.copyFile(`${storagePath}/${STORAGE_FILE}`, `${storagePath}/${backupType}/${getTimeStampSeconds()}.txt`);
  } catch (e) {
    console.log('Error creating backup', e);
    // no file to back up
    return;
  }

  const backupFiles = await window.myAPI.readFilesInDir(`${storagePath}/${backupType}`);

  const maxBackupFiles = backupType === EBackupType.INTERVAL ? MAX_BACKUP_FILES * 3 : MAX_BACKUP_FILES;

  if (backupFiles.length > maxBackupFiles + 5) {
    const toDelete = backupFiles.sort().slice(0, backupFiles.length - maxBackupFiles);
    await Promise.all(toDelete.map((file: string) => window.myAPI.deleteFile(`${storagePath}/${backupType}/${file}`)));
  }
};

const debouncedSaveState = debounce(async (state: TState) => {
  const storagePath = localStorage.getItem(STORAGE_PATH_VALUE_NAME) || '';
  try {
    const backUpSate = {
      series: state.series,
      books: state.books,
      authors: state.authors,
    };

    await createBackup(EBackupType.INTERVAL).catch((e) => console.log('Error creating backup 1', e));
    await window.myAPI.writeFile(`${storagePath}/${STORAGE_FILE}`, stringifyJson(backUpSate));
  } catch (e) {
    console.log('Error saving state to storage', e);
  }
}, 2000);

export const saveState = async (state: TState) => {
  await debouncedSaveState(state);
};
