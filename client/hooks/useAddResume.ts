import { useState } from "react";

export interface Resume {
  id: string;
  personalDetails: {
    name: string;
    desiredJobPosition: string;
    emailAddress: string;
    phoneNumber: string | null;
    address: string;
    postCode: string;
    city: string;
    dateOfBirth: string;
    driverLicense: string;
    gender: string;
    nationality: string;
    civilStatus: string;
    website: string;
    linkedIn: string;
    customFields: any[];
  };
  educations: any[];
  employment: any[];
  skills: any[];
  languages: any[];
  hobbies: any[];
}

export function useAddResume() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const addResume = async (body: Resume[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://job-helper-app.azurewebsites.net/api/users/${body.id}/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Failed to add resume");
      }
      const result = await response.json();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message || "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addResume, loading, error, data };
}
