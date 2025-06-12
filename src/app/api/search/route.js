import { NextResponse } from 'next/server';
import axios from 'axios';
import { sourceA, sourceB, sourceC } from '@/lib/mockData';

/**
 * Handles POST requests to the /api/search endpoint.
 * This function orchestrates the process of querying an LLM with user input and mock data.
 */
export async function POST(request) {
  try {
    // 1. Extract the user's query from the incoming request body.
    const body = await request.json();
    const { query } = body;

    // Basic validation to ensure a query was provided.
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // 2. Securely retrieve API credentials and model configuration from environment variables.
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;

    // 3. Construct a detailed "smart prompt" for the LLM.
    // This prompt provides the user's question, the context (our mock data),
    // and specific instructions for data synthesis, calculations (Neptune Score),
    // and the desired JSON output format. This is the core of our prompt engineering.
    const prompt = `
      User Question: "${query}"

      Based ONLY on the data provided below from Source A, Source B, and Source C, answer the user's question. 
      Synthesize the information into a clear, combined list. If you find duplicates (like 'Pupper Palace'), merge their information intelligently.
      For each service, provide its name, a consolidated rating, an estimated price, and booking information.
      
      You MUST calculate a 'Neptune Score' for each unique service and include it in the JSON output. 
      The formula is: (rating / 5) * 70 + (numberOfReviews / 200) * 30.
      For example, if a service has a rating of 4.8 and 152 reviews, the score would be (4.8 / 5) * 70 + (152 / 200) * 30 = 67.2 + 22.8 = 90.
      Round the final score to the nearest integer.

      Here is the data:
      Source A (JSON): ${JSON.stringify(sourceA)}
      Source B (JSON): ${JSON.stringify(sourceB)}
      Source C (JSON): ${JSON.stringify(sourceC)}

      Return the final result as a single, clean JSON array of objects. Each object in the array must have these keys: "name", "rating", "price", "bookingInfo", and "neptuneScore". Do not include any other text or explanation in your response, only the JSON array.
    `;
    
    // 4. Send the request to the OpenRouter API.
    // We include a system message to guide the LLM's behavior towards being a JSON-focused assistant.
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [
          { role: 'system', content: 'You are a helpful assistant that synthesizes data and returns it in a strict JSON format.' },
          { role: 'user', content: prompt }
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          // Optional headers for OpenRouter's community rankings.
          'HTTP-Referer': 'http://localhost:3000', 
          'X-Title': 'Neptune Search Test'
        },
      }
    );

    // 5. Extract and sanitize the LLM's response.
    // LLMs can sometimes return conversational text or markdown around the JSON.
    // We use a regex to find and extract the valid JSON block from the raw string.
    const rawResult = response.data.choices[0].message.content;
    const jsonMatch = rawResult.match(/(\[[\s\S]*\]|{[\s\S]*})/);

    // If no JSON block is found in the response, throw an error.
    if (!jsonMatch) {
      console.error("LLM Response did not contain valid JSON:", rawResult);
      throw new Error("Failed to parse LLM response.");
    }

    // Parse the clean JSON string into a JavaScript object.
    const jsonString = jsonMatch[0];
    const finalResult = JSON.parse(jsonString); 

    // 6. Return the successfully parsed result to the frontend.
    return NextResponse.json(finalResult);

  } catch (error) {
    // Comprehensive error handling to catch issues from the API call or parsing.
    // Logs the detailed error on the server for debugging purposes.
    console.error('Error in API route:', error.response ? error.response.data : error.message);
    
    // Returns a generic, user-friendly error message to the frontend.
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
