import React, { useEffect, useState } from 'react';
import { useNavigate } from '../../helpers/state/navigation';
import { useAppState } from '../../helpers/state/useAppState';
import { maxLength } from '../../helpers/string';
import { EPages, TBookSeries } from '../../helpers/types';
import style from './SeriesOverview.module.scss';

const calculateLayout = (imagesWidth: number[], containerWidth: number, gap: number) => {
  const lastImageSize = imagesWidth.at(-1) || 0;
  const totalWidth = imagesWidth.reduce((acc, imageWidth) => acc + imageWidth + gap, 0);
  const containerWidthWithGap = containerWidth - gap - lastImageSize;

  let xPos = 0;
  return imagesWidth.map((imageWidth, index) => {
    if (totalWidth < containerWidthWithGap) {
      const newXPos = xPos;
      xPos = newXPos + gap + imageWidth;
      return newXPos;
    }

    const newXPos = (containerWidthWithGap / (imagesWidth.length - 1)) * index;
    xPos = newXPos + gap;
    return newXPos;
  });
};

const SeriesCard = ({ series }: { series: TBookSeries }) => {
  const navigate = useNavigate();
  const { getAuthor, getBook } = useAppState();
  const coversRef = React.useRef<HTMLDivElement>(null);

  const allBooks = series.books.map((bookId) => getBook(bookId));
  const [coverImage, setCoverImage] = useState<string>(getBook(series.books?.[0] || series.tempBooks?.[0] || '')?.image || '');

  const onCoverHover = (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const imageUrl = event.currentTarget.dataset.url;
    setCoverImage(imageUrl || '');
  };

  useEffect(() => {
    if (coversRef.current) {
      const xPostions = calculateLayout(
        Array.from(coversRef.current.children).map((child) => child.clientWidth),
        coversRef.current.clientWidth,
        10,
      );

      Array.from(coversRef.current.children as HTMLCollectionOf<HTMLElement>).forEach((child, index) => {
        const left = xPostions[index];
        child.style.left = `${left}px`;
      });
    }
  }, []);

  return (
    <div key={series.goodReadSeriesId} className={style.seriesCard}>
      <h2 className={style.title}>{series.title}</h2>
      <img
        className={style.cover}
        src={coverImage}
        alt="series cover"
      />
      <h4 className={style.authorName}>{getAuthor(series.authorId)?.name || 'MISSING AUTHOR'}</h4>
      <img className={style.authorImg} src={getAuthor(series.authorId)?.image} alt="author" />
      <p className={style.description}>{maxLength(series.description, 650)}</p>
      <div className={style.covers} ref={coversRef}>
        {allBooks.map((book) => (
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
          <img
            key={`${book?.goodReadId}-cover`}
            src={book?.image}
            alt={book?.title}
            data-url={book?.image}
            onMouseEnter={onCoverHover}
          />
        ))}
      </div>
      <div className={style.buttons}>
        <button
          onClick={() => {
            navigate({ path: EPages.BOOK_SERIES, goodReadSeriesId: series.goodReadSeriesId, authorId: series.authorId });
          }}
        >
          Go To Series
        </button>
      </div>
    </div>
  );
};

export default SeriesCard;
