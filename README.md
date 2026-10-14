<div align="center">
  <img src="./app-oracoes/assets/svg/pixel-bible.svg" width="112" alt="Bíblia em pixel art" />

  # Orá — Jornada Bíblica

  **Um espaço pessoal para cultivar a Palavra, registrar orações e manter uma jornada diária com Deus.**

  [![Expo](https://img.shields.io/badge/Expo-SDK_57-10131D?style=for-the-badge&logo=expo&logoColor=FFF1C8)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React_Native-0.86-263A55?style=for-the-badge&logo=react&logoColor=FFD77A)](https://reactnative.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-6-943F37?style=for-the-badge&logo=typescript&logoColor=FFF1C8)](https://www.typescriptlang.org/)
</div>

---

## Sobre o app

O **Orá** é um aplicativo cristão feito com Expo e React Native. Sua interface combina leitura confortável com uma identidade visual pixelada inspirada em RPGs clássicos.

O aplicativo começa vazio e ganha forma com a caminhada de cada pessoa. Não há versículos ou orações de demonstração: todo o conteúdo é criado pelo próprio usuário e fica salvo localmente no aparelho.

<table align="center">
  <tr>
    <td align="center" width="180">
      <img src="./app-oracoes/assets/svg/pixel-bible.svg" width="88" alt="Bíblia pixelada" /><br />
      <strong>Palavra</strong><br />
      <sub>Versículos e marcações</sub>
    </td>
    <td align="center" width="180">
      <img src="./app-oracoes/assets/svg/pixel-candle.svg" width="88" alt="Vela pixelada" /><br />
      <strong>Oração</strong><br />
      <sub>Momentos pessoais com Deus</sub>
    </td>
    <td align="center" width="180">
      <img src="./app-oracoes/assets/svg/pixel-shield.svg" width="88" alt="Escudo pixelado" /><br />
      <strong>Jornada</strong><br />
      <sub>Constância e sequência diária</sub>
    </td>
  </tr>
</table>

## Recursos

- página inicial adaptada ao período local: manhã, tarde ou noite;
- palavra do dia escolhida entre os versículos adicionados pelo usuário;
- cadastro, edição e exclusão de versículos pessoais;
- busca por livro, referência, tema ou trecho do texto;
- filtros por tema, testamento e origem;
- marcações com cores e anotações pessoais;
- cadastro, edição e exclusão de orações;
- filtros de oração por período, status e termo de busca;
- sequência diária com chama e calendário semanal;
- confirmação obrigatória antes de qualquer exclusão;
- avisos visuais após cadastrar, atualizar, concluir ou excluir algo;
- funcionamento offline com persistência local;
- interface responsiva com arte pixelada original.

> [!IMPORTANT]
> Os dados são armazenados somente neste aparelho com AsyncStorage. Desinstalar o aplicativo ou limpar seus dados pode remover versículos, orações, marcações e o histórico da sequência.

## Tecnologias

| Tecnologia | Uso no projeto |
| --- | --- |
| Expo SDK 57 | Ferramentas de desenvolvimento e compilação |
| React Native 0.86 | Interface nativa para Android e iOS |
| Expo Router | Navegação baseada nos arquivos de `src/app` |
| TypeScript | Tipagem e segurança do código |
| AsyncStorage | Persistência local dos dados pessoais |
| React Native SVG | Ilustrações e ícones pixelados |
| Reanimated | Suporte às animações da experiência |

## Estrutura principal

```text
app-oracoes/
├── assets/
│   ├── images/              # Ícone, splash e imagens do aplicativo
│   └── svg/                 # Bíblia, vela e escudo em pixel art
├── src/
│   ├── app/                 # Telas e rotas do Expo Router
│   │   └── (tabs)/          # Início, Bíblia, Orações e Marcados
│   ├── components/          # Modais, botões, cards e pixel art
│   ├── context/             # Estado e persistência da jornada
│   ├── data/                # Tipos e metadados do conteúdo
│   ├── theme/               # Cores, fontes e medidas visuais
│   └── utils/               # Utilitários de data e período do dia
├── app.json                 # Configuração do aplicativo Expo
├── eas.json                 # Perfis de compilação APK e produção
└── package.json             # Dependências e comandos
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) em uma versão LTS atual;
- npm, instalado junto com o Node.js;
- [Expo Go](https://expo.dev/go) no celular para testes rápidos, ou um emulador Android;
- uma conta gratuita da Expo para gerar o APK na nuvem.

## Instalação

Abra o terminal dentro da pasta do projeto:

```bash
cd app-oracoes
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Escaneie o QR Code com o Expo Go. Também é possível usar os atalhos exibidos pelo Expo ou executar diretamente:

```bash
# Android ou emulador
npm run android

# Navegador
npm run web
```

Se o cache do Expo causar algum comportamento estranho, reinicie-o com:

```bash
npx expo start --clear
```

## Verificações do projeto

Antes de gerar uma versão instalável, execute:

```bash
# Verifica os tipos TypeScript
npm run typecheck

# Verifica a qualidade e o padrão do código
npm run lint

# Confere dependências e configuração do Expo
npx expo-doctor
```

## Gerar o APK

O perfil `preview` do arquivo `eas.json` está configurado para produzir um **APK instalável diretamente no Android**.

Na primeira utilização, autentique sua conta Expo:

```bash
npx eas-cli@latest login
npx eas-cli@latest whoami
```

Depois, inicie a compilação:

```bash
npm run build:apk
```

O mesmo processo pode ser executado sem o atalho do npm:

```bash
npx eas-cli@latest build --platform android --profile preview
```

O projeto será enviado ao EAS Build. A primeira compilação pode levar alguns minutos porque o serviço prepara e compila todas as dependências nativas. É possível pressionar `Ctrl+C` para parar de acompanhar pelo terminal sem cancelar a compilação que já está rodando na nuvem.

Consulte as compilações recentes com:

```bash
npx eas-cli@latest build:list --platform android
```

Quando o processo terminar, o EAS mostrará um link para baixar e instalar o APK.

## Gerar para a Google Play

Para publicar na Google Play, use o perfil `production`. Ele gera o pacote **AAB** esperado pela loja:

```bash
npx eas-cli@latest build --platform android --profile production
```

O APK de `preview` é indicado para instalação direta e testes. O AAB de `production` é indicado para envio à loja.

## Dados e privacidade

- o app não exige cadastro do usuário final;
- versículos, orações e notas não são enviados a um servidor;
- os dados permanecem no armazenamento local do aparelho;
- toda exclusão solicita confirmação antes de ser realizada;
- o conteúdo pessoal continua disponível sem conexão com a internet.

## Identidade visual

As artes em `assets/svg` usam formas inteiras e `shape-rendering="crispEdges"` para preservar o aspecto pixelado. A paleta mistura azul-noturno, pergaminho, dourado e tons de rubi, trazendo a atmosfera de um diário de jornada em RPG sem comprometer a leitura.

---

<div align="center">
  <img src="./app-oracoes/assets/svg/pixel-candle.svg" width="54" alt="Vela acesa em pixel art" />

  **Feito para transformar pequenos momentos de fé em uma jornada diária.**
</div>
