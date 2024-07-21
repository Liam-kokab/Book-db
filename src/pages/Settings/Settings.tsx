import { ChangeEvent, useContext, useState } from 'react';

import { STORAGE_PATH_VALUE_NAME } from '../../app.config';
import PageLayout from '../../components/PageLayout/PageLayout';
import { EActions, StateContext } from '../../helpers/state/StateProvider';
import styles from './Settings.module.scss';

const Settings = () => {
  const [, dispatch] = useContext(StateContext);
  const [storagePath, setStoragePath] = useState<string>(localStorage.getItem(STORAGE_PATH_VALUE_NAME) || '');

  const onFolderPathChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setStoragePath(event.target.value);
    localStorage.setItem(STORAGE_PATH_VALUE_NAME, event.target.value);
    const hasValidPath = await window.myAPI.doesDirExist(event.target.value);
    dispatch({ type: EActions.HAS_VALID_PATH, payload: hasValidPath });
  };

  return (
    <PageLayout className={styles.settingsPage} pageName="Settings">
      <h2>Settings</h2>
      <div className={styles.setting}>
        <label htmlFor="folderPathInput">Storage folder path</label>
        <input type="text" id="folderPathInput" onChange={onFolderPathChange} value={storagePath}/>
      </div>
    </PageLayout>
  );
};

export default Settings;
