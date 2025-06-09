export const getShortenerUrl = (label: string) => {
  return `${window.location.origin}/to/${label}`;
};
