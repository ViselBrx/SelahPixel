<div align="center">
  <img src="./app-oracoes/assets/svg/selahpixel-logo.svg" width="128" alt="Símbolo do SelahPixel: Bíblia aberta e pausa em pixel art" />

  # SelahPixel

  **“Guarde a Palavra. Encontre sua paz.”**
</div>

---

## Sobre o SelahPixel

O **SelahPixel** é um aplicativo cristão criado para guardar versículos, registrar orações e cultivar momentos diários de reflexão com Deus.

O nome une dois conceitos: **Selah**, palavra encontrada nos Salmos e associada a uma pausa ou reflexão, e **Pixel**, que remete ao universo digital pixelado. Essa combinação inspira uma experiência acolhedora, pessoal e com visual de RPG clássico.

O aplicativo começa vazio e ganha forma com a caminhada de cada pessoa. Não existem versículos ou orações de demonstração: todo o conteúdo é criado pelo próprio usuário.

<table align="center">
  <tr>
    <td align="center" width="180">
      <img src="./app-oracoes/assets/svg/pixel-bible.svg" width="88" alt="Bíblia pixelada" /><br />
      <strong>Palavra</strong><br />
      <sub>Versículos e marcações</sub>
    </td>
    <td align="center" width="180">
      <img src="./app-oracoes/assets/svg/pixel-prayer.svg" width="88" alt="Mãos em oração pixeladas" /><br />
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

## Download para Android

[**⬇ Baixar o SelahPixel para Android (.apk)**](app-oracoes/assets/apk/selahpixel-android.apk)

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
- interface responsiva com arte pixelada original;
- página de créditos, agradecimento e contato com o criador.

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

## Estrutura principal

```text
app-oracoes/
├── assets/
│   ├── apk/                 # Versão Android disponível para download
│   ├── images/              # Ícone, splash e imagens do aplicativo
│   └── svg/                 # Marca e ilustrações em pixel art
├── src/
│   ├── app/                 # Telas e rotas do Expo Router
│   │   └── (tabs)/          # Início, Bíblia, Orações, Marcados e Créditos
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

```powershell
cd C:\Users\enzot\Desktop\App-Ora-es\app-oracoes
npm install
```

Inicie o servidor de desenvolvimento:

```powershell
npm start
```

Escaneie o QR Code com o Expo Go. Também é possível usar os atalhos exibidos pelo Expo ou executar diretamente:

```powershell
# Android ou emulador
npm run android

# Navegador
npm run web
```

Se o cache do Expo causar algum comportamento estranho, reinicie-o com:

```powershell
npx expo start --clear
```

## Verificações do projeto

Antes de gerar uma versão instalável, execute:

```powershell
# Verifica os tipos TypeScript
npm run typecheck

# Verifica a qualidade e o padrão do código
npm run lint

# Confere dependências e configuração do Expo
npx expo-doctor
```

## Dados e privacidade

- o SelahPixel não exige cadastro ou conta do usuário;
- versículos, orações e anotações não são enviados para servidores;
- todo o conteúdo pessoal permanece armazenado localmente no aparelho;
- o aplicativo funciona offline;
- desinstalar o aplicativo ou limpar seus dados pode apagar o conteúdo salvo e o histórico da sequência.

## Identidade visual

A interface combina azul-noturno, pergaminho, dourado e tons de rubi. As ilustrações pixeladas foram criadas para transmitir a atmosfera de uma pequena jornada em RPG sem comprometer a leitura e a tranquilidade dos momentos de reflexão.

O símbolo do SelahPixel representa uma Bíblia aberta com duas barras de pausa no centro: um convite para respirar, guardar a Palavra e encontrar paz.

## Licença 

Este app é licenciado sob a licença MIT. Veja o arquivo [LICENSE](./app-oracoes/LICENSE)
