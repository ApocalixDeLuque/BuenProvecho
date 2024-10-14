import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('BuenProvecho');
    const collection = db.collection('Food');

    const body = await req.json();
    const { image, ...documentData } = body;

    // Ensure the image data is included in the document
    const document = { ...documentData, image };

    await collection.insertOne(document);

    return NextResponse.json({ message: 'Document saved to MongoDB' }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving to MongoDB:', error.message);
    return NextResponse.json({ error: `Error saving to MongoDB: ${error.message}` }, { status: 500 });
  }
}

export function GET(req: NextRequest) {
  return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
}
