// Fuzzy search utility for typo tolerance and spelling suggestions

// Calculate Levenshtein distance (edit distance) between two strings
function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = [];

    // Create matrix
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[len1][len2];
}

// Calculate similarity between two strings (0-1, where 1 is identical)
function calculateSimilarity(str1, str2) {
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (distance / maxLength);
}

// Find best matching word from a list of words
export function findBestMatch(searchTerm, wordList, threshold = 0.6) {
    let bestMatch = null;
    let bestScore = 0;

    const searchLower = searchTerm.toLowerCase().trim();

    for (const word of wordList) {
        const wordLower = word.toLowerCase();

        // Exact match
        if (wordLower === searchLower) {
            return { word, score: 1, isExact: true };
        }

        // Check if search term is contained in word
        if (wordLower.includes(searchLower)) {
            const score = 0.9; // High score for substring match
            if (score > bestScore) {
                bestScore = score;
                bestMatch = word;
            }
            continue;
        }

        // Calculate fuzzy match score
        const similarity = calculateSimilarity(searchLower, wordLower);

        if (similarity > bestScore && similarity >= threshold) {
            bestScore = similarity;
            bestMatch = word;
        }
    }

    if (bestMatch) {
        return { word: bestMatch, score: bestScore, isExact: false };
    }

    return null;
}

// Check if search term has potential typos and suggest correction
export function getSuggestion(searchTerm, productNames, threshold = 0.6) {
    const searchLower = searchTerm.toLowerCase().trim();

    // Extract unique words from product names
    const allWords = new Set();
    productNames.forEach(name => {
        const words = name.toLowerCase().split(/\s+/);
        words.forEach(word => {
            if (word.length > 2) { // Only consider words longer than 2 chars
                allWords.add(word);
            }
        });
    });

    const wordList = Array.from(allWords);
    const bestMatch = findBestMatch(searchTerm, wordList, threshold);

    // Only suggest if it's not an exact match and has good similarity
    if (bestMatch && !bestMatch.isExact && bestMatch.score >= threshold) {
        return bestMatch.word;
    }

    return null;
}

export default {
    levenshteinDistance,
    calculateSimilarity,
    findBestMatch,
    getSuggestion
};
