import {NextResponse} from "next/server";
import clientPromise from "../../../lib/mongodb";

// Function that will handle the post requests we make in page.tsx
export async function POST(req: Request) {
    // Gets the alias and url that were entered
    const {alias, url} = await req.json();

    // Fulfilling assignment requirement for user not entering inputs correctly
    if (!alias) {
        return NextResponse.json({ error: "Missing alias" });
    }
    if (!url) {
        return NextResponse.json({ error: "Missing URL" });
    }
    try {
        // Connecting to Mongo
        const client = await clientPromise;
        const db = client.db("urlshortener");
        const collection = db.collection("aliases");

        // Check if alias is already used
        const existing = await collection.findOne({alias});
        if (existing)
        {
            return NextResponse.json({error: "Alias already taken"});
        }
        // Add alias to the DB
        await collection.insertOne({alias, url});
        // Confirm success
        return NextResponse.json({success: true});
    }
    catch (err) {
        // Error handling
        console.error(err);
        return NextResponse.json({error: "Something went wrong"});
    }
}