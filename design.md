# Design — PressãoApp

## Visão Geral

Aplicativo de monitoramento de pressão arterial com visual limpo, clínico e confiável. O design segue as diretrizes Apple HIG com foco em legibilidade, uso com uma mão e fluxo intuitivo para usuários de todas as idades.

---

## Paleta de Cores

| Token       | Claro       | Escuro      | Uso                          |
|-------------|-------------|-------------|------------------------------|
| `primary`   | `#E53935`   | `#EF5350`   | Ações principais, destaque   |
| `background`| `#F8F9FA`   | `#0F1117`   | Fundo das telas              |
| `surface`   | `#FFFFFF`   | `#1C1F26`   | Cards e painéis              |
| `foreground`| `#1A1A2E`   | `#F0F0F5`   | Texto principal              |
| `muted`     | `#6B7280`   | `#9CA3AF`   | Texto secundário             |
| `border`    | `#E5E7EB`   | `#2D3748`   | Bordas e divisores           |
| `success`   | `#16A34A`   | `#4ADE80`   | Pressão normal               |
| `warning`   | `#D97706`   | `#FBBF24`   | Pressão elevada              |
| `error`     | `#DC2626`   | `#F87171`   | Pressão alta / crítica       |

---

## Telas

### 1. Home — Registro de Medição
- **Conteúdo:** Formulário central com campos de Sistólica (mmHg), Diastólica (mmHg) e Pulso (bpm)
- **Funcionalidade:** Botão "Registrar" grande e acessível; badge de classificação instantânea (Normal, Elevada, Hipertensão Estágio 1/2)
- **Layout:** Card central com inputs numéricos grandes; última leitura exibida abaixo

### 2. Histórico — Lista de Leituras
- **Conteúdo:** FlatList com leituras ordenadas por data (mais recente primeiro)
- **Funcionalidade:** Cada item mostra data/hora, valores sistólica/diastólica/pulso e badge de classificação colorido; swipe para deletar
- **Layout:** Lista com separadores; cabeçalho com total de registros

### 3. Estatísticas — Gráficos e Resumo
- **Conteúdo:** Gráfico de linha com evolução das últimas leituras; cards com média sistólica, diastólica e pulso; distribuição por classificação
- **Funcionalidade:** Filtro por período (7 dias, 30 dias, todos); exportação de dados
- **Layout:** ScrollView com seções bem definidas

### 4. Configurações (modal/sheet)
- **Conteúdo:** Nome do paciente, meta de pressão, notificações de lembrete
- **Funcionalidade:** Salvar preferências no AsyncStorage

---

## Fluxos Principais

**Registrar medição:**
Home → preencher sistólica/diastólica/pulso → toque em "Registrar" → feedback háptico + classificação exibida → leitura aparece no topo do histórico

**Visualizar histórico:**
Tab Histórico → lista de leituras → toque em item para ver detalhes → swipe para deletar com confirmação

**Analisar evolução:**
Tab Estatísticas → gráfico de linha → selecionar período → ver médias e tendências

---

## Classificação de Pressão Arterial (OMS/AHA)

| Classificação           | Sistólica     | Diastólica   | Cor       |
|-------------------------|---------------|--------------|-----------|
| Normal                  | < 120         | < 80         | Verde     |
| Elevada                 | 120–129       | < 80         | Amarelo   |
| Hipertensão Estágio 1   | 130–139       | 80–89        | Laranja   |
| Hipertensão Estágio 2   | ≥ 140         | ≥ 90         | Vermelho  |
| Crise Hipertensiva      | > 180         | > 120        | Vermelho escuro |
| Hipotensão              | < 90          | < 60         | Azul      |

---

## Componentes Chave

- `BloodPressureInput` — input numérico grande com label e unidade
- `ClassificationBadge` — badge colorido com texto da classificação
- `ReadingCard` — card de leitura para o histórico
- `BPChart` — gráfico de linha com react-native-svg
- `StatCard` — card de estatística com valor e label
