import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('BuenProvecho');
    const collection = db.collection('Food');

    const { id } = await req.json();

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: 'Food deleted successfully' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }
  } catch (error: any) {
    console.error('Error deleting document from MongoDB:', error.message);
    return NextResponse.json({ error: `Error deleting document from MongoDB: ${error.message}` }, { status: 500 });
  }
}
