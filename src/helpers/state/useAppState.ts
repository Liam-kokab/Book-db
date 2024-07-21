import { useContext } from 'react';
import { StateContext } from './StateProvider';
import { TAuthor, TBook, TBookSeries, TGoodReadId } from '../types';

type TReturn = {
  getBook: (goodReadId: TGoodReadId) => TBook | undefined;
  getSeries: (goodReadSeriesId: TGoodReadId) => TBookSeries | undefined;
  getAuthor: (goodReadAuthorId: TGoodReadId) => TAuthor | undefined;
};

export const useAppState = (): TReturn => {
  const [state] = useContext(StateContext);

  return {
    getBook: (goodReadId: TGoodReadId) => state.books[goodReadId],
    getSeries: (goodReadSeriesId: TGoodReadId) => state.series[goodReadSeriesId],
    getAuthor: (goodReadAuthorId: TGoodReadId) => state.authors[goodReadAuthorId],
  };
};

