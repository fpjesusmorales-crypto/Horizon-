type QuoteRequest = {
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  cleaningType: "standard" | "deep" | "move-in-move-out";
  condition: "light" | "moderate" | "heavy";
  serviceFrequency: "one-time" | "weekly" | "biweekly" | "monthly";
  zipCode?: string;
  addOns?: string[];
};

function validateBody(body: unknown): body is QuoteRequest {
  if (!body || typeof body !== "object") return false;

  const validCleaningTypes = ["standard", "deep", "move-in-move-out"];
  const validConditions = ["light", "moderate", "heavy"];
  const validFrequencies = ["one-time", "weekly", "biweekly", "monthly"];

  const b = body as Record<string, unknown>;

  return (
    typeof b.bedrooms === "number" &&
    typeof b.bathrooms === "number" &&
    b.bedrooms >= 0 &&
    b.bathrooms >= 0 &&
    (b.squareFeet === undefined || typeof b.squareFeet === "number") &&
    validCleaningTypes.includes(b.cleaningType as string) &&
    validConditions.includes(b.condition as string) &&
    validFrequencies.includes(b.serviceFrequency as string) &&
    (b.zipCode === undefined || typeof b.zipCode === "string") &&
    (b.addOns === undefined || Array.isArray(b.addOns))
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

// Frequency multipliers and descriptions
const FREQUENCY_MULTIPLIER = {
  "one-time": 1.0,
  "weekly": 0.92,    // 8% recurring discount
  "biweekly": 1.0,   // Standard pricing, most popular
  "monthly": 1.05,   // 5% increase due to buildup
};

const FREQUENCY_LABELS: Record<string, string> = {
  "one-time": "One-Time Cleaning",
  "weekly": "Weekly Recurring",
  "biweekly": "Biweekly Recurring",
  "monthly": "Monthly Recurring",
};

// Add-on pricing (min and max estimates)
const ADD_ON_PRICING: Record<string, { min: number; max: number; isPercentage?: boolean }> = {
  "Inside Refrigerator": { min: 35, max: 60 },
  "Inside Oven": { min: 35, max: 75 },
  "Interior Windows": { min: 25, max: 50 }, // Assuming 5-10 windows
  "Baseboards": { min: 40, max: 100 },
  "Inside Cabinets / Drawers": { min: 40, max: 100 },
  "Laundry Folding": { min: 25, max: 50 },
  "Dishes": { min: 20, max: 45 },
  "Pet Hair Treatment": { min: 25, max: 75 },
  "Garage Sweep / Reset": { min: 40, max: 100 },
  "Same-Day / Urgent Request": { min: 0, max: 0, isPercentage: true },
};

// Bathroom surcharge
const BATHROOM_SURCHARGE = 15; // per bathroom over 1

function getSizeCategory(bedrooms: number): "small" | "medium" | "large" {
  if (bedrooms <= 2) return "small";
  if (bedrooms === 3) return "medium";
  return "large";
}

function calculateEstimate(request: QuoteRequest) {
  const { bedrooms, bathrooms, cleaningType, condition, serviceFrequency, addOns = [] } = request;

  const sizeCategory = getSizeCategory(bedrooms);
  const baseRange = PRICING[cleaningType][sizeCategory];
  const conditionMult = CONDITION_MULTIPLIER[condition];
  const frequencyMult = FREQUENCY_MULTIPLIER[serviceFrequency];

  // Calculate adjusted range
  let minPrice = baseRange.min * conditionMult * frequencyMult;
  let maxPrice = baseRange.max * conditionMult * frequencyMult;

  // Add bathroom surcharge (for bathrooms beyond the first)
  const extraBathrooms = Math.max(0, bathrooms - 1);
  const bathroomExtra = extraBathrooms * BATHROOM_SURCHARGE;
  minPrice += bathroomExtra;
  maxPrice += bathroomExtra;

  // Calculate add-on costs
  let addOnMinTotal = 0;
  let addOnMaxTotal = 0;
  let hasSameDayRequest = false;

  for (const addOn of addOns) {
    const pricing = ADD_ON_PRICING[addOn];
    if (pricing) {
      if (pricing.isPercentage) {
        hasSameDayRequest = true;
      } else {
        addOnMinTotal += pricing.min;
        addOnMaxTotal += pricing.max;
      }
    }
  }

  minPrice += addOnMinTotal;
  maxPrice += addOnMaxTotal;

  // Apply same-day surcharge (20%) if selected
  if (hasSameDayRequest) {
    minPrice *= 1.2;
    maxPrice *= 1.2;
  }

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
  const { bedrooms, bathrooms, cleaningType, condition, serviceFrequency, addOns = [] } = request;
  const serviceName = getServiceName(cleaningType);
  const frequencyLabel = FREQUENCY_LABELS[serviceFrequency];

  let summary = `Based on your ${bedrooms} bedroom, ${bathrooms} bathroom home, we estimate a ${serviceName.toLowerCase()} (${frequencyLabel}) will cost between $${minPrice} and $${maxPrice}.`;

  if (addOns.length > 0) {
    summary += ` This includes ${addOns.length} add-on service${addOns.length > 1 ? "s" : ""}.`;
  }

  if (condition === "heavy") {
    summary += " The heavy condition of the home may require additional time and attention.";
  } else if (condition === "light") {
    summary += " Since the home is in light condition, we may be able to complete the job efficiently.";
  }

  // Add frequency-specific messaging
  if (serviceFrequency === "weekly") {
    summary += " Weekly recurring service includes a small discount and helps maintain peak cleanliness with minimal buildup between visits.";
  } else if (serviceFrequency === "biweekly") {
    summary += " Biweekly cleaning is our most popular option—it balances consistent upkeep with affordability and helps prevent buildup between visits.";
  } else if (serviceFrequency === "monthly") {
    summary += " Monthly service may require more time per visit as buildup can return between cleanings, but it's a great option for lighter-traffic homes.";
  } else {
    summary += " Interested in recurring service? It can reduce long-term cleaning effort and help maintain consistency in your home.";
  }

  summary += " Final pricing depends on condition, size, layout, and actual scope.";

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
      estimatedRange: `$${minPrice} – $${maxPrice}`,
      summary,
      selectedAddOns: body.addOns || [],
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
