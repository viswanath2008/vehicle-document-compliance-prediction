export type DriverInput = {
  vehicleAge: number;
  insuranceStatus: "valid" | "expired" | "none";
  rcStatus: "present" | "missing" | "fake";
  pollutionStatus: "valid" | "expired" | "none";
  licenseStatus: "valid" | "expired" | "suspended";
  vehicleType: "car" | "bike" | "truck" | "auto";
  registrationState: string;
  ownerAge: number;
  pastViolations: number;
};

export type Factor = {
  label: string;
  passed: boolean;
  weight: number;
};

export type PredictionResult = {
  compliant: boolean;
  probability: number;
  factors: Factor[];
  issues: string[];
};

/**
 * Weighted heuristic classifier.
 * Each document/factor contributes a weighted score; the final
 * probability is the normalized sum. A driver is "compliant" if
 * probability >= 0.6 AND no critical disqualifiers are present.
 */
export function predictCompliance(input: DriverInput): PredictionResult {
  const factors: Factor[] = [];
  const issues: string[] = [];

  // Insurance (weight 25)
  const insurancePassed = input.insuranceStatus === "valid";
  factors.push({ label: "Insurance Valid", passed: insurancePassed, weight: 25 });
  if (input.insuranceStatus === "expired") issues.push("Insurance has expired — renewal required immediately.");
  if (input.insuranceStatus === "none") issues.push("No active insurance policy found for this vehicle.");

  // RC (weight 25)
  const rcPassed = input.rcStatus === "present";
  factors.push({ label: "RC Document Present", passed: rcPassed, weight: 25 });
  if (input.rcStatus === "missing") issues.push("Registration Certificate (RC) is missing from vehicle records.");
  if (input.rcStatus === "fake") issues.push("RC document flagged as potentially fraudulent — legal action may apply.");

  // Pollution / PUCC (weight 20)
  const pollutionPassed = input.pollutionStatus === "valid";
  factors.push({ label: "Pollution Certificate (PUCC)", passed: pollutionPassed, weight: 20 });
  if (input.pollutionStatus === "expired") issues.push("Pollution Under Control Certificate has expired.");
  if (input.pollutionStatus === "none") issues.push("No valid Pollution Under Control Certificate on file.");

  // License (weight 20)
  const licensePassed = input.licenseStatus === "valid";
  factors.push({ label: "Driving License Valid", passed: licensePassed, weight: 20 });
  if (input.licenseStatus === "expired") issues.push("Driving license is expired.");
  if (input.licenseStatus === "suspended") issues.push("Driving license is currently suspended.");

  // Past violations (weight 10)
  const violationsPassed = input.pastViolations <= 2;
  factors.push({ label: "Clean Violation History", passed: violationsPassed, weight: 10 });
  if (input.pastViolations > 2) issues.push(`${input.pastViolations} past traffic violations detected — high-risk profile.`);

  // Vehicle age penalty
  if (input.vehicleAge > 15) {
    issues.push("Vehicle is older than 15 years — may require fitness certificate renewal.");
  }

  // Calculate weighted score
  const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
  const earnedScore = factors.reduce((sum, f) => sum + (f.passed ? f.weight : 0), 0);
  let probability = earnedScore / totalWeight;

  // Penalties for severe disqualifiers
  if (input.rcStatus === "fake") probability *= 0.2;
  if (input.licenseStatus === "suspended") probability *= 0.3;
  if (input.insuranceStatus === "none") probability *= 0.5;

  // Critical disqualifiers — auto non-compliant
  const hasCriticalFailure =
    input.rcStatus === "fake" ||
    input.rcStatus === "missing" ||
    input.licenseStatus === "suspended" ||
    input.insuranceStatus === "none";

  const compliant = probability >= 0.6 && !hasCriticalFailure;

  return {
    compliant,
    probability: Math.max(0, Math.min(1, probability)),
    factors,
    issues,
  };
}