import { EBookStatus, TBook, TGoodReadId, TState } from '../types';

const getBookListSorted = (state: TState, bookList: TGoodReadId[]): TGoodReadId[] =>
  [...bookList].sort((a, b) => {
    const bookA = state.books[a];
    const bookB = state.books[b];
    if (!bookA || !bookB) return 0;
    return bookA.sortNum - bookB.sortNum;
  });

export const seriesAddBook = (state: TState, goodReadSeriesId: TGoodReadId, goodReadId: TGoodReadId, bookStatus: EBookStatus): TState => {
  const series = state.series[goodReadSeriesId];
  const book = state.books[goodReadId];
  if (!series || !book) return state;
  return {
    ...state,
    series: {
      ...state.series,
      [goodReadSeriesId]: {
        ...series,
        books: getBookListSorted(state, [...series.books, goodReadId]),
        tempBooks: series.tempBooks.filter((bookId) => bookId !== goodReadId),
        hiddenBooks: series.hiddenBooks.filter((bookId) => bookId !== goodReadId),
      },
    },
    books: {
      ...state.books,
      [goodReadId]: { ...book, bookStatus },
    },
  };
};

export const seriesRemoveBook = (state: TState, goodReadSeriesId: TGoodReadId, goodReadId: TGoodReadId): TState => {
  const series = state.series[goodReadSeriesId];
  if (!series) return state;
  return {
    ...state,
    series: {
      ...state.series,
      [goodReadSeriesId]: {
        ...series,
        hiddenBooks: getBookListSorted(state, [...series.hiddenBooks, goodReadId]),
        tempBooks: series.tempBooks.filter((bookId) => bookId !== goodReadId),
        books: series.books.filter((bookId) => bookId !== goodReadId),
      },
    },
  };
};

export const addBooks = (state: TState, books: TBook[]): TState => {
  const newBooks = books.reduce((acc, book) => ({ ...acc, [book.goodReadId]: book }), {});
  return {
    ...state,
    books: { ...state.books, ...newBooks },
  };
};

export const changeBookStatus = (state: TState, goodReadId: TGoodReadId, bookStatus: EBookStatus): TState => {
  const book = state.books[goodReadId];
  if (!book) return state;
  return {
    ...state,
    books: {
      ...state.books,
      [goodReadId]: { ...book, bookStatus },
    },
  };
};
