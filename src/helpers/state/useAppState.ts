import { useContext } from 'react';
import { StateContext } from './StateProvider';
import { TAuthor, TBook, TBookSeries, TGoodReadId, TOpenLibraryId } from '../types';

type TReturn = {
  getBook: (goodReadId: TGoodReadId) => TBook | undefined;
  getSeries: (goodReadSeriesId: TGoodReadId) => TBookSeries | undefined;
  getAuthor: (authorId: TOpenLibraryId) => TAuthor | undefined;
};

export const useAppState = (): TReturn => {
  const [state] = useContext(StateContext);

  return {
    getBook: (goodReadId: TGoodReadId) => state.books[goodReadId],
    getSeries: (goodReadSeriesId: TGoodReadId) => state.series[goodReadSeriesId],
    getAuthor: (authorId: TOpenLibraryId) => state.authors[authorId],
  };
};

