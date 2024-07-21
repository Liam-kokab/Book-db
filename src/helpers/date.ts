import { DATA_VALID_TIME } from '../config';

// Check if the data is too old, not yet set dates are 0 or -1, they are always too old
export const isToOld = (date: number): boolean => date > 5 && Date.now() - date > DATA_VALID_TIME;
