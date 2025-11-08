from google import genai
from google.genai import types
from dotenv import load_dotenv
import os


def configure():
    load_dotenv()

configure()

GEMINI_API_KEY = os.getenv('api_key')

client = genai.Client(api_key=GEMINI_API_KEY)


def enhance_field(field_name, field_content):
    return client.models.generate_content(
    model="gemini-2.5-flash",
    config=types.GenerateContentConfig(
        system_instruction="You are an enhacer that should take user inputed text and make it better depending on the field it is in"
                           "Possible examples of modifications: rephrasing, punctuation, grammar or spelling mistakes ocrrection etc"
                           "Be mindful of the field, for something like 'address' then rephrasing is not much need, only check for mistakes"
                           "Output only enhanced text,, that I can put in the field, nothing else",
        temperature=0.6),
    contents = "Name of the field: " + field_name + " Content to enhance: " + field_content
    )