import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const actorId = searchParams.get("actorId");
    const apiKey = request.headers.get("x-apify-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 401 }
      );
    }

    if (!actorId) {
      return NextResponse.json(
        { error: "Actor ID is required" },
        { status: 400 }
      );
    }

    // Fetch the actor's input schema
    const response = await fetch(
      `https://api.apify.com/v2/acts/${actorId}/input-schema`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // If input schema endpoint doesn't exist or returns error, return null
      if (response.status === 404) {
        return NextResponse.json(null);
      }
      const data = await response.json();
      return NextResponse.json(
        { error: data.error || `Apify API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching actor input schema:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
