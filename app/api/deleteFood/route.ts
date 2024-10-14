import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('BuenProvecho');
    const collection = db.collection('Food');

    // Extract collectionId and itemId from the request body
    const { collectionId, itemId } = await req.json();

    if (!collectionId || !itemId) {
      return NextResponse.json({ error: 'Missing collectionId or itemId' }, { status: 400 });
    }

    // Update the document by removing the specific item from the items array
    const result = await collection.updateOne(
      { _id: new ObjectId(collectionId) },
      { $pull: { items: { _id: itemId } } as any } // Use 'as any' to bypass type checking
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: 'Food item deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Food item or collection not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Error deleting food item from MongoDB:', error.message);
    return NextResponse.json({ error: `Error deleting food item from MongoDB: ${error.message}` }, { status: 500 });
  }
}
