import { ZodIssue } from "zod";

export class InventoryOptimizationError extends Error {
  readonly errorCode: string;
  readonly details: ZodIssue[];

  constructor(message: string, issues: ZodIssue[]) {
    super(message);
    this.name = "InventoryOptimizationError";
    this.errorCode = "INVENTORY_001";
    this.details = issues;
  }
}

export class PricingOptimizationError extends Error {
  readonly errorCode: string;
  readonly historicalData?: number[];

  constructor(message: string, historicalData?: number[]) {
    super(message);
    this.name = "PricingOptimizationError";
    this.errorCode = "PRICING_002";
    this.historicalData = historicalData;
  }
}
