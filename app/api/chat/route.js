import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

const buildGoogleGenAIPrompt = (messages) => ({
  contents: messages
    .filter(message => message.role === 'user' || message.role === 'assistant')
    .map(message => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    })),
});

export async function POST(req) {
  const { messages, chatId } = await req.json();
  console.log("Received request with chatId:", chatId);

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!chatId) {
    return new Response(JSON.stringify({ error: "ChatId is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log("Generating content stream...");
    const geminiStream = await genAI
      .getGenerativeModel({ model: 'gemini-1.5-pro-latest'})
      .generateContentStream(buildGoogleGenAIPrompt(messages));
    
    console.log("Content stream generated successfully");

    // Add the new user message to the database
    const chatRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(chatRef, {
      content: messages[messages.length - 1].content,
      role: messages[messages.length - 1].role,
      timestamp: serverTimestamp()
    });

    console.log("User message added to database");

    // Convert the response into a friendly text-stream
    const stream = GoogleGenerativeAIStream(geminiStream, {
      async onCompletion(completion) {
        // Add the AI's response to the database
        await addDoc(chatRef, {
          content: completion,
          role: 'assistant',
          timestamp: serverTimestamp()
        });
        console.log("AI response added to database");
      }
    });

    console.log("Streaming response...");
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in POST request:", error);
    if (error.message.includes("API key not valid")) {
      return new Response(JSON.stringify({ error: "Invalid API key" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}