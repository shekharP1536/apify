import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
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

    // Get the input from the request body
    const input = await request.json();

    // Build query parameters for dataset formatting and filtering
    const queryParams = new URLSearchParams();

    // Actor run parameters
    const timeout = searchParams.get("timeout");
    const memory = searchParams.get("memory");
    const maxItems = searchParams.get("maxItems");
    const maxTotalChargeUsd = searchParams.get("maxTotalChargeUsd");
    const build = searchParams.get("build");
    const webhooks = searchParams.get("webhooks");

    if (timeout) queryParams.append("timeout", timeout);
    if (memory) queryParams.append("memory", memory);
    if (maxItems) queryParams.append("maxItems", maxItems);
    if (maxTotalChargeUsd)
      queryParams.append("maxTotalChargeUsd", maxTotalChargeUsd);
    if (build) queryParams.append("build", build);
    if (webhooks) queryParams.append("webhooks", webhooks);

    // Dataset formatting parameters
    const format = searchParams.get("format");
    const clean = searchParams.get("clean");
    const offset = searchParams.get("offset");
    const limit = searchParams.get("limit");
    const fields = searchParams.get("fields");
    const omit = searchParams.get("omit");
    const unwind = searchParams.get("unwind");
    const flatten = searchParams.get("flatten");
    const desc = searchParams.get("desc");
    const attachment = searchParams.get("attachment");
    const delimiter = searchParams.get("delimiter");
    const bom = searchParams.get("bom");
    const xmlRoot = searchParams.get("xmlRoot");
    const xmlRow = searchParams.get("xmlRow");
    const skipHeaderRow = searchParams.get("skipHeaderRow");
    const skipHidden = searchParams.get("skipHidden");
    const skipEmpty = searchParams.get("skipEmpty");
    const simplified = searchParams.get("simplified");
    const skipFailedPages = searchParams.get("skipFailedPages");

    if (format) queryParams.append("format", format);
    if (clean) queryParams.append("clean", clean);
    if (offset) queryParams.append("offset", offset);
    if (limit) queryParams.append("limit", limit);
    if (fields) queryParams.append("fields", fields);
    if (omit) queryParams.append("omit", omit);
    if (unwind) queryParams.append("unwind", unwind);
    if (flatten) queryParams.append("flatten", flatten);
    if (desc) queryParams.append("desc", desc);
    if (attachment) queryParams.append("attachment", attachment);
    if (delimiter) queryParams.append("delimiter", delimiter);
    if (bom) queryParams.append("bom", bom);
    if (xmlRoot) queryParams.append("xmlRoot", xmlRoot);
    if (xmlRow) queryParams.append("xmlRow", xmlRow);
    if (skipHeaderRow) queryParams.append("skipHeaderRow", skipHeaderRow);
    if (skipHidden) queryParams.append("skipHidden", skipHidden);
    if (skipEmpty) queryParams.append("skipEmpty", skipEmpty);
    if (simplified) queryParams.append("simplified", simplified);
    if (skipFailedPages) queryParams.append("skipFailedPages", skipFailedPages);

    const queryString = queryParams.toString();
    const url = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || `Apify API error: ${response.status}` },
        { status: response.status }
      );
    }

    // Handle different response formats
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return NextResponse.json(data);
    } else {
      // For non-JSON formats (CSV, XML, etc.), return the response as-is
      const responseBody = await response.text();
      return new NextResponse(responseBody, {
        status: 200,
        headers: {
          "Content-Type": contentType || "text/plain",
          ...(attachment === "true" || attachment === "1"
            ? { "Content-Disposition": "attachment" }
            : {}),
        },
      });
    }
  } catch (error) {
    console.error("Error running actor synchronously with input:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

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

    // Build query parameters for the Apify API
    const queryParams = new URLSearchParams();

    // Actor run parameters
    const timeout = searchParams.get("timeout");
    const memory = searchParams.get("memory");
    const maxItems = searchParams.get("maxItems");
    const maxTotalChargeUsd = searchParams.get("maxTotalChargeUsd");
    const build = searchParams.get("build");
    const webhooks = searchParams.get("webhooks");

    if (timeout) queryParams.append("timeout", timeout);
    if (memory) queryParams.append("memory", memory);
    if (maxItems) queryParams.append("maxItems", maxItems);
    if (maxTotalChargeUsd)
      queryParams.append("maxTotalChargeUsd", maxTotalChargeUsd);
    if (build) queryParams.append("build", build);
    if (webhooks) queryParams.append("webhooks", webhooks);

    // Dataset formatting parameters
    const format = searchParams.get("format");
    const clean = searchParams.get("clean");
    const offset = searchParams.get("offset");
    const limit = searchParams.get("limit");
    const fields = searchParams.get("fields");
    const omit = searchParams.get("omit");
    const unwind = searchParams.get("unwind");
    const flatten = searchParams.get("flatten");
    const desc = searchParams.get("desc");
    const attachment = searchParams.get("attachment");
    const delimiter = searchParams.get("delimiter");
    const bom = searchParams.get("bom");
    const xmlRoot = searchParams.get("xmlRoot");
    const xmlRow = searchParams.get("xmlRow");
    const skipHeaderRow = searchParams.get("skipHeaderRow");
    const skipHidden = searchParams.get("skipHidden");
    const skipEmpty = searchParams.get("skipEmpty");
    const simplified = searchParams.get("simplified");
    const skipFailedPages = searchParams.get("skipFailedPages");

    if (format) queryParams.append("format", format);
    if (clean) queryParams.append("clean", clean);
    if (offset) queryParams.append("offset", offset);
    if (limit) queryParams.append("limit", limit);
    if (fields) queryParams.append("fields", fields);
    if (omit) queryParams.append("omit", omit);
    if (unwind) queryParams.append("unwind", unwind);
    if (flatten) queryParams.append("flatten", flatten);
    if (desc) queryParams.append("desc", desc);
    if (attachment) queryParams.append("attachment", attachment);
    if (delimiter) queryParams.append("delimiter", delimiter);
    if (bom) queryParams.append("bom", bom);
    if (xmlRoot) queryParams.append("xmlRoot", xmlRoot);
    if (xmlRow) queryParams.append("xmlRow", xmlRow);
    if (skipHeaderRow) queryParams.append("skipHeaderRow", skipHeaderRow);
    if (skipHidden) queryParams.append("skipHidden", skipHidden);
    if (skipEmpty) queryParams.append("skipEmpty", skipEmpty);
    if (simplified) queryParams.append("simplified", simplified);
    if (skipFailedPages) queryParams.append("skipFailedPages", skipFailedPages);

    const queryString = queryParams.toString();
    const url = `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || `Apify API error: ${response.status}` },
        { status: response.status }
      );
    }

    // Handle different response formats
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // For non-JSON formats (CSV, XML, etc.), return the response as-is
      const responseBody = await response.text();
      return new NextResponse(responseBody, {
        status: 200,
        headers: {
          "Content-Type": contentType || "text/plain",
          ...(attachment === "true" || attachment === "1"
            ? { "Content-Disposition": "attachment" }
            : {}),
        },
      });
    }
  } catch (error) {
    console.error("Error running actor synchronously without input:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
