import { useState, useEffect } from "react";
import { Resume } from "./useAddResume";

export function useGetResumes(userId: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchResumes = async () => {
      setLoading(true);
      setError(null);

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://job-helper-app.azurewebsites.net";
        const url = `${backendUrl}/api/users/${userId}/resumes`;
        
        console.log("Fetching resumes from:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch resumes: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Resumes fetched:", result);
        setResumes(result);
      } catch (err: any) {
        console.error("Error fetching resumes:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://job-helper-app.azurewebsites.net";
      const url = `${backendUrl}/api/users/${userId}/resumes`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resumes: ${response.status}`);
      }
      
      const result = await response.json();
      setResumes(result);
    } catch (err: any) {
      console.error("Error fetching resumes:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { resumes, loading, error, refetch };
}
