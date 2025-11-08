from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
from chat import create_chat
from cv_enhancer import enhance_field
from quiz import get_quiz

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chats = {}
quizzes = {}


class ChatRequest(BaseModel):
    chat_id: Optional[str] = None
    message: str

class QuizRequest(BaseModel):
    quiz_id: Optional[str] = None
    message: str

class EnhanceCVFields(BaseModel):
    field: str
    field_content: str


@app.post("/chat")
async def chat(req: ChatRequest):
    if req.chat_id is None:
        chat_id = str(uuid.uuid4())
        chat = create_chat()
        chats[chat_id] = chat
    else:
        chat_id = req.chat_id
        chat = chats.get(chat_id)
        if chat is None:
            return {"error": "Chat not found or expired. Start a new one."}

    # Send user message to model

    response = chat.send_message(
        req.message +
        " Wait for the user's answer before continuing. "
        "Do not answer questions. Only ask interview questions."
    )

    finished = "Thank you for using our mock interview program" in response.text

    return {
        "chat_id": chat_id,
        "response": response.text,
        "finished": finished
    }

@app.post("/quiz")
async def quiz(req: QuizRequest):
    response = ""
    if req.quiz_id is None:
        quiz_id = str(uuid.uuid4())
        response = get_quiz(req.message)
        quizzes[quiz_id] = quiz_id
    else:
        return {"error": "Invalid quiz id"}

    return{
        "quiz_id": quiz_id,
        "response": response.text
    }


@app.post("/enhance")
async def enhance(req: EnhanceCVFields):
    response = enhance_field(field_name=req.field, field_content=req.field_content)

    return {
        "response": response.text
    }

