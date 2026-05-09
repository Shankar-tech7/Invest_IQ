const axios = require('axios');

async function callClaude(systemPrompt, userPrompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not defined in environment variables.");
    return "API Key is missing on the server. Please check your .env file.";
  }

  try {
    const res = await axios.post("https://api.anthropic.com/v1/messages", {
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }, {
      headers: { 
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      }
    });
    
    return res.data.content?.[0]?.text || "No response";
  } catch (error) {
    console.error("Error calling Claude:", error?.response?.data || error.message);
    throw new Error("Failed to call Claude API");
  }
}

module.exports = { callClaude };
