import { useEffect, useState } from "react";

export const useHttp = (fetchFn, param) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetchFn(param);
        setData(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(err);
        setLoading(false);
      }
    };
    getData();
  }, [fetchFn, param]);

  return [data, setData, loading, error];
};
