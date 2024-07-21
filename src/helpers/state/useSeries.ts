import { useContext, useState } from 'react';
import { sleep } from '../promise';
import { EBookStatus, TBookSeries } from '../types';
import { EActions, StateContext } from './StateProvider';

type TReturn = {
  currentSeries: TBookSeries;
  busy: boolean;
  addBook: (goodReadId: string, status?: EBookStatus) => void;
  removeBook: (goodReadId: string) => void;
};

const INIT_SERIES: TBookSeries = {
  goodReadSeriesId: '',
  title: 'NO_TITLE',
  description: '',
  info: '',
  lastUpdate: 0,
  books: [],
  tempBooks: [],
  hiddenBooks: [],
  goodReadAuthorId: '',
};

export const useSeries = (goodReadSeriesId: string): TReturn => {
  const [{ series }, dispatch] = useContext(StateContext);
  const [busy, setBusy] = useState(false);

  const currentSeries = series[goodReadSeriesId] || INIT_SERIES;

  const addBook = async (goodReadId: string, bookStatus: EBookStatus = EBookStatus.NO_STATUS) => {
    if (!goodReadId) return;
    setBusy(true);

    dispatch({ type: EActions.SERIES_ADD_BOOK, payload: { goodReadSeriesId, goodReadId, bookStatus } });
    await sleep(20);
    setBusy(false);
  };

  const removeBook = async (goodReadId: string) => {
    setBusy(true);
    if (!goodReadId) return;

    dispatch({ type: EActions.SERIES_REMOVE_BOOK, payload: { goodReadSeriesId, goodReadId } });
    await sleep(20);
    setBusy(false);
  };

  return {
    currentSeries,
    busy,
    addBook,
    removeBook,
  };
};
