import { useState, useEffect } from "react";
import { Resume } from "./useAddResume";

export function useGetResumeById(resumeId: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    if (!resumeId) {
      setResume(null);
      return;
    }

    const fetchResume = async () => {
      setLoading(true);
      setError(null);

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://job-helper-app.azurewebsites.net";
        const url = `${backendUrl}/api/resumes/${resumeId}`;
        
        console.log("Fetching resume from:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch resume: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("Resume fetched:", result);
        setResume(result);
      } catch (err: any) {
        console.error("Error fetching resume:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  return { resume, loading, error };
}
