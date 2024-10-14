import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('BuenProvecho');
    const collection = db.collection('Profiles');

    const body = await req.json();
    await collection.insertOne(body);

    return NextResponse.json({ message: 'Profile saved to MongoDB' }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving profile to MongoDB:', error.message);
    return NextResponse.json({ error: `Error saving profile to MongoDB: ${error.message}` }, { status: 500 });
  }
}