from google import genai
from google.genai import types
from dotenv import load_dotenv
import os


def configure():
    load_dotenv()

configure()

GEMINI_API_KEY = os.getenv('api_key')

client = genai.Client(api_key=GEMINI_API_KEY)

QUIZZES = {}

def get_quiz(theme):
    return client.models.generate_content(
    model="gemini-2.5-flash",
    config=types.GenerateContentConfig(
        system_instruction="Based on a theme given in contents you have to generate a quiz consisting of 10 questions."
                           "Each question should have id, correct answers should be indicated with the index of response."
                           "Output should be formated as a PURE JSON file, do not include identation, only essential JSON elements."
                           "Example of output in correct format:"
                           "[{\"id\":\"Q1\",\"question\":\"Which OOP principle bundles data and methods that operate on the data within a single unit, hiding the internal implementation details?\",\"responses\":[\"Inheritance\",\"Polymorphism\",\"Encapsulation\",\"Abstraction\"],\"correct_answer_index\":2},{\"id\":\"Q2\",\"question\":\"What OOP principle allows a new class to inherit properties and behaviors from an existing class?\",\"responses\":[\"Abstraction\",\"Polymorphism\",\"Encapsulation\",\"Inheritance\"],\"correct_answer_index\":3},{\"id\":\"Q3\",\"question\":\"Which OOP principle allows objects of different classes to be treated as objects of a common type, often demonstrated through method overriding or interface implementation?\",\"responses\":[\"Encapsulation\",\"Polymorphism\",\"Inheritance\",\"Abstraction\"],\"correct_answer_index\":1},{\"id\":\"Q4\",\"question\":\"What is the process of showing only essential features and hiding the complex implementation details from the user?\",\"responses\":[\"Inheritance\",\"Encapsulation\",\"Abstraction\",\"Polymorphism\"],\"correct_answer_index\":2},{\"id\":\"Q5\",\"question\":\"In Object-Oriented Programming, what is a blueprint for creating objects?\",\"responses\":[\"Method\",\"Object\",\"Class\",\"Attribute\"],\"correct_answer_index\":2},{\"id\":\"Q6\",\"question\":\"Which access modifier typically restricts access to members only within the same class and its derived classes?\",\"responses\":[\"Public\",\"Private\",\"Protected\",\"Internal\"],\"correct_answer_index\":2},{\"id\":\"Q7\",\"question\":\"What is the term for defining multiple methods in the same class with the same name but different parameters (number, type, or order)?\",\"responses\":[\"Method Overriding\",\"Method Overloading\",\"Method Hiding\",\"Method Invocation\"],\"correct_answer_index\":1},{\"id\":\"Q8\",\"question\":\"What is a significant benefit of using inheritance in OOP?\",\"responses\":[\"Reduced code readability\",\"Increased coupling\",\"Code reusability\",\"Elimination of polymorphism\"],\"correct_answer_index\":2},{\"id\":\"Q9\",\"question\":\"Which of the following statements is true regarding an abstract class in OOP?\",\"responses\":[\"It cannot have any concrete (implemented) methods.\",\"It can be instantiated directly.\",\"It can have both abstract and concrete methods.\",\"It must only contain static members.\"],\"correct_answer_index\":2},{\"id\":\"Q10\",\"question\":\"Which OOP principle is primarily responsible for achieving data hiding and ensuring data integrity?\",\"responses\":[\"Polymorphism\",\"Inheritance\",\"Abstraction\",\"Encapsulation\"],\"correct_answer_index\":3}]"),
    contents=theme
    )