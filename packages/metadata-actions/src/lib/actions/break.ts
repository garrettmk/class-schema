import { Break } from '../util/break';

/**
 * Signals `apply` or `applyToProperties` to stop applying actions and use
 * the current result.
 * 
 * @param metadata
 */
export function breakAction<Metadata>(metadata: Metadata) {
  throw new Break(metadata);
}