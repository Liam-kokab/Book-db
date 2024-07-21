import { useContext, useEffect, useState } from 'react';
import { getSeriesData } from '../../services/series';
import { isToOld } from '../date';
import { sleep } from '../promise';
import { EBookStatus, TBookSeries, TOpenLibraryId } from '../types';
import { EActions, StateContext } from './StateProvider';

type TReturn = {
  currentSeries: TBookSeries;
  loading: boolean;
  busy: boolean;
  error: string;
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
  authorId: '',
};

let IS_FETCHING = false;

export const useSeries = (goodReadSeriesId: string, authorId: TOpenLibraryId): TReturn => {
  const [{ series }, dispatch] = useContext(StateContext);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>('');

  const currentSeries = series[goodReadSeriesId] || INIT_SERIES;

  useEffect(() => {
    if (currentSeries.goodReadSeriesId) return;
    if (!goodReadSeriesId) {
      setError('No series id');
      return;
    }

    if (currentSeries.goodReadSeriesId && !isToOld(currentSeries.lastUpdate)) {
      console.log('from storage');
      return;
    }

    if (IS_FETCHING) {
      IS_FETCHING = true;
      return;
    }

    setLoading(true);
    getSeriesData(goodReadSeriesId, authorId)
      .then((res) => {
        IS_FETCHING = false;
        if (res.ok) {
          dispatch({ type: EActions.ADD_SERIES, payload: res.data.bookSeries });
          dispatch({ type: EActions.ADD_BOOKS, payload: res.data.books });
        } else {
          setError(res.error);
        }

        setLoading(false);
      });
  }, [authorId, currentSeries.goodReadSeriesId, currentSeries.lastUpdate, dispatch, goodReadSeriesId]);

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
    loading,
    busy,
    error,
    addBook,
    removeBook,
  };
};
