import { getUniqueArray } from '../helpers/array';
import { fetch2 } from '../helpers/fetch';
import { TAuthor, TDataOrError, TGoodReadId } from '../helpers/types';

type TAuthorRes = {
  name: string,
  remote_ids: Record<string, string>,
  key: string,
  photos: string[],
  birth_date: string,
};

export const getAuthor = async (authorKey: string): Promise<TDataOrError<TAuthor>> => {
  const id = authorKey.split('/').at(-1) || '';
  const res = await fetch2<Partial<TAuthorRes>>(`https://openlibrary.org/authors/${id}.json`);

  if (!res.ok) return { ok: false, statusCode: res.statusCode, error: 'error when getting author!' };
  const { data } = res;

  return {
    ok: true,
    statusCode: 200,
    data: {
      name: data.name || '',
      goodReadAuthorId: id,
      key: data.key || '',
      image: data.photos ? `https://covers.openlibrary.org/b/id/${data.photos.at(-1)}-M.jpg` : '',
      birthDate: data.birth_date || '',
    },
  };
};

export const getAuthors = async (authorKeys: string[], authors: Record<TGoodReadId, TAuthor | undefined>): Promise<TDataOrError<TAuthor[]>> => {
  const goodReadAuthorIds = getUniqueArray(authorKeys.map((author) => author.split('/').at(-1) || ''))
    .filter(Boolean);

  const authorsRes = await Promise.allSettled(goodReadAuthorIds.map((id) => {
    const authorFromState = authors[id];
    return authorFromState
      ? Promise.resolve({ ok: true, data: authorFromState })
      : getAuthor(id);
  }));

  const authorsData = authorsRes
    .filter((res) => res.status === 'fulfilled')
    .map((res) => res.status === 'fulfilled' && res.value.ok && res.value.data || {} as TAuthor);

  return { ok: true, statusCode: 200, data: authorsData };
};
