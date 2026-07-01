import { useCallback, useEffect, useState } from "react";

type NotificationError = {
  [key: string]: string;
} | null;

const useNotifications = <T>(apiLink: string, intervalMinutes: number = 5) => {
  const [result, setResult] = useState<T[]>([]);
  const [error, setError] = useState<NotificationError>(null);

  const callApi = useCallback(async () => {
    const path = new URL(apiLink);
    let response: Response;

    try {
      response = await fetch(path.toString());

      if (!response.ok) {
        throw new Error(`Request failed with status`);
      }
      const data = await response.json();

      setResult(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError({
        fetch: "Unable to get notifications",
      });
    }
  }, [apiLink]);

  function createCall() {
    callApi();

    setTimeout(() => createCall(), intervalMinutes * 60 * 1000);
  }

  useEffect(() => {
    createCall();
  }, [callApi]);

  return {
    result,
    setResult,
    error,
    setError,
  };
};

export default useNotifications;
