import { ChangeEvent, useContext, useState } from 'react';
import BookCard from '../../components/BookCard/BookCard';
import Loading from '../../components/Loading/Loading';
import PageLayout from '../../components/PageLayout/PageLayout';
import { sleep } from '../../helpers/promise';
import { useNavigate } from '../../helpers/state/navigation';
import { EActions, StateContext } from '../../helpers/state/StateProvider';
import { EPages, TGoodReadId, TOpenLibraryId } from '../../helpers/types';
import { getAuthor } from '../../services/author';
import { search, TBookWithAuthor } from '../../services/search';
import styles from './Home.module.scss';

type TInput = {
  author: string,
  book: string,
  seriesId: TGoodReadId,
  authorId: TOpenLibraryId,
};

const INPUT_INIT = {
  author: '',
  book: '',
  seriesId: '',
  authorId: '',
};

const Home = () => {
  const [{ authors }, dispatch] = useContext(StateContext);
  const navigate = useNavigate();
  const [input, setInput] = useState<TInput>(INPUT_INIT);
  const [books, setBooks] = useState<TBookWithAuthor[] | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    setInput(prev => ({ ...prev, [name]: event.target.value }));
  };

  const onSearch = async () => {
    setBooks(undefined);
    setLoading(true);
    const res = await search(input.book, input.author, authors);
    if (!res.ok) {
      console.error(res.error);
      return;
    }

    setBooks(res.data.books);
    setLoading(false);
  };

  const goToSeries = async () => {
    setLoading(true);
    const authorRes = await getAuthor(input.authorId);
    if (!authorRes.ok) {
      console.error(authorRes.error);
      return;
    }

    dispatch({ type: EActions.ADD_AUTHORS, payload: authorRes.data });
    await sleep(20);
    dispatch({ type: EActions.SAVE_STATE });
    await sleep(20);
    navigate({ path: EPages.BOOK_SERIES, goodReadSeriesId: input.seriesId, authorId: input.authorId });
    setLoading(false);
  };

  return (
    <PageLayout pageName="Home!" className={styles.homePage}>
      <h3>Manual:</h3>
      <div className={styles.addBookContainer}>
        <input placeholder="Good reads Series Id" name="seriesId" onChange={onInputChange} value={input.seriesId}/>
        <input placeholder="Open library Author Id" name="authorId" onChange={onInputChange} value={input.authorId}/>
        <button onClick={goToSeries} disabled={!(input.authorId.length > 2 && input.seriesId.length > 2)}>Go to Series</button>
      </div>
      <h3>Search</h3>
      <div className={styles.addBookContainer}>
        <input placeholder="Author Name" name="author" onChange={onInputChange} value={input.author}/>
        <input placeholder="Book Name" name="book" onChange={onInputChange} value={input.book}/>
        <button onClick={onSearch} disabled={!(input.author.length > 2 && input.book.length > 2)}>Search</button>
      </div>
      <div className={styles.bookList}>
        {loading ? <Loading/> : null}
        {(books || { length: -1 }).length === 0 ? <div>No books found</div> : null}
        {
          (books || []).map(book => (
            <BookCard
              book={book}
              author={book.author}
              key={book.goodReadId}
              buttons={[{
                title: 'Go to Series',
                onClick: async () => {
                  dispatch({ type: EActions.ADD_AUTHORS, payload: book.author });
                  await sleep(20);
                  dispatch({ type: EActions.SAVE_STATE });
                  await sleep(20);
                  navigate({ path: EPages.BOOK_SERIES, goodReadSeriesId: book.goodReadSeriesId, authorId: book.author.id });
                },
              }]}
            />
          ))
        }
      </div>
      <div id="ifreame"></div>
    </PageLayout>
  );
};

export default Home;
