'use client'
import React, { useState, useRef, useEffect } from 'react'

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function AIAgent() {
    const [inputValue, setInputValue] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [chatId, setChatId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage = inputValue.trim()
        setInputValue('')
        
        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            const response = await fetch('http://127.0.0.1:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    message: userMessage,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            const data = await response.json()
            
            // Save chat_id for subsequent messages
            if (data.chat_id && !chatId) {
                setChatId(data.chat_id)
            }

            // Add assistant response to chat
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
            
            // Check if interview is finished
            if (data.finished) {
                setIsFinished(true)
            }
        } catch (error) {
            console.error('Error sending message:', error)
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: 'Sorry, there was an error processing your message. Please try again.' 
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const resetChat = () => {
        setMessages([])
        setChatId(null)
        setIsFinished(false)
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center px-4 py-8">
                <div className="w-full max-w-4xl flex-1 flex flex-col">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <h1 className="text-4xl md:text-5xl font-normal mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                        AI Interview Assistant
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Start by providing a job description to begin the interview
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                                message.role === 'user'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                                            }`}
                                        >
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="sticky bottom-0 pb-4">
                        {isFinished && (
                            <div className="mb-4 text-center">
                                <button
                                    onClick={resetChat}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                >
                                    Start New Interview
                                </button>
                            </div>
                        )}
                        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center px-6 py-4 gap-3">
                                {/* Input */}
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Type your message..."
                                    disabled={isLoading || isFinished}
                                    className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 text-base disabled:opacity-50"
                                />

                                {/* Send Button */}
                                <button
                                    className="flex-shrink-0 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Send message"
                                    disabled={!inputValue.trim() || isLoading || isFinished}
                                    onClick={sendMessage}
                                >
                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        {chatId && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                                Chat ID: {chatId}
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
