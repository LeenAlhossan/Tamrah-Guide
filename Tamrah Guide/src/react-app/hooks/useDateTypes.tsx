import { useState, useEffect } from 'react';
import { DateType, RecommendationRequest } from '@/shared/types';

export function useDateTypes() {
  const [dateTypes, setDateTypes] = useState<DateType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDateTypes = async () => {
      try {
        const response = await fetch('/api/date-types');
        if (!response.ok) throw new Error('Failed to fetch date types');
        const data = await response.json();
        setDateTypes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchDateTypes();
  }, []);

  return { dateTypes, loading, error };
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<DateType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (preferences: RecommendationRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) throw new Error('Failed to get recommendations');
      const data = await response.json();
      setRecommendations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { recommendations, loading, error, getRecommendations };
}
