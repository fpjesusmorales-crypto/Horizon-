import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type QuoteRequest = {
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  cleaningType: "standard" | "deep" | "move-in-move-out";
  condition: "light" | "moderate" | "heavy";
  zipCode?: string;
};

function validateBody(body: any): body is QuoteRequest {
  if (!body || typeof body !== "object") return false;

  const validCleaningTypes = ["standard", "deep", "move-in-move-out"];
  const validConditions = ["light", "moderate", "heavy"];

  return (
    typeof body.bedrooms === "number" &&
    typeof body.bathrooms === "number" &&
    body.bedrooms >= 0 &&
    body.bathrooms >= 0 &&
    (body.squareFeet === undefined || typeof body.squareFeet === "number") &&
    validCleaningTypes.includes(body.cleaningType) &&
    validConditions.includes(body.condition) &&
    (body.zipCode === undefined || typeof body.zipCode === "string")
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!validateBody(body)) {
      return Response.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const {
      bedrooms,
      bathrooms,
      squareFeet,
      cleaningType,
      condition,
      zipCode,
    } = body;

    const systemPrompt = `
You are the quote assistant for Horizon Operations, a residential cleaning company in Nashville, Tennessee.

Your job:
- Give helpful estimate ranges for residential cleaning only.
- The company currently serves Nashville, Tennessee.
- Never guarantee an exact final price.
- Never promise scheduling availability.
- Be concise, professional, and trustworthy.
- Recommend "Book a Cleaning" as the next step.

Pricing guidance:
- Standard cleaning:
  - 1-2 bed: $100-$140
  - 3 bed: $140-$200
  - 4+ bed: $200-$280
- Deep cleaning:
  - 1-2 bed: $180-$280
  - 3 bed: $250-$400
  - 4+ bed: $400-$600+
- Move-in / move-out:
  - Small: $150-$250
  - Medium: $250-$400
  - Large: $400-$700

Adjustments:
- Moderate condition can sit around the middle of the range.
- Heavy condition should move toward the upper end or above the upper end if justified.
- Light condition can sit toward the lower end.
- Bathrooms increase labor.
- Square footage can help refine but should not fully control the estimate.

Output rules:
- Return VALID JSON only.
- No markdown.
- No code fences.
- Use this exact shape:
{
  "recommendedService": string,
  "estimatedRange": string,
  "summary": string,
  "nextStep": string
}
`;

    const userPrompt = `
Customer quote request:
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Square feet: ${squareFeet ?? "not provided"}
- Cleaning type: ${cleaningType}
- Condition: ${condition}
- ZIP code: ${zipCode ?? "not provided"}

Generate the JSON response now.
`;

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const raw = response.output_text?.trim();

    if (!raw) {
      return Response.json(
        { error: "No response from quote model." },
        { status: 500 }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return Response.json(
        {
          error: "Model returned non-JSON output.",
          raw,
        },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Quote API error:", error);
    return Response.json(
      { error: "Something went wrong while generating the estimate." },
      { status: 500 }
    );
  }
}