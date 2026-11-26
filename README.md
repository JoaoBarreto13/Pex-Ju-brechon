# Jú Brechó — Sistema de Gestão

Sistema web moderno e responsivo desenvolvido sob medida para gestão de brechó online, controle de sacolinhas com contagem regressiva de prazos, organização de estoque físico e acompanhamento financeiro.

## 🌸 Funcionalidades

- **Controle de Sacolinhas (Regra de 30 dias):**
  - Acompanhamento do ciclo de vida das compras acumuladas pelas clientes.
  - Alertas visuais automáticos de prazos (`Em aberto`, `Fecha em X dias`, `Vencida`).
  - Geração automática de mensagens personalizadas prontas para envio no WhatsApp com detalhamento de itens e valores.
- **Gestão de Estoque & Localização Física:**
  - Cadastro de peças com identificação precisa do local de guarda (ex: Box da Cama, Caixas Organizadoras, Cabideiros).
  - Consulta ágil para localização imediata das peças na separação de pedidos.
- **Painel Financeiro & Metas:**
  - Resumo de faturamento bruto, despesas operacionais e cálculo de lucro líquido.
  - Acompanhamento do progresso da meta mensal de vendas.
- **Engajamento & Enquetes:**
  - Registro de pesquisas e enquetes de interesse de público das redes sociais.
- **Interface Intuitiva & Temática:**
  - Design temático e responsivo inspirado na identidade visual da marca.
  - Alternância de tema com suporte a **Modo Escuro (Dark Mode)** e **Modo Claro**, com persistência da preferência e fundo quadriculado exclusivo adaptado.

## 🚀 Tecnologias

- **Frontend:** React 19, TypeScript
- **Estilização:** Tailwind CSS v4
- **Ícones:** Lucide React
- **Build & Dev:** Vite
- **Testes Unitários:** Vitest

## 💻 Como Executar

### Pré-requisitos
- Node.js (versão 18+)
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Acesse no navegador: `http://localhost:5173`

### Build para Produção

```bash
npm run build
```
