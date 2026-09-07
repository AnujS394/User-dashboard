/** All EMI math lives here — no inline calculations in components. */

export function computeMonthlyAmount(
  principal: number,
  tenureMonths: number,
  interestRate: number,
): number {
  if (interestRate === 0) {
    return Math.ceil(principal / tenureMonths);
  }
  const monthlyRate = interestRate / 100 / 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.ceil(emi);
}

export function computeTotalPayable(
  monthlyAmount: number,
  tenureMonths: number,
  processingFee: number,
): number {
  return monthlyAmount * tenureMonths + processingFee;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function buildEmiPlans(
  productId: string,
  principal: number,
  tenures: number[],
): import("../types").EmiPlan[] {
  return tenures.map((tenure, i) => {
    const monthly = computeMonthlyAmount(principal, tenure, 0);
    return {
      id: `${productId}-emi-${tenure}`,
      productId,
      tenureMonths: tenure,
      interestRate: 0,
      processingFee: 0,
      monthlyAmount: monthly,
      totalPayable: computeTotalPayable(monthly, tenure, 0),
    };
  });
}
