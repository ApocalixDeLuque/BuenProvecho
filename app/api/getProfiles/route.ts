import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('BuenProvecho');
    const collection = db.collection('Profiles');

    const profiles = await collection.find({}).toArray();

    return NextResponse.json(profiles, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching profiles from MongoDB:', error.message);
    return NextResponse.json({ error: `Error fetching profiles from MongoDB: ${error.message}` }, { status: 500 });
  }
}