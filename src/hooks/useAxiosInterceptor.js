import { useState, useEffect } from "react";
import { axiosPrivate } from "../utils/axiosprivate";

export const useAxiosInterceptor = () => {
  const [isCookieExpired, setIsCookieExpired] = useState(false);

  useEffect(() => {
    const interceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          setIsCookieExpired(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(interceptor);
    };
  }, [isCookieExpired]);

  return [isCookieExpired];
};
