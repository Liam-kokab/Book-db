type TObject<T> = {
  [key: string]: object | T;
};

export const getValueByKey = <T = string>(json: TObject<T>, key: string): T | null => {
  const isArray = Array.isArray(json);
  for (const [currentKey, currentValue] of Object.entries(json)) {
    if (!isArray && currentKey === key) return currentValue as T;

    if (typeof currentValue === 'object' && currentValue !== null) {
      const Value = getValueByKey<T>(currentValue as TObject<T>, key);
      if (Value) return Value;
    }
  }

  return null;
};
