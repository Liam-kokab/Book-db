import { fetch2 } from '../helpers/fetch';
import { EBookStatus, TAuthor, TBook, TDataOrError, TOpenLibraryId } from '../helpers/types';
import { getAuthors } from './author';
import { getGoodReadBookData } from './book';

type TBookRes = {
  title: string;
  author_name: string[];
  author_key: string[];
  cover_i: string;
  key: string;
  first_publish_year: number;
  publisher: string[];
  language: string[];
  isbn: string[];
  subject: string[];
  publish_place: string[];
  publish_date: string[];
  edition_count: number;
  id_goodreads: string[];
};

export type TBookWithAuthor = TBook & {
  author: TAuthor
};

type TSearchRes = {
  docs: TBookRes[];
  numFound: number;
  numFoundExact: boolean;
};

export type TBookSearchReturn = {
  totalItems: number;
  books: TBookWithAuthor[];
};

type TWorkRes = {
  title: string;
  description: {
    value: string;
  };
  key: string;
};

const getDescriptions = async (bookKey: string): Promise<TDataOrError<string>> => {
  const res = await fetch2<TWorkRes>(`https://openlibrary.org${bookKey}.json`);

  if (!res.ok) return { ok: false, statusCode: res.statusCode, error: 'error when getting book!' };

  return {
    ok: true,
    statusCode: 200,
    data: res.data.description?.value || '',
  };
};

export const search = async (bookName: string, authorName: string, authors: Record<TOpenLibraryId, TAuthor | undefined>)
: Promise<TDataOrError<TBookSearchReturn>> => {
  const bookNameQ = bookName.trim().split(' ').join('+');
  const authorNameQ = authorName.trim().split(' ').join('+');
  const res = await fetch2<TSearchRes>(`https://openlibrary.org/search.json?title=${bookNameQ}&author=${authorNameQ}&lang=en`);

  if (!res.ok) return { ok: false, statusCode: res.statusCode, error: 'error when searching!' };

  const authorsRes = await getAuthors(res.data.docs.map((book) => book.author_key[0]), authors);
  if (!authorsRes.ok) return { ok: false, statusCode: authorsRes.statusCode, error: 'error when getting authors!' };
  const authorsData = authorsRes.data;

  const books = await Promise.allSettled(res.data.docs.map(async (book): Promise<TBookWithAuthor> => {
    const author = authorsData.find((a: TAuthor) => a.id === book.author_key[0]);
    if (!author) throw new Error('author not found!');

    const [
      descriptionRes,
      goodReadBookDataRes,
    ] = await Promise.all([
      getDescriptions(book.key),
      getGoodReadBookData(book.id_goodreads[0]),
    ]);

    if (!goodReadBookDataRes.ok) throw new Error('error when getting goodReadBookData!');
    if (!descriptionRes.ok) throw new Error('error when getting description!');

    return {
      title: book.title,
      author,
      authorId: book.author_key[0],
      description: descriptionRes.data,
      image: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
      goodReadId: book.id_goodreads[0] || '',
      goodReadSeriesId: goodReadBookDataRes.data.goodReadSeriesId,
      bookNum: '',
      lastUpdate: Date.now(),
      sortNum: -1,
      publicationDate: book.first_publish_year ? `${book.first_publish_year}` : '',
      bookStatus: EBookStatus.NO_STATUS,
    };
  }));

  return {
    ok: true,
    statusCode: 200,
    data: {
      totalItems: res.data.numFound,
      books: books
        .filter(book => book.status === 'fulfilled')
        .flatMap((book) => book.status === 'fulfilled' ? book.value : []),
    },
  };
};
