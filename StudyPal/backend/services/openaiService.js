import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class OpenAIService {
  async explainConcept(topic, style = 'simple') {
    try {
      const prompts = {
        simple: `Explain "${topic}" in simple, beginner-friendly language. Use clear definitions and avoid jargon. Keep it concise and easy to understand for students with minimal prior knowledge. If it involves code:
1) Provide complete, working code examples with proper formatting using markdown code blocks with language specification (e.g., \`\`\`java, \`\`\`python)
2) After the code, show the EXACT expected output/result that would appear when running this code in a separate code block (use \`\`\`output)
3) Ensure the output is 100% accurate and matches what the code would actually produce`,
        
        analogy: `Explain "${topic}" using a clear, relatable real-world analogy. Make it memorable and easy to understand. Start with the analogy, then connect it to the concept. If it involves code:
1) Include complete, working code examples using markdown code blocks with language specification (e.g., \`\`\`java, \`\`\`python)
2) After the code, show the EXACT expected output/result that would appear when running this code in a separate code block (use \`\`\`output)
3) Ensure the output is 100% accurate and matches what the code would actually produce`,
        
        stepByStep: `Break down "${topic}" into clear, numbered steps. For each step, explain simply and logically. If it involves code or programming:
1) Show complete, working, executable code using markdown code blocks with language specification (e.g., \`\`\`java, \`\`\`python, \`\`\`javascript)
2) Break down the code step by step
3) Explain what each part does
4) After the complete code example, include the EXACT output/result that would appear when running this code in a separate code block labeled as \`\`\`output
5) The output must be 100% accurate - show exactly what would print/display/return when this code runs
6) Make it easy to follow for exam preparation

IMPORTANT: Verify the output matches the code logic precisely. No placeholder or example outputs - only real, accurate results.`,
        
        examReady: `Provide a concise, exam-focused explanation of "${topic}". If it involves code or programming:
1) Provide a complete, working, executable code example using markdown code blocks (e.g., \`\`\`java for Java, \`\`\`python for Python)
2) Immediately after the code, show the EXACT output/result that would appear when running this code in a separate code block (use \`\`\`output)
3) The output must be 100% accurate - show precisely what would print/display/return when executing this code
4) Include step-by-step explanation of the code
5) Explain what the code does and how it works
6) Add key points to remember

CRITICAL: Double-check that the output matches the code exactly. Students need accurate results for exam preparation.

For non-coding topics: Include key definition, main points to remember, and common exam applications. Keep it brief and memorization-friendly.`,
      };

      const systemPrompt = `You are StudyPal, an AI study assistant designed to help students learn and prepare for exams. Your explanations should be:
- Clear and beginner-friendly
- Structured and well-organized
- Free of unnecessary jargon (unless requested)
- Focused on exam preparation
- Supportive and encouraging
- For programming/code topics: Always use proper markdown code blocks with language specification (e.g., \`\`\`java, \`\`\`python, \`\`\`javascript)

CRITICAL FOR CODE EXAMPLES:
- Provide complete, working, executable code that students can run
- After each code block, show the EXACT output in a separate \`\`\`output block
- The output must be 100% accurate - trace through the code logic carefully
- Output should match exactly what would appear when running the code
- Verify all calculations, string operations, loops, and logic
- For "Hello World" type programs, show the exact text that prints
- For calculations, show the precise numerical results
- For loops/iterations, show each line of output if applicable
- Students rely on accurate output for exam preparation and understanding

Always assume minimal prior knowledge and build up from basics.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompts[style] || prompts.simple }
        ],
        temperature: 0.7,
        max_tokens: 800
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Check if it's a quota/billing error
      if (error.status === 429 || error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please add credits to your OpenAI account at https://platform.openai.com/account/billing or update your API key in the .env file.');
      }
      
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY in the .env file.');
      }
      
      throw new Error(`Failed to generate explanation: ${error.message}`);
    }
  }

  async summarizeNotes(notes) {
    try {
      const systemPrompt = `You are StudyPal, an AI study assistant. Summarize the provided study notes in a clear, structured, and exam-focused format. Extract key points, definitions, and important concepts.`;

      const userPrompt = `Summarize these study notes for exam preparation:\n\n${notes}`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        max_tokens: 1000
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Check if it's a quota/billing error
      if (error.status === 429 || error.code === 'insufficient_quota') {
        throw new Error('OpenAI API quota exceeded. Please add credits to your OpenAI account at https://platform.openai.com/account/billing or update your API key in the .env file.');
      }
      
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY in the .env file.');
      }
      
      throw new Error(`Failed to summarize notes: ${error.message}`);
    }
  }
}

export default new OpenAIService();
