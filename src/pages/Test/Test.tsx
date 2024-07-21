import { ChangeEvent, useState } from 'react';
import TextInput from '../../components/Input/TextInput';
import PageLayout from '../../components/PageLayout/PageLayout';
import { getSeriesData } from '../../services/series';

const Test = () => {
  const [input, setInput] = useState<string>('40419');

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const buttonAction = async () => {
    const series = await getSeriesData(input, '55');
    if (!series.ok) {
      console.error(series.error);
      return;
    }

    console.log(series.data);
  };

  return (
    <PageLayout pageName="Test">
      <TextInput label="Series Id" value={input} onChange={onInputChange} variant="oneLine" />
      <button onClick={buttonAction}>Action</button>
    </PageLayout>
  );
};

export default Test;
