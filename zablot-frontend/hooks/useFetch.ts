import React from "react";
import axios, { AxiosRequestConfig } from "axios";

type responseType<T> = ({ success: boolean } & T) & {
  message: string;
  name: string;
  statusCode: number;
} & { error: string };

export default function useFetch(fetchOnMount = false) {
  const [fetching, setFetching] = React.useState<boolean>(fetchOnMount);
  const abortController = new AbortController();
  const signal = abortController.signal;

  const fetcher = React.useCallback(
    async <T>(config: AxiosRequestConfig): Promise<responseType<T>> => {
      setFetching(true);
      try {
        const response = await axios({
          ...config,
          timeout: 50000,
          baseURL: "http://localhost:8080/api",
          validateStatus: function (status) {
            return status < 500; // Resolve only if the status code is less than 500
          },
        });
        const responseData = await response.data;

        console.log({ response });

        return responseData;
      } catch (error: any) {
        console.error(error);
        return { error: error.message, ...error.data };
      } finally {
        setFetching(false);
      }
    },
    []
  );

  return {
    fetching,
    fetcher,
  };
}
