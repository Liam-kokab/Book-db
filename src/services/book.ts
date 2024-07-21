import { fetch2 } from '../helpers/fetch';
import { EDocTypes, getDocById } from '../helpers/htmlParser';
import { getValueByKey } from '../helpers/object';
import { TDataOrError } from '../helpers/types';

type TBookCommon = {
  title: string;
  subjects: string[];
};

type TBookRes = TBookCommon & {
  key: string;
  authors: [{ key: string }];
  covers: number[];
};

type TBookReturn = TBookCommon & {
  id: string;
  authorId: string;
  image?: string;
};

export const getBookByISBN = async (isbn: string): Promise<TDataOrError<TBookReturn>> => {
  try {
    const bookRes = await fetch2<TBookRes>(`https://openlibrary.org/isbn/${isbn}.json`);
    if (!bookRes.ok) return bookRes;

    const id = bookRes.data.key.split('/').at(-1) || '';
    const authorId = bookRes.data.authors[0]?.key?.split('/').at(-1) || '';
    const image = bookRes.data.covers.at(-1)
      ? `https://covers.openlibrary.org/b/id/${bookRes.data.covers.at(-1)}-M.jpg`
      : undefined;

    return {
      ok: true,
      statusCode: 200,
      data: {
        id,
        title: bookRes.data.title,
        authorId,
        image,
        subjects: bookRes.data.subjects,
      },
    };
  } catch (error) {
    console.error('getBookByISBN: ', error);
    return { ok: false, statusCode: 500, error: `Unknown error getBookByISBN, isbn: ${isbn}` };
  }
};

export const getGoodReadBookData = async (goodReadId: string): Promise<TDataOrError<{ goodReadSeriesId: string, isbn13: string }>> => {
  try {
    const doc = await getDocById(goodReadId, EDocTypes.book);

    if (!doc.ok) return doc;

    const listItems = doc.data.querySelector('#__NEXT_DATA__');
    const propsJson = JSON.parse(listItems?.textContent || '{}');
    const isbn13 = getValueByKey<string>(propsJson, 'isbn13') || getValueByKey(propsJson, 'isbn') || '';

    if (!isbn13) return { ok: false, statusCode: 404, error: 'isbn13 not found' };

    const linkToSeries = doc.data
      .querySelector('.BookPageTitleSection__title')
      ?.querySelector('h3')
      ?.querySelector('a');

    if (!linkToSeries) return { ok: false, statusCode: 404, error: 'link to series not found' };
    const goodReadSeriesId = linkToSeries.href.split('/').at(-1)?.split('-')[0] || '';
    if (!goodReadSeriesId) return { ok: false, statusCode: 404, error: 'goodReadSeriesId not found' };

    return { ok: true, statusCode: 500, data: { goodReadSeriesId, isbn13 } };
  } catch (error) {
    console.error('getGoodReadBookData: ', error);
    return { ok: false, statusCode: 500, error: `Unknown error getGoodReadBookData, goodReadId: ${goodReadId}` };
  }
};
