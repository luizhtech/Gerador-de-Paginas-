import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const prompt = `Você é um designer web premiado e Programador. 
Crie uma landing page COMPLETA e VISUALMENTE IMPRESSIONANTE para o negócio descrito.

Regras de resposta:
- Responda SOMENTE com HTML e CSS puros
- Não use crases, markdown ou explicações
- Não use tags <img>

Identidade visual:
- Invente uma paleta de cores única que combine com a essência do negócio
- Escolha uma Google Font marcante via @import
- Use emojis grandes no lugar de imagens
- Use CSS moderno: gradientes, sombras, animações sutis, layout generoso, tipografia forte

Estrutura da página:
- Header com nome do negócio e menu
- Hero impactante com título, subtítulo e botão CTA
- Seção de diferenciais com emojis
- Depoimento de cliente
- Footer com contato

Todo o conteúdo em português, criativo e específico para o negócio.`;

app.post("/gerar", async (req, res) => {
    try {
        const { texto } = req.body;

        if (!texto) {
            return res.status(400).json({
                erro: "Texto do negócio não enviado."
            });
        }

        const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: prompt
                    },
                    {
                        role: "user",
                        content: texto
                    }
                ]
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            return res.status(resposta.status).json({
                erro: dados.error?.message || "Erro na API da Groq."
            });
        }

        const resultado = dados.choices?.[0]?.message?.content;

        if (!resultado) {
            return res.status(500).json({
                erro: "A API respondeu, mas não retornou código."
            });
        }

        res.json({ resultado });

    } catch (erro) {
        res.status(500).json({
            erro: erro.message
        });
    }
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});