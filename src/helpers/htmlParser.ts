import { TDataOrError } from './types';

const DATA: Record<string, Document> = {};

export enum EDocTypes {
  book = 'book',
  series = 'series',
  author = 'author',
}

const getUrl = (id: string, type: EDocTypes): string => {
  switch (type) {
    case EDocTypes.book:
      return `https://www.goodreads.com/book/show/${id}`;
    case EDocTypes.series:
      return `https://www.goodreads.com/series/${id}`;
    case EDocTypes.author:
      return `https://www.goodreads.com/author/show/${id}`;
  }

};

export const getDocById = async (id: string, type: EDocTypes): Promise<TDataOrError<Document>> => {
  const url = getUrl(id, type);

  if (DATA[url]) return { ok: true, statusCode: 200, data: DATA[url] };

  try {
    const a = await fetch(url, {
      'headers': {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language': 'en,nb;q=0.9,en-US;q=0.8,nb-NO;q=0.7,fa;q=0.6,no;q=0.5',
        'cache-control': 'max-age=0',
        'sec-ch-ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
      },
      'referrerPolicy': 'strict-origin-when-cross-origin',
      'body': null,
      'method': 'GET',
      'mode': 'cors',
      'credentials': 'include',
    });

    const html = await a.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    DATA[url] = doc;
    return { ok: true, statusCode: 200, data: doc };
  } catch (e) {
    return { ok: false, statusCode: -1, error: `Error in html parser, getting ${url}` };
  }
};
