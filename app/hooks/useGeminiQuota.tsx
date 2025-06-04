import { useEffect, useState } from 'react';

interface QuotaData {
  used: number;
  remaining: number;
  max: number;
}

export const useGeminiQuota = () => {
  const [quota, setQuota] = useState<QuotaData>({
    used: 0,
    remaining: 50,
    max: 50,
  });

  const fetchQuota = async () => {
    try {
      const res = await fetch('/api/chat/quota');
      const data = await res.json();
      setQuota(data);
    } catch (err) {
      console.error('Failed to fetch quota:', err);
    }
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  return { quota, refreshQuota: fetchQuota };
};
