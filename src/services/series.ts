import { EDocTypes, getDocById } from '../helpers/htmlParser';
import { removeHtmlTags } from '../helpers/string';
import { EBookStatus, TBook, TBookSeries, TDataOrError, TOpenLibraryId } from '../helpers/types';

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
};

export const getSeriesData = async (goodReadSeriesId: string, authorId: TOpenLibraryId): Promise<TDataOrError<TData>> => {
  const docRes = await getDocById(goodReadSeriesId, EDocTypes.series);
  if (!docRes.ok) return docRes;

  const headerElement = docRes.data.querySelector('[data-react-class="ReactComponents.SeriesHeader"]');
  if (!headerElement) return { ok: false, statusCode: 404, error: 'series header not found' };

  const headerDataset: TDataset = 'dataset' in headerElement && headerElement.dataset ? (headerElement.dataset as TDataset) : { reactProps: '{}' };
  const headerProps = JSON.parse(headerDataset.reactProps || '{}') as TSeriesRes;
  if (!headerProps.title) return { ok: false, statusCode: 404, error: 'series title not found' };

  const elements = docRes.data.querySelectorAll('[data-react-class="ReactComponents.SeriesList"]');
  if (!elements.length) return { ok: false, statusCode: 404, error: 'series list not found' };

  const books = Array.from(elements).map((seriesPart) => {
    const seriesDataset: TDataset = 'dataset' in seriesPart && seriesPart.dataset ? (seriesPart.dataset as TDataset) : { reactProps: '{}' };
    const a = JSON.parse(seriesDataset.reactProps || '{ series: [], seriesHeaders: [] }') as { series: TBookRes[], seriesHeaders: string[] };
    const { series = [], seriesHeaders = [] } = a;

    return series.map(({ book }, index): TBook => ({
      title: book.bookTitleBare,
      goodReadId: book.bookId,
      image: book.imageUrl,
      description: removeHtmlTags(book.description?.html || ''),
      goodReadSeriesId,
      bookNum: seriesHeaders[index] || '',
      authorId,
      sortNum: index,
      publicationDate: book.publicationDate,
      lastUpdate: Date.now(),
      bookStatus: EBookStatus.NO_STATUS,
    }));
  }).flatMap((x) => x);

  const bookSeries: TBookSeries = {
    goodReadSeriesId,
    title: headerProps.title,
    description: removeHtmlTags(headerProps.description?.html || ''),
    info: headerProps.subtitle || '',
    lastUpdate: Date.now(),
    books: [],
    tempBooks: books.map((book) => book.goodReadId),
    hiddenBooks: [],
    authorId,
  };

  return {
    ok: true,
    statusCode: 200,
    data: { bookSeries, books },
  };
};
