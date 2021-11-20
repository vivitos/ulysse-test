export const getApiUrl = (origin: string, destination: string) =>
  `${process.env
    .NEXT_PUBLIC_API_URL!}/sherpa/country?origin=${origin}&destination=${destination}`;

export const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};
