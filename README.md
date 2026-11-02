# Rotina semanal

Planejador de rotinas com painel (HUD) em estilo dark e minimalista. Organize seus dias de segunda a domingo, adicione tarefas em qualquer horário entre 00:00 e 23:59 e acompanhe o progresso com status de **pendente**, **concluída** e **incompleta**. Tudo é salvo no próprio navegador, sem servidor e sem cadastro.

> **Versão atual:** 1.1.0 · **Última atualização:** 2026-11-01
> Veja o histórico completo em [Changelog](#changelog).

---

## Sumário

1. [Funcionalidades](#funcionalidades)
2. [Estrutura do projeto](#estrutura-do-projeto)
3. [Como executar](#como-executar)
4. [Como usar](#como-usar)
5. [Atalhos de teclado](#atalhos-de-teclado)
6. [Como os dados são salvos](#como-os-dados-são-salvos)
7. [Personalização](#personalização)
8. [Publicar no GitHub Pages](#publicar-no-github-pages)
9. [Tecnologias](#tecnologias)
10. [Limitações conhecidas](#limitações-conhecidas)
11. [Ideias para o futuro](#ideias-para-o-futuro)
12. [Changelog](#changelog)
13. [Como manter este README atualizado](#como-manter-este-readme-atualizado)

---

## Funcionalidades

- **Painel lateral (HUD)** com anel de progresso do dia, saudação por período, relógio e data.
- **Contadores por status** (concluídas, pendentes, incompletas) e barra proporcional.
- **Sequência de dias completos:** quantos dias seguidos você concluiu 100% das rotinas.
- **Faixa da semana (seg a dom)** com mini barra de progresso de cada dia.
- **Visão Dia:** linha do tempo de 00:00 a 23:59, com botão **+** em cada hora para criar rotinas já no horário escolhido.
- **Visão Semana:** sete colunas lado a lado, com status alterável direto no cartão da rotina.
- **Rotinas com início e término**, categoria e repetição nos dias da semana que você escolher.
- **Três status por rotina**, guardados **por data** (marcar a segunda desta semana não altera a próxima).
- **Aviso de atraso** para rotinas pendentes cujo horário já passou (somente no dia de hoje).
- **Filtros** por status, **busca** por nome e opção de **ocultar horas vazias**.
- **Editar, excluir e desfazer** a exclusão.
- **Salvamento automático** no navegador (`localStorage`).
- Interface responsiva (celular, tablet e desktop), com foco visível no teclado e respeito à preferência de movimento reduzido.

## Estrutura do projeto

```
rotina/
├── index.html        # Estrutura da página e do diálogo de nova rotina
├── css/
│   └── style.css     # Tema dark, layout, componentes e responsividade
├── js/
│   └── script.js     # Lógica, renderização e persistência
└── README.md         # Este arquivo
```

## Como executar

Não há dependências nem etapa de build.

**Opção 1: abrir direto**
Dê dois cliques em `index.html`. Funciona na maioria dos navegadores.

**Opção 2: servidor local (recomendado)**
Alguns navegadores limitam o `localStorage` em arquivos abertos via `file://`. Para evitar isso:

```bash
# Python
python -m http.server 8000

# ou Node.js
npx serve .
```

Depois acesse `http://localhost:8000`. No VS Code, a extensão **Live Server** também resolve.

> A fonte **Bricolage Grotesque** é carregada do Google Fonts. Sem internet, o app usa a fonte padrão do sistema e continua funcionando.

## Como usar

### Criar uma rotina
1. Clique em **Nova rotina** (ou pressione `N`). Se preferir, na visão Dia passe o mouse sobre uma hora e clique em **+** para já definir o horário.
2. Preencha **nome**, **início** e, se quiser, **término** (o término precisa ser depois do início).
3. Escolha a **categoria** (Saúde, Trabalho, Estudo ou Pessoal).
4. Marque os **dias da semana** em que ela se repete. Os atalhos *Todos*, *Seg a sex* e *Fim de semana* ajudam.
5. Clique em **Salvar rotina**.

### Acompanhar o dia
- Em cada rotina, use o seletor **Pendente · Concluída · Incompleta**.
- O anel, os contadores e a faixa da semana atualizam na hora.
- Rotinas pendentes que já passaram do horário aparecem como **atrasada**.

### Alternar entre Dia e Semana
- Use os botões **Dia** e **Semana** no topo, ou a tecla `W`.
- Na visão **Semana**, clique em uma rotina para avançar o status (pendente → concluída → incompleta → pendente). Clique no cabeçalho de um dia para abri-lo na visão Dia.
- As setas ao lado do título avançam ou voltam **um dia** (visão Dia) ou **uma semana** (visão Semana). O botão **Hoje** volta ao período atual.

### Editar e excluir
- O ícone de lápis edita a rotina. A edição vale para **todos** os dias em que ela se repete.
- O ícone de lixeira exclui a rotina. Um aviso aparece por 5 segundos com a opção **Desfazer**.

## Atalhos de teclado

| Tecla | Ação |
| --- | --- |
| `N` | Abrir "Nova rotina" |
| `/` | Focar a busca |
| `W` | Alternar entre visão Dia e Semana |
| `←` / `→` | Dia (ou semana) anterior / seguinte |
| `Enter` (no campo nome) | Salvar a rotina |
| `Esc` | Fechar o diálogo |

## Como os dados são salvos

Os dados ficam no `localStorage` do navegador, na chave **`rotina.v2`**. Isso significa:

- Não há conta, servidor ou sincronização entre aparelhos.
- Limpar os dados do site ou usar aba anônima apaga ou isola as rotinas.
- Cada navegador e cada endereço (domínio) guarda os seus próprios dados.

### Formato

```json
{
  "items": [
    {
      "id": "k3j9x2a",
      "title": "Treino",
      "start": "07:00",
      "end": "08:00",
      "cat": "saude",
      "days": [0, 2, 4]
    }
  ],
  "log": {
    "2026-11-02": { "k3j9x2a": "concluida" }
  }
}
```

| Campo | Descrição |
| --- | --- |
| `items[].id` | Identificador único gerado automaticamente |
| `items[].start` / `end` | Horário `HH:MM` (24 h). `end` pode ser vazio |
| `items[].cat` | `saude`, `trabalho`, `estudo` ou `pessoal` |
| `items[].days` | Dias da semana: `0` = segunda ... `6` = domingo |
| `log[data][id]` | Status da rotina naquela data: `pendente` (padrão, não gravado), `concluida` ou `incompleta` |

A chave **`rotina.v2.seed`** apenas registra que as rotinas de exemplo já foram criadas na primeira visita.

### Apagar tudo (reiniciar)
No console do navegador (`F12`):

```js
localStorage.removeItem('rotina.v2');
localStorage.removeItem('rotina.v2.seed');
location.reload();
```

## Personalização

### Cores
As cores ficam em variáveis no início de `css/style.css`:

```css
:root {
  --bg: #0c0d12;  /* fundo */
  --sf: #13141b;  /* superfícies */
  --bd: #1f212b;  /* bordas */
  --tx: #e9eaf2;  /* texto */
  --mu: #7d8092;  /* texto secundário */
  --ac: #8b9cff;  /* destaque */
  --ok: #7ee0a8;  /* concluída */
  --pe: #f2c46d;  /* pendente */
  --no: #f27c8f;  /* incompleta */
}
```

### Categorias
Em `js/script.js`, edite o objeto `CATS` (nome e cor de cada categoria):

```js
const CATS = {
  saude: ['Saúde', '#7ee0a8'],
  // adicione novas: chave: ['Nome', '#cor']
};
```

### Rotinas de exemplo
Na primeira visita, o app cria quatro rotinas de exemplo (trecho com `localStorage.setItem(K+'.seed'...)` em `js/script.js`). Você pode editar essa lista ou removê-la.

## Publicar no GitHub Pages

1. Envie a pasta do projeto para um repositório no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch `main` e a pasta `/ (root)`.
4. Salve e aguarde alguns minutos. O link ficará disponível na mesma página.

Depois, adicione o link da demonstração neste README, logo abaixo do título.

## Tecnologias

- HTML5 (incluindo o elemento `<dialog>`)
- CSS3 (variáveis, grid, flexbox)
- JavaScript puro (ES6+), sem frameworks nem bibliotecas
- `localStorage` para persistência
- Fonte Bricolage Grotesque (Google Fonts)

## Limitações conhecidas

- Os dados não sincronizam entre dispositivos.
- Não há exportação nem importação de dados.
- Não há notificações ou lembretes sonoros.
- Rotinas que atravessam a meia-noite devem ser divididas em duas (ex.: 22:00 – 23:59 e 00:00 – 02:00).
- A edição de uma rotina vale para todos os dias em que ela se repete.

## Ideias para o futuro

- [ ] Exportar e importar rotinas em JSON
- [ ] Notificações no horário da rotina
- [ ] Back-end com API e banco de dados, para sincronizar entre dispositivos
- [ ] Login de usuário
- [ ] Estatísticas semanais e mensais
- [ ] Instalação como PWA (uso offline)

## Changelog

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/). As versões mais novas ficam **no topo**.

### [1.1.0] - 2026-11-01
**Adicionado**
- Visão **Semana** (segunda a domingo) com status alterável direto nos cartões.
- Linha do tempo de **00:00 a 23:59** na visão Dia, com botão **+** por hora.
- Rotinas com **início e término** e **repetição por dias da semana**.
- Botão para ocultar horas vazias e atalho `W` para alternar as visões.
- Validação do formulário (nome, horário, término após o início, ao menos um dia).

**Alterado**
- Projeto separado em `index.html`, `css/style.css` e `js/script.js`.
- Formato de armazenamento atualizado para `rotina.v2`.

**Observação**
- As rotinas criadas na 1.0.0 **não são migradas** automaticamente para a 1.1.0.

### [1.0.0] - 2026-11-01
**Adicionado**
- Primeira versão: HUD dark com anel de progresso, status pendente, concluída e incompleta, sequência de dias, faixa da semana, filtros, busca, edição, exclusão com desfazer e salvamento em `localStorage` (`rotina.v1`).

## Como manter este README atualizado

Para não perder detalhes quando o projeto mudar, siga este roteiro:

1. **Nunca apague versões antigas do Changelog.** Adicione uma nova entrada **no topo** da seção, com versão e data.
2. **Escolha o número da versão** (`MAIOR.MENOR.CORREÇÃO`):
   - `CORREÇÃO` (1.1.1): conserto de bug sem mudar o uso.
   - `MENOR` (1.2.0): funcionalidade nova que não quebra o que já existe.
   - `MAIOR` (2.0.0): mudança que quebra compatibilidade (ex.: novo formato de dados).
3. **Classifique cada mudança** em *Adicionado*, *Alterado*, *Corrigido* ou *Removido*.
4. **Atualize só o que mudou** nas outras seções:
   - Nova função: acrescente em [Funcionalidades](#funcionalidades) e, se precisar, em [Como usar](#como-usar).
   - Novo arquivo ou pasta: atualize [Estrutura do projeto](#estrutura-do-projeto).
   - Novo atalho: acrescente na tabela de [Atalhos](#atalhos-de-teclado).
   - Mudança nos dados: atualize o [Formato](#formato), a chave do `localStorage` e registre no Changelog se haverá ou não migração.
5. **Atualize o cabeçalho** (versão atual e data) e marque como feitos (`[x]`) os itens de [Ideias para o futuro](#ideias-para-o-futuro) que foram implementados, em vez de apagá-los.
6. **Peça ajuda ao Claude:** envie a lista do que mudou (ou o código novo) e peça "atualize o README mantendo o histórico". A instrução de preservar o Changelog e as seções existentes evita perda de detalhes.
