![](https://a.imagem.app/bMY5V0.png)
# 💰 Banco Digital
Projeto piloto de desenvolvimento de uma API para um banco digital.



<h4 align="left"> 
	🚧 Cubos Bank 🚧
</h4>

<p align="left">
	<img alt="Status Concluído" src="https://img.shields.io/badge/STATUS-CONCLU%C3%8DDO-brightgreen">
</p>

---

## 💻 Sobre o projeto
API Restful desenvolvida como projeto final do módulo 2 durante a Turma B2B T05 de Desenvolvimento de Software com foco em Backend oferecida pela [Cubos Academy](https://cubos.academy/) em parceria com o Ifood.
A Cubos Academy é uma escola com cursos de tecnologia para todos os perfis, do iniciante ao avançado.

---

## ⚙️ Funcionalidades
-   Criar conta bancária
-   Listar contas bancárias
-   Atualizar os dados do usuário da conta bancária
-   Excluir uma conta bancária
-   Depósitar em uma conta bancária
-   Sacar de uma conta bancária
-   Transferir valores entre contas bancárias
-   Consultar saldo da conta bancária
-   Emitir extrato bancário

---  

## 💻 Como executar o projeto

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/).

#### 🎲 Rodando o Backend (servidor)
```bash
# Clone este repositório
$ git clone git@github.com:GessycaBorges/API-Banco-Digital.git

# Acesse a pasta do projeto no terminal/cmd
$ cd API-Banco-Digital

# Instale as dependências
$ npm install express
$ npm install date-fns --save

# Execute a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor inciará na porta:3000 - acesse http://localhost:3000

```
##
<p align="left">
  <a href="https://github.com/GessycaBorges/API-Banco-Digital" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
</p>

#### 📌Listar contas bancárias
#### `GET` `/contas?senha_banco=Cubos123Bank`
<h2 align="center">
    <img src="https://a.imagem.app/bMnEoG.png" alt="Listar" width="1000">
</h2>

#### 📌Criar conta bancária
#### `POST` `/contas`
<h2 align="center">
    <img src="https://a.imagem.app/bMnLqV.png" alt="Criar" width="1000">
</h2>

#### 📌Atualizar usuário da conta bancária
#### `PUT` `/contas/:numeroConta/usuario`
<h2 align="center">
    <img src="https://a.imagem.app/bMnI6m.png" alt="Atualizar" width="1000">
</h2>

#### 📌Excluir Conta
#### `DELETE` `/contas/:numeroConta`
<h2 align="center">
    <img src="https://a.imagem.app/bMnROb.png" alt="Excluir" width="1000">
</h2>

#### 📌Depositar
#### `POST` `/transacoes/depositar`
<h2 align="center">
    <img src="https://a.imagem.app/bMnmr1.png" alt="Depositar" width="1000">
</h2>

#### 📌Sacar
#### `POST` `/transacoes/sacar`
<h2 align="center">
    <img src="https://a.imagem.app/bMngPW.png" alt="Sacar" width="1000">
</h2>

#### 📌Tranferir
#### `POST` `/transacoes/transferir`
<h2 align="center">
    <img src="https://a.imagem.app/bMnMht.png" alt="Transferir" width="1000">
</h2>

#### 📌Saldo
#### `GET` `/contas/saldo?numero_conta=1&senha=123458`
<h2 align="center">
    <img src="https://a.imagem.app/bMnVJ0.png" alt="Saldo" width="1000">
</h2>

#### 📌Extrato
#### `GET` `/contas/extrato?numero_conta=1&senha=123458`
<h2 align="center">
    <img src="https://a.imagem.app/bMnyOl.png" alt="Extrato" width="1000">
</h2>

---

## 🛠 Tecnologias

As seguintes ferramentas foram usadas na construção do projeto:
#### **Server**  ([NodeJS](https://nodejs.org/en/))

-   **[Express](https://expressjs.com/)**
-   **[date-fns](https://date-fns.org/)**

> Veja o arquivo  [package.json](https://github.com/GessycaBorges/API-Banco-Digital/blob/main/package.json)

#### **Utilitários**

-   Editor:  **[Visual Studio Code](https://code.visualstudio.com/)**
-   Teste de API:  **[Insomnia](https://insomnia.rest/)**

---

## 💡 Como contribuir para o projeto

1. Faça um **fork** do projeto.
2. Crie uma nova branch com as suas alterações: `git checkout -b my-feature`
3. Salve as alterações e crie uma mensagem de commit contando o que você fez: `git commit -m "feature: My new feature"`
4. Envie as suas alterações: `git push origin my-feature`

---

## 🧙🏽‍♀️ Autora

<a href="https://www.linkedin.com/in/gessycaborges/">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/124705468?v=4" width="100px;" alt=""/><br />
 <sub><a>Gessyca Borges</a></sub></a> <a href="https://www.linkedin.com/in/gessycaborges/" title="Gessyca">✨</a>
 <br />

 ---

## 📝 Licença

Feito com ❤️ por Gessyca Borges 👋🏽 [Entre em contato!](https://www.linkedin.com/in/gessycaborges/)