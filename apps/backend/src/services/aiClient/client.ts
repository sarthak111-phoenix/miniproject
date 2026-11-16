import { AiCopilotService, ChatRequest, ExplanationRequest } from '../aiCopilotService';
import { logger } from '../../middleware/errorHandler.middleware';

export class CircuitBreakerOpenError extends Error {
  constructor(message = 'AI Service temporarily unavailable due to high latency. Falling back.') {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}

export class AiClient {
  private static failureCount = 0;
  private static lastFailureTime = 0;
  private static readonly FAILURE_THRESHOLD = 3;
  private static readonly RECOVERY_TIMEOUT_MS = 30000; // 30s cooldown
  private static readonly CALL_TIMEOUT_MS = 10000; // 10s hard timeout per Security.md

  private static isCircuitOpen(): boolean {
    if (this.failureCount >= this.FAILURE_THRESHOLD) {
      if (Date.now() - this.lastFailureTime < this.RECOVERY_TIMEOUT_MS) {
        return true;
      }
      // Half-open: allow probe
      this.failureCount = 0;
    }
    return false;
  }

  public static async explain(req: ExplanationRequest) {
    if (this.isCircuitOpen()) {
      logger.warn('AI circuit breaker is open. Returning graceful fallback.');
      return {
        explanation: 'AI explanation service is temporarily undergoing maintenance. Please refer directly to the verified eligibility criteria listed above.',
        isEligible: false,
        citations: [],
        confidenceScore: 0.5,
        circuitBreakerActive: true,
      };
    }

    try {
      // Execute with hard 10s timeout
      const result = await Promise.race([
        AiCopilotService.explainEligibility(req),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI Engine request timed out after 10000ms')), this.CALL_TIMEOUT_MS)
        ),
      ]);
      this.failureCount = 0;
      return result;
    } catch (err: any) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      logger.error({ error: err.message }, 'AI explain failed');
      throw err;
    }
  }

  public static async chat(req: ChatRequest) {
    if (this.isCircuitOpen()) {
      logger.warn('AI circuit breaker is open. Returning graceful fallback.');
      return {
        answer: 'Our AI Copilot is currently experiencing high demand. Please consult the verified government portal links directly.',
        citations: [],
        isOutOfScope: false,
        confidenceScore: 0.5,
        circuitBreakerActive: true,
      };
    }

    try {
      const result = await Promise.race([
        AiCopilotService.chat(req),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('AI Engine request timed out after 10000ms')), this.CALL_TIMEOUT_MS)
        ),
      ]);
      this.failureCount = 0;
      return result;
    } catch (err: any) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      logger.error({ error: err.message }, 'AI chat failed');
      throw err;
    }
  }

  public static simulateTrip() {
    this.failureCount = 5;
    this.lastFailureTime = Date.now();
  }

  public static reset() {
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }
}
