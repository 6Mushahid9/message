import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Mushahid-Learning-App',
  },
})

export async function POST(req: Request) {
  try {
    const { type } = await req.json();

    const promptMap: Record<string, string> = {
      conversation: "Give me 3 short and friendly random messages to start a conversation.",
      compliment: "Give me 3 short and wholesome compliments.",
      question: "Give me 3 curious questions to ask anonymously.",
      funfact: "Give me 3 fun facts that are short and surprising.",
      motivational: "Give me 3 short motivational messages.",
      joke: "Give me 3 short clean jokes.",
      roast: "Give me 3 friendly roast lines meant in good fun.",
      pickup: "Give me 3 funny or creative pickup lines.",
      sarcasm: "Give me 3 short sarcastic remarks.",
      showerthought: "Give me 3 short and deep shower thoughts.",
      advice: "Give me 3 short pieces of useful life advice.",
      confession: "Give me 3 anonymous-style confessions.",
      poetic: "Give me 3 short poetic lines with emotional depth.",
    };

    const prompt = promptMap[type] || promptMap["conversation"];

    const completion = await openai.chat.completions.create({
      model: 'google/gemma-3-27b-it',
      messages: [
        {
          role: 'user',
          content: `${prompt} add emojis here and there. Format the output as a JSON array of strings.`,
        },
      ],
    });

    const rawReply = completion.choices[0].message.content;

    const suggestions = JSON.parse(
      rawReply?.match(/\[[\s\S]*\]/)?.[0] || '[]'
    ) as string[];

    return Response.json({ success: true, message: "Suggestions ready", suggestions });
  } catch (error) {
    console.error('❌ Error:', error);
    return Response.json(
      { success: false, message: 'Something went wrong with AI' },
      { status: 500 }
    );
  }
}

