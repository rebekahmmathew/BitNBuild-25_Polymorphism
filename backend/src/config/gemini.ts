import { GoogleGenerativeAI } from '@google/generative-ai';

// Use environment variable for Gemini API key; keep initialization lazy to avoid side-effects on import
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

function createGenAI() {
	if (!GEMINI_API_KEY) {
		throw new Error('GEMINI_API_KEY not set in environment');
	}
	return new GoogleGenerativeAI(GEMINI_API_KEY);
}

export { createGenAI };
