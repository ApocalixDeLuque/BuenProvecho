import {NextRequest, NextResponse} from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db('BuenProvecho');
        const collection = db.collection('Food');

        // Verifica la conexión
        console.log('Conectado a la base de datos:', db.databaseName);

        const documents = await collection.find({}).toArray();

        // Verifica los documentos recuperados
        console.log('Documentos encontrados:', documents);

        return NextResponse.json(documents, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching food from MongoDb:', error);
        return NextResponse.json({ error: `Error fetching food from MongoDb: ${error}` }, { status: 500 });
    }
}