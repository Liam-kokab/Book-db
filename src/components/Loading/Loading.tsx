import styles from './Loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.container}>
        <div className={styles.spinner} />
        <h3 className={styles.loadingText}>Loading...</h3>
      </div>

    </div>
  );
};

export default Loading;
