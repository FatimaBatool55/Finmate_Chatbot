// Simple finance knowledge base - chunks with topics
export const knowledgeBase = [
  {
    id: 1,
    topic: "50/30/20 rule",
    content: "The 50/30/20 budgeting rule suggests allocating 50% of income to needs (rent, food, bills), 30% to wants (entertainment, shopping), and 20% to savings and debt repayment. This is a simple framework for beginners to manage their money effectively."
  },
  {
    id: 2,
    topic: "emergency fund",
    content: "An emergency fund should cover 3-6 months of essential living expenses. It should be kept in a easily accessible savings account, not invested in stocks, so it can be used immediately during job loss, medical emergency, or unexpected expenses."
  },
  {
    id: 3,
    topic: "credit score",
    content: "To improve your credit score: pay bills on time, keep credit utilization below 30%, avoid opening too many new accounts at once, maintain older credit accounts, and regularly check your credit report for errors."
  },
  {
    id: 4,
    topic: "mutual funds vs stocks",
    content: "Mutual funds pool money from multiple investors and are managed by professionals, offering diversification and lower risk. Stocks represent direct ownership in a single company, offering higher potential returns but with higher risk and volatility."
  },
  {
    id: 5,
    topic: "tax saving",
    content: "Common tax-saving strategies include contributing to retirement accounts, claiming eligible deductions for education or medical expenses, investing in tax-saving instruments, and keeping proper documentation of deductible expenses throughout the year."
  },
  {
    id: 6,
    topic: "debt repayment strategy",
    content: "Two popular debt repayment methods are the Avalanche method (pay off highest interest debt first to save money) and the Snowball method (pay off smallest debt first for psychological motivation). Choose based on what keeps you most consistent."
  },
  {
    id: 7,
    topic: "fixed deposit vs savings account",
    content: "Fixed deposits offer higher interest rates than regular savings accounts but lock your money for a fixed term with penalties for early withdrawal. Savings accounts offer lower interest but full liquidity for emergencies."
  },
  {
    id: 8,
    topic: "budgeting for irregular income",
    content: "For irregular income, budget based on your lowest expected monthly income, build a larger buffer fund, and treat any extra income above your baseline as bonus savings rather than regular spending money."
  },
];

// Simple keyword-based retrieval (no embeddings needed - works great for small KB)
export function retrieveRelevantDocs(query: string, topK: number = 2): string[] {
  const queryLower = query.toLowerCase();
  const scored = knowledgeBase.map((doc) => {
    const contentLower = (doc.topic + " " + doc.content).toLowerCase();
    let score = 0;
    const queryWords = queryLower.split(/\s+/);
    queryWords.forEach((word) => {
      if (word.length > 3 && contentLower.includes(word)) {
        score += 1;
      }
    });
    return { ...doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored
    .filter((d) => d.score > 0)
    .slice(0, topK)
    .map((d) => d.content);
}