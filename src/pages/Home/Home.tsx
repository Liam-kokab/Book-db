import { ChangeEvent, useContext, useState } from 'react';
import TextInput from '../../components/Input/TextInput';
import Loading from '../../components/Loading/Loading';
import PageLayout from '../../components/PageLayout/PageLayout';
import { sleep } from '../../helpers/promise';
import { useNavigate } from '../../helpers/state/navigation';
import { EActions, StateContext } from '../../helpers/state/StateProvider';
import { EPages, TAuthor, TBook, TBookSeries, TState } from '../../helpers/types';
import { getSeriesData } from '../../services/series';
import styles from './Home.module.scss';

type TData = {
  bookSeries: TBookSeries;
  books: TBook[];
  author: TAuthor;
};

const findMissingData = (data: TData, state: TState): string => {
  if (!state.series[data.bookSeries.goodReadSeriesId]) return 'series';
  if (!state.authors[data.author.id]) return 'author';
  return data.books.some((book) => !state.books[book.goodReadId])
    ? 'books'
    : '';
};

const Home = () => {
  const [state, dispatch] = useContext(StateContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('40419');
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<TData | undefined>(undefined);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const onSeeSeries = async () => {
    setLoading(true);
    const seriesRes = await getSeriesData(input);
    if (!seriesRes.ok) {
      setError(seriesRes.error);
      setLoading(false);
      return;
    }

    setData(seriesRes.data);
    setLoading(false);
  };

  const goToSeries = async () => {
    if (!data) return;
    setLoading(true);

    dispatch({ type: EActions.ADD_PACKAGE, payload: data });
    await sleep(150);
    dispatch({ type: EActions.SAVE_STATE });
    await sleep(150);
    setLoading(false);

    const missingData = findMissingData(data, state);
    if (missingData) {
      setError(`Missing data: ${missingData}`);
      return;
    }

    navigate({ path: EPages.BOOK_SERIES, goodReadSeriesId: data.bookSeries.goodReadSeriesId });
  };

  return (
    <PageLayout pageName="Home!" className={styles.homePage}>
      <h1>Welcome to Book-db!</h1>
      <div className={styles.addBookContainer}>
        <TextInput
          label="Good Read Series Id:"
          placeholder="Please enter a good read series Id"
          value={input}
          onChange={onChange}
          disabled={loading}
          className={styles.input}
        />
        <button
          onClick={data ? goToSeries : onSeeSeries}
          disabled={loading || input.length < 3}
        >
          {data ? 'Go to series' : 'See the series'}
        </button>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
      {loading ? <Loading /> : null}
      {
        data ? (
          <div className={styles.seriesContainer}>
            <div className={styles.seriesHeader}>
              <span>
                <h2>{data.bookSeries.title}</h2>
                <p>{data.bookSeries.description}</p>
              </span>
              <div className={styles.separator}></div>
              <span>
                <h3>Author: {data.author.name}</h3>
                <img src={data.author.image} alt={data.author.name} />
              </span>
            </div>
            <div className={styles.seriesBookList}>
              {data.books.map((book) => (
                <div className={styles.bookContainer} key={book.goodReadId}>
                  <h4>{book.title}</h4>
                  <img src={book.image} alt="book cover" />
                </div>
              ))}
            </div>
          </div>
        ) : null
      }
    </PageLayout>
  );
};

export default Home;
