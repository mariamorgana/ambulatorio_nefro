# Agenda — Ambulatório de Nefrologia

Aplicativo de página única (`index.html`) para gestão da agenda de consultas do
ambulatório de nefrologia: alerta de lotação, registro de ausências médicas e
busca de consultas por prontuário. Não depende de servidor nem de build —
roda direto no navegador.

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (pode ser público ou privado, desde
   que seu plano permita Pages em repositórios privados).
2. Suba o arquivo `index.html` para a raiz do repositório:
   ```bash
   git init
   git add index.html README.md
   git commit -m "Agenda do ambulatório de nefrologia"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git push -u origin main
   ```
3. No GitHub, vá em **Settings → Pages**.
4. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
5. Clique em **Save**. Em alguns minutos o GitHub mostrará o link do site,
   algo como:
   ```
   https://SEU_USUARIO.github.io/SEU_REPOSITORIO/
   ```

Pronto — esse link pode ser acessado e compartilhado normalmente.

## Privacidade dos dados

O aplicativo **não exibe nem armazena o nome dos pacientes em nenhum lugar** —
nem na tela, nem no código da página, nem nos dados salvos no navegador.
Só ficam visíveis: número de prontuário, data, horário e médico(a). Isso vale
tanto para os dados de exemplo que já vêm no `index.html` quanto para
qualquer CSV que for importado depois.

O arquivo CSV original (com nomes completos dos pacientes) é lido e
processado inteiramente no navegador de quem faz o upload — o nome do
paciente é descartado nesse processamento e nunca chega a ser salvo,
enviado ou exibido pelo aplicativo. Colunas mínimas que o CSV precisa ter
para o upload funcionar: `Data/Hora`, `Prontuário`, `Profissional`, `Sit`
(a coluna `Nome Paciente`, se estiver no arquivo, é simplesmente ignorada).

## Atualizando a agenda toda semana e deixando visível para todos com o link

O site é hospedado como arquivos estáticos (não tem "servidor" nem banco de
dados por trás), então para todo mundo que acessa o link ver a mesma
atualização, o processo é em duas etapas, feitas pelo próprio painel
**"Atualizar agenda (CSV semanal)"** no topo da página:

**Passo 1 — Importar o CSV novo (fica só no seu navegador, como uma prévia)**
1. Baixe o novo CSV exportado do sistema (mesmo formato de sempre).
2. Abra o site publicado no navegador.
3. No painel do topo, clique em **"1. Clique para escolher o CSV"** (ou
   arraste o arquivo) e selecione o arquivo baixado.
4. A agenda é recalculada na hora — mas por enquanto só aparece assim no seu
   navegador. O painel mostra o aviso **"Atualização local — ainda não
   publicada"**.

**Passo 2 — Publicar para todo mundo ver**
1. Ainda no painel, clique em **"2. Baixar `agenda-dados.json`"**. Isso baixa
   um arquivinho pequeno (só com prontuário, data, horário e médico — sem
   nome de paciente) para o seu computador.
2. Vá até o repositório no GitHub.
3. Clique em **Add file → Upload files**, arraste o `agenda-dados.json` que
   acabou de baixar (mesmo processo que você já usa para o `index.html`).
   - Se já existir um `agenda-dados.json` no repositório, o GitHub substitui
     o antigo automaticamente.
   - Se for a primeira vez, ele só cria o arquivo novo.
4. Escreva uma mensagem tipo "Atualiza agenda da semana" e clique em
   **Commit changes**.
5. Espere 1–2 minutos — o GitHub Pages atualiza sozinho. A partir daí,
   **qualquer pessoa que abrir o link do site vê essa agenda atualizada**,
   sem precisar importar nada.

Um arquivo de exemplo (`agenda-dados.example.json`) já vai junto neste
pacote, com os dados de exemplo atuais, só para você ver o formato — não é
necessário usá-lo, é só referência.

**Resumo do fluxo semanal, depois da primeira vez:** baixar CSV do sistema →
importar no site → baixar `agenda-dados.json` → subir no GitHub por cima do
anterior → pronto, todo mundo já vê.

Se quiser descartar uma atualização local antes de publicar (por exemplo,
importou o CSV errado), o painel tem o botão **"Descartar esta atualização
local"**, que volta para os dados publicados mais recentes (ou para os dados
de exemplo, se nada tiver sido publicado ainda).

### Por que não atualiza automaticamente sozinho?

Por ser um site 100% estático (sem servidor), não existe como uma pessoa
"enviar" dados que apareçam instantaneamente para as outras sem alguém
publicar um arquivo em algum lugar acessível a todos — no caso, o próprio
repositório do GitHub. Se no futuro isso virar um processo chato demais,
existe a opção de conectar um serviço externo (planilha do Google, Firebase,
etc.) para automatizar a publicação sem precisar subir o arquivo manualmente
— é só pedir que eu configuro.

## Sobre as ausências médicas

As ausências ficam salvas no navegador de cada pessoa que acessa o site
(via `localStorage`), não em um servidor compartilhado. Isso significa que:

- Alterações feitas em um computador/navegador não aparecem em outro.
- Se quiser uma lista de ausências compartilhada por toda a equipe, me avise
  — dá para adaptar para salvar num serviço externo (planilha do Google,
  Firebase, etc.), mas isso exige uma configuração adicional.

## Limites de lotação

- **30 pacientes/dia** → sinalização (alerta amarelo).
- **36 pacientes/dia** → superlotação (alerta vermelho).

Esses limites estão definidos no topo do arquivo `index.html`, nas
constantes `LIMIAR_SINALIZAR` e `LIMIAR_OVERFLOW`, e podem ser ajustados
diretamente ali se a política do ambulatório mudar.
