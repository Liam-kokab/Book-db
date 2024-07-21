import { ChangeEvent, useContext, useState } from 'react';
import TextInput from '../../components/Input/TextInput';
import Loading from '../../components/Loading/Loading';
import PageLayout from '../../components/PageLayout/PageLayout';
import { sleep } from '../../helpers/promise';
import { useNavigate } from '../../helpers/state/navigation';
import { EActions, StateContext } from '../../helpers/state/StateProvider';
import { EPages, TAuthor, TBook, TBookSeries } from '../../helpers/types';
import { getSeriesData } from '../../services/series';
import styles from './Home.module.scss';

type TData = {
  bookSeries: TBookSeries;
  books: TBook[];
  author: TAuthor;
};

const Home = () => {
  const [, dispatch] = useContext(StateContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
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
    if (!data || !data.bookSeries || !data.books.length || !data.author) return;
    setLoading(true);

    dispatch({ type: EActions.ADD_PACKAGE, payload: data });
    await sleep(50);
    dispatch({ type: EActions.SAVE_STATE });
    await sleep(100);
    setLoading(false);
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
                <div className={styles.bookContainer} key={book.goodReadBookId}>
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
