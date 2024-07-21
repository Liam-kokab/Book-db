import { useContext } from 'react';
import { TPage } from '../types';
import { EActions, StateContext } from './StateProvider';

export const useNavigate = () => {
  const [, dispatch] = useContext(StateContext);

  return (page: TPage) => {
    dispatch({ type: EActions.SET_PAGE, payload: page });
  };
};
