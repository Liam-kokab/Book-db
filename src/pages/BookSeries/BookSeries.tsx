import { useState } from 'react';
import BookCard from '../../components/BookCard/BookCard';
import PageLayout from '../../components/PageLayout/PageLayout';
import { useSeries } from '../../helpers/state/useSeries';
import { EBookStatus, TGoodReadId } from '../../helpers/types';
import styles from './BookSeries.module.scss';

const BookSeries = ({ goodReadSeriesId }: {  goodReadSeriesId: TGoodReadId; }) => {
  const { currentSeries, addBook, removeBook, busy } = useSeries(goodReadSeriesId);
  const [compactView, setCompactView] = useState(false);
  const [show, setShow] = useState({
    unevaluated: true,
    books: true,
    hidden: false,
  });

  return (
    <PageLayout pageName="Book Series" className={styles.bookSeries}>
      <div className={styles.bookSeriesHeader}>
        <h2>{currentSeries.title} ({currentSeries.goodReadSeriesId})</h2>
        <div className={styles.buttonContainer}>
          <button disabled={true}>Refresh</button>
          <button onClick={() => setCompactView(prev => !prev)}>{compactView ? 'Extended View' : 'Compact View'}</button>
        </div>
      </div>
      {
        currentSeries.tempBooks.length
          ? (
            <div className={styles.bookSeriesHeader}>
              <h3>Unevaluated Books: ({currentSeries.tempBooks.length})</h3>
              <button
                onClick={() => setShow((prev) => ({ ...prev, unevaluated: !prev.unevaluated }))}
              >
                { show.unevaluated ? 'Hide' : 'show' }
              </button>
            </div>
          )
          : null
      }
      {
        show.unevaluated && currentSeries.tempBooks.length
          ? (
            <div className={styles.bookList}>
              {
                currentSeries.tempBooks.map(bookId => (
                  <BookCard
                    bookId={bookId}
                    goodReadAuthorId={currentSeries.goodReadAuthorId}
                    key={bookId}
                    compactView={compactView}
                    buttons={[
                      {
                        title: 'Remove from Series',
                        onClick: () => removeBook(bookId),
                        disabled: busy,
                      },
                      {
                        title: 'Add as Not Downloaded',
                        onClick: () => addBook(bookId, EBookStatus.NOT_DOWNLOADED),
                        disabled: busy,
                      },
                      {
                        title: 'Add as Read',
                        onClick: () => addBook(bookId, EBookStatus.READ),
                        disabled: busy,
                      },
                      {
                        title: 'Add To Series',
                        onClick: () => addBook(bookId, EBookStatus.NO_STATUS),
                        disabled: busy,
                      },
                    ]}
                  />
                ))
              }
            </div>
          )
          : null
      }

      <div className={styles.bookSeriesHeader}>
        <h3>Books: ({currentSeries.books.length})</h3>
        <button
          onClick={() => setShow((prev) => ({ ...prev, books: !prev.books }))}
        >
          { show.books ? 'Hide' : 'show' }
        </button>
      </div>
      {
        show.books
          ? (
            <div>
              {
                currentSeries.books.map(bookId => (
                  <BookCard
                    bookId={bookId}
                    goodReadAuthorId={currentSeries.goodReadAuthorId}
                    key={bookId}
                    showStatus={true}
                    compactView={compactView}
                    buttons={[
                      {
                        title: 'Remove from Series',
                        onClick: () => removeBook(bookId),
                        disabled: busy,
                      },
                    ]}
                  />
                ))
              }
            </div>
          )
          : null
      }

      <div className={styles.bookSeriesHeader}>
        <h3>Hidden Books: ({currentSeries.hiddenBooks.length})</h3>
        <button
          onClick={() => setShow((prev) => ({ ...prev, hidden: !prev.hidden }))}
        >
          { show.hidden ? 'Hide' : 'show' }
        </button>
      </div>
      {
        show.hidden
          ? (
            <div>
              {
                currentSeries.hiddenBooks.map(bookId => (
                  <BookCard
                    bookId={bookId}
                    goodReadAuthorId={currentSeries.goodReadAuthorId}
                    key={bookId}
                    compactView={compactView}
                    buttons={[
                      {
                        title: 'Add to Series',
                        onClick: () => addBook(bookId),
                        disabled: busy,
                      },
                    ]}
                  />
                ))
              }
            </div>
          )
          : null
      }
    </PageLayout>
  );
};

export default BookSeries;
