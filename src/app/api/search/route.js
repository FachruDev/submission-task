import { NextResponse } from 'next/server';
import axios from 'axios';
import { sourceA, sourceB, sourceC } from '@/lib/mockData';

export async function POST(request) {
  try {
    // no 1 get query from body
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // no 2 get apikey from .env
    const apiKey = process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL;

    // no 3 create smart prompt for LLM
    const prompt = `
      User Question: "${query}"

      Based ONLY on the data provided below from Source A, Source B, and Source C, answer the user's question. 
      Synthesize the information into a clear, combined list. If you find duplicates (like 'Pupper Palace'), merge their information intelligently.
      For each service, provide its name, a consolidated rating, an estimated price, and booking information.
      
      Also, calculate a 'Neptune Score' for each unique service. The formula for the Neptune Score is: (rating / 5) * 70 + (numberOfReviews / 200) * 30. The maximum score is 100. Round the score to the nearest integer.

      Here is the data:
      Source A (JSON): ${JSON.stringify(sourceA)}
      Source B (JSON): ${JSON.stringify(sourceB)}
      Source C (JSON): ${JSON.stringify(sourceC)}

      Return the final result as a single, clean JSON array of objects. Each object in the array should have these keys: "name", "rating", "price", "bookingInfo", and "neptuneScore". Do not include any other text or explanation in your response, only the JSON array.
    `;
    
    // no 4 send request to open router api
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
          'HTTP-Referer': 'http://localhost:3000', 
          'X-Title': 'Neptune Search Test'
        },
      }
    );

    // no 5 extract and parse result from llm
    const rawResult = response.data.choices[0].message.content;
    const jsonMatch = rawResult.match(/(\[[\s\S]*\]|{[\s\S]*})/);

    if (!jsonMatch) {
    console.error("LLM Response did not contain valid JSON:", rawResult);
    throw new Error("Failed to parse LLM response.");
    }

    const jsonString = jsonMatch[0];
    const finalResult = JSON.parse(jsonString); 

    // no 6 return to frontend
    return NextResponse.json(finalResult);

  } catch (error) {
    console.error('Error in API route:', error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}