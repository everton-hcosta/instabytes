import fs from "fs";
import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiservice.js"

// Função assíncrona para listar todos os posts
export async function listarPosts(req, res) {
    // Chama a função `getTodosPosts` do modelo para obter todos os posts do banco de dados
    const posts = await getTodosPosts();
    // Envia uma resposta HTTP com status 200 (OK) e os posts em formato JSON
    res.status(200).json(posts);
}

// Função assíncrona para criar um novo post
export async function postarNovoPost(req, res) {
    // Obtém os dados do novo post a partir do corpo da requisição
    const novoPost = req.body;

    try {
        // Chama a função `criarPost` do modelo para inserir o novo post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Envia uma resposta HTTP com status 200 (OK) e o post criado em formato JSON
        res.status(200).json(postCriado);
    } catch (erro) {
        // Caso ocorra um erro, loga a mensagem de erro no console e envia uma resposta HTTP com status 500 (Erro interno do servidor)
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

// Função assíncrona para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
    // Cria um objeto com os dados do novo post, incluindo a imagem
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    try {
        // Chama a função `criarPost` do modelo para inserir o novo post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Gera um novo nome para a imagem, utilizando o ID do post criado
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo da imagem para o novo nome
        fs.renameSync(req.file.path, imagemAtualizada);
        // Envia uma resposta HTTP com status 200 (OK) e o post criado em formato JSON
        res.status(200).json(postCriado);
    } catch (erro) {
        // Caso ocorra um erro, loga a mensagem de erro no console e envia uma resposta HTTP com status 500 (Erro interno do servidor)
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`

    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`)
        const descricao = await gerarDescricaoComGemini(imageBuffer)
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        const postCriado = await atualizarPost(id, post);
        // Envia uma resposta HTTP com status 200 (OK) e o post criado em formato JSON
        res.status(200).json(postCriado);
    } catch (erro) {
        // Caso ocorra um erro, loga a mensagem de erro no console e envia uma resposta HTTP com status 500 (Erro interno do servidor)
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"});
    }
}