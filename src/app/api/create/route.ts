import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

// Function that will handle the post requests we make in page.tsx
export async function POST(req: Request) {
    // Gets the alias and url that were entered
    const { alias, url } = await req.json();

    console.log("Received alias:", alias);
    console.log("Received url:", url);

    // Fulfilling assignment requirement for user not entering inputs correctly
    if (!alias) {
        console.log("Alias missing");
        return NextResponse.json({ error: "Missing alias" });
    }
    if (!url) {
        console.log("URL missing");
        return NextResponse.json({ error: "Missing URL" });
    }

    try {
        // Connecting to Mongo
        const client = await clientPromise;
        const db = client.db("urlshortener");
        const collection = db.collection("aliases");

        // Check if alias is already used
        const existing = await collection.findOne({ alias });
        console.log("Existing alias found:", existing);
        if (existing) {
            console.log("Alias already taken");
            return NextResponse.json({ error: "Alias already taken" });
        }

        // Add alias to the DB
        await collection.insertOne({ alias, url });
        console.log("Alias inserted successfully");
        // Confirm success
        return NextResponse.json({ success: true });
    }
    catch (err) {
        // Error handling
        console.error("Error in POST /api/create:", err);
        return NextResponse.json({ error: "Something went wrong" });
    }
}
