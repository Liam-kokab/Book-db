import { EDocTypes, getDocById } from '../helpers/htmlParser';
import { removeHtmlTags } from '../helpers/string';
import { EBookStatus, TAuthor, TBook, TBookSeries, TDataOrError } from '../helpers/types';

type TDataset = {
  reactProps: string;
};

type TSeriesRes = {
  title?: string;
  subtitle?: string;
  description?: {
    html: string;
  };
};

type TBookRes = {
  book: {
    imageUrl: string;
    bookTitleBare: string;
    bookId: string;
    publicationDate: string;
    author: {
      name: string;
      id: number;
      profileUrl: string;
    };
    description?: {
      html: string;
    };
  };
  isLibrarianView: boolean;
};

type TData = {
  bookSeries: TBookSeries;
  books: TBook[];
  author: TAuthor;
};

const getAuthor = async (series: (TBookRes & { bookNum: string })[]): Promise<TDataOrError<TAuthor>> => {
  const authorList: { id: string, count: number, name: string }[] = [];

  series.forEach(({ book }) => {
    const index = authorList.findIndex((a) => a.id === book.author.id.toString());
    if (index !== -1) {
      authorList[index].count += 1;
    } else {
      authorList.push({
        name: book.author.name,
        id: book.author.id.toString(),
        count: 1,
      });
    }
  });

  if (authorList.length === 0) return { ok: false, statusCode: 404, error: 'author not found' };

  authorList.sort((a, b) => b.count - a.count);
  const docRes = await getDocById( authorList[0].id, EDocTypes.author);
  if (!docRes.ok) return docRes;

  const birthDate = docRes.data.querySelector('[itemprop="birthDate"]');

  const images = docRes.data.querySelectorAll('img');
  const image = Array.from(images).map((img) => img.src).find(src => src.includes('authors'));

  return {
    ok: true,
    statusCode: docRes.statusCode,
    data: {
      id: authorList[0].id,
      name: authorList[0].name,
      birthDate: birthDate ? birthDate.textContent || '' : '',
      image: image || '',
      key: '',
    },
  };
};

export const getSeriesData = async (goodReadSeriesId: string): Promise<TDataOrError<TData>> => {
  const docRes = await getDocById(goodReadSeriesId, EDocTypes.series);
  if (!docRes.ok) return docRes;

  const headerElement = docRes.data.querySelector('[data-react-class="ReactComponents.SeriesHeader"]');
  if (!headerElement) return { ok: false, statusCode: 404, error: 'series header not found' };

  const headerDataset: TDataset = 'dataset' in headerElement && headerElement.dataset ? (headerElement.dataset as TDataset) : { reactProps: '{}' };
  const headerProps = JSON.parse(headerDataset.reactProps || '{}') as TSeriesRes;
  if (!headerProps.title) return { ok: false, statusCode: 404, error: 'series title not found' };

  const elements = docRes.data.querySelectorAll('[data-react-class="ReactComponents.SeriesList"]');
  if (!elements.length) return { ok: false, statusCode: 404, error: 'series list not found' };

  const bookListRes = Array.from(elements).flatMap((seriesPart) => {
    const seriesDataset: TDataset = 'dataset' in seriesPart && seriesPart.dataset ? (seriesPart.dataset as TDataset) : { reactProps: '{}' };
    const { series = [], seriesHeaders = [] } = JSON.parse(seriesDataset.reactProps || '{ series: [], seriesHeaders: [] }') as { series: TBookRes[], seriesHeaders: string[] };

    return series.map((book, index): TBookRes & { bookNum: string } => ({
      ...book,
      bookNum: seriesHeaders[index] || '',
    }));
  });

  const author = await getAuthor(bookListRes);
  if (!author.ok) return author;

  const books = bookListRes.map(({ book, bookNum }, index) => ({
    title: book.bookTitleBare,
    goodReadId: book.bookId,
    image: book.imageUrl,
    description: removeHtmlTags(book.description?.html || ''),
    goodReadSeriesId,
    bookNum,
    authorId: author.data.id,
    sortNum: index,
    publicationDate: book.publicationDate,
    lastUpdate: Date.now(),
    bookStatus: EBookStatus.NO_STATUS,
  }));

  const bookSeries: TBookSeries = {
    goodReadSeriesId,
    title: headerProps.title,
    description: removeHtmlTags(headerProps.description?.html || ''),
    info: headerProps.subtitle || '',
    lastUpdate: Date.now(),
    books: [],
    tempBooks: books.map((book) => book.goodReadId),
    hiddenBooks: [],
    authorId: author.data.id,
  };

  return {
    ok: true,
    statusCode: 200,
    data: { bookSeries, books, author: author.data },
  };
};
