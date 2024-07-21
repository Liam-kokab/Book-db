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

export enum EBookStatus {
  NO_STATUS = 'NO_STATUS',
  NOT_RELEASED = 'NOT_RELEASED',
  NOT_DOWNLOADED = 'NOT_DOWNLOADED',
  NOT_READ = 'NOT_READ',
  READ = 'READ',
}

export type TAuthor = {
  name: string;
  goodReadAuthorId: TGoodReadId;
  key: string;
  image: string;
  birthDate: string;
};

export type TBook = {
  title: string;
  goodReadAuthorId: TGoodReadId;
  description: string;
  image: string;
  goodReadBookId: TGoodReadId;
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
  goodReadAuthorId: TGoodReadId;
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
  { path: EPages.BOOK_SERIES; goodReadSeriesId: TGoodReadId; }
);

export type TState = {
  books: Record<TGoodReadId, TBook | undefined>;
  series: Record<TGoodReadId, TBookSeries | undefined>;
  authors: Record<TGoodReadId, TAuthor | undefined>;
  ready: boolean;
  hasValidPath: boolean;
  currentPage: TPage;
};
