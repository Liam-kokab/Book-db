import { EBookStatus, TAuthor, TBook, TBookSeries, TGoodReadId, TState } from '../types';

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
  const newBooks: Record<string, TBook> = {};
  books.forEach((book) => {
    const prevBook = state.books[book.goodReadBookId];
    newBooks[book.goodReadBookId] = {
      ...book,
      bookStatus: prevBook ? prevBook.bookStatus : EBookStatus.NO_STATUS,
    };
  });

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

export const addAuthors = (state: TState, author: TAuthor): TState => {
  return {
    ...state,
    authors: {
      ...state.authors,
      [author.goodReadAuthorId]: author,
    },
  };
};

export const addSeries = (state: TState, series: TBookSeries): TState => {
  const emptyArrays: { books: string[], tempBooks: string[], hiddenBooks: string[] } = { books: [], tempBooks: [], hiddenBooks: [] };
  const prevSeries = state.series[series.goodReadSeriesId] || { ...emptyArrays };

  const newSeriesTempBooks = series.tempBooks
    .filter((bookId) => !prevSeries.books.includes(bookId) && !prevSeries.hiddenBooks.includes(bookId));

  return {
    ...state,
    series: {
      ...state.series,
      [series.goodReadSeriesId]: {
        ...series,
        books: getBookListSorted(state, prevSeries.books),
        tempBooks: getBookListSorted(state, newSeriesTempBooks),
        hiddenBooks: getBookListSorted(state, prevSeries.hiddenBooks),
      },
    },
  };
};

export const addPackage = (state: TState, books: TBook[], bookSeries: TBookSeries, author: TAuthor): TState => {
  return {
    ...state,
    books: addBooks(state, books).books,
    series: addSeries(state, bookSeries).series,
    authors: addAuthors(state, author).authors,
  };
};
