from google import genai
from google.genai import types
from dotenv import load_dotenv
import os


def configure():
    load_dotenv()

configure()

GEMINI_API_KEY = os.getenv('api_key')

client = genai.Client(api_key=GEMINI_API_KEY)


def parse_cv_text(user_text):
    return client.models.generate_content(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            system_instruction="""You are a CV information extractor. Extract personal and professional information from the user's text and return it as a JSON object.

IMPORTANT: Return ONLY a valid JSON object, no additional text, no markdown, no explanations.

Extract these fields if mentioned:
- fullName: Person's full name
- email: Email address
- phone: Phone number
- address: Street address
- city: City name
- postCode: Postal/ZIP code
- dateOfBirth: Date of birth (in YYYY-MM-DD format if possible)
- nationality: Nationality/citizenship
- gender: Gender (Male/Female/Other)
- driverLicense: Driver's license info
- civilStatus: Marital status (Single/Married/Divorced/etc)
- linkedin: LinkedIn profile URL or username
- portfolio: Portfolio website URL
- website: Personal website URL
- desiredJobPosition: Desired job title/position
- education: Education degree/qualification
- university: University/school name
- skills: Array of skills (programming languages, technologies, soft skills)
- languages: Array of spoken languages
- hobbies: Array of hobbies/interests
- description: Any additional description or summary

Rules:
1. Only include fields that are explicitly mentioned or can be clearly inferred
2. For fields not mentioned, omit them from the JSON (do not include null values)
3. Return arrays for skills, languages, and hobbies
4. If a location is mentioned without city/address distinction, put it in city
5. Output MUST be valid JSON only

Example output format:
{"fullName":"John Doe","city":"Chicago","skills":["TypeScript","React"],"desiredJobPosition":"Software Developer"}""",
            temperature=0.3),
        contents=user_text
    )
