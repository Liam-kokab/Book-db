export const parseJson = <T>(json: string): T => {
  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.log('Error parsing JSON:', error);
    return {} as T;
  }
};

export const stringifyJson = (json: object): string => JSON.stringify(json, null, 2);

