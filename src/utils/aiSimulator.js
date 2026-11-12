// AI Classification and Triage Engine (Heuristic Simulation)

const CATEGORY_KEYWORDS = {
  Hostel: ['hostel', 'room', 'bed', 'warden', 'geyser', 'plumber', 'water leakage', 'bathroom in block', 'lift in hostel', 'ceiling', 'ac in room'],
  Mess: ['mess', 'food', 'canteen', 'roti', 'rice', 'dal', 'meal', 'catering', 'hygiene', 'water dispenser', 'breakfast', 'dinner', 'lunch', 'stomach', 'sprouts'],
  Academics: ['marks', 'grade', 'exam', 're-evaluation', 'professor', 'faculty', 'clash', 'syllabus', 'erp', 'attendance', 'lecture', 'credit', 'degree', 'transcript'],
  Transport: ['bus', 'shuttle', 'route', 'driver', 'late', 'schedule', 'gate', 'metro', 'transport', 'speeding', 'rickshaw', 'commute'],
  Lab: ['lab', 'equipment', 'computer', 'microscope', 'chemical', 'fume hood', 'software', 'cad', 'soldering', 'workbench', 'overheating', 'machine'],
  Library: ['library', 'books', 'librarian', 'reading room', 'quiet', 'wifi', 'ieee', 'journals', 'study hall', 'air conditioning in library'],
  Sanitation: ['toilet', 'washroom', 'flush', 'tap dripping', 'stagnant water', 'dirty', 'odor', 'restroom', 'sanitary', 'soap', 'cleanliness'],
  Infrastructure: ['streetlights', 'ramp', 'road', 'auditorium', 'pothole', 'pathway', 'sports', 'court', 'gate', 'lights', 'electricity', 'generator']
};

const CRITICAL_KEYWORDS = [
  'danger', 'hazard', 'safety', 'fire', 'electric', 'shock', 'trapped', 'collapse', 'leaking ceiling', 'fumes', 'poison', 'urgent', 'emergency', 'exam clash tomorrow', 'severe'
];

const HIGH_KEYWORDS = [
  'unusable', 'broken', 'overheating', 'illness', 'stomach infection', 'penalty', 'missing marks', 'pitch dark', 'darkness', 'speeding'
];

const POSITIVE_KEYWORDS = [
  'thank', 'praise', 'good', 'appreciate', 'helpful', 'extended hours', 'kudos', 'great', 'suggestion', 'recommend'
];

export function fakeAiAnalysis(title = '', description = '', userChosenCategory = '') {
  const fullText = `${title} ${description}`.toLowerCase();

  // 1. Category Detection
  let detectedCategory = userChosenCategory || 'Infrastructure';
  let maxMatches = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let matchCount = 0;
    keywords.forEach(kw => {
      if (fullText.includes(kw)) matchCount += 1;
    });
    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      detectedCategory = category;
    }
  }

  // 2. Sentiment Detection
  let sentiment = 'Neutral';
  let sentimentDetail = 'Objective observation';
  let sentimentScore = 0.50;

  let posCount = POSITIVE_KEYWORDS.filter(k => fullText.includes(k)).length;
  let negCount = [...CRITICAL_KEYWORDS, ...HIGH_KEYWORDS, 'bad', 'poor', 'terrible', 'worst', 'unbearable', 'malfunctioning', 'filthy'].filter(k => fullText.includes(k)).length;

  if (negCount > posCount) {
    sentiment = 'Negative';
    sentimentDetail = negCount >= 2 ? 'Frustrated & Critical' : 'Dissatisfied';
    sentimentScore = Math.max(0.12, 0.40 - (negCount * 0.08));
  } else if (posCount > negCount) {
    sentiment = 'Positive';
    sentimentDetail = 'Constructive & Supportive';
    sentimentScore = Math.min(0.92, 0.65 + (posCount * 0.1));
  } else {
    sentiment = 'Neutral';
    sentimentDetail = 'Inquiry / Operational';
    sentimentScore = 0.50;
  }

  // 3. Priority Detection
  let priority = 'Medium';
  const hasCritical = CRITICAL_KEYWORDS.some(kw => fullText.includes(kw));
  const hasHigh = HIGH_KEYWORDS.some(kw => fullText.includes(kw));

  if (hasCritical) {
    priority = 'Critical';
  } else if (hasHigh || sentiment === 'Negative') {
    priority = 'High';
  } else if (sentiment === 'Positive') {
    priority = 'Low';
  } else {
    priority = 'Medium';
  }

  // Confidence calculation
  const confidence = Math.min(99, Math.max(88, 86 + Math.floor(Math.random() * 12)));

  // Generate unique Ticket ID
  const randomNum = Math.floor(121 + Math.random() * 879);
  const ticketId = `GRV-2026-${randomNum}`;

  // Reasoning snippet
  const reasons = [];
  if (hasCritical) reasons.push('Safety-critical keywords flagged');
  if (detectedCategory) reasons.push(`High semantic similarity with ${detectedCategory} operations`);
  if (sentiment === 'Negative') reasons.push('High emotional dissatisfaction detected');

  return {
    ticketId,
    category: detectedCategory,
    sentiment,
    sentimentDetail,
    sentimentScore,
    priority,
    confidence,
    reasoning: reasons.length > 0 ? reasons.join(' • ') : 'Standard campus triage rules applied'
  };
}
