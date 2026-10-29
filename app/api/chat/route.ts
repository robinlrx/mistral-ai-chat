// Cette route API reçoit les questions de Chat.tsx, les envoie à Groq pour générer une réponse et la renvoie au frontend en protégeant la clé API côté serveur.
import OpenAI from 'openai';

const groq = new OpenAI({
	apiKey: process.env.GROQ_API_KEY,
	baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(request: Request) {
	try {
		if (!process.env.GROQ_API_KEY) {
			return Response.json(
				{ error: 'La clé GROQ_API_KEY est absente de .env' },
				{ status: 500 }
			);
		}

		const { question } = await request.json();

		if (typeof question !== 'string' || !question.trim()) {
			return Response.json(
				{ error: 'La question est vide ou invalide.' },
				{ status: 400 }
			);
		}

		const completion = await groq.chat.completions.create({
			model: 'openai/gpt-oss-20b',
			messages: [{
				role: 'user',
				content: question.trim(),
			}],
		});

		const answer = completion.choices[0]?.message?.content;

		return Response.json({
			answer: answer || 'Aucune réponse disponible.',
		});
	} catch (error) {
		console.error('Erreur Groq :', error);

		return Response.json(
			{ error: 'Impossible de contacter Groq. Réessaie plus tard.' },
			{ status: 500 }
		);
	}
}
