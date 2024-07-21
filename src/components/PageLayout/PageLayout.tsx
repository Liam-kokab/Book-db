import { ReactNode, useContext } from 'react';
import { classNames } from '../../helpers/classNames';
import { useNavigate } from '../../helpers/state/navigation';
import { EActions, StateContext } from '../../helpers/state/StateProvider';
import { getStateFromStorage } from '../../helpers/state/storage';
import SettingsIcon from '../../assets/settings.svg?react';
import { EPages } from '../../helpers/types';
import Loading from '../Loading/Loading';
import styles from './PageLayout.module.scss';

const IS_DEV = import.meta.env.MODE === 'development';

type Props = {
  children: ReactNode;
  pageName?: string;
  className?: string;
  loading?: boolean;
};

const PageLayout = ({ children, pageName = '', className = '', loading = false }: Props) => {
  const navigate = useNavigate();
  const [state, dispatch] = useContext(StateContext);

  const savaChanges = () => {
    dispatch({ type: EActions.SAVE_STATE });
  };

  const reset = async () => {
    const stateFromStorage = await getStateFromStorage();
    dispatch({ type: EActions.SET_STATE, payload: stateFromStorage });
  };

  return (
    <div className={styles.pageLayout}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Book db! - {pageName}</h1>
          <button
            className={styles.iconButton}
            onClick={() => { navigate({ path: EPages.SETTINGS }); }}
          >
            <SettingsIcon />
          </button>
        </div>
        <div className={styles.buttons}>
          <nav>
            <button
              onClick={() => { navigate({ path: EPages.HOME }); }}
              disabled={!state.hasValidPath}
            >
                Home
            </button>
            <button
              onClick={() => { navigate({ path: EPages.SERIES_OVERVIEW }); }}
              disabled={!state.hasValidPath}
            >
                Series Overview
            </button>
            {
              IS_DEV
                ? <button
                  onClick={() => {
                    navigate({ path: EPages.TEST });
                  }}
                  disabled={!state.hasValidPath}
                >
              Test
                </button>
                : null
            }
          </nav>
          <div>
            <button onClick={() => {console.log(state);}} disabled={!state.hasValidPath}>State</button>
            <button onClick={reset} disabled={!state.hasValidPath}>Reset</button>
            <button onClick={savaChanges} disabled={!state.hasValidPath}>Sava Changes</button>
          </div>
        </div>
      </div>
      <main className={classNames(styles.main, className)}>
        {
          loading
            ? <Loading />
            : children
        }
      </main>
    </div>
  );
};

export default PageLayout;
