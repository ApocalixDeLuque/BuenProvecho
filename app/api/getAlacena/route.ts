import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('BuenProvecho');
    const collection = db.collection('Food');

    console.log('Conectado a la base de datos:', db.databaseName);

    const documents = await collection.find({}).toArray();

    // Restructure the data
    const restructuredData = documents.map((doc) => {
      const items = Object.values(doc).filter(
        (item) => typeof item === 'object' && item !== null && !('_bsontype' in item)
      );
      return {
        _id: doc._id,
        image: doc.image,
        items: items,
      };
    });

    console.log('Datos reestructurados:', restructuredData);

    return NextResponse.json(restructuredData, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching food from MongoDb:', error);
    return NextResponse.json({ error: `Error fetching food from MongoDb: ${error}` }, { status: 500 });
  }
}
