import { Item, MatchResult, MatchScoreBreakdown } from '../types';

// Stop words to exclude from keyword extraction
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'by',
  'about', 'my', 'of', 'is', 'it', 'this', 'that', 'from', 'was', 'i', 'have',
  'has', 'had', 'lost', 'found', 'item', 'please', 'help', 'near', 'around'
]);

function extractKeywords(text: string): Set<string> {
  if (!text) return new Set();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
  return new Set(words);
}

/**
 * Computes rule-based similarity between a lost item and a found item
 * according to Section 17 of the LostLink specification:
 * - Category match: 30%
 * - Keyword/description similarity: 30%
 * - Location similarity: 20%
 * - Date/time proximity: 10%
 * - Color/brand/unique attribute: 10%
 */
export function calculateMatchScore(
  lostItem: Item,
  foundItem: Item
): { score: number; reason: string; breakdown: MatchScoreBreakdown } {
  // 1. Category match (Weight: 30%)
  let categoryScore = 0;
  if (lostItem.category.trim().toLowerCase() === foundItem.category.trim().toLowerCase()) {
    categoryScore = 30;
  } else if (
    (lostItem.category.includes('Electronics') && foundItem.category.includes('Gadgets')) ||
    (lostItem.category.includes('Gadgets') && foundItem.category.includes('Electronics'))
  ) {
    categoryScore = 15;
  }

  // 2. Keyword/Description similarity (Weight: 30%)
  const lostTokens = extractKeywords(`${lostItem.title} ${lostItem.description}`);
  const foundTokens = extractKeywords(`${foundItem.title} ${foundItem.description}`);

  let intersectionCount = 0;
  lostTokens.forEach(token => {
    if (foundTokens.has(token)) {
      intersectionCount++;
    } else {
      // Check partial substring match (e.g. "airpod" vs "airpods", "macbook" vs "mac")
      for (const fToken of foundTokens) {
        if (fToken.includes(token) || token.includes(fToken)) {
          intersectionCount += 0.5;
          break;
        }
      }
    }
  });

  const unionSize = Math.max(1, new Set([...lostTokens, ...foundTokens]).size);
  const keywordRatio = Math.min(1, (intersectionCount * 1.5) / unionSize);
  const keywordScore = Math.round(keywordRatio * 30 * 10) / 10;

  // 3. Location similarity (Weight: 20%)
  let locationScore = 0;
  const locLost = lostItem.location.toLowerCase();
  const locFound = foundItem.location.toLowerCase();

  if (locLost === locFound) {
    locationScore = 20;
  } else {
    // Check if in same building or campus zone
    const zones = ['library', 'canteen', 'lab block', 'sports', 'admin block', 'hostel', 'classroom', 'shuttle'];
    const matchedZone = zones.find(z => locLost.includes(z) && locFound.includes(z));
    if (matchedZone) {
      locationScore = 14;
    } else {
      const lostWords = extractKeywords(lostItem.location);
      const foundWords = extractKeywords(foundItem.location);
      let locOverlap = 0;
      lostWords.forEach(w => {
        if (foundWords.has(w)) locOverlap++;
      });
      if (locOverlap > 0) locationScore = 10;
    }
  }

  // 4. Date/Time proximity (Weight: 10%)
  // Lost item date should be on or slightly before found item date
  let dateScore = 0;
  try {
    const lostDate = new Date(lostItem.date).getTime();
    const foundDate = new Date(foundItem.date).getTime();
    const diffDays = Math.round((foundDate - lostDate) / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays <= 2) {
      dateScore = 10; // Found within 48 hours of being lost
    } else if (diffDays > 2 && diffDays <= 7) {
      dateScore = 7;  // Within a week
    } else if (diffDays > 7 && diffDays <= 14) {
      dateScore = 4;  // Within two weeks
    } else if (diffDays >= -1 && diffDays < 0) {
      dateScore = 6;  // Slight reporting date variance
    } else {
      dateScore = 1;
    }
  } catch {
    dateScore = 3;
  }

  // 5. Color / Brand / Unique attribute match (Weight: 10%)
  let attributeScore = 0;
  const lostBrand = (lostItem.brand || '').toLowerCase().trim();
  const foundBrand = (foundItem.brand || '').toLowerCase().trim();
  const lostColor = (lostItem.color || '').toLowerCase().trim();
  const foundColor = (foundItem.color || '').toLowerCase().trim();

  if (lostBrand && foundBrand && (lostBrand.includes(foundBrand) || foundBrand.includes(lostBrand))) {
    attributeScore += 5;
  }
  if (lostColor && foundColor && (lostColor.includes(foundColor) || foundColor.includes(lostColor))) {
    attributeScore += 5;
  }
  if (attributeScore === 0) {
    // Check if color or brand mentioned in title/description
    if (lostColor && (foundItem.title.toLowerCase().includes(lostColor) || foundItem.description.toLowerCase().includes(lostColor))) {
      attributeScore += 4;
    }
    if (lostBrand && (foundItem.title.toLowerCase().includes(lostBrand) || foundItem.description.toLowerCase().includes(lostBrand))) {
      attributeScore += 4;
    }
  }
  attributeScore = Math.min(10, attributeScore);

  const totalScore = Math.min(100, Math.round(categoryScore + keywordScore + locationScore + dateScore + attributeScore));

  // Construct human-readable reason
  const reasons: string[] = [];
  if (categoryScore >= 30) reasons.push(`Identical category: ${lostItem.category}`);
  if (keywordScore >= 15) reasons.push(`Strong keyword correlation in description`);
  if (locationScore >= 14) reasons.push(`Reported in the same campus facility area`);
  if (dateScore >= 7) reasons.push(`Found close to reported lost date`);
  if (attributeScore >= 5) reasons.push(`Color/Brand attribute alignment`);

  const reason = reasons.length > 0
    ? reasons.join('. ') + '.'
    : 'Partial attribute similarity based on campus reports.';

  return {
    score: totalScore,
    reason,
    breakdown: {
      categoryScore,
      keywordScore,
      locationScore,
      dateScore,
      attributeScore
    }
  };
}

/**
 * Finds all potential matches for a given item against opposite-type items.
 */
export function findMatchesForItem(targetItem: Item, allItems: Item[]): MatchResult[] {
  const isLost = targetItem.type === 'lost';
  const oppositeItems = allItems.filter(item =>
    item._id !== targetItem._id &&
    item.type !== targetItem.type &&
    item.status !== 'closed'
  );

  const results: MatchResult[] = [];

  for (const counterpart of oppositeItems) {
    const lost = isLost ? targetItem : counterpart;
    const found = isLost ? counterpart : targetItem;

    const { score, reason, breakdown } = calculateMatchScore(lost, found);

    // Filter to items having non-trivial match score (>= 25%)
    if (score >= 25) {
      results.push({
        _id: `match_${lost._id}_${found._id}`,
        lostItemId: lost._id,
        foundItemId: found._id,
        score,
        reason,
        breakdown,
        createdAt: new Date().toISOString(),
        counterpartItem: counterpart
      });
    }
  }

  // Sort by highest score first
  return results.sort((a, b) => b.score - a.score);
}
