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
  G3: [
    { name: "Abobrinha italiana cozida",   quantity: 135, unit: "g",  measure: "2 col. A."      },
    { name: "Abobrinha italiana refogada", quantity: 95,  unit: "g",  measure: "1 escumadeira"   },
    { name: "Alho poró",                   quantity: 60,  unit: "g",  measure: "10 rodelas"      },
    { name: "Berinjela cozida",            quantity: 90,  unit: "g",  measure: "4 col. sopa"     },
    { name: "Beterraba cozida",            quantity: 55,  unit: "g",  measure: "2 fatias G."     },
    { name: "Beterraba crua",              quantity: 35,  unit: "g",  measure: "3 col. sopa"     },
    { name: "Broto de bambu",              quantity: 80,  unit: "g",  measure: "1 porção"        },
    { name: "Broto de feijão",             quantity: 70,  unit: "g",  measure: "2 col. serv."    },
    { name: "Brócolis cozido",             quantity: 90,  unit: "g",  measure: "1 xícara"        },
    { name: "Cebola cozida",               quantity: 40,  unit: "g",  measure: "4 col. sopa"     },
    { name: "Cenoura cozida",              quantity: 60,  unit: "g",  measure: "3 col. sopa"     },
    { name: "Cenoura crua",                quantity: 52,  unit: "g",  measure: "4 col. sopa"     },
    { name: "Chuchu cozido",               quantity: 83,  unit: "g",  measure: "4 col. sopa"     },
    { name: "Couve-flor cozida",           quantity: 100, unit: "g",  measure: "1 escumadeira"   },
    { name: "Jiló cozido",                 quantity: 50,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Palmito pupunha conserva",    quantity: 75,  unit: "g",  measure: "5 col. sopa"     },
    { name: "Pepino cru",                  quantity: 100, unit: "g",  measure: "½ und. G."       },
    { name: "Pimentão amarelo cru",        quantity: 70,  unit: "g",  measure: "1 und. G."       },
    { name: "Quiabo cozido",               quantity: 90,  unit: "g",  measure: "2 col. sopa"     },
    { name: "Rabanete cru",                quantity: 150, unit: "g",  measure: "4 und. G."       },
    { name: "Shimeji",                     quantity: 120, unit: "g",  measure: "3 col. sopa"     },
    { name: "Tomate cereja",               quantity: 100, unit: "g",  measure: "½ xíc. chá"      },
    { name: "Tomate salada",               quantity: 80,  unit: "g",  measure: "3 fatias G."     },
  ],
  G4: [
    { name: "Atum natural",                quantity: 60,  unit: "g",  measure: "3 col. sopa"     },
    { name: "Bacalhau cozido",             quantity: 60,  unit: "g",  measure: "1 ped. P."       },
    { name: "Camarão cozido",              quantity: 80,  unit: "g",  measure: "10 und."         },
    { name: "Clara de ovo cozida",         quantity: 110, unit: "g",  measure: "4 und."          },
    { name: "Contra filé grelhado",        quantity: 45,  unit: "g",  measure: "1 bife P."       },
    { name: "Filé de Merluza",             quantity: 95,  unit: "g",  measure: "1 filé P."       },
    { name: "Filé mignon grelhado",        quantity: 50,  unit: "g",  measure: "1 bife P."       },
    { name: "Frango peito desfiado",       quantity: 50,  unit: "g",  measure: "2 col. sopa"     },
    { name: "Frango peito filé",           quantity: 50,  unit: "g",  measure: "1 bife P."       },
    { name: "Ovos de galinha",             quantity: 55,  unit: "g",  measure: "1 und."          },
    { name: "Patinho / Músculo / Fígado",  quantity: 50,  unit: "g",  measure: "1 bife P."       },
    { name: "Pescada branca crua",         quantity: 90,  unit: "g",  measure: "1 filé P."       },
    { name: "Polvo cozido",                quantity: 50,  unit: "g",  measure: "1 esc. M."       },
    { name: "Salmão grelhado",             quantity: 60,  unit: "g",  measure: "1 filé P."       },
    { name: "Sardinha assada",             quantity: 50,  unit: "g",  measure: "2 und."          },
    { name: "Tilápia filé",                quantity: 60,  unit: "g",  measure: "1 filé P."       },
  ],
  G5: [
    { name: "Arroz 7 grãos",               quantity: 25,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Arroz integral cozido",       quantity: 30,  unit: "g",  measure: "1½ col. sopa"    },
    { name: "Arroz negro cozido",          quantity: 30,  unit: "g",  measure: "1 col. sopa CH"  },
    { name: "Arroz branco cozido",         quantity: 25,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Batata baroa cozida",         quantity: 40,  unit: "g",  measure: "1½ col. sopa"    },
    { name: "Batata doce cozida",          quantity: 40,  unit: "g",  measure: "1 fatia P."      },
    { name: "Batata inglesa cozida",       quantity: 60,  unit: "g",  measure: "2 col. sopa"     },
    { name: "Batata inglesa sauté",        quantity: 50,  unit: "g",  measure: "2 col. sopa CH"  },
    { name: "Batata yacon cozida",         quantity: 65,  unit: "g",  measure: "2 col. sopa"     },
    { name: "Abóbora Cabotian cozida",     quantity: 150, unit: "g",  measure: "4 col. sopa"     },
    { name: "Cará cozido",                 quantity: 40,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Inhame cozido",               quantity: 27,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Macarrão cozido",             quantity: 30,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Macarrão de arroz cozido",    quantity: 30,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Macarrão integral cozido",    quantity: 28,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Mandioca cozida",             quantity: 25,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Quinoa cozida",               quantity: 35,  unit: "g",  measure: "1 col. sopa"     },
  ],
  G6: [
    { name: "Carne de soja cozida",        quantity: 30,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Ervilha enlatada",            quantity: 55,  unit: "g",  measure: "2 col. sopa CH"  },
    { name: "Ervilha em vagem",            quantity: 50,  unit: "g",  measure: "2 col. sopa CH"  },
    { name: "Feijão Azuki cozido",         quantity: 30,  unit: "g",  measure: "1 col. CH"       },
    { name: "Feijão Branco cozido",        quantity: 29,  unit: "g",  measure: "1 col. CH"       },
    { name: "Feijão Fradinho cozido",      quantity: 50,  unit: "g",  measure: "½ concha M."     },
    { name: "Feijão carioca",              quantity: 55,  unit: "g",  measure: "1 concha P. CH"  },
    { name: "Feijão preto",                quantity: 55,  unit: "g",  measure: "1 concha CH"     },
    { name: "Feijão verde",                quantity: 37,  unit: "g",  measure: "2 col. sopa"     },
    { name: "Grão de Bico cozido",         quantity: 28,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Grão de soja cozido",         quantity: 30,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Lentilha Rosa",               quantity: 25,  unit: "g",  measure: "1 col. sopa CH"  },
    { name: "Lentilha cozida",             quantity: 46,  unit: "g",  measure: "1 concha CH"     },
    { name: "Milho verde enlatado",        quantity: 50,  unit: "g",  measure: "2 col. sopa"     },
  ],
  G9: [
    { name: "Abacaxi",                     quantity: 120, unit: "g",  measure: "2 fatias P."     },
    { name: "Acerola",                     quantity: 190, unit: "g",  measure: "10 und."         },
    { name: "Ameixa crua",                 quantity: 110, unit: "g",  measure: "2 und."          },
    { name: "Ameixa seca",                 quantity: 24,  unit: "g",  measure: "5 und. M."       },
    { name: "Amora",                       quantity: 150, unit: "g",  measure: "7 col. sopa CH"  },
    { name: "Banana Maçã",                 quantity: 70,  unit: "g",  measure: "1 und. M."       },
    { name: "Banana Ouro",                 quantity: 50,  unit: "g",  measure: "1 und. P."       },
    { name: "Banana da terra",             quantity: 45,  unit: "g",  measure: "½ und."          },
    { name: "Banana nanica",               quantity: 70,  unit: "g",  measure: "1 und. M."       },
    { name: "Banana prata",                quantity: 55,  unit: "g",  measure: "1 und."          },
    { name: "Caju",                        quantity: 150, unit: "g",  measure: "1 und."          },
    { name: "Caqui",                       quantity: 80,  unit: "g",  measure: "1 und."          },
    { name: "Carambola",                   quantity: 130, unit: "g",  measure: "1 und."          },
    { name: "Cereja",                      quantity: 100, unit: "g",  measure: "14 und. P."      },
    { name: "Damasco desidratado",         quantity: 18,  unit: "g",  measure: "2 und. M."       },
    { name: "Figo",                        quantity: 80,  unit: "g",  measure: "2 und. M."       },
    { name: "Framboesa",                   quantity: 125, unit: "g",  measure: "1 xíc. chá"      },
    { name: "Goiaba",                      quantity: 120, unit: "g",  measure: "1 und."          },
    { name: "Jabuticaba",                  quantity: 95,  unit: "g",  measure: "18 und. M."      },
    { name: "Jaca",                        quantity: 65,  unit: "g",  measure: "5 bagos"         },
    { name: "Kiwi",                        quantity: 130, unit: "g",  measure: "2 und."          },
    { name: "Laranja",                     quantity: 130, unit: "g",  measure: "1 und."          },
    { name: "Mamão formosa",               quantity: 120, unit: "g",  measure: "1 fatia M."      },
    { name: "Mamão papaia",                quantity: 135, unit: "g",  measure: "½ und. P."       },
    { name: "Manga",                       quantity: 100, unit: "g",  measure: "1 und. P."       },
    { name: "Maracujá",                    quantity: 120, unit: "g",  measure: "1 und. G."       },
    { name: "Maçã Fuji",                   quantity: 100, unit: "g",  measure: "1 und. P."       },
    { name: "Melancia",                    quantity: 175, unit: "g",  measure: "1 fatia M."      },
    { name: "Melão",                       quantity: 185, unit: "g",  measure: "2 fatias M."     },
    { name: "Mirtilo / Blueberry",         quantity: 100, unit: "g",  measure: "25 und."         },
    { name: "Morango",                     quantity: 220, unit: "g",  measure: "10 und."         },
    { name: "Nectarina",                   quantity: 140, unit: "g",  measure: "1 und. G."       },
    { name: "Pera",                        quantity: 110, unit: "g",  measure: "1 und. M."       },
    { name: "Pêssego",                     quantity: 150, unit: "g",  measure: "2½ und. P."      },
    { name: "Romã",                        quantity: 100, unit: "g",  measure: "1 und. P."       },
    { name: "Tangerina",                   quantity: 150, unit: "g",  measure: "1 und. M."       },
    { name: "Uva sem caroço",              quantity: 100, unit: "g",  measure: "1 cacho P."      },
    { name: "Uva passa",                   quantity: 19,  unit: "g",  measure: "1 col. sopa CH"  },
    { name: "Água de coco",                quantity: 280, unit: "ml", measure: "1 copo D. CH"    },
  ],
  G12: [
    { name: "Amaranto em flocos",          quantity: 20,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Aveia flocos crua",           quantity: 18,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Biscoito cream cracker",      quantity: 18,  unit: "g",  measure: "3 unid."         },
    { name: "Bolacha de arroz",            quantity: 15,  unit: "g",  measure: "2 und. M."       },
    { name: "Cuscuz de milho",             quantity: 45,  unit: "g",  measure: "3 col. sopa CH"  },
    { name: "Farelo de aveia",             quantity: 25,  unit: "g",  measure: "1 col. sopa CH"  },
    { name: "Granola",                     quantity: 20,  unit: "g",  measure: "1 col. sopa CH"  },
    { name: "Pão de forma integral",       quantity: 25,  unit: "g",  measure: "1 fatia"         },
    { name: "Pão de forma tradicional",    quantity: 25,  unit: "g",  measure: "1 fatia"         },
    { name: "Pão de milho",                quantity: 30,  unit: "g",  measure: "1 und. M."       },
    { name: "Pão francês",                 quantity: 25,  unit: "g",  measure: "½ unid."         },
    { name: "Pão sírio / pita",            quantity: 23,  unit: "g",  measure: "½ und. M."       },
    { name: "Quinoa em flocos",            quantity: 18,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Tapioca goma",                quantity: 20,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Torrada integral",            quantity: 20,  unit: "g",  measure: "3 und."          },
  ],
  G13: [
    { name: "Coalhada desnatada",          quantity: 170, unit: "g",  measure: "1 unid."         },
    { name: "Creme de ricota light",       quantity: 65,  unit: "g",  measure: "3 col. sopa"     },
    { name: "Iogurte Grego desnatado",     quantity: 100, unit: "g",  measure: "1 unid."         },
    { name: "Iogurte natural desnatado",   quantity: 195, unit: "ml", measure: "1 und."          },
    { name: "Iogurte light com sabor",     quantity: 200, unit: "ml", measure: "até 70 kcal"     },
    { name: "Leite desnatado UHT",         quantity: 240, unit: "ml", measure: "1 copo D. CH"    },
    { name: "Queijo cottage",              quantity: 65,  unit: "g",  measure: "2 col. sopa"     },
    { name: "Queijo cottage zero lactose", quantity: 60,  unit: "g",  measure: "2 col. sopa"     },
    { name: "Queijo Minas Frescal",        quantity: 30,  unit: "g",  measure: "1 fatia"         },
    { name: "Queijo ricota",               quantity: 60,  unit: "g",  measure: "2 fatias M."     },
    { name: "Queijo tofu",                 quantity: 110, unit: "g",  measure: "1 und."          },
    { name: "Requeijão light",             quantity: 30,  unit: "g",  measure: "1 col. sopa"     },
    { name: "Muçarela",                    quantity: 20,  unit: "g",  measure: "1 fatia"         },
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

const SYSTEM_PROMPT = `Você é nutricionista especializado no plano do Nut. João Muzzy para Elaine Alves (família de 5 pessoas).

Gere um cardápio semanal de 7 dias. Para cada refeição, use EXACTAMENTE as quantidades abaixo — são as quantidades por pessoa prescritas no plano.

ESTRUTURA E QUANTIDADES EXACTAS POR PESSOA:

CAFÉ DA MANHÃ: 1 item G1 (livre) + 1 item G9 + 2 itens G12 + 1 item G13
ALMOÇO: folhas G2 (livre) + 2 itens G3 + 2 itens G4 + 3 itens G5 + 1 item G6
CAFÉ DA TARDE: 1 item G1 (livre) + 1 item G9 + 2 itens G12 + 1 item G13
JANTAR: folhas G2 (livre) + 2 itens G3 + 2 itens G4 + 2 itens G12 + 1 item G13
CEIA: 1 item G9

LISTA DE ALIMENTOS E QUANTIDADES POR PESSOA (use SEMPRE estes valores no campo quantity_per_person):

G1 — livre (quantity_per_person: 0, unit: "livre"):
Café sem açúcar | Chá infusão | Suco de limão | Polpa fruta congelada com adoçante

G2 — livre (quantity_per_person: 0, unit: "livre"):
Folhas variadas (alface, rúcula, espinafre, couve, agrião)

G3 — use EXACTAMENTE estas quantidades:
Abobrinha italiana cozida 135g | Abobrinha refogada 95g | Alho poró 60g | Berinjela cozida 90g | Beterraba cozida 55g | Beterraba crua 35g | Broto de bambu 80g | Broto de feijão 70g | Brócolis cozido 90g | Cebola cozida 40g | Cenoura cozida 60g | Cenoura crua 52g | Chuchu cozido 83g | Couve-flor cozida 100g | Jiló cozido 50g | Palmito pupunha 75g | Pepino cru 100g | Pimentão amarelo 70g | Quiabo cozido 90g | Rabanete cru 150g | Shimeji 120g | Tomate cereja 100g | Tomate salada 80g

G4 — use EXACTAMENTE estas quantidades:
Atum natural 60g | Bacalhau cozido 60g | Camarão cozido 80g | Clara de ovo cozida 110g | Contra filé grelhado 45g | Filé de Merluza 95g | Filé mignon grelhado 50g | Frango peito desfiado 50g | Frango peito filé 50g | Ovos de galinha 55g (1 und) | Patinho/Músculo/Fígado 50g | Pescada branca 90g | Polvo cozido 50g | Salmão grelhado 60g | Sardinha assada 50g | Tilápia filé 60g

G5 — use EXACTAMENTE estas quantidades:
Arroz 7 grãos 25g | Arroz integral cozido 30g | Arroz negro cozido 30g | Arroz branco cozido 25g | Batata baroa cozida 40g | Batata doce cozida 40g | Batata inglesa cozida 60g | Batata inglesa sauté 50g | Batata yacon cozida 65g | Abóbora Cabotian cozida 150g | Cará cozido 40g | Inhame cozido 27g | Macarrão cozido 30g | Macarrão integral cozido 28g | Mandioca cozida 25g | Quinoa cozida 35g

G6 — use EXACTAMENTE estas quantidades:
Carne de soja cozida 30g | Ervilha enlatada 55g | Ervilha em vagem 50g | Feijão Azuki 30g | Feijão Branco 29g | Feijão Fradinho 50g | Feijão carioca 55g | Feijão preto 55g | Feijão verde 37g | Grão de Bico 28g | Grão de soja 30g | Lentilha Rosa 25g | Lentilha cozida 46g | Milho verde enlatado 50g

G9 — use EXACTAMENTE estas quantidades:
Abacaxi 120g | Acerola 190g | Ameixa crua 110g | Amora 150g | Banana Maçã 70g | Banana Ouro 50g | Banana da terra 45g | Banana nanica 70g | Banana prata 55g | Caju 150g | Caqui 80g | Framboesa 125g | Goiaba 120g | Jabuticaba 95g | Kiwi 130g | Laranja 130g | Mamão formosa 120g | Mamão papaia 135g | Manga 100g | Maçã Fuji 100g | Melancia 175g | Melão 185g | Mirtilo 100g | Morango 220g | Pera 110g | Pêssego 150g | Tangerina 150g | Uva sem caroço 100g | Água de coco 280ml

G12 — use EXACTAMENTE estas quantidades:
Amaranto em flocos 20g | Aveia flocos crua 18g | Biscoito cream cracker 18g | Bolacha de arroz 15g | Cuscuz de milho 45g | Farelo de aveia 25g | Granola 20g | Pão de forma integral 25g | Pão de forma tradicional 25g | Pão de milho 30g | Pão francês 25g | Pão sírio 23g | Quinoa em flocos 18g | Tapioca goma 20g | Torrada integral 20g

G13 — use EXACTAMENTE estas quantidades:
Coalhada desnatada 170g | Creme de ricota light 65g | Iogurte Grego desnatado 100g | Iogurte natural desnatado 195ml | Iogurte light com sabor 200ml | Leite desnatado UHT 240ml | Queijo cottage 65g | Queijo cottage zero lactose 60g | Queijo Minas Frescal 30g | Queijo ricota 60g | Queijo tofu 110g | Requeijão light 30g | Muçarela 20g

REGRAS OBRIGATÓRIAS:
- quantity_per_person deve ser EXACTAMENTE o número indicado acima — nunca invente quantidades
- Não repetir o mesmo alimento G4 mais de 2× na semana
- Variar as frutas G9 ao longo da semana
- kids_note em cada refeição com sugestão prática para crianças
- Sábado jantar: SEMPRE is_free_meal:true
- Nomes criativos para cada refeição em português
- 2+ dias influência portuguesa/mediterrânea, 3+ dias brasileira

Retorne SOMENTE JSON válido sem markdown:
IMPORTANTE: O JSON deve estar COMPLETO com todos os 7 dias. Nunca cortes a resposta a meio.
{"week_theme":"string","days":[{"day_index":0,"day_key":"monday","day_label":"Segunda-feira","day_short":"Seg","culinary_influence":"string","meals":{"breakfast":{"name":"string","items":[{"food":"string","group":"G9","quantity_per_person":135,"unit":"g","measure":"½ und."}],"kids_note":"string"},"lunch":{"name":"string","items":[...],"kids_note":"string"},"afternoon_snack":{"name":"string","items":[...],"kids_note":"string"},"dinner":{"name":"string","items":[...],"kids_note":"string"},"supper":{"name":"string","items":[...]}}},...7 dias total]}`;

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
