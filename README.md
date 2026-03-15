# ETL Pipeline 🔄 (w/ Nest)

[![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![CircleCI](https://circleci.com/gh/nestjs/nest.svg?style=shield)](https://circleci.com/gh/nestjs/nest)

Uma aplicação robusta de ETL (Extract, Transform, Load) desenvolvida em **NestJS** e conectada a múltiplos clusters **MongoDB**, demonstrando o uso de microsserviços e cronjobs para transporte e criptografia segura de dados entre instâncias.

## 👥 Autores

- **Felipe Tiroleza Biancalana**
- **Beatriz Meloni Meneghetti**
- **Rafael Elias Correa**

---

## 🚀 Arquitetura e Objetivo (Description)

O intuito desta aplicação é demonstrar, na prática, um processo padronizado de **ETL (Extract, Transform, Load)** dividindo as responsabilidades de negócio e segurança. 

O fluxo executado compreende:
1. **Extração (Extract):** Variáveis ("dados") são persistidas em um **Cluster (1)** primário de origem. Múltiplos dados podem ser injetados aqui. 
2. **Transformação (Transform):** Um rotina agendada (Cron Job) analisa iterativamente novos dados presentes no Cluster 1, realizando criptografia baseada em Cifra de César com uma chave/shift específica.
3. **Carga (Load):** Os dados processados e seguros são então transportados e armazenados permanentemente em um **Cluster (2)** secundário de arquivamento ou distribuição. 

### Funcionalidades de Destaque
- Suporte nativo a múltiplos bancos de dados simultâneos utilizando o `MongooseModule` do NestJS.
- Rotinas agendadas `@Cron` com locks de segurança à prova de falhas processuais concorrentes (previne o "loop de dados duplos").
- API exposta via Controllers para fácil injeção e manipulação de informações.
- Tratamento de exceções utilizando `ValidationPipes` global do framework Nest.

---

## 🛠 Instalação 

Clone o repositório, garanta que possui o Node.js e instale as dependências:

```bash
# Clone o rep
$ git clone https://github.com/Tiroleza/ETL_API-.git

# Navegue e instale as dependências
$ cd ETL_API-
$ npm install
```

### Configuração de Ambiente (.env)

Crie no root do projeto o arquivo `.env` seguindo a estrutura do `.env.example`:

```env
MONGODB_URI_CLUSTER1=mongodb+srv://<usuario>:<senha>@seucluster1.net/
MONGODB_URI_CLUSTER2=mongodb+srv://<usuario>:<senha>@seucluster2.net/
# PORT=3000 (Opcional, Default é 3000)
```

---

## 💻 Executando a Aplicação

```bash
# Modo desenvolvimento local
$ npm run start

# Modo desenvolvimento de "watch" (Recarrega automaticamente nas alterações)
$ npm run start:dev

# Compilação e Build para modo de produção (Performance máxima)
$ npm run start:prod
```

Uma vez rodando, o agendador ETL começará de forma automática com base no seu intervalo nativo (1 hora), além de a API estar apta a receber seus cURLS via GET/POST para `http://localhost:3000/dados`.

---

## 🛡 Licença

Este projeto e o framework que o abraça são desenvolvidos perante as regras *open-source* usando a [MIT licensed](LICENSE) do próprio Nest.
