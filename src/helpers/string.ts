export const removeHtmlTags = (str: string): string => {
  return str.replace(/<[^>]*>?/gm, '');
};

// mex length for a text, cut at last . before max
export const maxLength = (str: string, max: number): string => {
  if (str.length <= max) return str;
  const cut = str.substr(0, max);
  return `${cut.substr(0, cut.lastIndexOf('.') + 1)} (...)`;
};
