type QuoteRequest = {
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  cleaningType: "standard" | "deep" | "move-in-move-out";
  condition: "light" | "moderate" | "heavy";
  zipCode?: string;
};

function validateBody(body: unknown): body is QuoteRequest {
  if (!body || typeof body !== "object") return false;

  const validCleaningTypes = ["standard", "deep", "move-in-move-out"];
  const validConditions = ["light", "moderate", "heavy"];

  const b = body as Record<string, unknown>;

  return (
    typeof b.bedrooms === "number" &&
    typeof b.bathrooms === "number" &&
    b.bedrooms >= 0 &&
    b.bathrooms >= 0 &&
    (b.squareFeet === undefined || typeof b.squareFeet === "number") &&
    validCleaningTypes.includes(b.cleaningType as string) &&
    validConditions.includes(b.condition as string) &&
    (b.zipCode === undefined || typeof b.zipCode === "string")
  );
}

// Pricing tables based on bedrooms
const PRICING = {
  standard: {
    small: { min: 100, max: 140 },   // 1-2 bed
    medium: { min: 140, max: 200 },  // 3 bed
    large: { min: 200, max: 280 },   // 4+ bed
  },
  deep: {
    small: { min: 180, max: 280 },
    medium: { min: 250, max: 400 },
    large: { min: 400, max: 600 },
  },
  "move-in-move-out": {
    small: { min: 150, max: 250 },
    medium: { min: 250, max: 400 },
    large: { min: 400, max: 700 },
  },
};

// Condition multipliers
const CONDITION_MULTIPLIER = {
  light: 0.9,
  moderate: 1.0,
  heavy: 1.15,
};

// Bathroom surcharge
const BATHROOM_SURCHARGE = 15; // per bathroom over 1

function getSizeCategory(bedrooms: number): "small" | "medium" | "large" {
  if (bedrooms <= 2) return "small";
  if (bedrooms === 3) return "medium";
  return "large";
}

function calculateEstimate(request: QuoteRequest) {
  const { bedrooms, bathrooms, cleaningType, condition } = request;

  const sizeCategory = getSizeCategory(bedrooms);
  const baseRange = PRICING[cleaningType][sizeCategory];
  const conditionMult = CONDITION_MULTIPLIER[condition];

  // Calculate adjusted range
  let minPrice = baseRange.min * conditionMult;
  let maxPrice = baseRange.max * conditionMult;

  // Add bathroom surcharge (for bathrooms beyond the first)
  const extraBathrooms = Math.max(0, bathrooms - 1);
  const bathroomExtra = extraBathrooms * BATHROOM_SURCHARGE;
  minPrice += bathroomExtra;
  maxPrice += bathroomExtra;

  // Round to nearest $5
  minPrice = Math.round(minPrice / 5) * 5;
  maxPrice = Math.round(maxPrice / 5) * 5;

  return { minPrice, maxPrice };
}

function getServiceName(cleaningType: string): string {
  switch (cleaningType) {
    case "standard":
      return "Standard Cleaning";
    case "deep":
      return "Deep Cleaning";
    case "move-in-move-out":
      return "Move-In/Move-Out Cleaning";
    default:
      return "Cleaning Service";
  }
}

function generateSummary(request: QuoteRequest, minPrice: number, maxPrice: number): string {
  const { bedrooms, bathrooms, cleaningType, condition } = request;
  const serviceName = getServiceName(cleaningType);

  let summary = `Based on your ${bedrooms} bedroom, ${bathrooms} bathroom home, we estimate a ${serviceName.toLowerCase()} will cost between $${minPrice} and $${maxPrice}.`;

  if (condition === "heavy") {
    summary += " The heavy condition of the home may require additional time and attention.";
  } else if (condition === "light") {
    summary += " Since the home is in light condition, we may be able to complete the job quickly.";
  }

  return summary;
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

    const { minPrice, maxPrice } = calculateEstimate(body);
    const serviceName = getServiceName(body.cleaningType);
    const summary = generateSummary(body, minPrice, maxPrice);

    const response = {
      recommendedService: serviceName,
      estimatedRange: `$${minPrice} - $${maxPrice}`,
      summary,
      nextStep: "Ready to get started? Click 'Book a Cleaning' to schedule your appointment and we'll confirm the final price based on an in-home assessment.",
    };

    return Response.json(response);
  } catch (error) {
    console.error("Quote API error:", error);
    return Response.json(
      { error: "Something went wrong while generating the estimate." },
      { status: 500 }
    );
  }
}
