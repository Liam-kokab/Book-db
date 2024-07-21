import fs from 'node:fs';

const readFilesInDir = async (dir: string): Promise<string[]> => fs.promises.readdir(dir);
const readFile = async (path: string): Promise<string> => fs.promises.readFile(path, 'utf-8');
const writeFile = async (path: string, data: string): Promise<void> => fs.promises.writeFile(path, data, { encoding: 'utf-8', flag: 'w' });
const copyFile = async (src: string, dest: string): Promise<void> => fs.promises.copyFile(src, dest);
const deleteFile = async (path: string): Promise<void> => fs.promises.unlink(path);

const doesDirExist = async (path: string): Promise<boolean> => {
  try {
    await fs.promises.access(path);
    return true;
  } catch (e) {
    return false;
  }
};

const createDirIfNotExist = async (path: string): Promise<void> => {
  try {
    await fs.promises.access(path);
  } catch (e) {
    await fs.promises.mkdir(path);
  }
};

export default {
  readFilesInDir,
  readFile,
  writeFile,
  copyFile,
  deleteFile,
  createDirIfNotExist,
  doesDirExist,
};
