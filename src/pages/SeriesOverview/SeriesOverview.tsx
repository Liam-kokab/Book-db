import { useContext } from 'react';
import PageLayout from '../../components/PageLayout/PageLayout';
import { StateContext } from '../../helpers/state/StateProvider';
import SeriesCard from '../../components/SeriesCard/SeriesCard';
import style from './SeriesOverview.module.scss';

const SeriesOverview = () => {
  const [{ series }] = useContext(StateContext);

  return (
    <PageLayout pageName="Series OverView" className={style.seriesOverview}>
      {
        Object.values(series).map((seriesData) => seriesData ? (
          <SeriesCard series={seriesData} key={seriesData.goodReadSeriesId} />
        ) : null)
      }
    </PageLayout>
  );
};

export default SeriesOverview;
