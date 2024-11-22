import express from "express";
import multer from "multer";
import cors from "cors"
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

// Configura o armazenamento das imagens enviadas pelo formulário
const storage = multer.diskStorage({
    // Define o diretório onde as imagens serão salvas
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Define o nome do arquivo salvo
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

// Cria uma instância do multer com a configuração de armazenamento definida
const upload = multer({ dest: "./uploads" , storage})

const routes = (app) => {
    // Habilita o middleware `express.json()`, que permite que o Express receba dados no formato JSON nas requisições.
    app.use(express.json());

    app.use(cors(corsOptions));

    // Rota GET para a URL "/posts/". Quando uma requisição GET é feita para essa URL, a função `listarPosts` é executada.
    app.get("/posts", listarPosts);

    // Rota POST para a URL "/posts/". Quando uma requisição POST é feita para essa URL, a função `postarNovoPost` é executada.
    app.post("/posts", postarNovoPost);

    // Rota POST para a URL "/upload/". Quando uma requisição POST é feita para essa URL, a função `uploadImagem` é executada.
    // O middleware `upload.single("imagem")` processa arquivos enviados com o nome de campo "imagem".
    app.post("/upload", upload.single("imagem"), uploadImagem);

    app.put("/upload/:id", atualizarNovoPost);
}

export default routes;