import { useContext } from 'react';
import StateProvider, { StateContext } from './helpers/state/StateProvider';
import { EPages } from './helpers/types';
import BookSeries from './pages/BookSeries/BookSeries';

// Pages
import Home from './pages/Home/Home';
import SeriesOverview from './pages/SeriesOverview/SeriesOverview';
import Settings from './pages/Settings/Settings';
import Test from './pages/Test/Test';

const CurrentPage = () => {
  const [{ currentPage }] = useContext(StateContext);

  switch (currentPage.path) {
    case EPages.HOME:
      return <Home />;
    case EPages.BOOK_SERIES:
      return <BookSeries goodReadSeriesId={currentPage.goodReadSeriesId} authorId={currentPage.authorId} />;
    case EPages.SERIES_OVERVIEW:
      return <SeriesOverview />;
    case EPages.SETTINGS:
      return <Settings />;
    case EPages.TEST:
      return <Test />;
    default:
      return <Home />;
  }
};

const App = () => {

  return (
    <StateProvider>
      <CurrentPage />
    </StateProvider>
  );
};

export default App;
