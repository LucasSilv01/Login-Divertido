# Terminal Retrô — Tela de Login (Projeto de IHC)

Descrição
-
Projeto de tela de login com estética de terminal retrô (estilo jogos 80s/90s). Interface totalmente offline que simula autenticação local e foca em usabilidade e experiência do usuário.

Objetivo e restrições
-
- Criar um sistema de login funcional sem conexões externas nem banco de dados.
- Todo o funcionamento é simulado localmente (localStorage e validação JS).
- Não há redirecionamento de página — o feedback é apresentado na mesma tela.

Requisitos funcionais implementados
-
- Interface de login em estilo terminal (`src/App.jsx`).
- Validação local de dados (usuário obrigatório; senha mínima 4 caracteres).
- Feedback ao usuário em estilo terminal (linhas de log, erros e sucesso).
- Funcionamento offline (todos os assets e código locais).

Análise das metas de usabilidade (obrigatórias)
-
- Fácil de lembrar como usar: metáforas familiares (terminal) e placeholders claros tornam o fluxo memorizável.
- Fácil de entender: prompts e labels (`user@retro:` / `senha:`) explicam as ações.
- Útil: fornece feedback claro sobre sucesso/erro e instruções para correção.
- Seguro (percepção do usuário): linguagem de terminal e indicadores visuais reforçam a sensação de controle; informar que é simulação aumenta transparência.
- Eficiente: interação direta, mínimo de passos e resposta quase instantânea.

Metas de experiência escolhidas (mín. 5) — análise
-
- Divertido: estética retrô e efeitos tipográficos criam um tom lúdico.
- Emocionalmente adequado: tom neutro e claro evita frustração em mensagens de erro.
- Compensador: animação de sucesso e mensagem de "ACCESS GRANTED" fornece recompensa imediata.
- Incentivador de criatividade: estilo, cores e possibilidade de personalização (futuro) instigam exploração.
- Esteticamente apreciável: paleta verde sobre fundo escuro e tipografia monoespaço conectam com a nostalgia.

Tecnologias utilizadas
-
- React (JSX) — componentes e estado.
- Vite — dev server e bundling.
- HTML/CSS — estilos, animações e responsividade.
- localStorage/JS — persistência simulada e validação.

Instruções para executar
-
1. Instale dependências:
```bash
npm install
```
2. Rode em modo de desenvolvimento:
```bash
npm run dev
```
Abra `http://localhost:5173` (ou porta mostrada pelo Vite).

Funcionamento offline
-
O projeto não faz requisições externas; todos os assets usados estão no repositório. O login é validado localmente por JavaScript e não envia dados para servidores.

Validação e feedback
-
- Validação local mínima: usuário não vazio, senha com pelo menos 4 caracteres.
- Feedback em tempo simulado: mensagens de erro precedidas por `! Erro:` e sucesso com `ACCESS GRANTED`.

Critérios de avaliação (mapa para a rubrica)
-
- Funcionamento do login (2.0): validação local, fluxo de tentativa e mensagem de sucesso/erro.
- Usabilidade (3.0): labels, placeholders, foco automático, mensagens claras.
- Experiência (3.0): estética retrô, micro-feedback e sensação de recompensa.
- Qualidade do README (2.0): este arquivo documenta o projeto, metas e instruções.

Observações de acessibilidade e extensões futuras
-
- Labels e `aria-live` foram adicionados para melhorar suporte a leitores de tela.
- Futuras melhorias: sons retrô opcionais, animação de digitação, alternativas acessíveis para qualquer interação não-textual.

Arquivos relevantes
-
- `src/App.jsx` — componente Terminal Retrô (login)
- `src/App.css` — estilos do terminal
- `src/main.jsx` — ponto de entrada

Contato
-
Este projeto foi implementado como atividade de IHC — para dúvidas ou melhorias, edite os arquivos no diretório `src/`...