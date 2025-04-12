// data.ts
export const loadAddressPoints = async (): Promise<
  [number, number, number][]
> => {
  const response = await fetch("/data/points.txt");
  const text = await response.text();

  const addressPoints = text
    .trim()
    .split("\n")
    .map((line) => {
      const [lat, lng, val] = line.split(",").map((x) => parseFloat(x.trim()));
      return [lat, lng, val] as [number, number, number];
    });

  return addressPoints;
};
