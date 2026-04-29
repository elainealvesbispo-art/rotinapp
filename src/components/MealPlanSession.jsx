/**
 * MealPlanSession.jsx
 * Cardápio Semanal — integração com API Claude
 */

import { useState, useMemo, useEffect } from "react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const FAMILY_SIZE = 5;

const GROUPS_META = {
  G1:  { name: "Bebidas",              color: "#BA7517", bg: "#FAEEDA" },
  G2:  { name: "Verduras e Folhosos",  color: "#3B6D11", bg: "#EAF3DE" },
  G3:  { name: "Legumes e Hortaliças", color: "#0F6E56", bg: "#E1F5EE" },
  G4:  { name: "Carnes e Proteínas",   color: "#993C1D", bg: "#FAECE7" },
  G5:  { name: "Cereais e Tubérculos", color: "#854F0B", bg: "#FEF3E2" },
  G6:  { name: "Leguminosas",          color: "#3B6D11", bg: "#EAF3DE" },
  G9:  { name: "Frutas",               color: "#993556", bg: "#FBEAF0" },
  G12: { name: "Pães e Fibras",        color: "#854F0B", bg: "#FEF3E2" },
  G13: { name: "Laticínios",           color: "#185FA5", bg: "#E6F1FB" },
};

const SUBSTITUTIONS = {
  G9: [
    { name: "Mamão papaia",    quantity: 135, unit: "g",  measure: "½ und."    },
    { name: "Maçã fuji",       quantity: 100, unit: "g",  measure: "1 und."    },
    { name: "Banana prata",    quantity: 55,  unit: "g",  measure: "1 und."    },
    { name: "Morango",         quantity: 220, unit: "g",  measure: "10 und."   },
    { name: "Uva sem caroço",  quantity: 100, unit: "g"                        },
    { name: "Goiaba",          quantity: 120, unit: "g",  measure: "1 und."    },
    { name: "Melão",           quantity: 185, unit: "g",  measure: "2 fatias"  },
    { name: "Melancia",        quantity: 175, unit: "g",  measure: "1 fatia"   },
    { name: "Kiwi",            quantity: 130, unit: "g",  measure: "2 und."    },
    { name: "Laranja",         quantity: 130, unit: "g",  measure: "1 und."    },
    { name: "Pêssego",         quantity: 150, unit: "g",  measure: "2½ und."   },
  ],
  G12: [
    { name: "Pão de forma integral", quantity: 25, unit: "g", measure: "1 fatia"     },
    { name: "Aveia em flocos crua",  quantity: 18, unit: "g", measure: "1 col. sopa" },
    { name: "Tapioca goma",          quantity: 20, unit: "g", measure: "1 col. sopa" },
    { name: "Pão francês",           quantity: 25, unit: "g", measure: "½ unid."     },
    { name: "Pão de milho",          quantity: 30, unit: "g", measure: "1 und."      },
    { name: "Granola",               quantity: 20, unit: "g", measure: "1 col. sopa" },
    { name: "Cuscuz de milho",       quantity: 45, unit: "g", measure: "3 col. sopa" },
    { name: "Torrada integral",      quantity: 20, unit: "g", measure: "3 und."      },
  ],
  G13: [
    { name: "Iogurte natural desnatado", quantity: 195, unit: "ml"                        },
    { name: "Iogurte grego desnatado",   quantity: 100, unit: "g"                         },
    { name: "Queijo cottage",            quantity: 65,  unit: "g", measure: "2 col. sopa" },
    { name: "Creme de ricota light",     quantity: 65,  unit: "g", measure: "3 col. sopa" },
    { name: "Queijo minas frescal",      quantity: 30,  unit: "g"                         },
    { name: "Leite desnatado",           quantity: 240, unit: "ml"                        },
    { name: "Requeijão light",           quantity: 30,  unit: "g"                         },
  ],
  G4: [
    { name: "Frango peito grelhado",  quantity: 100, unit: "g", measure: "2 bifes"   },
    { name: "Tilápia assada",         quantity: 120, unit: "g", measure: "2 filés"   },
    { name: "Salmão grelhado",        quantity: 120, unit: "g", measure: "2 filés"   },
    { name: "Filé de merluza",        quantity: 95,  unit: "g", measure: "1 filé"    },
    { name: "Atum natural",           quantity: 60,  unit: "g", measure: "3 col. sopa" },
    { name: "Bacalhau cozido",        quantity: 60,  unit: "g", measure: "1 pedaço"  },
    { name: "Camarão grelhado",       quantity: 80,  unit: "g", measure: "10 und."   },
    { name: "Filé mignon grelhado",   quantity: 100, unit: "g", measure: "2 bifes"   },
    { name: "Ovos (2 unidades)",      quantity: 110, unit: "g", measure: "2 und."    },
  ],
  G3: [
    { name: "Brócolis cozido",      quantity: 90,  unit: "g" },
    { name: "Cenoura cozida",       quantity: 60,  unit: "g" },
    { name: "Tomate cereja",        quantity: 100, unit: "g" },
    { name: "Abobrinha refogada",   quantity: 95,  unit: "g" },
    { name: "Chuchu cozido",        quantity: 83,  unit: "g" },
    { name: "Palmito em conserva",  quantity: 75,  unit: "g" },
    { name: "Beterraba cozida",     quantity: 55,  unit: "g" },
    { name: "Couve-flor cozida",    quantity: 100, unit: "g" },
    { name: "Pepino cru",           quantity: 100, unit: "g" },
    { name: "Pimentão amarelo",     quantity: 70,  unit: "g" },
    { name: "Shimeji",              quantity: 120, unit: "g" },
  ],
  G5: [
    { name: "Arroz branco cozido",   quantity: 75,  unit: "g", measure: "3 col. sopa" },
    { name: "Arroz integral cozido", quantity: 90,  unit: "g", measure: "3 col. sopa" },
    { name: "Batata doce cozida",    quantity: 150, unit: "g", measure: "4 fatias"    },
    { name: "Batata inglesa cozida", quantity: 150, unit: "g", measure: "4 col. sopa" },
    { name: "Mandioca cozida",       quantity: 75,  unit: "g", measure: "3 col. sopa" },
    { name: "Macarrão cozido",       quantity: 90,  unit: "g", measure: "3 col. sopa" },
    { name: "Cará cozido",           quantity: 120, unit: "g", measure: "3 col. sopa" },
  ],
  G6: [
    { name: "Feijão carioca",       quantity: 55, unit: "g" },
    { name: "Feijão preto",         quantity: 55, unit: "g" },
    { name: "Feijão branco",        quantity: 29, unit: "g" },
    { name: "Feijão fradinho",      quantity: 50, unit: "g" },
    { name: "Ervilha enlatada",     quantity: 55, unit: "g" },
    { name: "Lentilha cozida",      quantity: 46, unit: "g" },
    { name: "Grão-de-bico cozido",  quantity: 28, unit: "g" },
    { name: "Milho verde enlatado", quantity: 50, unit: "g" },
  ],
};

const MEAL_META = {
  breakfast:       { label: "Café da manhã",  color: "#EF9F27" },
  lunch:           { label: "Almoço",         color: "#1D9E75" },
  afternoon_snack: { label: "Café da tarde",  color: "#EF9F27" },
  dinner:          { label: "Jantar",         color: "#378ADD" },
  supper:          { label: "Ceia",           color: "#D4537E" },
};

const SHOPPING_ORDER = ["G4", "G5", "G6", "G3", "G9", "G12", "G13", "G1"];

// ─────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────

const SYSTEM_PROMPT = `Você é nutricionista especializado em alimentação familiar mediterrânea, portuguesa e brasileira.
Gere cardápios semanais para família de 5 (2 adultos + 3 crianças) seguindo o plano João Muzzy.

ESTRUTURA (quantidades POR PESSOA por refeição):
- Café da manhã: G1 bebida livre + 1×G9 fruta + 2×G12 pão/fibra + 1×G13 laticínio
- Almoço: G2 folhas livres + 2×G3 legumes (150g) + 2×G4 proteína + 3×G5 cereal + 1×G6 leguminosa
- Café da tarde: G1 + 1×G9 + 2×G12 + 1×G13
- Jantar: G2/G3 legumes livres (150g) + 2×G4 + 2×G12 carboidrato + 1×G13
- Ceia: 1×G9 fruta leve
- Sábado jantar: SEMPRE is_free_meal:true

GRUPOS (quantidade por porção individual):
G9: mamão 135g | maçã 100g | banana 55g | morango 220g | uva 100g | goiaba 120g | melão 185g | kiwi 130g
G12 (1 porção): pão integral 25g | aveia 18g | tapioca 20g | pão francês 25g | granola 20g | cuscuz 45g
G13: iogurte natural 195ml | iogurte grego 100g | cottage 65g | ricota light 65g | queijo minas 30g
G4 (2 porções): frango 100g | tilápia 120g | salmão 120g | merluza 95g | atum 60g | bacalhau 60g | camarão 80g | filé mignon 100g
G3: brócolis 90g | cenoura 60g | tomate 80g | abobrinha 95g | chuchu 83g | palmito 75g | beterraba 55g
G5 (3 porções total): arroz branco 75g | arroz integral 90g | batata doce 150g | batata inglesa 150g | mandioca 75g | macarrão 90g
G6: feijão carioca 55g | feijão preto 55g | ervilha 55g | lentilha 46g | feijão branco 29g | grão-de-bico 28g

REGRAS:
- Não repetir proteína G4 mais de 2×/semana
- 2+ dias mediterrâneos, 2+ dias portuguesa, 3 dias brasileira
- kids_note em toda refeição
- Nomes criativos em português
- Varie as frutas G9 ao longo da semana

Retorne SOMENTE JSON válido sem markdown:
IMPORTANTE: O JSON deve estar COMPLETO com todos os 7 dias. Nunca cortes a resposta a meio.
{"week_theme":"tema","days":[{"day_index":0,"day_key":"monday","day_label":"Segunda-feira","day_short":"Seg","culinary_influence":"Base brasileira","meals":{"breakfast":{"name":"nome","items":[{"food":"nome","group":"G9","quantity_per_person":135,"unit":"g","measure":"½ und."}],"kids_note":"dica"},"lunch":{"name":"...","items":[...],"kids_note":"..."},"afternoon_snack":{"name":"...","items":[...],"kids_note":"..."},"dinner":{"name":"...","items":[...],"kids_note":"..."},"supper":{"name":"...","items":[...]}}},...7 dias total]}`;

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export default function MealPlanSession() {
  const [plan, setPlan]               = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [tab, setTab]                 = useState("plan");
  const [openSub, setOpenSub]         = useState(null);
  const [checked, setChecked]         = useState({});
  const [weekCount, setWeekCount]     = useState(0);

  // Persistência localStorage
  useEffect(() => {
    const saved = localStorage.getItem("nt_mealplan_ia");
    if (saved) { try { setPlan(JSON.parse(saved)); setWeekCount(1); } catch {} }
  }, []);
  useEffect(() => {
    if (plan) localStorage.setItem("nt_mealplan_ia", JSON.stringify(plan));
  }, [plan]);

  // ── Generate a new week via Claude API ──
  const generate = async () => {
    setLoading(true);
    setError(null);
    setChecked({});
    setOpenSub(null);

    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

      if (!apiKey) {
        setError("Chave da API não encontrada. Verifica o ficheiro .env (VITE_ANTHROPIC_API_KEY).");
        setLoading(false);
        return;
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 8000,
          system: SYSTEM_PROMPT,
          messages: [{
            role: "user",
            content: `Gere o cardápio da semana ${weekCount + 1}. ${
              weekCount > 0
                ? "Crie pratos e combinações completamente diferentes das semanas anteriores."
                : "Comece com uma semana equilibrada e variada."
            }`,
          }],
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(`Erro da API: ${res.status} — ${errData?.error?.message ?? "sem detalhes"}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      const raw  = data.content?.find(b => b.type === "text")?.text ?? "";
      const json = JSON.parse(raw.replace(/```json|```/g, "").trim());

      setPlan(json);
      setWeekCount(c => c + 1);
      setSelectedDay(0);

    } catch (e) {
      setError(`Erro: ${e.message ?? "Não foi possível gerar o cardápio. Verifique a conexão."}`);
    }

    setLoading(false);
  };

  // ── Substitute a food item in-place ──
  const substitute = (dayIdx, mealKey, itemIdx, opt) => {
    setPlan(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const item = next.days[dayIdx].meals[mealKey].items[itemIdx];
      item.food                = opt.name;
      item.quantity_per_person = opt.quantity;
      item.unit                = opt.unit;
      item.measure             = opt.measure ?? "";
      return next;
    });
    setOpenSub(null);
  };

  // ── Build shopping list ──
  const shopping = useMemo(() => {
    if (!plan) return {};
    const acc = {};

    plan.days.forEach(day => {
      Object.values(day.meals).forEach(meal => {
        (meal.items ?? []).forEach(item => {
          if (!item.quantity_per_person) return;
          const k = `${item.group}||${item.food}`;
          if (!acc[k]) acc[k] = { food: item.food, group: item.group, unit: item.unit ?? "g", total: 0 };
          acc[k].total += item.quantity_per_person * FAMILY_SIZE;
        });
      });
    });

    const grouped = {};
    Object.values(acc).forEach(item => {
      if (!grouped[item.group]) grouped[item.group] = [];
      grouped[item.group].push(item);
    });
    return grouped;
  }, [plan]);

  const day = plan?.days?.[selectedDay];

  return (
    <div style={styles.root}>
      <Header plan={plan} loading={loading} weekCount={weekCount} onGenerate={generate} />

      {error && <ErrorBanner message={error} />}
      {loading && <LoadingState />}
      {!plan && !loading && <EmptyState />}

      {plan && !loading && (
        <>
          <TabBar tab={tab} setTab={setTab} />

          {tab === "plan" && (
            <>
              <DaySelector
                days={plan.days}
                selectedDay={selectedDay}
                onSelect={i => { setSelectedDay(i); setOpenSub(null); }}
              />
              {day && (
                <>
                  <DayHeading day={day} />
                  {Object.entries(MEAL_META).map(([mealKey, meta]) => {
                    const meal = day.meals[mealKey];
                    if (!meal) return null;
                    return (
                      <MealCard
                        key={mealKey}
                        meal={meal}
                        mealKey={mealKey}
                        meta={meta}
                        dayIdx={selectedDay}
                        openSub={openSub}
                        setOpenSub={setOpenSub}
                        onSubstitute={substitute}
                      />
                    );
                  })}
                </>
              )}
            </>
          )}

          {tab === "shopping" && (
            <ShoppingList list={shopping} checked={checked} setChecked={setChecked} />
          )}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function Header({ plan, loading, weekCount, onGenerate }) {
  return (
    <div style={styles.header}>
      <div>
        <h2 style={styles.title}>
          Cardápio semanal
          {plan && <span style={styles.titleSub}> — {plan.week_theme}</span>}
        </h2>
        <p style={styles.subtitle}>5 pessoas · plano João Muzzy</p>
      </div>
      <button
        onClick={onGenerate}
        disabled={loading}
        style={{ ...styles.primaryBtn, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Gerando..." : weekCount === 0 ? "Gerar cardápio" : "Nova semana"}
      </button>
    </div>
  );
}

function ErrorBanner({ message }) {
  return <div style={styles.errorBanner}>{message}</div>;
}

function LoadingState() {
  return (
    <div style={styles.emptyState}>
      <p style={{ fontSize: 14, color: "#64748b", marginBottom: 6 }}>Preparando o cardápio...</p>
      <p style={{ fontSize: 12, color: "#94a3b8" }}>Consultando influências mediterrâneas e portuguesas</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={styles.emptyState}>
      <p style={styles.emptyTitle}>Nenhum cardápio gerado</p>
      <p style={styles.emptyBody}>Clique em "Gerar cardápio" para criar uma semana personalizada</p>
    </div>
  );
}

function TabBar({ tab, setTab }) {
  return (
    <div style={styles.tabBar}>
      {[["plan", "Cardápio"], ["shopping", "Lista de compras"]].map(([key, label]) => (
        <button
          key={key}
          onClick={() => setTab(key)}
          style={{ ...styles.tabBtn, ...(tab === key ? styles.tabBtnActive : {}) }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function DaySelector({ days, selectedDay, onSelect }) {
  return (
    <div style={styles.daySelector}>
      {days.map((d, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          style={{ ...styles.dayBtn, ...(selectedDay === i ? styles.dayBtnActive : {}) }}
        >
          {d.day_short}
        </button>
      ))}
    </div>
  );
}

function DayHeading({ day }) {
  return (
    <div style={styles.dayHeading}>
      <span style={{ fontSize: 15, fontWeight: 500, color: "#1e293b" }}>{day.day_label}</span>
      <span style={styles.influenceBadge}>{day.culinary_influence}</span>
    </div>
  );
}

function MealCard({ meal, mealKey, meta, dayIdx, openSub, setOpenSub, onSubstitute }) {
  return (
    <div style={styles.card}>
      <div style={styles.mealHeader}>
        <div style={{ ...styles.dot, background: meta.color }} />
        <span style={styles.mealLabel}>{meta.label}</span>
      </div>
      <p style={styles.mealName}>{meal.name}</p>

      {meal.is_free_meal && (
        <p style={{ fontSize: 13, color: "#64748b", padding: "4px 0" }}>
          Refeição livre — hambúrguer artesanal, pizza, japonesa ou churrasco (até 1000 kcal)
        </p>
      )}

      {!meal.is_free_meal && (meal.items ?? []).map((item, idx) => {
        const subKey = `${dayIdx}-${mealKey}-${idx}`;
        const isOpen = openSub === subKey;
        const opts   = SUBSTITUTIONS[item.group] ?? [];
        const gMeta  = GROUPS_META[item.group] ?? {};

        return (
          <div key={idx}>
            <div style={{ ...styles.itemRow, borderTop: idx > 0 ? "0.5px solid #f1f5f9" : "none" }}>
              <div style={styles.itemLeft}>
                <span style={{ ...styles.groupBadge, background: gMeta.bg, color: gMeta.color, borderColor: gMeta.color }}>
                  {item.group}
                </span>
                <span style={styles.foodName}>{item.food}</span>
              </div>
              <div style={styles.itemRight}>
                <span style={styles.qty}>
                  {item.quantity_per_person ? `${item.quantity_per_person}${item.unit ?? "g"}` : "livre"}
                  {item.measure ? ` (${item.measure})` : ""}
                </span>
                {opts.length > 0 && (
                  <button
                    onClick={() => setOpenSub(isOpen ? null : subKey)}
                    style={{ ...styles.trocarBtn, ...(isOpen ? styles.trocarBtnActive : {}) }}
                  >
                    {isOpen ? "fechar" : "trocar"}
                  </button>
                )}
              </div>
            </div>

            {isOpen && (
              <div style={styles.subPanel}>
                <p style={styles.subPanelTitle}>Substituições disponíveis — grupo {item.group}</p>
                <div style={styles.subGrid}>
                  {opts.map((opt, oi) => {
                    const isActive = opt.name === item.food;
                    return (
                      <button
                        key={oi}
                        onClick={() => onSubstitute(dayIdx, mealKey, idx, opt)}
                        style={{ ...styles.subOption, ...(isActive ? styles.subOptionActive : {}) }}
                      >
                        <span style={{ fontSize: 13 }}>{opt.name}</span>
                        <span style={{ fontSize: 11, color: "#64748b" }}>
                          {opt.quantity}{opt.unit}{opt.measure ? ` · ${opt.measure}` : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {meal.kids_note && (
        <div style={styles.kidsNote}>
          <strong style={{ fontWeight: 500, color: "#1e293b" }}>Crianças: </strong>
          {meal.kids_note}
        </div>
      )}
    </div>
  );
}

function ShoppingList({ list, checked, setChecked }) {
  const allItems = Object.values(list).flat();
  const total    = allItems.length;
  const done     = Object.values(checked).filter(Boolean).length;
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0;

  const toggle   = k  => setChecked(p => ({ ...p, [k]: !p[k] }));
  const clearAll = () => setChecked({});

  return (
    <div>
      <div style={styles.shoppingHeader}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#1e293b", margin: 0 }}>
            Lista de compras — {FAMILY_SIZE} pessoas
          </p>
          <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
            Semana completa · {done}/{total} marcados
          </p>
        </div>
        {done > 0 && <button onClick={clearAll} style={styles.clearBtn}>Limpar</button>}
      </div>

      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${pct}%` }} />
      </div>

      {SHOPPING_ORDER.map(gid => {
        const items = list[gid];
        if (!items?.length) return null;
        const meta = GROUPS_META[gid] ?? {};

        return (
          <div key={gid} style={{ marginBottom: "1.25rem" }}>
            <div style={{ ...styles.categoryLabel, color: meta.color }}>{meta.name ?? gid}</div>
            {items.map((item, i) => {
              const k    = `${gid}-${item.food}`;
              const isDone = !!checked[k];
              return (
                <div
                  key={i}
                  onClick={() => toggle(k)}
                  style={{
                    ...styles.shoppingItem,
                    opacity: isDone ? 0.4 : 1,
                    borderBottom: i < items.length - 1 ? "0.5px solid #f1f5f9" : "none",
                  }}
                >
                  <div style={{
                    ...styles.checkbox,
                    background: isDone ? "#1D9E75" : "#f8fafc",
                    borderColor: isDone ? "#1D9E75" : "#e2e8f0",
                  }}>
                    {isDone && <span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>✓</span>}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, color: "#1e293b", textDecoration: isDone ? "line-through" : "none" }}>
                    {item.food}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>
                    {Math.round(item.total)}{item.unit}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// STYLES (CSS variables substituídas por valores directos)
// ─────────────────────────────────────────────

const styles = {
  root: {
    fontFamily: "Inter, system-ui, sans-serif",
    padding: "1rem 0",
    maxWidth: 720,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.25rem",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
    color: "#1e293b",
    margin: "0 0 3px",
  },
  titleSub: {
    fontSize: 12,
    fontWeight: 400,
    color: "#64748b",
    marginLeft: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#64748b",
    margin: 0,
  },
  primaryBtn: {
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    background: "#FAEEDA",
    color: "#633806",
    border: "0.5px solid #BA7517",
    borderRadius: "8px",
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  errorBanner: {
    padding: "10px 14px",
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "8px",
    marginBottom: "1rem",
    fontSize: 13,
  },
  emptyState: {
    textAlign: "center",
    padding: "4rem 2rem",
    border: "0.5px dashed #e2e8f0",
    borderRadius: "14px",
    color: "#64748b",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: 500,
    color: "#1e293b",
    marginBottom: 6,
  },
  emptyBody: { fontSize: 13 },
  tabBar: {
    display: "flex",
    borderBottom: "0.5px solid #f1f5f9",
    marginBottom: "1.25rem",
  },
  tabBtn: {
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    background: "transparent",
    border: "none",
    marginBottom: -1,
    color: "#64748b",
    borderBottom: "2px solid transparent",
  },
  tabBtnActive: {
    color: "#BA7517",
    borderBottom: "2px solid #BA7517",
  },
  daySelector: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap",
    marginBottom: "1.25rem",
  },
  dayBtn: {
    padding: "6px 12px",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
    background: "#ffffff",
    color: "#64748b",
    border: "0.5px solid #e2e8f0",
    borderRadius: "8px",
  },
  dayBtnActive: {
    background: "#FAEEDA",
    color: "#633806",
    border: "0.5px solid #BA7517",
  },
  dayHeading: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: "1rem",
  },
  influenceBadge: {
    fontSize: 11,
    padding: "2px 8px",
    background: "#E1F5EE",
    color: "#085041",
    border: "0.5px solid #5DCAA5",
    borderRadius: "8px",
  },
  card: {
    background: "#ffffff",
    border: "0.5px solid #f1f5f9",
    borderRadius: "14px",
    padding: "12px 14px",
    marginBottom: 10,
  },
  mealHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    flexShrink: 0,
  },
  mealLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  mealName: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1e293b",
    margin: "0 0 8px",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "6px 0",
    gap: 8,
  },
  itemLeft: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    flex: 1,
    minWidth: 0,
  },
  groupBadge: {
    fontSize: 10,
    padding: "1px 5px",
    border: "0.5px solid",
    borderRadius: "8px",
    flexShrink: 0,
  },
  foodName: {
    fontSize: 13,
    color: "#1e293b",
  },
  itemRight: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  qty: {
    fontSize: 12,
    color: "#64748b",
  },
  trocarBtn: {
    fontSize: 11,
    padding: "2px 8px",
    cursor: "pointer",
    background: "#f8fafc",
    color: "#64748b",
    border: "0.5px solid #e2e8f0",
    borderRadius: "8px",
  },
  trocarBtnActive: {
    background: "#FAEEDA",
    color: "#633806",
    border: "0.5px solid #BA7517",
  },
  subPanel: {
    background: "#f8fafc",
    borderRadius: "8px",
    padding: "10px 12px",
    margin: "4px 0 6px",
  },
  subPanelTitle: {
    fontSize: 11,
    color: "#64748b",
    margin: "0 0 8px",
  },
  subGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  subOption: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "6px 10px",
    cursor: "pointer",
    background: "#ffffff",
    border: "0.5px solid #f1f5f9",
    borderRadius: "8px",
  },
  subOptionActive: {
    background: "#E1F5EE",
    border: "0.5px solid #5DCAA5",
  },
  kidsNote: {
    marginTop: 8,
    padding: "7px 10px",
    background: "#f8fafc",
    borderRadius: "8px",
    borderLeft: "2px solid #EF9F27",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    fontSize: 12,
    color: "#64748b",
  },
  shoppingHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  clearBtn: {
    fontSize: 12,
    padding: "4px 10px",
    background: "#f8fafc",
    color: "#64748b",
    border: "0.5px solid #e2e8f0",
    borderRadius: "8px",
    cursor: "pointer",
  },
  progressTrack: {
    height: 4,
    background: "#f8fafc",
    borderRadius: 2,
    marginBottom: "1.25rem",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "#1D9E75",
    borderRadius: 2,
    transition: "width .25s",
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    paddingBottom: 6,
    borderBottom: "0.5px solid #f1f5f9",
    marginBottom: 6,
  },
  shoppingItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 0",
    cursor: "pointer",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "0.5px solid",
  },
};
