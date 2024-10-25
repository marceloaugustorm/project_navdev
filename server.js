const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

const conexao = mysql.createConnection({
    host: '127.0.0.1', 
    user: 'root',
    password: 'nova_senha',
    database: 'cadastro_navdev'
});


conexao.connect((error) => {
    if (error) {
        console.error("Erro ao conectar ao banco de dados:", error);
        return;
    }
    console.log("Conexão com o banco de dados bem-sucedida!");
});


app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    conexao.query(query, [email, senha], (error, results) => {
        if (results.length > 0) {
            res.json({ success: true, message: 'Login bem-sucedido!' });
        } else {
            console.log("Credenciais inválidas");
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }
    });
});

app.post('/cadastro', (req, res) => {
    const { email, senha } = req.body;

    const cadastrado = 'SELECT * FROM usuarios WHERE email = ?';
    conexao.query(cadastrado, [email], (erro, lista) => {
        if (lista.length > 0) {
            return res.status(400).json({ success: false, message: "Email já existe no banco de dados." });
        }

        const query = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';
        conexao.query(query, [email, senha], (error) => {
            if (error) {
                console.error("Erro ao inserir no banco de dados:", error);
                return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário' });
            }
            console.log("Usuário cadastrado com sucesso!");
            res.json({ success: true, message: 'Usuário cadastrado com sucesso!' });
        });
    });
});


app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/cadastro", function(req, res){
    res.sendFile(__dirname + "/cadastro.html");
});

app.get('/home.html', (req, res) => {
    console.log('Acessando home.html');
    res.sendFile(__dirname + '/home.html');
});


app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(`Servidor inicializado em http://localhost:${port}`);
});
