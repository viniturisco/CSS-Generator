require('dotenv').config();
const Fastify = require('fastify');
const cors = require('@fastify/cors');

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: '*' });

fastify.post('/generate-css', async (request, reply) => {
    const MY_API_KEY = process.env.API_KEY;

    const { description } = request.body;

    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";

    try {
        let answer = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${MY_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Você é um gerador de código HTML e CSS. Responda SOMENTE com código puro. NUNCA use crases, markdown ou explicações. Formato: primeiro <style> com o CSS, depois o HTML. Siga EXATAMENTE o que o usuário pedir. Se pedir algo quicando, use translateY no @keyframes. Se pedir algo girando, use rotate."
                    },
                    {
                        role: "user",
                        content: description
                    }
                ]
            })
        });

        const CSSdata = await answer.json();
        const GeneratedCSS = CSSdata.choices[0].message.content;
        return reply.send({ resultCss: GeneratedCSS });

    } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: 'Error generating CSS' });
    }
});

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Server running ${address}`);
});