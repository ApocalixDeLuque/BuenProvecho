import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type ChatMessage = {
  role: 'assistant' | 'user';
  content: string;
};

type RequestBody = {
  messages?: ChatMessage[];
  scannedItems?: unknown;
};

export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ message: 'OpenAI is not configured' }, { status: 503 });
  }

  const body = (await request.json()) as RequestBody;
  const messages = Array.isArray(body.messages)
    ? body.messages.filter(
        (message): message is ChatMessage =>
          (message?.role === 'assistant' || message?.role === 'user') &&
          typeof message.content === 'string' &&
          message.content.length > 0 &&
          message.content.length <= 4_000,
      )
    : [];

  if (messages.length === 0 || messages.length > 20) {
    return NextResponse.json({ message: 'Invalid chat messages' }, { status: 400 });
  }

  const chefPrompt = process.env.CHEFSITO_PROMPT || '';
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: `${chefPrompt}\n\nLista de productos de la alacena: ${JSON.stringify(body.scannedItems ?? [])}`,
      },
      ...messages,
    ],
  });

  return NextResponse.json({ content: completion.choices[0]?.message.content || '' });
}
