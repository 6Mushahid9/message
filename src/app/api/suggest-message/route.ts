import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // or your deployed app
    'X-Title': 'Mushahid-Learning-App',
  },
});

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemma-3-27b-it', // using a free model 😅
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return Response.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("❌ Error:", error);
    return Response.json({ error: "Something went wrong with AI" }, { status: 500 });
  }
}
