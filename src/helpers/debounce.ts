type DebouncedFunction<Args extends unknown[]> = (...args: Args) => Promise<unknown>;

export const debounce = <Args extends unknown[]>(fn: (...args: Args) => Promise<unknown> | unknown, delay: number): DebouncedFunction<Args> => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return async (...args: Args): Promise<void> => {
    if (timer !== null) {
      clearTimeout(timer);
    }

    return new Promise<void>((resolve) => {
      timer = setTimeout(async () => {
        await fn(...args);
        resolve();
      }, delay);
    });
  };
};
