import { MouseEvent, ChangeEvent, useContext } from 'react';
import { classNames } from '../../helpers/classNames';
import { EActions, StateContext } from '../../helpers/state/StateProvider';
import { useAppState } from '../../helpers/state/useAppState';
import { maxLength } from '../../helpers/string';
import { EBookStatus, TAuthor, TBook, TGoodReadId } from '../../helpers/types';
import styles from './BookCard.module.scss';

type TProps = ({
  book: TBook
  author: TAuthor;
  compactView?: boolean;
}
| {
  bookId: TGoodReadId;
  goodReadAuthorId: TGoodReadId;
  showStatus?: boolean;
  compactView?: boolean;
}
) & {
  buttons?: {
    title: string;
    onClick: (event: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean,
  }[];
};

const options = Object.values(EBookStatus).map((status) => ({
  value: status,
  label: status.split('_').map(str => `${str.at(0)}${str.toLowerCase().slice(1)}`).join(' '),
}));

const BookCard = (props: TProps) => {
  const [, dispatch] = useContext(StateContext);
  const { getBook, getAuthor } = useAppState();
  const isFromStore = 'bookId' in props;
  const book = isFromStore ? getBook(props.bookId) : props.book;
  const authorData = isFromStore ? getAuthor(props.goodReadAuthorId) : props.author;
  const bookId = (isFromStore ? props.bookId : book?.goodReadBookId) || '';

  const onChangeStatus = (event: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: EActions.CHANGE_BOOK_STATUS, payload: { goodReadId: bookId, bookStatus: event.target.value as EBookStatus } });
  };

  if (!book) {
    return <div key={bookId} className={styles.bookCard}>Book not found!</div>;
  }

  return (
    <div key={bookId} className={classNames(styles.bookCard, props.compactView ? styles.compactView : '') }>
      <img src={book.image} alt={book.title} className={styles.bookCover}/>
      <div className={styles.bookHeader}>
        <h3>{book.title}</h3>
        <h4>By {authorData?.name || 'MISSING AUTHOR'}</h4>
      </div>

      <div className={styles.bookInfo}>
        <h3>{book.bookNum}</h3>
        <h4>{book.publicationDate || 'MISSING PUBLICATION DATE'}</h4>
      </div>

      {
        props.compactView
          ? null
          : <p className={styles.bookDescription}>{maxLength(book.description, 650)}</p>
      }

      <div className={styles.bookActions}>
        {
          isFromStore && props.showStatus
            ? <select onChange={onChangeStatus} value={book.bookStatus}>
              { options.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            : null
        }
        {
          props.buttons?.map(({ title, onClick, ...rest }) => (
            <button key={`${title}-${onClick.toString()}`} onClick={onClick} {...rest}>
              {title}
            </button>
          ))
        }
      </div>
    </div>
  );
};

export default BookCard;
