export async function addResume(userId: string, resume: any) {
  const response = await fetch(
    `https://job-helper-app.azurewebsites.net/api/users/${userId}/resumes`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resume), // API expects an array
    }
  );
  if (!response.ok) {
    throw new Error('Failed to add resume');
  }
  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}
