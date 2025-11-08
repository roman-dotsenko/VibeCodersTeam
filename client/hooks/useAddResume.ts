import { useState } from "react";

export interface Resume {
  id: string;
  templateId: number;
  personalDetails: {
    name: string;
    emailAddress: string;
    desiredJobPosition: string;
    phoneNumber: string | null;
    address: string | null;
    postCode: string | null;
    city: string | null;
    dateOfBirth: string | null;
    driverLicense: string | null;
    gender: string | null;
    nationality: string | null;
    civilStatus: string | null;
    website: string | null;
    linkedIn: string | null;
    customFields: Array<{
      label: string;
      value: string;
    }>;
  };
  educations: Array<{
    educationName: string;
    school: string;
    id: string;
    city: string | null;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
  }>;
  employment: Array<{
    jobTitle: string;
    employer: string;
    id: string;
    city: string | null;
    startDate: string | null;
    endDate: string | null;
    description: string | null;
  }>;
  skills: Array<{
    name: string;
    level: {
      value: number;
      description: string;
    };
  }>;
  languages: Array<{
    name: string;
    level: {
      value: number;
      description: string;
    };
  }>;
  hobbies: string[];
}

export function useAddResume() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const addResume = async (userId: string | undefined, body: Resume) => {
    setLoading(true);
    setError(null);

    if (!userId) {
      setError("User ID is required");
      setLoading(false);
      return;
    }
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://job-helper-app.azurewebsites.net";
      const url = `${backendUrl}/api/users/${userId}/resumes`;
      
      console.log("Sending resume to backend:", url);
      console.log("Resume data:", JSON.stringify(body, null, 2));
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`Failed to add resume: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Resume added successfully:", result);
      setData(result);
      return result;
    } catch (err: any) {
      console.error("Error adding resume:", err);
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateResume = async (resumeId: string, body: Resume) => {
    setLoading(true);
    setError(null);
    
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://job-helper-app.azurewebsites.net";
      const url = `${backendUrl}/api/resumes/update/${resumeId}`;
      
      console.log("Updating resume at:", url);
      console.log("Resume data:", JSON.stringify(body, null, 2));
      
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", errorText);
        throw new Error(`Failed to update resume: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      console.log("Resume updated successfully:", result);
      setData(result);
      return result;
    } catch (err: any) {
      console.error("Error updating resume:", err);
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addResume, updateResume, loading, error, data };
}

