export type TDataOrError<T> = {
  ok: true;
  statusCode: number;
  data: T;
} | {
  ok: false;
  statusCode: number;
  error: string;
};

export type TGoodReadId = string;
export type TOpenLibraryId = string;

export enum EBookStatus {
  NO_STATUS = 'NO_STATUS',
  NOT_RELEASED = 'NOT_RELEASED',
  NOT_DOWNLOADED = 'NOT_DOWNLOADED',
  NOT_READ = 'NOT_READ',
  READ = 'READ',
}

export type TAuthor = {
  name: string;
  id: TOpenLibraryId;
  key: string;
  image: string;
  birthDate: string;
};

export type TBook = {
  title: string;
  authorId: TOpenLibraryId;
  description: string;
  image: string;
  goodReadId: TGoodReadId;
  goodReadSeriesId: TGoodReadId;
  bookNum: string;
  sortNum: number;
  lastUpdate: number;
  bookStatus: EBookStatus;
  publicationDate: string;
};

export type TBookSeries = {
  goodReadSeriesId: TGoodReadId;
  title: string;
  description: string;
  info: string;
  lastUpdate: number;
  books: TGoodReadId[];
  tempBooks: TGoodReadId[];
  hiddenBooks: TGoodReadId[];
  authorId: TOpenLibraryId;
};

export enum EPages {
  HOME = 'HOME',
  BOOK_SERIES  = 'BOOK_SERIES',
  SERIES_OVERVIEW = 'SERIES_OVERVIEW',
  SETTINGS = 'SETTINGS',
  TEST = 'TEST',
}

export type TPage = (
  { path: EPages.HOME | EPages.SERIES_OVERVIEW | EPages.SETTINGS | EPages.TEST; } |
  { path: EPages.BOOK_SERIES; goodReadSeriesId: TGoodReadId; authorId: TOpenLibraryId; }
);

export type TState = {
  books: Record<TGoodReadId, TBook | undefined>;
  series: Record<TGoodReadId, TBookSeries | undefined>;
  authors: Record<TOpenLibraryId, TAuthor | undefined>;
  ready: boolean;
  hasValidPath: boolean;
  currentPage: TPage;
};
