import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { ScannedCollection } from '../../../utils/types';

export async function POST(request: Request) {
  const client = await MongoClient.connect(process.env.MONGODB_URI as string);
  const db = client.db('BuenProvecho');

  try {
    const body: ScannedCollection = await request.json();
    const { title, image, items } = body;

    const collection = db.collection('Food');
    const result = await collection.insertOne({
      title,
      image,
      items,
      dateAdded: new Date().toISOString(),
    });

    await client.close();

    return NextResponse.json({ message: 'Saved successfully', id: result.insertedId }, { status: 200 });
  } catch (error) {
    console.error('Error saving to database:', error);
    await client.close();
    return NextResponse.json({ message: 'Error saving to database', error }, { status: 500 });
  }
}
