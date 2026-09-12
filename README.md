# Recicla+

Plataforma web para conectar pessoas interessadas em destinar materiais recicláveis com agentes que realizam a coleta, incentivando o descarte adequado e a sustentabilidade na comunidade.

-----
<p align="center">
  <img
    width="911"
    height="791"
    alt="Um"
    src="https://github.com/user-attachments/assets/d95c39c5-c5e8-497e-b54c-1f21829e38a4"
  />
</p>


## Sobre o projeto

O **Recicla+** é um projeto desenvolvido com o objetivo de facilitar a destinação de materiais recicláveis que muitas vezes não são atendidos pela coleta convencional ou que são difíceis de transportar até um ponto de descarte.

A plataforma permite que usuários disponibilizem materiais para coleta e que outros usuários interessados possam visualizar materiais disponíveis e assumir uma coleta.

O projeto também busca incentivar a participação da comunidade em ações relacionadas à **economia sustentável** e à gestão responsável de resíduos.

## Como funciona

O Recicla+ possui dois tipos principais de usuários:

### Gerador

É a pessoa que possui materiais recicláveis e deseja disponibilizá-los para coleta.

O gerador pode:

- Criar uma conta;
- Informar seus dados e endereço;
- Disponibilizar materiais recicláveis;
- Informar a quantidade e a unidade do material;
- Definir data e horário para a coleta;
- Consultar os materiais que disponibilizou;
- Acompanhar o status da coleta;
- Visualizar o coletador interessado.

### Coletador

É a pessoa interessada em realizar a coleta dos materiais disponibilizados.

O coletador pode:

- Criar uma conta;
- Visualizar materiais disponíveis;
- Consultar os detalhes de um material;
- Visualizar o endereço de coleta;
- Demonstrar interesse em realizar uma coleta.

## Materiais

O sistema permite o cadastro de diferentes tipos de materiais:

- Papelão
- Plástico
- Latas
- Garrafas PET
- Vidro
- Eletrônicos
- Outros

A unidade de medida varia de acordo com o material. Por exemplo:

- Papelão: caixas ou unidades
- Plástico: unidades ou sacos de 1 L / 10 L
- Latas: unidades ou sacos de 1 L / 10 L
- Garrafas PET: unidades
- Vidro: unidades
- Eletrônicos: unidades
- Outros: unidades ou sacos de 1 L / 10 L

## Funcionalidades

### Autenticação

- Cadastro de usuários
- Login
- Autenticação por e-mail e senha
- Diferenciação entre gerador e coletador
- Validação dos dados cadastrados

### Gerador

- Dashboard do gerador
- Cadastro de materiais
- Definição de quantidade e unidade
- Definição de data e horário
- Consulta dos materiais cadastrados
- Acompanhamento do status da coleta
- Identificação do coletador interessado

### Coletador

- Dashboard do coletador
- Visualização de materiais disponíveis
- Visualização dos detalhes do material
- Visualização do endereço de coleta
- Solicitação de coleta

## Status dos materiais

Os materiais podem apresentar diferentes estados durante o processo:

- **Disponível** — o material foi cadastrado e ainda não possui um coletador.
- **Em coleta** — um coletador demonstrou interesse e assumiu a coleta.

## Tecnologias utilizadas

### Front-end

- React
- JavaScript
- HTML
- CSS
- Vite
- React Router

### Back-end / Serviços

O projeto utiliza o **Firebase** para serviços de backend:

- Firebase Authentication — autenticação dos usuários;
- Firebase Realtime Database — armazenamento dos dados da aplicação.

### Ferramentas

- Git
- GitHub
- Visual Studio Code
- npm

## Como executar o projeto

### Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm
- Git

### 1. Clonar o repositório

```bash
git clone https://github.com/Niicknicole/Recicla_App.git
```
### 2. Entrar na pasta do projeto 
```bash
cd Recicla_App
```

### 3. Instalar as dependências
```bash
npm install
```
### 4. Configurar o Firebase

O projeto utiliza o Firebase para autenticação dos usuários e armazenamento dos dados. O arquivo src/firebase.js não está disponível no repositório.
Para executar o projeto localmente, crie o arquivo: src/firebase.js
E configure o Firebase utilizando as informações fornecidas no console do Firebase:
import { initializeApp } from "firebase/app";

```javascript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN"
};

const app = initializeApp(firebaseConfig);
export default app;
```

No projeto Firebase, é necessário habilitar:

Authentication → E-mail/senha
Realtime Database

### 5. Executar o projeto
```bash
npm run dev
```

----- 
