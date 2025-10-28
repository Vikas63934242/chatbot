import { useState } from 'react';

export const useLoader = () => {
  const [loading, setLoading] = useState(false);

  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const withLoader = async (asyncFunction) => {
    startLoading();
    try {
      const result = await asyncFunction();
      return result;
    } catch (error) {
      throw error;
    } finally {
      stopLoading();
    }
  };

  return { loading, startLoading, stopLoading, withLoader };
};
