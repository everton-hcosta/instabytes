import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";
// A variável `conexao` armazena o resultado da função `conectarAoBanco`, que é uma promessa que será resolvida com o objeto de conexão quando a conexão for estabelecida.
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO)

// Função assíncrona que busca todos os posts no banco de dados.
export async function getTodosPosts() {
    // Obtém o banco de dados "imersao-instabytes" da conexão estabelecida.
    const db = conexao.db("imersao-instabytes");
    // Obtém a coleção "posts" do banco de dados.
    const colecao = db.collection("posts");
    // Executa a operação de busca em todos os documentos da coleção e retorna um array com os resultados.
    return colecao.find().toArray()
}

export async function criarPost(novoPost) {
    // Obtém o banco de dados "imersao-instabytes" da conexão estabelecida.
    const db = conexao.db("imersao-instabytes");
    // Obtém a coleção "posts" do banco de dados.
    const colecao = db.collection("posts");
    // Executa a operação de criação de um post
    return colecao.insertOne(novoPost)
}

export async function atualizarPost(id, novoPost) {
    // Obtém o banco de dados "imersao-instabytes" da conexão estabelecida.
    const db = conexao.db("imersao-instabytes");
    // Obtém a coleção "posts" do banco de dados.
    const colecao = db.collection("posts");
    // Executa a operação de atualização de um post
    const objID = ObjectId.createFromHexString(id)
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost})
}