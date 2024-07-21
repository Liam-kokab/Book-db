import { createContext, Dispatch, ReactNode, useEffect, useReducer, useRef } from 'react';
import { STORAGE_PATH_VALUE_NAME } from '../../app.config';
import Loading from '../../components/Loading/Loading';
import { TAuthor, TBook, TBookSeries, EBookStatus, TGoodReadId, TState, TPage, EPages } from '../types';
import { addAuthors, addBooks, addPackage, addSeries, changeBookStatus, seriesAddBook, seriesRemoveBook } from './actionFunctions';
import { createBackup, doesDirExist, EBackupType, getStateFromStorage, saveState } from './storage';

export enum EActions {
  ADD_BOOKS = 'ADD_BOOKS',
  ADD_SERIES = 'ADD_SERIES',
  ADD_AUTHORS = 'ADD_AUTHORS',
  SET_STATE = 'SET_STATE',
  SAVE_STATE = 'SAVE_STATE',
  SERIES_ADD_BOOK = 'SERIES_ADD_BOOK',
  SERIES_REMOVE_BOOK = 'SERIES_REMOVE_BOOK',
  CHANGE_BOOK_STATUS = 'CHANGE_BOOK_STATUS',
  HAS_VALID_PATH = 'HAS_VALID_PATH',
  SET_PAGE = 'SET_PAGE',
  ADD_PACKAGE = 'ADD_PACKAGE',
}

const initialState: TState = {
  series: {},
  books: {},
  authors: {},
  ready: false,
  hasValidPath: false,
  currentPage: { path: EPages.HOME },
};

type TAction =
  { type: EActions.SET_PAGE; payload: TPage } |
  { type: EActions.ADD_PACKAGE; payload: { bookSeries: TBookSeries, books: TBook[], author: TAuthor } } |
  { type: EActions.ADD_SERIES; payload: TBookSeries; } |
  { type: EActions.ADD_BOOKS; payload: TBook[]; } |
  { type: EActions.ADD_AUTHORS; payload: TAuthor; } |
  { type: EActions.SET_STATE; payload: Partial<TState>; } |
  { type: EActions.SERIES_ADD_BOOK; payload: { goodReadSeriesId: TGoodReadId, goodReadId: TGoodReadId, bookStatus: EBookStatus }; } |
  { type: EActions.SERIES_REMOVE_BOOK; payload: { goodReadSeriesId: TGoodReadId, goodReadId: TGoodReadId }; } |
  { type: EActions.CHANGE_BOOK_STATUS; payload: { goodReadId: TGoodReadId, bookStatus: EBookStatus }; } |
  { type: EActions.HAS_VALID_PATH; payload: boolean } |
  { type: EActions.SAVE_STATE; };

export const StateContext = createContext<[TState, Dispatch<TAction>]>([
  initialState,
  (state) => state,
]);

const reducer = (state: TState, action: TAction): TState => {
  switch (action.type) {
    case EActions.SET_PAGE:
      return { ...state, currentPage: action.payload };

    case EActions.SET_STATE:
      return { ...state, ...action.payload };

    case EActions.ADD_PACKAGE:
      return addPackage(state, action.payload.books, action.payload.bookSeries, action.payload.author);

    case EActions.ADD_BOOKS:
      return addBooks(state, action.payload);

    case EActions.ADD_SERIES:
      return addSeries(state, action.payload);

    case EActions.SERIES_ADD_BOOK:
      return seriesAddBook(state, action.payload.goodReadSeriesId, action.payload.goodReadId, action.payload.bookStatus);

    case EActions.SERIES_REMOVE_BOOK:
      return seriesRemoveBook(state, action.payload.goodReadSeriesId, action.payload.goodReadId);

    case EActions.CHANGE_BOOK_STATUS:
      return changeBookStatus(state, action.payload.goodReadId, action.payload.bookStatus);

    case EActions.ADD_AUTHORS:
      return addAuthors(state, action.payload);

    case EActions.HAS_VALID_PATH:
      return {
        ...state,
        hasValidPath: action.payload,
      };

    case EActions.SAVE_STATE:
      saveState(state);
      return { ...state };

    default:
      throw new Error('Unknown action type');
  }
};

const onInit = async () => {
  if (!(await doesDirExist())) throw new Error('Storage path does not exist');
  await createBackup(EBackupType.START);
  return getStateFromStorage();
};

const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const storagePath = localStorage.getItem(STORAGE_PATH_VALUE_NAME);
  const hasInit = useRef<boolean>(false);

  useEffect(() => {
    if (!storagePath && state.currentPage.path !== EPages.SETTINGS) {
      console.log('No storage path, navigating to settings');
      dispatch({ type: EActions.SET_PAGE, payload: { path: EPages.SETTINGS } });
    } else if (storagePath && !hasInit.current) {
      onInit()
        .then(async (StateFromStorage) => {
          dispatch({
            type: EActions.SET_STATE, payload: {
              ...StateFromStorage,
              ready: true,
              hasValidPath: true,
            },
          });
          hasInit.current = true;
        })
        .catch(() => {
          if (state.currentPage.path !== EPages.SETTINGS) {
            console.log('Storage path does not exist, navigating to settings');
            dispatch({ type: EActions.SET_PAGE, payload: { path: EPages.SETTINGS } });
          }
          dispatch({ type: EActions.HAS_VALID_PATH, payload: false });
        });
    }
  }, [state.currentPage, storagePath]);

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {
        (state.ready && state.hasValidPath) || state.currentPage.path === EPages.SETTINGS
          ? children
          : <div style={{ width: '100dvw' }}><Loading /></div>
      }
    </StateContext.Provider>
  );
};

export default StateProvider;
