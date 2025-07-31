import { redirect } from "next/navigation";
import clientPromise from "../../lib/mongodb"; // Use shared client from lib dir

export default async function RedirectPage({ params }: { params: Promise<{ alias: string }> }) {
    const awaitedParams = await params;       // Await the params object
    const alias = awaitedParams.alias;        // Afterwards get the alias to avoid an annoying error that took 30 minutes to figure out

    try {
        // Connect to the database using the shared client
        const client = await clientPromise;
        const db = client.db("urlshortener");
        const collection = db.collection("aliases");

        // Find the document with the matching alias
        const result = await collection.findOne({ alias });

        if (result && result.url) {
            // If found, redirect to the stored URL
            redirect(result.url);
        }
        else {
            // If not found, show a simple error message
            return (
                <main>
                    <h1>404 - Alias Not Found</h1>
                    <p>Sorry, the alias <strong>{alias}</strong> does not exist</p>
                </main>
            );
        }
    }
    catch (error) {
        // If there is a normal redirect error ignore it to prevent the web page from ALWAYS displaying the something went wrong message in a really annoying problem that took 40 minutes to debug
        if (error instanceof Error && error.message === "NEXT_REDIRECT") {
            throw error;
        }
        // If an error occurs, show a generic error message
        return (
            <main>
                <h1>Error</h1>
                <p>Something went wrong while looking up your URL</p>
            </main>
        );
    }
}
