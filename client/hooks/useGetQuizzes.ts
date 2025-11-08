import { useState, useEffect } from "react";

export interface Quiz {
  quizId: string;
  quizScore: number;
}

export function useGetQuizzes(userId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://job-helper-app.azurewebsites.net";
        const url = `${backendUrl}/api/users/${userId}/quizzes`;
        
        console.log("Fetching quizzes from:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch quizzes: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Quizzes fetched:", result);
        setQuizzes(result);
      } catch (err: any) {
        console.error("Error fetching quizzes:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://job-helper-app.azurewebsites.net";
      const url = `${backendUrl}/api/users/${userId}/quizzes`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quizzes: ${response.status}`);
      }
      
      const result = await response.json();
      setQuizzes(result);
    } catch (err: any) {
      console.error("Error fetching quizzes:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { quizzes, loading, error, refetch };
}
