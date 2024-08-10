import { GoogleGenerativeAI } from '@google/generative-ai';
import { StreamingTextResponse } from 'ai';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

function buildGoogleGenAIPrompt(messages) {
  return messages.map(message => ({
    role: message.role === 'user' ? 'user' : 'model',
    parts: [{ text: message.content }],
  }));
}

export async function POST(req) {
  const { messages, chatId } = await req.json();

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });
    const geminiStream = await model.generateContentStream({
      contents: buildGoogleGenAIPrompt(messages),
    });
    
    // Add the new user message to the database
    const chatRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(chatRef, {
      content: messages[messages.length - 1].content,
      role: messages[messages.length - 1].role,
      timestamp: serverTimestamp()
    });

    // Create a ReadableStream from the geminiStream
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of geminiStream.stream) {
          const text = chunk.text();
          controller.enqueue(text);
        }
        controller.close();
      },
    });

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}