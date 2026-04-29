import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════
//  DESIGN TOKENS — NutriTrack visual
// ═══════════════════════════════════════════════════════════════════
const E = { 50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",
            400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534" };
const S = { 50:"#f8fafc",100:"#f1f5f9",200:"#e2e8f0",300:"#cbd5e1",
            400:"#94a3b8",500:"#64748b",600:"#475569",700:"#334155",800:"#1e293b",900:"#0f172a" };
const R = { 200:"#fecaca",500:"#ef4444",600:"#dc2626" };
const A = { 50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",
            500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e" };

// CSS-in-JS card style
const card = {
  background:"#fff",borderRadius:16,padding:16,
  boxShadow:"0 1px 8px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9",
};
const btnPrimary = {
  background:E[600],color:"#fff",border:"none",borderRadius:999,
  padding:"12px 20px",fontWeight:700,fontSize:14,cursor:"pointer",
  display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",
};
const btnSecondary = {
  background:S[100],color:S[700],border:"none",borderRadius:999,
  padding:"12px 20px",fontWeight:600,fontSize:14,cursor:"pointer",
  display:"flex",alignItems:"center",justifyContent:"center",gap:8,width:"100%",
};

// ═══════════════════════════════════════════════════════════════════
//  DADOS — Plano Alimentar Nut. João Muzzy / Elaine
// ═══════════════════════════════════════════════════════════════════
const MEAL_TYPES = [
  { id:"breakfast",      label:"Café da Manhã", emoji:"☕", time:"07:00" },
  { id:"lunch",          label:"Almoço",        emoji:"🍽️", time:"12:30" },
  { id:"afternoon_snack",label:"Café da Tarde", emoji:"🥪", time:"15:30" },
  { id:"dinner",         label:"Jantar",        emoji:"🌙", time:"19:00" },
  { id:"supper",         label:"Ceia",          emoji:"🌛", time:"21:00" },
];

// ─── Listas completas por grupo ───────────────────────────────────
const G1_BEBIDAS = [
  "Café sem açúcar — livre","Chá / infusão — livre",
  "Suco de limão — livre",
  "Polpa morango congelada com adoçante","Polpa acerola congelada com adoçante","Polpa maracujá congelada com adoçante",
];

const G2_FOLHOSOS = [
  "Acelga 50g","Agrião 50g","Alface crespa 50g","Alface lisa 50g","Alface americana 50g","Alface roxa 50g",
  "Alfafa broto 50g","Almeirão cru 50g","Aspargo 100g","Bertalha 50g","Brócolis folhas 50g",
  "Chicória 50g","Couve manteiga crua 50g","Couve refogada 50g","Espinafre cru 50g","Espinafre refogado 50g",
  "Jambu 15g","Mostarda folhas 50g","Repolho 50g","Rúcula 50g","Taioba 50g",
];

const G3_HORTALICAS = [
  "Abobrinha italiana cozida 135g","Abobrinha refogada 95g","Alho poró 60g","Berinjela cozida 90g",
  "Beterraba cozida 55g","Beterraba crua 35g","Broto de bambu 80g","Broto de feijão 70g",
  "Brócolis cozido 90g","Cebola cozida 40g","Cenoura cozida 60g","Cenoura crua 52g",
  "Chuchu cozido 83g","Couve-flor cozida 100g","Jiló cozido 50g","Palmito pupunha 75g",
  "Pepino cru 100g","Pimentão amarelo 70g","Quiabo cozido 90g","Rabanete cru 150g",
  "Shimeji 120g","Tomate cereja 100g","Tomate salada 80g",
];

const G4_PROTEINAS = [
  "Atum natural 60g","Bacalhau cozido 60g","Camarão cozido 80g","Clara de ovo cozida 110g",
  "Contra filé grelhado 45g","Filé de Merluza 95g","Filé mignon grelhado 50g",
  "Frango peito desfiado 50g","Frango peito filé 50g","Ovos de galinha 2 unidades",
  "Patinho magro 100g","Músculo magro 100g","Fígado 100g",
  "Pescada branca crua 90g","Polvo cozido 50g","Salmão grelhado 60g",
  "Sardinha assada 50g","Tilápia filé 60g",
];

const G5_CEREAIS = [
  "Arroz 7 grãos 25g","Arroz integral cozido 30g","Arroz negro cozido 30g","Arroz tipo 1 cozido 25g",
  "Batata baroa cozida 40g","Batata doce cozida 40g","Batata inglesa cozida 60g","Batata inglesa sauté 50g",
  "Batata yacon cozida 65g","Abóbora Cabotian cozida 150g","Cará cozido 40g","Inhame cozido 27g",
  "Macarrão cozido 30g","Macarrão de arroz cozido 30g","Macarrão integral cozido 28g",
  "Mandioca cozida 25g","Quinoa cozida 35g",
];

const G6_LEGUMINOSAS = [
  "Carne de soja cozida 30g","Ervilha enlatada 55g","Ervilha em vagem 50g",
  "Feijão Azuki cozido 30g","Feijão Branco cozido 29g","Feijão Fradinho cozido 50g",
  "Feijão carioca 55g","Feijão preto 55g","Feijão verde 37g",
  "Grão de Bico cozido 28g","Grão de soja cozido 30g",
  "Lentilha Rosa 25g","Lentilha cozida 46g","Milho verde enlatado 50g",
];

const G9_FRUTAS = [
  "Abacaxi 120g","Acerola 190g","Ameixa crua 110g","Ameixa seca 24g","Amora 150g",
  "Banana Maçã 70g","Banana Ouro 50g","Banana da terra 45g","Banana nanica 70g","Banana prata 55g",
  "Caju 150g","Caqui 80g","Carambola 130g","Cereja 100g","Damasco desidratado 18g",
  "Figo 80g","Framboesa 125g","Goiaba 120g","Jabuticaba 95g","Jaca 65g","Kiwi 130g",
  "Laranja 130g","Mamão formosa 120g","Mamão papaia 135g","Manga 100g","Maracujá 120g",
  "Maçã Fuji 100g","Melancia 175g","Melão 185g","Mirtilo 100g","Morango 220g",
  "Nectarina 140g","Pera 110g","Pêssego 150g","Romã 100g","Tangerina 150g",
  "Uva sem caroço 100g","Uva passa 19g","Água de coco 280ml",
];

const G11_NOZES = [
  "Amendoim 17g","Amêndoa torrada 17g","Avelã 15g","Castanha de baru 15g",
  "Castanha de caju torrada 20g","Castanha do Pará crua 15g","Chia 25g",
  "Farinha de amêndoa 20g","Farinha de coco 20g","Gergelim 18g",
  "Linhaça farinha 25g","Linhaça semente 25g","Macadâmia 12g","Noz crua 15g",
  "Pasta de amendoim integral 15g","Pistache 18g","Whey Protein concentrado 35g",
];

const G12_PAES = [
  "Amaranto em flocos 20g","Aveia flocos crua 18g","Biscoito cream cracker 18g",
  "Bolacha de arroz 15g","Cuscuz de milho 45g","Farelo de aveia 25g","Granola 20g",
  "Pão de forma integral 25g","Pão de forma tradicional 25g","Pão de milho 30g",
  "Pão francês 25g","Pão sírio 23g","Quinoa em flocos 18g","Tapioca goma 20g","Torrada integral 20g",
];

const G13_LATICINIOS = [
  "Coalhada desnatada 170g","Creme de ricota light 65g","Iogurte Grego desnatado 100g",
  "Iogurte natural desnatado 195ml","Iogurte light com sabor 200ml (até 70kcal)",
  "Leite desnatado UHT 240ml","Queijo cottage 65g","Queijo cottage zero lactose 60g",
  "Queijo Minas Frescal 30g","Queijo ricota 60g","Queijo tofu 110g",
  "Requeijão light 30g","Muçarela 1 fatia 20g",
];

// ─── Plano alimentar mapeado por refeição ─────────────────────────
const MEAL_PLAN = {
  breakfast: {
    G1:  { label:"Bebida Livre",       emoji:"☕", portions:"1 porção",  note:"Sem açúcar",
           options: G1_BEBIDAS },
    G9:  { label:"Fruta",              emoji:"🍌", portions:"1 porção",  note:"Ver pesos por fruta",
           options: G9_FRUTAS },
    G12a:{ label:"Pão / Fibra (1ª porção)", emoji:"🍞", portions:"1 porção", note:"",
           options: G12_PAES },
    G12b:{ label:"Pão / Fibra (2ª porção)", emoji:"🍞", portions:"1 porção", note:"",
           options: G12_PAES },
    G13: { label:"Laticínio",          emoji:"🥛", portions:"1 porção",  note:"Ver pesos por alimento", isProtein:true,
           options: G13_LATICINIOS },
  },
  lunch: {
    G3a: { label:"Vegetal / Hortaliça (1ª porção)", emoji:"🥦", portions:"1 porção", note:"Ver pesos por alimento", isVeg:true,
           options: G3_HORTALICAS },
    G3b: { label:"Vegetal / Hortaliça (2ª porção)", emoji:"🥦", portions:"1 porção", note:"",  isVeg:true,
           options: G3_HORTALICAS },
    G4a: { label:"Proteína (1ª porção)", emoji:"🥩", portions:"1 porção", note:"Ver pesos por alimento", isProtein:true,
           options: G4_PROTEINAS },
    G4b: { label:"Proteína (2ª porção)", emoji:"🥩", portions:"1 porção", note:"",  isProtein:true,
           options: G4_PROTEINAS },
    G5a: { label:"Cereal / Tubérculo (1ª porção)", emoji:"🍚", portions:"1 porção", note:"Ver pesos por alimento",
           options: G5_CEREAIS },
    G5b: { label:"Cereal / Tubérculo (2ª porção)", emoji:"🍚", portions:"1 porção", note:"",
           options: G5_CEREAIS },
    G5c: { label:"Cereal / Tubérculo (3ª porção)", emoji:"🍚", portions:"1 porção", note:"",
           options: G5_CEREAIS },
    G6:  { label:"Leguminosa",          emoji:"🫘", portions:"1 porção", note:"Ver pesos por alimento",
           options: G6_LEGUMINOSAS },
  },
  afternoon_snack: {
    G1:  { label:"Bebida Livre (opcional)", emoji:"☕", portions:"1 porção", note:"Sem açúcar",
           options: G1_BEBIDAS },
    G9:  { label:"Fruta",              emoji:"🍌", portions:"1 porção", note:"Ver pesos por fruta",
           options: G9_FRUTAS },
    G12a:{ label:"Pão / Fibra (1ª porção)", emoji:"🍞", portions:"1 porção", note:"",
           options: G12_PAES },
    G12b:{ label:"Pão / Fibra (2ª porção)", emoji:"🍞", portions:"1 porção", note:"",
           options: G12_PAES },
    G13: { label:"Laticínio",          emoji:"🥛", portions:"1 porção", note:"Ver pesos por alimento", isProtein:true,
           options: G13_LATICINIOS },
  },
  dinner: {
    G3a: { label:"Vegetal / Hortaliça (1ª porção)", emoji:"🥦", portions:"1 porção", note:"Ver pesos por alimento", isVeg:true,
           options: G3_HORTALICAS },
    G3b: { label:"Vegetal / Hortaliça (2ª porção)", emoji:"🥦", portions:"1 porção", note:"", isVeg:true,
           options: G3_HORTALICAS },
    G4a: { label:"Proteína (1ª porção)", emoji:"🥩", portions:"1 porção", note:"Ver pesos por alimento", isProtein:true,
           options: G4_PROTEINAS },
    G4b: { label:"Proteína (2ª porção)", emoji:"🥩", portions:"1 porção", note:"", isProtein:true,
           options: G4_PROTEINAS },
    G12a:{ label:"Pão / Fibra (1ª porção)", emoji:"🍞", portions:"1 porção", note:"",
           options: G12_PAES },
    G12b:{ label:"Pão / Fibra (2ª porção)", emoji:"🍞", portions:"1 porção", note:"",
           options: G12_PAES },
    G13: { label:"Laticínio",          emoji:"🥛", portions:"1 porção", note:"Ver pesos por alimento", isProtein:true,
           options: G13_LATICINIOS },
  },
  supper: {
    G9:  { label:"Fruta",              emoji:"🍌", portions:"1 porção", note:"Ver pesos por fruta",
           options: G9_FRUTAS },
  },
};

const FREE_MEAL_OPTIONS = [
  { id:"hamburguer", emoji:"🍔", label:"Hambúrguer artesanal",
    desc:"Pão + 160g carne + 1 ovo + 2 tiras bacon + 1 fatia queijo + salada + 1 bombom" },
  { id:"pizza",      emoji:"🍕", label:"Pizza",
    desc:"2 a 3 fatias sem borda recheada" },
  { id:"japonesa",   emoji:"🍣", label:"Japonesa",
    desc:"20 a 25 peças (máx. 5 fritas) ou Temaki filadéfia não frito + 15 peças cruas" },
  { id:"churrasco",  emoji:"🥩", label:"Churrasco",
    desc:"2 espetinhos 200g + pão de alho + arroz 80g + vinagrete" },
  { id:"pastel",     emoji:"🥟", label:"Pastel de feira",
    desc:"Pastel 300g + caldo de cana 300ml" },
  { id:"doce",       emoji:"🍰", label:"Jantar + doce",
    desc:"Jantar normal + 500kcal de qualquer doce" },
  { id:"acai",       emoji:"🍨", label:"Proteína + açaí",
    desc:"Proteína + salada + açaí 300ml (ou sorvete 250g) + frutas + 2 acréscimos" },
  { id:"massas",     emoji:"🍝", label:"Massas",
    desc:"250g massa + 200g proteína magra + vegetais livres" },
  { id:"tropeiro",   emoji:"🫘", label:"Tropeiro",
    desc:"2 espetinhos + pão de alho + arroz com feijão tropeiro 120g + vinagrete" },
];

// ═══════════════════════════════════════════════════════════════════
//  ROTINA SEMANAL
// ═══════════════════════════════════════════════════════════════════
const CAT_BLOCK = {
  manha:     { bg:"#FEFCE8", border:"#D97706", text:"#78350F", label:"Manhã" },
  casa:      { bg:"#FFF1F2", border:"#E11D48", text:"#881337", label:"Casa" },
  trabalho:  { bg:"#F0FDF4", border:"#16A34A", text:"#14532D", label:"Trabalho" },
  refeicao:  { bg:"#FEFCE8", border:"#CA8A04", text:"#713F12", label:"Alimentação" },
  espiritual:{ bg:"#F5F3FF", border:"#7C3AED", text:"#3B0764", label:"Espiritual" },
  pessoal:   { bg:"#FDF2F8", border:"#C026D3", text:"#701A75", label:"Pessoal" },
  familia:   { bg:"#EFF6FF", border:"#2563EB", text:"#1E3A8A", label:"Família" },
  desloc:    { bg:"#F8FAFC", border:"#64748B", text:"#334155", label:"Deslocamento" },
  noite:     { bg:"#1E1B4B", border:"#6366F1", text:"#C7D2FE", label:"Noite" },
  planej:    { bg:"#FFF7ED", border:"#EA580C", text:"#7C2D12", label:"Planejamento" },
  compras:   { bg:"#F0FDF4", border:"#059669", text:"#065F46", label:"Compras" },
  descanso:  { bg:"#FAF5FF", border:"#9333EA", text:"#581C87", label:"Descanso" },
};
const CAT_MODULE={ casa:"limpeza",compras:"limpeza",refeicao:"cardapio",espiritual:"estudo" };
const DAYS=["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const MONTHS_LONG=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

const DEFAULT_SCHEDULE={
  Seg:{ wake:"8h00",badge:"Limpeza profunda + trabalho fixo 13h–17h",badgeBg:E[50],badgeBorder:E[600],badgeText:E[800],
    blocks:[
      {id:"s1b1",time:"8h – 9h",c:"manha",desc:"Rotina dos filhos — preparar e levar para a escola"},
      {id:"s1b2",time:"9h – 9h15",c:"desloc",desc:"Levar à escola e voltar"},
      {id:"s1b3",time:"9h15 – 12h",c:"casa",desc:"Limpeza profunda da casa"},
      {id:"s1b4",time:"12h – 13h",c:"refeicao",desc:"Almoço"},
      {id:"s1b5",time:"13h – 17h",c:"trabalho",desc:"Bloco fixo de trabalho — conteúdo e estratégia"},
      {id:"s1b6",time:"17h – 17h30",c:"desloc",desc:"Buscar filho na escola"},
      {id:"s1b7",time:"17h30 – 19h",c:"familia",desc:"Tempo com os filhos"},
      {id:"s1b8",time:"19h – 20h",c:"refeicao",desc:"Jantar em família"},
      {id:"s1b9",time:"20h – 21h30",c:"familia",desc:"Tempo com o marido"},
      {id:"s1b10",time:"21h30 – 22h",c:"espiritual",desc:"Estudo pessoal — preparação de reunião"},
      {id:"s1b11",time:"22h – 00h",c:"noite",desc:"Trabalho noturno"},
    ]},
  Ter:{ wake:"8h00",badge:"Pregação 14h30 — almoço antecipado",badgeBg:"#F5F3FF",badgeBorder:"#7C3AED",badgeText:"#3B0764",
    blocks:[
      {id:"s2b1",time:"8h – 9h",c:"manha",desc:"Rotina dos filhos"},
      {id:"s2b2",time:"9h – 9h15",c:"desloc",desc:"Levar à escola e voltar"},
      {id:"s2b3",time:"9h15 – 10h15",c:"casa",desc:"Limpeza rápida da casa"},
      {id:"s2b4",time:"10h15 – 11h15",c:"refeicao",desc:"Almoço antecipado"},
      {id:"s2b5",time:"11h15 – 14h",c:"trabalho",desc:"Trabalho — administração e clientes"},
      {id:"s2b6",time:"14h – 14h30",c:"desloc",desc:"Deslocamento para pregação"},
      {id:"s2b7",time:"14h30 – 16h30",c:"espiritual",desc:"Serviço de pregação ao campo"},
      {id:"s2b8",time:"16h30 – 17h30",c:"descanso",desc:"Descanso antes de buscar o filho"},
      {id:"s2b9",time:"17h30 – 19h",c:"familia",desc:"Tempo com os filhos"},
      {id:"s2b10",time:"19h – 20h",c:"refeicao",desc:"Jantar em família"},
      {id:"s2b11",time:"20h – 21h",c:"familia",desc:"Tempo com o marido"},
      {id:"s2b12",time:"21h – 22h",c:"espiritual",desc:"Estudo pessoal da Bíblia"},
      {id:"s2b13",time:"22h – 00h",c:"noite",desc:"Trabalho noturno"},
    ]},
  Qua:{ wake:"6h40",badge:"Reunião 20h15 — sem trabalho noturno",badgeBg:"#F5F3FF",badgeBorder:"#7C3AED",badgeText:"#3B0764",
    blocks:[
      {id:"s3b1",time:"6h40 – 7h30",c:"manha",desc:"Preparar filho do meio + café da manhã"},
      {id:"s3b2",time:"7h30 – 9h",c:"pessoal",desc:"Tempo livre — cuidados pessoais"},
      {id:"s3b3",time:"9h – 9h15",c:"desloc",desc:"Levar filho à escola e voltar"},
      {id:"s3b4",time:"9h15 – 10h15",c:"casa",desc:"Limpeza rápida da casa"},
      {id:"s3b5",time:"10h15 – 11h15",c:"refeicao",desc:"Almoço antecipado"},
      {id:"s3b6",time:"11h15 – 13h",c:"descanso",desc:"Descanso — compensar o acordar cedo"},
      {id:"s3b7",time:"13h – 17h",c:"trabalho",desc:"Bloco fixo de trabalho"},
      {id:"s3b8",time:"17h – 17h30",c:"desloc",desc:"Buscar filho na escola"},
      {id:"s3b9",time:"17h30 – 19h",c:"familia",desc:"Tempo com os filhos"},
      {id:"s3b10",time:"19h – 20h",c:"refeicao",desc:"Jantar rápido — tem reunião"},
      {id:"s3b11",time:"20h15 – 22h",c:"espiritual",desc:"Reunião da congregação"},
      {id:"s3b12",time:"22h+",c:"pessoal",desc:"Descanso"},
    ]},
  Qui:{ wake:"8h00",badge:"Estrutura igual à segunda — com mais flexibilidade",badgeBg:E[50],badgeBorder:E[600],badgeText:E[800],
    blocks:[
      {id:"s4b1",time:"8h – 9h",c:"manha",desc:"Rotina dos filhos"},
      {id:"s4b2",time:"9h – 9h15",c:"desloc",desc:"Levar à escola e voltar"},
      {id:"s4b3",time:"9h15 – 12h",c:"casa",desc:"Limpeza profunda + recuperar pendências"},
      {id:"s4b4",time:"12h – 13h",c:"refeicao",desc:"Almoço"},
      {id:"s4b5",time:"13h – 17h",c:"trabalho",desc:"Bloco fixo de trabalho — clientes e estratégia"},
      {id:"s4b6",time:"17h – 17h30",c:"desloc",desc:"Buscar filho na escola"},
      {id:"s4b7",time:"17h30 – 19h",c:"familia",desc:"Tempo com os filhos"},
      {id:"s4b8",time:"19h – 20h",c:"refeicao",desc:"Jantar em família"},
      {id:"s4b9",time:"20h – 21h30",c:"familia",desc:"Tempo com o marido"},
      {id:"s4b10",time:"21h30 – 22h",c:"espiritual",desc:"Estudo pessoal"},
      {id:"s4b11",time:"22h – 00h",c:"noite",desc:"Trabalho noturno"},
    ]},
  Sex:{ wake:"6h40",badge:"Melhor dia — trabalha mais cedo",badgeBg:A[50],badgeBorder:A[600],badgeText:A[800],
    blocks:[
      {id:"s5b1",time:"6h40 – 7h30",c:"manha",desc:"Preparar filho do meio + café"},
      {id:"s5b2",time:"7h30 – 9h",c:"pessoal",desc:"Tempo pessoal — beleza, saúde, cuidados"},
      {id:"s5b3",time:"9h – 9h15",c:"desloc",desc:"Levar filho à escola e voltar"},
      {id:"s5b4",time:"9h15 – 10h45",c:"casa",desc:"Limpeza da casa (1h30)"},
      {id:"s5b5",time:"10h45 – 12h30",c:"trabalho",desc:"Trabalho — começa mais cedo"},
      {id:"s5b6",time:"12h30 – 13h30",c:"refeicao",desc:"Almoço"},
      {id:"s5b7",time:"13h30 – 17h",c:"trabalho",desc:"Bloco principal — estratégia e funil"},
      {id:"s5b8",time:"17h – 17h30",c:"desloc",desc:"Buscar filho na escola"},
      {id:"s5b9",time:"17h30 – 19h",c:"familia",desc:"Início do fim de semana em família"},
      {id:"s5b10",time:"19h – 20h",c:"refeicao",desc:"Jantar em família"},
      {id:"s5b11",time:"20h – 21h30",c:"familia",desc:"Tempo com o marido"},
      {id:"s5b12",time:"21h30 – 22h",c:"espiritual",desc:"Estudo pessoal"},
      {id:"s5b13",time:"22h – 00h",c:"noite",desc:"Último empurrão criativo"},
    ]},
  Sáb:{ wake:"Livre",badge:"Reunião 17h15",badgeBg:"#F5F3FF",badgeBorder:"#7C3AED",badgeText:"#3B0764",
    blocks:[
      {id:"s6b1",time:"Manhã",c:"descanso",desc:"Manhã livre — família, descanso, lazer"},
      {id:"s6b2",time:"Almoço",c:"refeicao",desc:"Almoço tardio"},
      {id:"s6b3",time:"Tarde",c:"familia",desc:"Tempo livre em família"},
      {id:"s6b4",time:"15h30 – 17h",c:"espiritual",desc:"Preparação e estudo para a reunião"},
      {id:"s6b5",time:"17h15 – 20h",c:"espiritual",desc:"Reunião da congregação"},
      {id:"s6b6",time:"20h – 21h",c:"familia",desc:"Jantar em família"},
      {id:"s6b7",time:"21h – 22h",c:"planej",desc:"Montar cardápio + lista de compras do domingo"},
      {id:"s6b8",time:"22h+",c:"pessoal",desc:"Descanso"},
    ]},
  Dom:{ wake:"8h00",badge:"Pregação + compras + planejamento da semana",badgeBg:"#FFF7ED",badgeBorder:"#EA580C",badgeText:"#7C2D12",
    blocks:[
      {id:"s7b1",time:"8h – 9h",c:"manha",desc:"Preparação para o serviço de pregação"},
      {id:"s7b2",time:"9h – 12h",c:"espiritual",desc:"Serviço de pregação"},
      {id:"s7b3",time:"12h – 13h",c:"refeicao",desc:"Almoço"},
      {id:"s7b4",time:"13h – 15h30",c:"compras",desc:"Compras no supermercado"},
      {id:"s7b5",time:"15h30 – 16h30",c:"planej",desc:"Planejar tarefas da marca para a semana"},
      {id:"s7b6",time:"16h30 – 18h",c:"descanso",desc:"Descanso — preparação mental para segunda"},
      {id:"s7b7",time:"18h+",c:"familia",desc:"Jantar em família e dormir cedo"},
    ]},
};

const DEFAULT_CLEANING={
  Seg:[{id:"cl1",text:"Varrer toda a casa"},{id:"cl2",text:"Passar pano úmido nos pisos"},{id:"cl3",text:"Limpar banheiro completo"},{id:"cl4",text:"Limpar cozinha e fogão"},{id:"cl5",text:"Tirar o lixo"},{id:"cl6",text:"Lavar louça"},{id:"cl7",text:"Fazer as camas"}],
  Ter:[{id:"ct1",text:"Varrer sala e quartos"},{id:"ct2",text:"Limpar bancadas da cozinha"},{id:"ct3",text:"Lavar louça"},{id:"ct4",text:"Fazer as camas"},{id:"ct5",text:"Organizar banheiro"}],
  Qua:[{id:"cq1",text:"Varrer sala"},{id:"cq2",text:"Lavar louça"},{id:"cq3",text:"Fazer as camas"},{id:"cq4",text:"Limpar fogão"}],
  Qui:[{id:"cqi1",text:"Aspirar tapetes"},{id:"cqi2",text:"Passar pano nos pisos"},{id:"cqi3",text:"Lavar banheiro"},{id:"cqi4",text:"Limpar geladeira"},{id:"cqi5",text:"Lavar louça"},{id:"cqi6",text:"Fazer as camas"}],
  Sex:[{id:"cs1",text:"Varrer e passar pano"},{id:"cs2",text:"Lavar louça"},{id:"cs3",text:"Fazer as camas"},{id:"cs4",text:"Organizar guarda-roupas"},{id:"cs5",text:"Limpar microondas"}],
  Sáb:[{id:"csb1",text:"Lavar roupas"},{id:"csb2",text:"Estender roupas"}],
  Dom:[{id:"cd1",text:"Dobrar e guardar roupas"},{id:"cd2",text:"Preparar para a semana"}],
};

// ═══════════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════════
function parseStartMins(t){const m=t.match(/^(\d+)h(\d*)/);if(!m)return null;return parseInt(m[1])*60+(m[2]?parseInt(m[2]):0);}
function getNowMins(){const n=new Date();return n.getHours()*60+n.getMinutes();}
function getTodayKey(){return["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][new Date().getDay()];}
function dateStr(d){return d.toISOString().split("T")[0];}
function todayStr(){return dateStr(new Date());}
function curr(v){return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v||0);}

function computeScore(selections,hasBinge){
  const meals=["breakfast","morning_snack","lunch","afternoon_snack","dinner"];
  const mainMeals=["breakfast","lunch","dinner"];
  const mainDone=mainMeals.filter(m=>Object.keys(selections[m]||{}).length>0).length;
  const calories_ok=mainDone>=3;
  let protein_ok=false,vegs_ok=false;
  for(const m of meals){
    const sel=selections[m]||{};
    const plan=MEAL_PLAN[m]||{};
    for(const g of Object.keys(plan)){if(plan[g].isProtein&&sel[g])protein_ok=true;}
    for(const g of Object.keys(plan)){if(plan[g].isVeg&&sel[g])vegs_ok=true;}
  }
  const no_binge=!hasBinge;
  let total=0;
  if(calories_ok)total+=40;
  if(protein_ok)total+=25;
  if(vegs_ok)total+=20;
  if(no_binge)total+=15;
  const classification=total>=90?"gold":total>=70?"silver":total>=50?"bronze":null;
  return{total_score:total,classification,calories_ok,protein_ok,vegs_ok,no_binge};
}

function getClassificationInfo(c){
  if(!c)return{emoji:"💔",label:"Continua tentando",color:"#f87171"};
  if(c==="gold")return{emoji:"🥇",label:"Ouro! Excelente!",color:A[500]};
  if(c==="silver")return{emoji:"🥈",label:"Prata! Muito bem!",color:S[400]};
  if(c==="bronze")return{emoji:"🥉",label:"Bronze! Bom esforço",color:"#fb923c"};
  return{emoji:"💔",label:"Continua tentando",color:"#f87171"};
}

function buildWeekDays(){
  const days=[];
  for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);days.push(d.toISOString().split("T")[0]);}
  return days;
}

function greeting(){
  const h=new Date().getHours();
  if(h<12)return"Bom dia";if(h<18)return"Boa tarde";return"Boa noite";
}

function playAlarm(){
  try{const ctx=new(window.AudioContext||window.webkitAudioContext)();
    [[0,523],[0.3,659],[0.6,784],[0.9,1047]].forEach(([t,hz])=>{
      const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);
      o.frequency.value=hz;o.type="sine";
      g.gain.setValueAtTime(0,ctx.currentTime+t);g.gain.linearRampToValueAtTime(0.2,ctx.currentTime+t+0.05);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.25);
      o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.25);
    });
  }catch(e){}
}
function vibrate(){try{navigator.vibrate&&navigator.vibrate([300,100,300]);}catch(e){}}

const stor={
  get:async(k,def)=>{
    if(typeof window!=="undefined"&&window.storage){
      try{const r=await window.storage.get(k);return r?JSON.parse(r.value):def;}catch{return def;}
    }
    try{
      const{loadData}=await import('./lib/supabase.js');
      const r=await loadData(k,def);
      return r!==null&&r!==undefined?r:def;
    }catch{return def;}
  },
  set:async(k,v)=>{
    if(typeof window!=="undefined"&&window.storage){
      try{await window.storage.set(k,JSON.stringify(v));}catch{}
      return;
    }
    try{
      const{saveData}=await import('./lib/supabase.js');
      await saveData(k,v);
    }catch{}
  },
};

// ═══════════════════════════════════════════════════════════════════
//  SCORE BADGE
// ═══════════════════════════════════════════════════════════════════
function ScoreBadge({score,classification}){
  const info=getClassificationInfo(classification);
  const pct=score;const r=44;const circ=2*Math.PI*r;
  const trackColor=classification==="gold"?A[200]:classification==="silver"?S[200]:classification==="bronze"?"#fed7aa":S[100];
  const fillColor=classification==="gold"?A[400]:classification==="silver"?S[400]:classification==="bronze"?"#fb923c":S[300];
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <div style={{position:"relative",width:120,height:120}}>
        <svg width={120} height={120} style={{transform:"rotate(-90deg)"}}>
          <circle cx={60} cy={60} r={r} fill="none" stroke={trackColor} strokeWidth={10}/>
          <circle cx={60} cy={60} r={r} fill="none" stroke={fillColor} strokeWidth={10}
            strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
            strokeLinecap="round" style={{transition:"stroke-dashoffset 0.8s ease"}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:32,fontWeight:900,color:S[800],lineHeight:1}}>{score}</span>
          <span style={{fontSize:11,color:S[400],fontWeight:600}}>pontos</span>
        </div>
      </div>
      {classification&&(
        <div style={{display:"flex",alignItems:"center",gap:6,background:info.color+"22",
          borderRadius:99,padding:"5px 14px"}}>
          <span style={{fontSize:16}}>{info.emoji}</span>
          <span style={{fontSize:13,fontWeight:700,color:info.color}}>{info.label}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  SCORE ITEM
// ═══════════════════════════════════════════════════════════════════
function ScoreItem({label,pts,ok}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:12,
      border:`1px solid ${ok?E[200]:S[100]}`,background:ok?E[50]:S[50]}}>
      <span style={{fontSize:15}}>{ok?"✅":"⬜"}</span>
      <span style={{flex:1,fontSize:12,fontWeight:500,color:ok?E[700]:S[400],lineHeight:1.3}}>{label}</span>
      <span style={{fontSize:12,fontWeight:700,color:ok?E[600]:S[300]}}>+{pts}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  DASHBOARD (NutriTrack) — score + histórico semanal integrado
// ═══════════════════════════════════════════════════════════════════
function DashboardTab({selections,hasBinge,onRegisterBinge,onNavMealLog,weekScores}){
  const score=computeScore(selections,hasBinge);
  const today=new Date();
  const todayS=todayStr();
  const DAY_LABELS=["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
  const weekDays=buildWeekDays();

  const vals=Object.values(weekScores);
  const weeklyAvg=vals.length?Math.round(vals.reduce((s,r)=>s+(r.total_score||0),0)/vals.length):0;
  const goldDays=vals.filter(r=>r.classification==="gold").length;
  const streakDays=vals.filter(r=>(r.total_score||0)>=70).length;

  const mealStatus=MEAL_TYPES.filter(m=>m.id!=="supper").map(m=>({
    ...m,done:Object.keys(selections[m.id]||{}).length>0
  }));
  const [showBinge,setShowBinge]=useState(false);
  const [bingeNote,setBingeNote]=useState("");

  function dayBgColor(row){
    if(!row)return{bg:S[100],text:S[400]};
    if(row.classification==="gold")return{bg:A[400],text:"#fff"};
    if(row.classification==="silver")return{bg:S[400],text:"#fff"};
    if(row.classification==="bronze")return{bg:"#fb923c",text:"#fff"};
    return{bg:"#fecaca",text:R[600]};
  }

  function doRegisterBinge(){
    onRegisterBinge(bingeNote);setShowBinge(false);setBingeNote("");
  }

  // ScoreBadge pequeno inline
  const pct=score.total_score;const r=28;const circ=2*Math.PI*r;
  const info=getClassificationInfo(score.classification);
  const trackColor=score.classification==="gold"?A[200]:score.classification==="silver"?S[200]:score.classification==="bronze"?"#fed7aa":S[100];
  const fillColor=score.classification==="gold"?A[400]:score.classification==="silver"?S[400]:score.classification==="bronze"?"#fb923c":S[300];

  return(
    <div style={{padding:"16px 16px 80px",display:"flex",flexDirection:"column",gap:12}}>
      {/* Saudação */}
      <div>
        <p style={{color:E[600],fontWeight:600,fontSize:13,margin:0}}>{greeting()},</p>
        <h1 style={{fontSize:19,fontWeight:900,color:S[800],margin:"1px 0 0",lineHeight:1.2}}>Elaine 🌱</h1>
        <p style={{color:S[400],fontSize:11,margin:"2px 0 0",textTransform:"capitalize"}}>
          {today.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}
        </p>
      </div>

      {/* Score + breakdown compacto */}
      <div style={{...card,padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
          {/* Anel pequeno */}
          <div style={{position:"relative",width:68,height:68,flexShrink:0}}>
            <svg width={68} height={68} style={{transform:"rotate(-90deg)"}}>
              <circle cx={34} cy={34} r={r} fill="none" stroke={trackColor} strokeWidth={7}/>
              <circle cx={34} cy={34} r={r} fill="none" stroke={fillColor} strokeWidth={7}
                strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
                strokeLinecap="round" style={{transition:"stroke-dashoffset 0.8s ease"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:18,fontWeight:900,color:S[800],lineHeight:1}}>{score.total_score}</span>
              <span style={{fontSize:8,color:S[400],fontWeight:600}}>pts</span>
            </div>
          </div>
          <div style={{flex:1}}>
            <p style={{fontSize:12,color:S[500],margin:"0 0 3px",fontWeight:500}}>Pontuação de hoje</p>
            {score.classification&&(
              <div style={{display:"inline-flex",alignItems:"center",gap:5,background:info.color+"18",
                borderRadius:99,padding:"3px 10px",marginBottom:6}}>
                <span style={{fontSize:13}}>{info.emoji}</span>
                <span style={{fontSize:11,fontWeight:700,color:info.color}}>{info.label}</span>
              </div>
            )}
            <button onClick={onNavMealLog} style={{
              display:"block",fontSize:11,color:E[600],fontWeight:700,background:E[50],
              padding:"5px 12px",borderRadius:99,border:`1px solid ${E[200]}`,cursor:"pointer"}}>
              Registar refeição →
            </button>
          </div>
        </div>
        {/* Breakdown 2x2 compacto */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {[{l:"Refeições",pts:40,ok:score.calories_ok},
            {l:"Proteína",pts:25,ok:score.protein_ok},
            {l:"Vegetais",pts:20,ok:score.vegs_ok},
            {l:"Sem compulsão",pts:15,ok:score.no_binge}].map(it=>(
            <div key={it.l} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 10px",
              borderRadius:10,border:`1px solid ${it.ok?E[200]:S[100]}`,background:it.ok?E[50]:S[50]}}>
              <span style={{fontSize:12}}>{it.ok?"✅":"⬜"}</span>
              <span style={{flex:1,fontSize:11,fontWeight:500,color:it.ok?E[700]:S[400],lineHeight:1.2}}>{it.l}</span>
              <span style={{fontSize:11,fontWeight:700,color:it.ok?E[600]:S[300]}}>+{it.pts}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status refeições de hoje */}
      <div style={card}>
        <p style={{fontWeight:600,color:S[700],marginBottom:10,fontSize:13}}>Refeições de hoje</p>
        {mealStatus.map((m,i)=>(
          <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",
            borderBottom:i<mealStatus.length-1?`1px solid ${S[50]}`:"none"}}>
            <span style={{fontSize:16}}>{m.emoji}</span>
            <div style={{flex:1}}>
              <p style={{fontSize:12,fontWeight:500,color:S[700],margin:0}}>{m.label}</p>
            </div>
            {m.done
              ?<span style={{color:E[500],fontWeight:700,fontSize:14}}>✓</span>
              :<button onClick={onNavMealLog} style={{fontSize:10,color:E[600],fontWeight:600,
                  background:E[50],padding:"4px 10px",borderRadius:99,
                  border:`1px solid ${E[200]}`,cursor:"pointer"}}>Registar</button>}
          </div>
        ))}
      </div>

      {/* Histórico semanal mini */}
      <div style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <p style={{fontWeight:600,color:S[700],fontSize:13,margin:0}}>Semana atual</p>
          <div style={{display:"flex",gap:10}}>
            {[{e:"⭐",v:weeklyAvg,l:"Média"},{e:"🥇",v:goldDays,l:"Ouro"},{e:"✅",v:streakDays,l:"≥70"}].map(s=>(
              <div key={s.l} style={{textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:900,color:S[800]}}>{s.v}</div>
                <div style={{fontSize:9,color:S[400]}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {weekDays.map(d=>{
            const row=weekScores[d];
            const dow=new Date(d+"T12:00:00").getDay();
            const isToday=d===todayS;
            const{bg,text}=dayBgColor(row);
            return(
              <div key={d} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <span style={{fontSize:8,fontWeight:700,color:isToday?E[600]:S[400]}}>
                  {DAY_LABELS[dow]}
                </span>
                <div style={{width:30,height:30,borderRadius:8,display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:9,fontWeight:900,background:bg,color:text,
                  outline:isToday?`2px solid ${E[500]}`:"none",outlineOffset:1}}>
                  {row?row.total_score:"—"}
                </div>
                <span style={{fontSize:8}}>
                  {row?.classification==="gold"?"🥇":row?.classification==="silver"?"🥈":
                   row?.classification==="bronze"?"🥉":row?"💔":""}
                </span>
              </div>
            );
          })}
        </div>
        {/* Legenda compacta */}
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:10,paddingTop:10,
          borderTop:`1px solid ${S[100]}`}}>
          {[[A[400],"Ouro"],[S[400],"Prata"],["#fb923c","Bronze"],["#fecaca","<50"],[S[100],"—"]].map(([c,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:3}}>
              <div style={{width:8,height:8,borderRadius:2,background:c}}/>
              <span style={{fontSize:8,color:S[500]}}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compulsão */}
      <button onClick={()=>!hasBinge&&setShowBinge(true)} disabled={hasBinge} style={{
        width:"100%",padding:"12px",borderRadius:14,cursor:hasBinge?"default":"pointer",
        border:`2px dashed ${hasBinge?"#fde68a":"#fecaca"}`,background:"transparent",
        color:hasBinge?A[700]:"#f87171",fontWeight:500,fontSize:12,
        display:"flex",alignItems:"center",justifyContent:"center",gap:8,
      }}>
        {hasBinge?"💛 Episódio já registado — sem julgamento":"💛 Registar episódio de compulsão"}
      </button>

      {showBinge&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,
          display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 16px 24px"}}>
          <div style={{background:"#fff",borderRadius:24,padding:24,width:"100%",maxWidth:440}}>
            <p style={{fontSize:24,textAlign:"center",marginBottom:4}}>💛</p>
            <h3 style={{fontWeight:700,fontSize:17,color:S[800],textAlign:"center",margin:"0 0 6px"}}>
              Registo sem julgamento
            </h3>
            <p style={{color:S[500],fontSize:13,textAlign:"center",marginBottom:16}}>
              Reconhecer é o primeiro passo. Está tudo bem.
            </p>
            <textarea value={bingeNote} onChange={e=>setBingeNote(e.target.value)}
              placeholder="O que aconteceu? (opcional)" rows={3}
              style={{width:"100%",padding:"12px",borderRadius:12,border:`1px solid ${S[200]}`,
                background:S[50],fontSize:13,color:S[700],resize:"none",outline:"none",
                fontFamily:"inherit",marginBottom:12}}/>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowBinge(false)} style={{...btnSecondary,flex:1}}>Cancelar</button>
              <button onClick={doRegisterBinge} style={{...btnPrimary,flex:1}}>Registar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  SELECTION MODAL (MealLog)
// ═══════════════════════════════════════════════════════════════════
function SelectionModal({groupId,groupMeta,currentItem,onSelect,onClose}){
  const [search,setSearch]=useState("");
  const options=groupMeta.options||[];
  const filtered=search?options.filter(o=>o.toLowerCase().includes(search.toLowerCase())):options;
  return(
    <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",flexDirection:"column",background:"#fff"}}>
      {/* Header com botão voltar e botão limpar */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px",borderBottom:"1px solid #f1f5f9"}}>
        <button onClick={onClose} style={{width:38,height:38,borderRadius:99,background:"#f1f5f9",
          border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:20,color:"#64748b",flexShrink:0}}>
          ‹
        </button>
        <div style={{flex:1}}>
          <p style={{fontWeight:900,color:"#1e293b",fontSize:15,margin:0}}>{groupMeta.emoji} {groupMeta.label}</p>
          <p style={{fontSize:11,color:"#94a3b8",margin:0}}>{groupMeta.portions} · {groupId}</p>
        </div>
        {currentItem&&(
          <button onClick={()=>onSelect(null)} style={{
            fontSize:11,color:"#ef4444",fontWeight:700,
            background:"#fef2f2",border:"1px solid #fecaca",
            padding:"5px 12px",borderRadius:99,cursor:"pointer",flexShrink:0,
          }}>
            Limpar
          </button>
        )}
      </div>

      {/* Selecção actual */}
      {currentItem&&(
        <div style={{margin:"10px 16px 0",padding:"10px 14px",background:"#f0fdf4",
          border:"1px solid #bbf7d0",borderRadius:12,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>✅</span>
          <div style={{flex:1}}>
            <p style={{fontSize:11,fontWeight:700,color:"#16a34a",margin:"0 0 2px"}}>Seleccionado</p>
            <p style={{fontSize:13,color:"#15803d",fontWeight:500,margin:0}}>{currentItem}</p>
          </div>
          <button onClick={()=>onSelect(null)} style={{
            width:28,height:28,borderRadius:99,background:"#dcfce7",border:"none",
            cursor:"pointer",fontSize:14,color:"#16a34a",display:"flex",
            alignItems:"center",justifyContent:"center",
          }}>✕</button>
        </div>
      )}

      {groupMeta.note&&(
        <div style={{margin:"10px 16px 0",padding:"10px 12px",background:"#fffbeb",
          border:"1px solid #fde68a",borderRadius:12}}>
          <p style={{fontSize:12,color:"#b45309",margin:0}}>💡 {groupMeta.note}</p>
        </div>
      )}

      {/* Pesquisa */}
      <div style={{padding:"12px 16px",position:"relative"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pesquisar…"
          style={{width:"100%",padding:"10px 14px 10px 36px",borderRadius:12,border:"none",
            background:"#f1f5f9",fontSize:13,color:"#1e293b",outline:"none",fontFamily:"inherit"}}/>
        <span style={{position:"absolute",left:26,top:"50%",transform:"translateY(-50%)",
          fontSize:14,color:"#94a3b8"}}>🔍</span>
      </div>

      {/* Lista de opções */}
      <div style={{flex:1,overflowY:"auto",padding:"0 16px 32px",display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((opt,i)=>{
          const isSel=currentItem===opt;
          return(
            <button key={i} onClick={()=>isSel?onSelect(null):onSelect(opt)} style={{
              display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:16,
              border:`2px solid ${isSel?"#4ade80":"#e2e8f0"}`,
              background:isSel?"#f0fdf4":"#fff",
              cursor:"pointer",textAlign:"left",width:"100%",
            }}>
              <div style={{width:22,height:22,borderRadius:99,
                border:`2px solid ${isSel?"#22c55e":"#cbd5e1"}`,
                background:isSel?"#22c55e":"transparent",flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                {isSel&&<span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}
              </div>
              <span style={{fontSize:14,fontWeight:500,color:isSel?"#15803d":"#334155"}}>{opt}</span>
              {isSel&&(
                <span style={{marginLeft:"auto",fontSize:11,color:"#ef4444",fontWeight:600,
                  background:"#fef2f2",padding:"3px 8px",borderRadius:99,flexShrink:0}}>
                  toque para remover
                </span>
              )}
            </button>
          );
        })}
        {filtered.length===0&&(
          <div style={{textAlign:"center",padding:40,color:"#94a3b8"}}>
            <p style={{fontSize:32,marginBottom:8}}>🔍</p>
            <p style={{fontSize:14,fontWeight:600}}>Nenhum resultado</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MEAL LOG (NutriTrack)
// ═══════════════════════════════════════════════════════════════════
function MealLogTab({selections,onSelect,rewards,onFreeMeal}){
  const [activeMeal,setActiveMeal]=useState("breakfast");
  const [activeGroup,setActiveGroup]=useState(null);
  const [showFree,setShowFree]=useState(false);
  const today=new Date();
  const mealGroups=MEAL_PLAN[activeMeal]||{};
  const completedCount=Object.keys(mealGroups).filter(g=>selections[activeMeal]?.[g]).length;
  const totalGroups=Object.keys(mealGroups).length;
  const hasReward=rewards.length>0&&(activeMeal==="lunch"||activeMeal==="dinner");
  const isFreeMeal=selections[activeMeal]?.FREE!==undefined;

  return(
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{padding:"20px 16px 12px"}}>
        <h1 style={{fontSize:22,fontWeight:900,color:S[800],margin:0}}>Registar Refeição</h1>
        <p style={{color:S[400],fontSize:13,margin:"3px 0 0",textTransform:"capitalize"}}>
          {today.toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"short"})}
        </p>
      </div>

      {/* Meal tabs */}
      <div style={{display:"flex",gap:8,padding:"0 16px 12px",overflowX:"auto",scrollbarWidth:"none"}}>
        {MEAL_TYPES.map(m=>{
          const grps=MEAL_PLAN[m.id]||{};
          const done=Object.keys(grps).length>0&&Object.keys(grps).every(g=>selections[m.id]?.[g]);
          const partial=!done&&Object.values(selections[m.id]||{}).length>0;
          const isSel=activeMeal===m.id;
          return(
            <button key={m.id} onClick={()=>setActiveMeal(m.id)} style={{
              display:"flex",flexDirection:"column",alignItems:"center",
              padding:"10px 14px",borderRadius:16,flexShrink:0,cursor:"pointer",
              border:`2px solid ${isSel?E[500]:S[200]}`,
              background:isSel?E[500]:"#fff",color:isSel?"#fff":S[600],
            }}>
              <span style={{fontSize:18}}>{m.emoji}</span>
              <span style={{fontSize:10,fontWeight:600,marginTop:2}}>{m.label.split(" ")[0]}</span>
              {done&&<span style={{fontSize:9,marginTop:2}}>✅</span>}
              {partial&&!done&&<span style={{fontSize:9,marginTop:2,color:isSel?A[200]:A[400]}}>◑</span>}
            </button>
          );
        })}
      </div>

      {/* Progress */}
      <div style={{padding:"0 16px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontSize:12,color:S[500],fontWeight:500}}>
            {MEAL_TYPES.find(m=>m.id===activeMeal)?.label}
          </span>
          <span style={{fontSize:12,fontWeight:700,color:E[600]}}>{completedCount}/{totalGroups} grupos</span>
        </div>
        <div style={{height:6,background:S[100],borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",background:E[400],borderRadius:99,
            width:totalGroups?`${(completedCount/totalGroups)*100}%`:"0%",
            transition:"width 0.5s ease"}}/>
        </div>
      </div>

      {/* Free meal banner */}
      {hasReward&&!isFreeMeal&&(
        <div style={{margin:"0 16px 12px"}}>
          <button onClick={()=>setShowFree(true)} style={{
            width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 16px",
            borderRadius:16,border:`2px solid ${A[300]}`,background:A[50],cursor:"pointer"}}>
            <span style={{fontSize:24}}>🎁</span>
            <div style={{textAlign:"left",flex:1}}>
              <p style={{fontWeight:700,color:A[800],fontSize:14,margin:0}}>Refeição Livre disponível!</p>
              <p style={{fontSize:11,color:A[600],margin:0}}>Toque para usar o seu prémio</p>
            </div>
            <span style={{color:A[600],fontSize:18}}>›</span>
          </button>
        </div>
      )}
      {isFreeMeal&&(
        <div style={{margin:"0 16px 12px",padding:"14px 16px",borderRadius:16,
          border:`2px solid ${A[300]}`,background:A[50]}}>
          <p style={{fontWeight:700,color:A[800],margin:"0 0 3px"}}>🎉 Refeição Livre registada!</p>
          <p style={{color:A[600],fontSize:13,margin:0}}>{selections[activeMeal]?.FREE}</p>
        </div>
      )}

      {/* Group cards */}
      {!isFreeMeal&&(
        <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:10}}>
          {Object.entries(mealGroups).map(([groupId,groupMeta])=>{
            const selected=selections[activeMeal]?.[groupId];
            return(
              <button key={groupId} onClick={()=>setActiveGroup({groupId,groupMeta})} style={{
                ...card,display:"flex",alignItems:"center",gap:12,cursor:"pointer",
                textAlign:"left",border:`1px solid ${selected?E[300]:S[100]}`,
                background:selected?E[50]+"99":"#fff",padding:"14px 16px",
              }}>
                <span style={{fontSize:26,flexShrink:0}}>{groupMeta.emoji}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <span style={{fontWeight:700,color:S[700],fontSize:14}}>{groupMeta.label}</span>
                    <span style={{fontSize:10,fontWeight:600,color:S[400],background:S[100],
                      padding:"2px 7px",borderRadius:99}}>{groupMeta.portions}</span>
                  </div>
                  {selected?(
                    <p style={{fontSize:12,color:E[600],fontWeight:500,margin:0,overflow:"hidden",
                      textOverflow:"ellipsis",whiteSpace:"nowrap"}}>✓ {selected}</p>
                  ):(
                    <p style={{fontSize:12,color:S[400],margin:0}}>Toque para escolher…</p>
                  )}
                </div>
                {selected?(
                  <div style={{width:30,height:30,borderRadius:99,background:E[500],flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14}}>✓</div>
                ):(
                  <span style={{color:S[300],fontSize:18,flexShrink:0}}>›</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Selection Modal */}
      {activeGroup&&(
        <SelectionModal
          groupId={activeGroup.groupId}
          groupMeta={activeGroup.groupMeta}
          currentItem={selections[activeMeal]?.[activeGroup.groupId]}
          onSelect={item=>{onSelect(activeMeal,activeGroup.groupId,item);setActiveGroup(null);}}
          onClose={()=>setActiveGroup(null)}/>
      )}

      {/* Free Meal Modal */}
      {showFree&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,
          display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 16px 24px"}}>
          <div style={{background:"#fff",borderRadius:24,padding:24,width:"100%",maxWidth:440,maxHeight:"80vh",overflowY:"auto"}}>
            <p style={{fontSize:26,margin:"0 0 4px"}}>🎁</p>
            <h3 style={{fontWeight:900,fontSize:20,color:S[800],margin:"0 0 4px"}}>Refeição Livre</h3>
            <p style={{color:S[500],fontSize:13,margin:"0 0 16px"}}>Escolha a sua recompensa (~1000 kcal)</p>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {FREE_MEAL_OPTIONS.map(opt=>(
                <button key={opt.id} onClick={()=>{onFreeMeal(activeMeal,opt.label);setShowFree(false);}} style={{
                  display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",borderRadius:16,
                  border:`2px solid ${S[100]}`,background:"#fff",cursor:"pointer",textAlign:"left"}}>
                  <span style={{fontSize:24,flexShrink:0}}>{opt.emoji}</span>
                  <div>
                    <p style={{fontWeight:700,color:S[800],fontSize:14,margin:0}}>{opt.label}</p>
                    <p style={{fontSize:12,color:S[400],margin:"2px 0 0",lineHeight:1.4}}>{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={()=>setShowFree(false)} style={btnSecondary}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  CARDÁPIO SEMANAL + LISTA DE COMPRAS IA
// ═══════════════════════════════════════════════════════════════════
function CardapioSemanalTab({weekPlan,onSelectWeek}){
  const [activeDay,setActiveDay]=useState("Seg");
  const [activeGroup,setActiveGroup]=useState(null);
  const [shoppingList,setShoppingList]=useState("");
  const [loadingList,setLoadingList]=useState(false);
  const [showList,setShowList]=useState(false);

  const dayPlan=weekPlan[activeDay]||{};

  // Conta grupos preenchidos para o dia
  function dayProgress(day){
    const dp=weekPlan[day]||{};
    let total=0,done=0;
    MEAL_TYPES.forEach(m=>{
      const groups=MEAL_PLAN[m.id]||{};
      Object.keys(groups).forEach(g=>{total++;if(dp[m.id]?.[g])done++;});
    });
    return{total,done};
  }

  async function gerarListaCompras(){
    setLoadingList(true);setShoppingList("");setShowList(true);
    // Coletar todos os alimentos selecionados na semana
    const items={}; // {alimento: count}
    DAYS.forEach(day=>{
      const dp=weekPlan[day]||{};
      MEAL_TYPES.forEach(m=>{
        const groups=MEAL_PLAN[m.id]||{};
        Object.keys(groups).forEach(g=>{
          const sel=(dp[m.id]||{})[g];
          if(sel){ items[sel]=(items[sel]||0)+1; }
        });
      });
    });

    if(Object.keys(items).length===0){
      setShoppingList("Nenhum alimento selecionado no cardápio. Preencha pelo menos um dia para gerar a lista.");
      setLoadingList(false);return;
    }

    const itemsText=Object.entries(items)
      .map(([food,count])=>`- ${food} × ${count}`)
      .join("\n");

    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1500,
          messages:[{role:"user",content:`Você é uma assistente de compras. Recebi um cardápio semanal de uma família de 6 pessoas (5 pessoas + 1 extra de segurança). Preciso de uma lista de compras organizada por categoria de supermercado.

ALIMENTOS SELECIONADOS NO CARDÁPIO (quantidade de vezes que aparece):
${itemsText}

REGRAS IMPORTANTES:
1. Multiplique TODAS as quantidades por 6 (somos 6 pessoas)
2. Some itens repetidos (se aparecer morango 2 vezes: 220g × 2 × 6 = 2640g = 2,6kg)
3. Arredonde para unidades práticas de compra (ex: "3kg de morango", "600g de frango")
4. Organize por categoria: 🥩 Proteínas, 🥦 Vegetais e Hortaliças, 🍎 Frutas, 🍞 Pães e Cereais, 🥛 Laticínios, 🫘 Leguminosas, ☕ Bebidas
5. Use linguagem simples e prática para mercado
6. Ignore alimentos "livre" (café, chá) pois não precisam de quantidade específica

Formato de resposta:
🛒 **Lista de Compras — Semana completa (6 pessoas)**

[cada categoria com seus itens e quantidades]

💡 **Dica**: [uma dica rápida de organização das compras]`}]
        })
      });
      const data=await res.json();
      setShoppingList(data.content?.map(c=>c.text||"").join("\n")||"Erro ao gerar lista.");
    }catch(e){
      setShoppingList("Erro ao gerar lista de compras. Verifique sua conexão e tente novamente.");
    }finally{
      setLoadingList(false);
    }
  }

  function renderList(text){
    return text.split("\n").map((line,i)=>{
      if(!line.trim())return<div key={i} style={{height:6}}/>;
      const isBold=line.startsWith("**")&&line.endsWith("**");
      const isHeader=line.startsWith("🛒")||line.startsWith("🥩")||line.startsWith("🥦")||
        line.startsWith("🍎")||line.startsWith("🍞")||line.startsWith("🥛")||
        line.startsWith("🫘")||line.startsWith("☕")||line.startsWith("💡");
      if(isBold||isHeader)return(
        <p key={i} style={{fontWeight:700,color:S[800],margin:"12px 0 4px",fontSize:14}}>
          {line.replace(/\*\*/g,"")}
        </p>
      );
      if(line.startsWith("-"))return(
        <div key={i} style={{display:"flex",gap:8,padding:"5px 0",
          borderBottom:`1px solid ${S[50]}`}}>
          <span style={{color:E[500],fontWeight:700,flexShrink:0}}>•</span>
          <span style={{fontSize:13,color:S[700],lineHeight:1.4}}>{line.slice(1).trim()}</span>
        </div>
      );
      return<p key={i} style={{fontSize:13,color:S[600],margin:"2px 0",lineHeight:1.5}}>{line}</p>;
    });
  }

  // Modal de lista de compras
  if(showList){
    return(
      <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"16px",
          borderBottom:`1px solid ${S[100]}`,background:"#fff",position:"sticky",top:0,zIndex:10}}>
          <button onClick={()=>setShowList(false)} style={{
            width:36,height:36,borderRadius:99,background:S[100],border:"none",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:18,color:S[600]}}>‹</button>
          <div style={{flex:1}}>
            <p style={{fontWeight:800,color:S[800],fontSize:15,margin:0}}>Lista de Compras</p>
            <p style={{fontSize:11,color:S[400],margin:0}}>Gerada por IA · 6 pessoas</p>
          </div>
          {!loadingList&&shoppingList&&(
            <button onClick={gerarListaCompras} style={{
              fontSize:11,color:E[600],fontWeight:700,background:E[50],
              padding:"5px 10px",borderRadius:99,border:`1px solid ${E[200]}`,cursor:"pointer"}}>
              Refazer
            </button>
          )}
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"16px 16px 80px"}}>
          {loadingList?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"48px 0",gap:14}}>
              <div style={{width:36,height:36,border:`4px solid ${E[200]}`,borderTopColor:E[500],
                borderRadius:99,animation:"spin 0.8s linear infinite"}}/>
              <p style={{color:S[500],fontSize:13,margin:0}}>A calcular quantidades para 6 pessoas…</p>
            </div>
          ):(
            <div style={card}>{renderList(shoppingList)}</div>
          )}
        </div>
      </div>
    );
  }

  return(
    <div style={{paddingBottom:80}}>
      {/* Header */}
      <div style={{padding:"16px 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h1 style={{fontSize:19,fontWeight:900,color:S[800],margin:0}}>Cardápio Semanal</h1>
          <p style={{color:S[400],fontSize:12,margin:"3px 0 0"}}>Planeia as refeições da semana</p>
        </div>
        <button onClick={gerarListaCompras} style={{
          ...btnPrimary,width:"auto",padding:"9px 14px",fontSize:12,gap:5}}>
          🛒 Lista de compras
        </button>
      </div>

      {/* Tabs dos dias */}
      <div style={{display:"flex",gap:4,padding:"0 16px 10px",overflowX:"auto",scrollbarWidth:"none"}}>
        {DAYS.map(d=>{
          const {total,done}=dayProgress(d);
          const isSel=d===activeDay;
          const pct=total?Math.round(done/total*100):0;
          return(
            <button key={d} onClick={()=>setActiveDay(d)} style={{
              flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",
              padding:"8px 12px",borderRadius:12,border:"none",cursor:"pointer",
              background:isSel?E[500]:"#fff",
              boxShadow:isSel?"none":"0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <span style={{fontSize:12,fontWeight:700,color:isSel?"#fff":S[600]}}>{d}</span>
              {total>0&&(
                <span style={{fontSize:9,color:isSel?E[100]:S[400],marginTop:2}}>
                  {done}/{total}
                </span>
              )}
              {pct===100&&<span style={{fontSize:9,marginTop:1}}>✅</span>}
            </button>
          );
        })}
      </div>

      {/* Refeições do dia */}
      <div style={{padding:"0 16px",display:"flex",flexDirection:"column",gap:12}}>
        {MEAL_TYPES.map(meal=>{
          const groups=MEAL_PLAN[meal.id]||{};
          if(Object.keys(groups).length===0)return null;
          const mealSel=dayPlan[meal.id]||{};
          const done=Object.keys(groups).filter(g=>mealSel[g]).length;
          const total=Object.keys(groups).length;
          return(
            <div key={meal.id} style={card}>
              {/* Header refeição */}
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{fontSize:20}}>{meal.emoji}</span>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,color:S[700],fontSize:13,margin:0}}>{meal.label}</p>
                  <p style={{fontSize:10,color:S[400],margin:0}}>{meal.time} · {done}/{total} grupos</p>
                </div>
                {done===total&&total>0&&<span style={{fontSize:14}}>✅</span>}
              </div>
              {/* Grupos */}
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {Object.entries(groups).map(([groupId,groupMeta])=>{
                  const selected=mealSel[groupId];
                  return(
                    <button key={groupId}
                      onClick={()=>setActiveGroup({day:activeDay,mealId:meal.id,groupId,groupMeta})}
                      style={{
                        display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
                        borderRadius:12,border:`1.5px solid ${selected?E[300]:S[200]}`,
                        background:selected?E[50]:"#fff",cursor:"pointer",textAlign:"left",width:"100%",
                      }}>
                      <span style={{fontSize:18,flexShrink:0}}>{groupMeta.emoji}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <p style={{fontSize:12,fontWeight:600,color:S[700],margin:0}}>{groupMeta.label}</p>
                        {selected
                          ?<p style={{fontSize:11,color:E[600],margin:"2px 0 0",overflow:"hidden",
                              textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>✓ {selected}</p>
                          :<p style={{fontSize:11,color:S[400],margin:"1px 0 0"}}>Toque para escolher…</p>
                        }
                      </div>
                      {selected
                        ?<div style={{width:22,height:22,borderRadius:99,background:E[500],flexShrink:0,
                            display:"flex",alignItems:"center",justifyContent:"center",
                            color:"#fff",fontSize:11,fontWeight:700}}>✓</div>
                        :<span style={{color:S[300],fontSize:16,flexShrink:0}}>›</span>
                      }
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de seleção */}
      {activeGroup&&(
        <SelectionModal
          groupId={activeGroup.groupId}
          groupMeta={activeGroup.groupMeta}
          currentItem={(weekPlan[activeGroup.day]?.[activeGroup.mealId]||{})[activeGroup.groupId]}
          onSelect={item=>{
            onSelectWeek(activeGroup.day,activeGroup.mealId,activeGroup.groupId,item);
            setActiveGroup(null);
          }}
          onClose={()=>setActiveGroup(null)}/>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  RECIPES (NutriTrack + IA real)
// ═══════════════════════════════════════════════════════════════════
function RecipesTab(){
  const [ingredients,setIngredients]=useState("");
  const [recipe,setRecipe]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  async function generate(){
    if(!ingredients.trim())return;
    setError("");setRecipe("");setLoading(true);
    try{
      const response=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          messages:[{role:"user",content:`Você é nutricionista. Crie uma receita saudável e saborosa compatível com plano de emagrecimento usando: ${ingredients.trim()}.

Princípios: proteínas magras, carboidratos complexos, abundância de vegetais, sem frituras nem açúcar refinado.

Responda em português com este formato exato:
🍽️ **Nome da Receita**

📋 **Ingredientes** (com quantidades)

👨‍🍳 **Modo de Preparo** (numerado)

📊 **Informação Nutricional Estimada**

💡 **Dica da nutricionista**`}]
        })
      });
      const data=await response.json();
      const text=data.content?.map(c=>c.text||"").join("\n")||"Sem resposta.";
      setRecipe(text);
    }catch(e){
      setError("Erro ao gerar receita. Tente novamente.");
    }finally{
      setLoading(false);
    }
  }

  function renderRecipe(text){
    return text.split("\n").map((line,i)=>{
      if(!line.trim())return<div key={i} style={{height:8}}/>;
      const isBold=line.startsWith("**")&&line.endsWith("**");
      const isHeader=line.startsWith("🍽️")||line.startsWith("📋")||line.startsWith("👨‍🍳")||line.startsWith("📊")||line.startsWith("💡");
      const isNum=/^\d+\./.test(line);
      if(isBold||isHeader)return<p key={i} style={{fontWeight:700,color:S[800],margin:"12px 0 3px",fontSize:14}}>{line.replace(/\*\*/g,"")}</p>;
      if(isNum)return<p key={i} style={{marginLeft:12,fontSize:13,color:S[700],margin:"3px 0 3px 12px"}}>{line}</p>;
      return<p key={i} style={{fontSize:13,color:S[700],margin:"2px 0",lineHeight:1.5}}>{line}</p>;
    });
  }

  return(
    <div style={{padding:"20px 16px 80px",display:"flex",flexDirection:"column",gap:14}}>
      <div>
        <h1 style={{fontSize:22,fontWeight:900,color:S[800],margin:0}}>Receitas IA</h1>
        <p style={{color:S[400],fontSize:13,margin:"3px 0 0"}}>Diga os ingredientes que tem em casa</p>
      </div>

      <div style={card}>
        <p style={{fontWeight:600,color:S[700],marginBottom:10,fontSize:14}}>Que ingredientes tens em casa?</p>
        <textarea value={ingredients} onChange={e=>setIngredients(e.target.value)}
          placeholder="Ex: frango, batata doce, brócolis, azeite, alho, limão…" rows={4}
          style={{width:"100%",padding:"12px",borderRadius:12,border:`1px solid ${S[200]}`,
            background:S[50],resize:"none",fontSize:13,color:S[700],outline:"none",
            fontFamily:"inherit",marginBottom:12}}/>
        <button onClick={generate} disabled={loading||!ingredients.trim()} style={{
          ...btnPrimary,
          background:loading||!ingredients.trim()?S[300]:E[600],
          cursor:loading||!ingredients.trim()?"not-allowed":"pointer",
        }}>
          {loading?(
            <><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",
              borderTopColor:"#fff",borderRadius:99,animation:"spin 0.8s linear infinite"}}/>
            A gerar…</>
          ):(
            <><span>✨</span>Gerar receita</>
          )}
        </button>
      </div>

      {error&&(
        <div style={{...card,border:`1px solid ${R[200]}`,background:"#fef2f2"}}>
          <p style={{color:R[600],fontSize:13,margin:0}}>{error}</p>
        </div>
      )}

      {recipe&&(
        <div style={card}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
            <span style={{fontSize:20}}>✨</span>
            <p style={{fontWeight:700,color:S[800],fontSize:15,margin:0}}>Receita gerada</p>
          </div>
          <div>{renderRecipe(recipe)}</div>
          <button onClick={()=>setRecipe("")} style={{...btnSecondary,marginTop:14}}>
            Gerar outra receita
          </button>
        </div>
      )}

      {!recipe&&!loading&&!error&&(
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          padding:"32px 0",gap:10,textAlign:"center"}}>
          <span style={{fontSize:52}}>🥗</span>
          <p style={{fontWeight:600,color:S[600],fontSize:15,margin:0}}>Conta o que tens na cozinha</p>
          <p style={{color:S[400],fontSize:13,maxWidth:240,lineHeight:1.6,margin:0}}>
            A IA vai sugerir uma receita saudável compatível com o teu plano alimentar.
          </p>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  LIMPEZA
// ═══════════════════════════════════════════════════════════════════
function LimpezaTab({dayKey,cleanTasks,completions,onToggle,onAddTask,onEditTask,onDeleteTask}){
  const [newTask,setNewTask]=useState("");
  const [editingId,setEditingId]=useState(null);
  const [editVal,setEditVal]=useState("");
  const tasks=cleanTasks[dayKey]||[];
  const done=tasks.filter(t=>(completions[dayKey]||[]).includes(t.id)).length;
  const pct=tasks.length?Math.round((done/tasks.length)*100):0;
  const complete=pct===100&&tasks.length>0;

  return(
    <div style={{padding:"20px 16px 80px",display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:900,color:S[800],margin:0}}>Limpeza</h1>
          <p style={{color:S[400],fontSize:13,margin:"3px 0 0"}}>{dayKey} · {done} de {tasks.length} feitas</p>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:28,fontWeight:900,color:complete?E[600]:S[700]}}>{pct}%</div>
        </div>
      </div>

      <div style={{height:6,background:S[100],borderRadius:99,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:complete?E[500]:E[400],
          borderRadius:99,transition:"width 0.4s ease"}}/>
      </div>

      <div style={card}>
        {tasks.length===0&&(
          <p style={{textAlign:"center",color:S[400],padding:"20px 0",fontSize:14,margin:0}}>
            Nenhuma tarefa para {dayKey}
          </p>
        )}
        {tasks.map((t,i)=>{
          const isDone=(completions[dayKey]||[]).includes(t.id);
          return(
            <div key={t.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",
              borderBottom:i<tasks.length-1?`1px solid ${S[50]}`:"none"}}>
              <button onClick={()=>onToggle(dayKey,t.id)} style={{
                width:22,height:22,borderRadius:6,flexShrink:0,cursor:"pointer",
                border:`2px solid ${isDone?E[500]:S[300]}`,background:isDone?E[500]:"transparent",
                display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {isDone&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </button>
              {editingId===t.id?(
                <input value={editVal} onChange={e=>setEditVal(e.target.value)} autoFocus
                  onBlur={()=>{onEditTask(dayKey,t.id,editVal);setEditingId(null);}}
                  onKeyDown={e=>e.key==="Enter"&&(onEditTask(dayKey,t.id,editVal),setEditingId(null))}
                  style={{flex:1,border:`1px solid ${E[400]}`,borderRadius:8,padding:"4px 10px",
                    fontSize:14,fontFamily:"inherit",outline:"none"}}/>
              ):(
                <span onDoubleClick={()=>{setEditingId(t.id);setEditVal(t.text);}} style={{
                  flex:1,fontSize:14,color:isDone?S[400]:S[700],
                  textDecoration:isDone?"line-through":"none",lineHeight:1.4}}>
                  {t.text}
                </span>
              )}
              <button onClick={()=>onDeleteTask(dayKey,t.id)} style={{
                background:"none",border:"none",cursor:"pointer",color:S[300],fontSize:16,padding:"0 2px"}}>×</button>
            </div>
          );
        })}
      </div>

      <div style={{display:"flex",gap:8}}>
        <input value={newTask} onChange={e=>setNewTask(e.target.value)} placeholder="Adicionar tarefa…"
          onKeyDown={e=>{if(e.key==="Enter"&&newTask.trim()){onAddTask(dayKey,newTask.trim());setNewTask("");}}}
          style={{flex:1,padding:"12px 14px",borderRadius:12,border:`1px solid ${S[200]}`,
            background:S[50],fontSize:14,fontFamily:"inherit",outline:"none",color:S[800]}}/>
        <button onClick={()=>{if(newTask.trim()){onAddTask(dayKey,newTask.trim());setNewTask("");}}}
          style={{...btnPrimary,width:"auto",padding:"12px 18px",fontSize:20}}>+</button>
      </div>

      {complete&&(
        <div style={{background:E[50],border:`1px solid ${E[200]}`,borderRadius:14,
          padding:"14px",textAlign:"center"}}>
          <p style={{color:E[700],fontWeight:700,fontSize:14,margin:0}}>✅ Limpeza concluída!</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  GASTOS
// ═══════════════════════════════════════════════════════════════════
function GastosTab({expenses,onAdd,onDelete}){
  const [form,setForm]=useState({amount:"",type:"saída",desc:""});
  const [showForm,setShowForm]=useState(false);
  const amtRef=useRef();
  const today=new Date(),todayS=dateStr(today),month=todayS.slice(0,7);
  const weekStart=(()=>{const d=new Date(today);d.setDate(d.getDate()-d.getDay());return dateStr(d);})();
  const monthOut=expenses.filter(e=>e.type==="saída"&&e.date.startsWith(month)).reduce((s,e)=>s+e.amount,0);
  const monthIn=expenses.filter(e=>e.type==="entrada"&&e.date.startsWith(month)).reduce((s,e)=>s+e.amount,0);
  const weekOut=expenses.filter(e=>e.type==="saída"&&e.date>=weekStart).reduce((s,e)=>s+e.amount,0);
  const saldo=monthIn-monthOut;
  const submit=()=>{
    if(!form.amount)return;
    onAdd({id:Date.now(),amount:parseFloat(form.amount.replace(",",".")),type:form.type,description:form.desc,date:todayS});
    setForm({amount:"",type:"saída",desc:""});setShowForm(false);
  };

  return(
    <div style={{padding:"20px 16px 80px",display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:900,color:S[800],margin:0}}>Gastos</h1>
          <p style={{color:S[400],fontSize:13,margin:"3px 0 0"}}>Controlo financeiro</p>
        </div>
        <button onClick={()=>{setShowForm(true);setTimeout(()=>amtRef.current?.focus(),100);}} style={{
          ...btnPrimary,width:"auto",padding:"10px 18px",fontSize:13}}>+ Lançar</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {[{l:"Semana",v:weekOut,c:R[600]},{l:"Mês saída",v:monthOut,c:R[600]},{l:"Entrada",v:monthIn,c:E[600]}].map(s=>(
          <div key={s.l} style={{...card,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:9,color:S[400],fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:3}}>{s.l}</div>
            <div style={{fontSize:13,fontWeight:700,color:s.c}}>{curr(s.v)}</div>
          </div>
        ))}
      </div>

      <div style={{...card,display:"flex",justifyContent:"space-between",alignItems:"center",
        background:saldo>=0?E[50]:"#fef2f2",border:`1px solid ${saldo>=0?E[200]:R[200]}`}}>
        <span style={{fontSize:13,fontWeight:600,color:saldo>=0?E[700]:R[600]}}>Saldo do mês</span>
        <span style={{fontSize:20,fontWeight:900,color:saldo>=0?E[600]:R[600]}}>{curr(saldo)}</span>
      </div>

      {showForm&&(
        <div style={{...card,border:`1px solid ${E[200]}`}}>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {["saída","entrada"].map(t=>(
              <button key={t} onClick={()=>setForm(f=>({...f,type:t}))} style={{
                flex:1,padding:"10px",borderRadius:12,fontWeight:600,fontSize:13,cursor:"pointer",
                background:form.type===t?(t==="entrada"?E[600]:R[600]):S[100],
                color:form.type===t?"#fff":S[600],border:"none",fontFamily:"inherit"}}>
                {t==="entrada"?"+ Entrada":"− Saída"}
              </button>
            ))}
          </div>
          <input ref={amtRef} type="number" inputMode="decimal" placeholder="0,00"
            value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}
            onKeyDown={e=>e.key==="Enter"&&submit()}
            style={{width:"100%",border:"none",borderRadius:12,padding:12,fontSize:32,
              fontFamily:"inherit",fontWeight:800,textAlign:"center",outline:"none",
              marginBottom:10,background:S[50],color:S[800]}}/>
          <input placeholder="Descrição (opcional)" value={form.desc}
            onChange={e=>setForm(f=>({...f,desc:e.target.value}))}
            onKeyDown={e=>e.key==="Enter"&&submit()}
            style={{width:"100%",border:`1px solid ${S[200]}`,borderRadius:12,padding:"10px 13px",
              fontSize:14,fontFamily:"inherit",outline:"none",marginBottom:12,background:S[50],color:S[800]}}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setShowForm(false)} style={{...btnSecondary,flex:1}}>Cancelar</button>
            <button onClick={submit} style={{...btnPrimary,flex:2}}>Salvar</button>
          </div>
        </div>
      )}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {expenses.slice(0,40).map(e=>(
          <div key={e.id} style={{...card,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,flexShrink:0,
              background:e.type==="entrada"?E[100]:"#fecaca",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:14,fontWeight:700,color:e.type==="entrada"?E[700]:R[600]}}>
              {e.type==="entrada"?"+":"−"}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600,color:S[800],overflow:"hidden",
                textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                {e.description||(e.type==="entrada"?"Entrada":"Saída")}
              </div>
              <div style={{fontSize:12,color:S[400]}}>{e.date}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:700,color:e.type==="entrada"?E[600]:R[600]}}>{curr(e.amount)}</div>
              <button onClick={()=>onDelete(e.id)} style={{fontSize:11,color:S[300],background:"none",
                border:"none",cursor:"pointer",fontFamily:"inherit"}}>remover</button>
            </div>
          </div>
        ))}
        {expenses.length===0&&(
          <div style={{textAlign:"center",padding:"32px 0",color:S[400]}}>
            <p style={{fontSize:40,marginBottom:8}}>💰</p>
            <p style={{fontSize:14,fontWeight:600,margin:0}}>Nenhum lançamento ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ROTINA — DayView
// ═══════════════════════════════════════════════════════════════════
function DayView({dayKey,schedule,onBlockTap,onAddBlock}){
  const dayData=schedule[dayKey];if(!dayData)return null;
  const todayKey=getTodayKey(),isToday=dayKey===todayKey,nowMins=getNowMins();
  let activeIdx=-1;
  if(isToday)dayData.blocks.forEach((b,i)=>{const s=parseStartMins(b.time);if(s!==null&&s<=nowMins)activeIdx=i;});

  return(
    <div style={{padding:"16px 16px 80px"}}>
      <div style={{borderLeft:`3px solid ${dayData.badgeBorder}`,background:dayData.badgeBg,
        borderRadius:"0 12px 12px 0",padding:"12px 16px",marginBottom:16}}>
        <div style={{fontSize:10,fontWeight:700,color:dayData.badgeBorder,
          textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>Destaque do dia</div>
        <div style={{fontSize:14,fontWeight:600,color:dayData.badgeText,lineHeight:1.4}}>{dayData.badge}</div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {dayData.blocks.map((block,i)=>{
          const cat=CAT_BLOCK[block.c]||CAT_BLOCK.descanso;
          const isActive=i===activeIdx,isPast=isToday&&i<activeIdx,hasMod=!!CAT_MODULE[block.c];
          return(
            <button key={block.id} onClick={()=>onBlockTap(block)} style={{
              display:"flex",alignItems:"flex-start",gap:10,
              background:isActive?cat.bg:"#fff",
              borderLeft:`3px solid ${isActive?cat.border:isPast?"#e2e8f0":cat.border+"88"}`,
              borderRadius:"0 12px 12px 0",padding:"11px 13px",
              opacity:isPast?0.45:1,cursor:"pointer",
              boxShadow:isActive?"0 2px 12px rgba(0,0,0,0.08)":"0 1px 4px rgba(0,0,0,0.04)",
              border:`none`,borderLeft:`3px solid ${isActive?cat.border:isPast?"#e2e8f0":cat.border+"88"}`,
              width:"100%",textAlign:"left",
            }}>
              <div style={{fontSize:10,fontWeight:700,color:isActive?cat.border:S[400],
                letterSpacing:0.3,whiteSpace:"nowrap",paddingTop:2,minWidth:68}}>{block.time}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,color:isActive?cat.text:S[700],
                  fontWeight:isActive?600:500,lineHeight:1.4}}>{block.desc}</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginTop:3}}>
                  <span style={{fontSize:10,color:isActive?cat.border:S[400],
                    fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{cat.label}</span>
                  {hasMod&&<span style={{fontSize:10,color:cat.border,fontWeight:700}}>— abrir →</span>}
                </div>
              </div>
              {isActive&&<div style={{fontSize:9,fontWeight:800,color:cat.border,
                border:`1px solid ${cat.border}`,borderRadius:99,
                padding:"2px 7px",flexShrink:0,letterSpacing:0.5,textTransform:"uppercase"}}>agora</div>}
            </button>
          );
        })}
      </div>

      <button onClick={onAddBlock} style={{display:"block",width:"100%",marginTop:12,padding:"12px",
        borderRadius:12,border:`1.5px dashed ${S[300]}`,background:"transparent",
        color:S[400],fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
        + Adicionar bloco
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  MODAIS
// ═══════════════════════════════════════════════════════════════════
function AlarmModal({alarm,onSave,onClose}){
  const[time,setTime]=useState(alarm||"07:00");
  const[active,setActive]=useState(!!alarm);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:440,padding:"24px 20px 44px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div><h3 style={{margin:0,fontSize:17,fontWeight:700,color:S[800]}}>Alarme matinal</h3>
            <p style={{margin:"3px 0 0",fontSize:13,color:S[400]}}>Toca todos os dias no horário</p></div>
          <button onClick={onClose} style={{background:S[100],border:"none",borderRadius:99,
            width:32,height:32,cursor:"pointer",fontSize:15,color:S[500]}}>✕</button>
        </div>
        <input type="time" value={time} onChange={e=>setTime(e.target.value)}
          style={{width:"100%",border:"none",borderRadius:14,padding:"16px",fontSize:40,
            fontWeight:700,textAlign:"center",fontFamily:"inherit",color:S[800],
            background:S[50],outline:"none",marginBottom:16,letterSpacing:2}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"12px 14px",background:S[50],borderRadius:12,marginBottom:16}}>
          <span style={{fontSize:14,fontWeight:600,color:S[700]}}>Alarme ativado</span>
          <button onClick={()=>setActive(a=>!a)} style={{
            width:46,height:25,borderRadius:99,border:"none",cursor:"pointer",
            background:active?E[600]:S[300],transition:"background 0.2s",position:"relative"}}>
            <span style={{position:"absolute",top:2.5,left:active?22:2.5,width:20,height:20,
              borderRadius:99,background:"#fff",transition:"left 0.2s",
              boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
          </button>
        </div>
        <button onClick={()=>onSave(active?time:null)} style={btnPrimary}>Salvar</button>
      </div>
    </div>
  );
}

function InfoPanel({block,onEdit,onClose}){
  const cat=CAT_BLOCK[block.c]||CAT_BLOCK.descanso;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.3)",zIndex:100,
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:440,padding:"20px 20px 40px"}}>
        <div style={{width:32,height:4,background:S[200],borderRadius:99,margin:"0 auto 16px"}}/>
        <div style={{borderLeft:`3px solid ${cat.border}`,paddingLeft:14,marginBottom:16}}>
          <div style={{fontSize:10,fontWeight:700,color:cat.border,textTransform:"uppercase",
            letterSpacing:1,marginBottom:4}}>{cat.label} · {block.time}</div>
          <p style={{margin:0,fontSize:15,color:S[700],lineHeight:1.6,fontWeight:500}}>{block.desc}</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>onEdit(block)} style={{...btnSecondary,flex:1}}>Editar</button>
          <button onClick={onClose} style={{...btnPrimary,flex:2}}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

function EditBlockModal({block,dayKey,onSave,onDelete,onClose}){
  const[desc,setDesc]=useState(block.desc);const[time,setTime]=useState(block.time);const[cat,setCat]=useState(block.c);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:440,
        padding:"22px 20px 44px",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{margin:0,fontSize:17,fontWeight:700,color:S[800]}}>Editar bloco</h3>
          <button onClick={onClose} style={{background:S[100],border:"none",borderRadius:99,
            width:32,height:32,cursor:"pointer",fontSize:15}}>✕</button>
        </div>
        {[["Horário",time,setTime],["Descrição",desc,setDesc]].map(([label,val,setVal])=>(
          <div key={label} style={{marginBottom:12}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:S[500],
              textTransform:"uppercase",letterSpacing:0.8,marginBottom:4}}>{label}</label>
            <input value={val} onChange={e=>setVal(e.target.value)}
              style={{width:"100%",border:`1px solid ${S[200]}`,borderRadius:11,padding:"11px 13px",
                fontSize:14,fontFamily:"inherit",outline:"none",background:S[50],color:S[800]}}/>
          </div>
        ))}
        <label style={{display:"block",fontSize:11,fontWeight:600,color:S[500],
          textTransform:"uppercase",letterSpacing:0.8,marginBottom:8}}>Categoria</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:18}}>
          {Object.entries(CAT_BLOCK).map(([k,v])=>(
            <button key={k} onClick={()=>setCat(k)} style={{
              padding:"6px 12px",borderRadius:99,cursor:"pointer",fontSize:11,fontWeight:600,
              border:`1.5px solid ${cat===k?v.border:S[200]}`,
              background:cat===k?v.bg:"transparent",color:cat===k?v.text:S[500],fontFamily:"inherit"}}>
              {v.label}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>onDelete(dayKey,block.id)} style={{
            padding:"12px 14px",borderRadius:11,border:`1px solid ${R[200]}`,
            background:"#fef2f2",color:R[600],fontWeight:600,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
            Excluir
          </button>
          <button onClick={()=>onSave(dayKey,block.id,{desc,time,c:cat})} style={{...btnPrimary,flex:1}}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

function AddBlockModal({dayKey,onAdd,onClose}){
  const[desc,setDesc]=useState("");const[time,setTime]=useState("");const[cat,setCat]=useState("trabalho");
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:200,
      display:"flex",alignItems:"flex-end",justifyContent:"center"}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:440,
        padding:"22px 20px 44px",maxHeight:"85vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{margin:0,fontSize:17,fontWeight:700,color:S[800]}}>Novo bloco</h3>
          <button onClick={onClose} style={{background:S[100],border:"none",borderRadius:99,
            width:32,height:32,cursor:"pointer",fontSize:15}}>✕</button>
        </div>
        {[["Horário (ex: 14h – 15h)",time,setTime],["Descrição",desc,setDesc]].map(([ph,val,setVal])=>(
          <input key={ph} value={val} onChange={e=>setVal(e.target.value)} placeholder={ph}
            style={{display:"block",width:"100%",border:`1px solid ${S[200]}`,borderRadius:11,
              padding:"11px 13px",fontSize:14,fontFamily:"inherit",outline:"none",
              background:S[50],color:S[800],marginBottom:10}}/>
        ))}
        <label style={{display:"block",fontSize:11,fontWeight:600,color:S[500],
          textTransform:"uppercase",letterSpacing:0.8,marginBottom:8}}>Categoria</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:18}}>
          {Object.entries(CAT_BLOCK).map(([k,v])=>(
            <button key={k} onClick={()=>setCat(k)} style={{
              padding:"6px 12px",borderRadius:99,cursor:"pointer",fontSize:11,fontWeight:600,
              border:`1.5px solid ${cat===k?v.border:S[200]}`,
              background:cat===k?v.bg:"transparent",color:cat===k?v.text:S[500],fontFamily:"inherit"}}>
              {v.label}
            </button>
          ))}
        </div>
        <button onClick={()=>{if(!desc.trim())return;onAdd(dayKey,{id:"u"+Date.now(),time:time||"–",c:cat,desc:desc.trim()});onClose();}}
          style={btnPrimary}>Adicionar</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  ESTUDO BÍBLICO — 4 secções
// ═══════════════════════════════════════════════════════════════════
const P = { 50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",
            400:"#c084fc",500:"#a855f7",600:"#9333ea",700:"#7e22ce",800:"#6b21a8" };

async function callClaude(prompt,max=1200){
  const apiKey=import.meta.env.VITE_ANTHROPIC_API_KEY||"";
  const res=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:max,
      messages:[{role:"user",content:prompt}]})
  });
  const data=await res.json();
  return data.content?.map(c=>c.text||"").join("\n")||"Sem resposta.";
}

function AiText({text}){
  if(!text)return null;
  return(
    <div>
      {text.split("\n").map((line,i)=>{
        if(!line.trim())return<div key={i} style={{height:6}}/>;
        const bold=/^\*\*(.+)\*\*$/.test(line);
        const header=line.startsWith("##")||line.startsWith("###");
        const bullet=line.startsWith("-")||line.startsWith("•");
        const num=/^\d+\./.test(line);
        if(bold||header)return<p key={i} style={{fontWeight:700,color:S[800],margin:"10px 0 3px",fontSize:14}}>{line.replace(/\*\*/g,"").replace(/#+\s/,"")}</p>;
        if(bullet)return(
          <div key={i} style={{display:"flex",gap:8,padding:"4px 0"}}>
            <span style={{color:P[500],fontWeight:700,flexShrink:0}}>•</span>
            <span style={{fontSize:13,color:S[700],lineHeight:1.5}}>{line.replace(/^[-•]\s*/,"")}</span>
          </div>);
        if(num)return<p key={i} style={{fontSize:13,color:S[700],margin:"4px 0 4px 12px",lineHeight:1.5}}>{line}</p>;
        return<p key={i} style={{fontSize:13,color:S[700],margin:"2px 0",lineHeight:1.6}}>{line}</p>;
      })}
    </div>
  );
}

function LoadingSpinner({msg}){
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"32px 0",gap:12}}>
      <div style={{width:32,height:32,border:`4px solid ${P[200]}`,borderTopColor:P[500],
        borderRadius:99,animation:"spin 0.8s linear infinite"}}/>
      <p style={{color:S[500],fontSize:13,margin:0}}>{msg||"A analisar…"}</p>
    </div>
  );
}

// ─── 1. Estudo Profundo ───────────────────────────────────────────
function EstudoProfundo(){
  const [passage,setPassage]=useState("");
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);

  async function analisar(){
    if(!passage.trim())return;
    setLoading(true);setResult("");
    try{
      const r=await callClaude(
        `Você é um estudioso das Escrituras que analisa a Bíblia com base no entendimento das Testemunhas de Jeová e das publicações da Sociedade Torre de Vigia.

Analise profundamente esta passagem ou tema bíblico: "${passage}"

Forneça uma análise estruturada com:
**🔍 Contexto da passagem**
Explique o contexto histórico e bíblico em que aparece.

**👤 Personagens e protagonistas**
Quem são, qual o papel, o que podemos aprender com eles.

**⏳ Importância na época**
Por que foi relevante para as pessoas daquele tempo.

**💎 Tesouros espirituais**
Lições e princípios que podemos extrair hoje para nossa vida e relacionamento com Jeová.

**🙏 Aplicação prática**
Como aplicar isso na vida diária como cristão dedicado.

**📖 Versículos relacionados**
2-3 textos complementares que enriquecem o estudo.

Seja preciso, profundo mas direto. Use linguagem acessível e edificante.`,1400);
      setResult(r);
    }catch(e){setResult("Erro ao analisar. Verifique sua conexão.");}
    finally{setLoading(false);}
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={card}>
        <p style={{fontWeight:700,color:S[700],fontSize:14,margin:"0 0 10px"}}>
          📖 Passagem ou tema para estudar
        </p>
        <textarea value={passage} onChange={e=>setPassage(e.target.value)}
          placeholder="Ex: João 17:3 · Salmo 83:18 · O dilúvio de Noé · A fé de Abraão…" rows={3}
          style={{width:"100%",padding:"11px 12px",borderRadius:12,border:`1px solid ${S[200]}`,
            background:S[50],resize:"none",fontSize:13,color:S[800],outline:"none",
            fontFamily:"inherit",marginBottom:10}}/>
        <button onClick={analisar} disabled={loading||!passage.trim()} style={{
          ...btnPrimary,background:loading||!passage.trim()?S[300]:P[600],
          cursor:loading||!passage.trim()?"not-allowed":"pointer"}}>
          {loading?<><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",
            borderTopColor:"#fff",borderRadius:99,animation:"spin 0.8s linear infinite"}}/> A analisar…</>
            :<><span>🔍</span>Analisar passagem</>}
        </button>
      </div>
      {loading&&<div style={card}><LoadingSpinner msg="Buscando tesouros espirituais…"/></div>}
      {result&&<div style={{...card,borderLeft:`3px solid ${P[400]}`}}><AiText text={result}/></div>}
    </div>
  );
}

// ─── 2. Preparar Comentários ──────────────────────────────────────
function PrepararComentarios(){
  const [paragrafo,setParagrafo]=useState("");
  const [pergunta,setPergunta]=useState("");
  const [texto,setTexto]=useState("");
  const [resposta,setResposta]=useState("");
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);

  async function avaliar(){
    if(!pergunta.trim()||!resposta.trim())return;
    setLoading(true);setResult("");
    const words=resposta.trim().split(/\s+/).length;
    const estimatedSecs=Math.round(words*0.5);
    try{
      const r=await callClaude(
        `Você é um instrutor de comentários em reuniões cristãs das Testemunhas de Jeová, gentil e encorajador.

PARÁGRAFO DO ESTUDO:
"${paragrafo||"(não fornecido)"}"

PERGUNTA:
"${pergunta}"

${texto?`TEXTO BÍBLICO RELACIONADO: ${texto}\n\n`:""}RESPOSTA DA IRMÃ ELAINE (estimativa: ~${estimatedSecs} segundos):
"${resposta}"

Faça uma avaliação encorajadora e construtiva com:

**⏱️ Duração estimada**
${estimatedSecs} segundos — avalie se está dentro do ideal (15-45 segundos para um bom comentário de reunião).

**✅ O que ficou bom**
Destaque os pontos fortes da resposta dela.

**🎯 Responde à pergunta?**
Verifique se aborda diretamente o que foi perguntado.

**💡 Sugestão de melhoria**
Com base exatamente no que ela disse, sugira uma versão melhorada do comentário (mantenha a voz dela, apenas lapide).

**📝 Comentário sugerido**
Escreva a versão refinada entre aspas, como se ela fosse falar.

Seja sempre encorajador e positivo.`,1300);
      setResult(r);
    }catch(e){setResult("Erro ao avaliar. Verifique sua conexão.");}
    finally{setLoading(false);}
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={card}>
        <p style={{fontWeight:700,color:S[700],fontSize:14,margin:"0 0 12px"}}>
          🗒️ Preparar comentário
        </p>
        {[
          ["Parágrafo (opcional)",paragrafo,setParagrafo,3,"Cole o parágrafo da publicação…"],
          ["Pergunta",pergunta,setPergunta,2,"Cole a pergunta do parágrafo…"],
          ["Texto bíblico (opcional)",texto,setTexto,1,"Ex: João 3:16"],
        ].map(([label,val,setVal,rows,ph])=>(
          <div key={label} style={{marginBottom:10}}>
            <label style={{display:"block",fontSize:11,fontWeight:600,color:S[500],
              textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>{label}</label>
            <textarea value={val} onChange={e=>setVal(e.target.value)} placeholder={ph} rows={rows}
              style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${S[200]}`,
                background:S[50],resize:"none",fontSize:13,color:S[800],outline:"none",fontFamily:"inherit"}}/>
          </div>
        ))}
        <div style={{marginBottom:10}}>
          <label style={{display:"block",fontSize:11,fontWeight:600,color:S[500],
            textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>
            Minha resposta (como eu comentaria)
          </label>
          <textarea value={resposta} onChange={e=>setResposta(e.target.value)}
            placeholder="Escreva aqui como você responderia em voz alta na reunião…" rows={4}
            style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${P[300]}`,
              background:P[50],resize:"none",fontSize:13,color:S[800],outline:"none",fontFamily:"inherit"}}/>
        </div>
        <button onClick={avaliar} disabled={loading||!pergunta.trim()||!resposta.trim()} style={{
          ...btnPrimary,background:loading||!pergunta.trim()||!resposta.trim()?S[300]:P[600],
          cursor:loading||!pergunta.trim()||!resposta.trim()?"not-allowed":"pointer"}}>
          {loading?<><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",
            borderTopColor:"#fff",borderRadius:99,animation:"spin 0.8s linear infinite"}}/> A avaliar…</>
            :<><span>✨</span>Avaliar comentário</>}
        </button>
      </div>
      {loading&&<div style={card}><LoadingSpinner msg="Analisando seu comentário…"/></div>}
      {result&&<div style={{...card,borderLeft:`3px solid ${P[400]}`}}><AiText text={result}/></div>}
    </div>
  );
}

// ─── 3. Simulador de Ministério ───────────────────────────────────
function SimuladorMinisterio(){
  const [tema,setTema]=useState("");
  const [msgs,setMsgs]=useState([]); // {role:"morador"|"eu"|"sistema", text}
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [started,setStarted]=useState(false);
  const [feedback,setFeedback]=useState("");
  const [showFeedback,setShowFeedback]=useState(false);
  const bottomRef=useRef();

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  },[msgs]);

  async function iniciarSimulacao(){
    if(!tema.trim())return;
    setLoading(true);setMsgs([]);setFeedback("");setShowFeedback(false);
    try{
      const r=await callClaude(
        `Você é um simulador de ministério de campo das Testemunhas de Jeová. Crie um cenário realista de pregação.

TEMA/TEXTO para a visita: "${tema}"

Responda APENAS com a fala inicial do morador quando Elaine tocar a campainha. 
O morador deve ser uma pessoa comum, levemente curiosa ou um pouco relutante (varie os perfis: ocupado, interessado, cético amigável).
Escreva apenas a fala do morador, de 1-2 frases, como se fosse real.
NÃO escreva narração, apenas o diálogo direto do morador.`,400);
      setMsgs([{role:"morador",text:r.trim()}]);
      setStarted(true);
    }catch(e){setMsgs([{role:"sistema",text:"Erro ao iniciar simulação."}]);}
    finally{setLoading(false);}
  }

  async function responder(){
    if(!input.trim()||loading)return;
    const myText=input.trim(); setInput("");
    const newMsgs=[...msgs,{role:"eu",text:myText}];
    setMsgs(newMsgs);setLoading(true);
    try{
      const history=newMsgs.map(m=>`${m.role==="eu"?"Elaine":m.role==="morador"?"Morador":"Sistema"}: ${m.text}`).join("\n");
      const r=await callClaude(
        `Você é um simulador de ministério de campo das Testemunhas de Jeová. Tema: "${tema}"

Histórico da conversa:
${history}

Continue APENAS com a resposta do morador (1-3 frases naturais). Varie o nível de interesse. 
Se Elaine usou um texto bíblico, o morador pode pedir para ver ou fazer uma pergunta.
Se a conversa chegou a um momento natural de encerramento (após 4-6 trocas), o morador pode se despedir educadamente.
Escreva APENAS a fala do morador, sem narração.`,400);
      setMsgs(prev=>[...prev,{role:"morador",text:r.trim()}]);
    }catch(e){}
    finally{setLoading(false);}
  }

  async function pedirFeedback(){
    setShowFeedback(true);setLoading(true);
    const history=msgs.map(m=>`${m.role==="eu"?"Elaine":m.role==="morador"?"Morador":"Sistema"}: ${m.text}`).join("\n");
    try{
      const r=await callClaude(
        `Você é um instrutor de ministério das Testemunhas de Jeová, encorajador e experiente.

TEMA DA VISITA: "${tema}"
CONVERSA SIMULADA:
${history}

Avalie a performance de Elaine nesta simulação:

**👏 Pontos fortes**
O que ela fez muito bem na abordagem.

**💬 Clareza da mensagem**
A mensagem ficou clara? O tema foi bem introduzido?

**📖 Uso das Escrituras**
Ela usou textos bíblicos? Como poderia ser mais eficaz?

**🌱 Como melhorar**
1-2 sugestões práticas e específicas.

**✨ Como poderia ter respondido melhor**
Reescreva 1 fala de Elaine que poderia ter sido mais impactante, mantendo a simplicidade.

Seja sempre encorajador — o ministério se aprende na prática!`,1200);
      setFeedback(r);
    }catch(e){setFeedback("Erro ao gerar feedback.");}
    finally{setLoading(false);}
  }

  if(!started){
    return(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={card}>
          <p style={{fontWeight:700,color:S[700],fontSize:14,margin:"0 0 10px"}}>
            🏠 Simulador de Ministério
          </p>
          <p style={{fontSize:13,color:S[500],margin:"0 0 14px",lineHeight:1.5}}>
            Pratica uma conversa real de pregação. A IA fará o papel do morador e avaliará sua apresentação.
          </p>
          <label style={{display:"block",fontSize:11,fontWeight:600,color:S[500],
            textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>
            Tema ou texto bíblico
          </label>
          <textarea value={tema} onChange={e=>setTema(e.target.value)} rows={2}
            placeholder="Ex: Salmo 37:29 · O que é o Reino de Deus? · Por que há sofrimento?"
            style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${S[200]}`,
              background:S[50],resize:"none",fontSize:13,color:S[800],outline:"none",
              fontFamily:"inherit",marginBottom:12}}/>
          <button onClick={iniciarSimulacao} disabled={loading||!tema.trim()} style={{
            ...btnPrimary,background:loading||!tema.trim()?S[300]:E[600],
            cursor:loading||!tema.trim()?"not-allowed":"pointer"}}>
            {loading?<><div style={{width:16,height:16,border:"2px solid rgba(255,255,255,0.4)",
              borderTopColor:"#fff",borderRadius:99,animation:"spin 0.8s linear infinite"}}/> A criar cenário…</>
              :<><span>🚪</span>Iniciar simulação</>}
          </button>
        </div>
        <div style={{...card,background:E[50],border:`1px solid ${E[200]}`}}>
          <p style={{fontSize:12,color:E[700],fontWeight:600,margin:"0 0 4px"}}>💡 Como funciona</p>
          <p style={{fontSize:12,color:E[700],lineHeight:1.6,margin:0}}>
            A IA vai simular um morador real. Você responde como responderia na pregação. 
            No final, recebe um feedback completo da sua apresentação.
          </p>
        </div>
      </div>
    );
  }

  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 180px)"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0 10px",flexShrink:0}}>
        <button onClick={()=>{setStarted(false);setMsgs([]);setFeedback("");setShowFeedback(false);}} style={{
          background:S[100],border:"none",borderRadius:99,width:32,height:32,
          cursor:"pointer",fontSize:15,color:S[600]}}>‹</button>
        <div style={{flex:1}}>
          <p style={{fontSize:12,fontWeight:700,color:S[700],margin:0}}>Simulação em curso</p>
          <p style={{fontSize:11,color:S[400],margin:0}}>Tema: {tema}</p>
        </div>
        <button onClick={pedirFeedback} disabled={loading||showFeedback||msgs.length<2} style={{
          fontSize:11,color:"#fff",fontWeight:700,background:msgs.length<2?S[300]:P[600],
          padding:"6px 12px",borderRadius:99,border:"none",cursor:"pointer"}}>
          📊 Feedback
        </button>
      </div>

      {/* Chat */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:10,paddingBottom:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{
            display:"flex",justifyContent:m.role==="eu"?"flex-end":"flex-start",
          }}>
            <div style={{
              maxWidth:"82%",padding:"10px 14px",borderRadius:16,
              background:m.role==="eu"?E[500]:m.role==="morador"?"#fff":S[100],
              color:m.role==="eu"?"#fff":S[800],
              borderBottomRightRadius:m.role==="eu"?4:16,
              borderBottomLeftRadius:m.role==="morador"?4:16,
              boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
            }}>
              <p style={{fontSize:11,fontWeight:700,margin:"0 0 4px",
                color:m.role==="eu"?"rgba(255,255,255,0.75)":S[400]}}>
                {m.role==="eu"?"Você (Elaine)":"🏠 Morador"}
              </p>
              <p style={{fontSize:13,margin:0,lineHeight:1.5}}>{m.text}</p>
            </div>
          </div>
        ))}
        {loading&&!showFeedback&&(
          <div style={{display:"flex",justifyContent:"flex-start"}}>
            <div style={{background:"#fff",padding:"12px 16px",borderRadius:16,borderBottomLeftRadius:4,
              boxShadow:"0 1px 4px rgba(0,0,0,0.06)"}}>
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                {[0,1,2].map(n=>(
                  <div key={n} style={{width:7,height:7,borderRadius:99,background:S[300],
                    animation:`bounce 1s ease ${n*0.15}s infinite`}}/>
                ))}
              </div>
            </div>
          </div>
        )}
        {showFeedback&&(
          <div style={{...card,borderLeft:`3px solid ${P[400]}`,marginTop:8}}>
            <p style={{fontWeight:700,color:P[700],fontSize:14,margin:"0 0 10px"}}>📊 Avaliação da simulação</p>
            {loading?<LoadingSpinner msg="A avaliar sua pregação…"/>:<AiText text={feedback}/>}
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input */}
      {!showFeedback&&(
        <div style={{display:"flex",gap:8,paddingTop:8,flexShrink:0}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} rows={2}
            placeholder="Escreva sua resposta ao morador…"
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();responder();}}}
            style={{flex:1,padding:"10px 12px",borderRadius:12,border:`1px solid ${S[200]}`,
              background:"#fff",resize:"none",fontSize:13,color:S[800],outline:"none",fontFamily:"inherit"}}/>
          <button onClick={responder} disabled={loading||!input.trim()} style={{
            background:loading||!input.trim()?S[300]:E[600],color:"#fff",border:"none",
            borderRadius:12,padding:"0 16px",fontWeight:700,fontSize:18,cursor:"pointer",flexShrink:0}}>→</button>
        </div>
      )}
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}`}</style>
    </div>
  );
}

// ─── 4. Diário Espiritual ─────────────────────────────────────────
function DiarioEspiritual(){
  const [entries,setEntries]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [selected,setSelected]=useState(null);
  const [form,setForm]=useState({ref:"",aprendizado:"",aplicacao:"",jeova:"",ideias:""});
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    stor.get("nt_diario",[]).then(d=>{setEntries(d);setLoaded(true);});
  },[]);

  const saveEntry=async()=>{
    if(!form.ref.trim()&&!form.aprendizado.trim())return;
    const e={id:Date.now(),date:new Date().toLocaleDateString("pt-BR"),
      ref:form.ref,aprendizado:form.aprendizado,
      aplicacao:form.aplicacao,jeova:form.jeova,ideias:form.ideias};
    const next=[e,...entries];
    setEntries(next);await stor.set("nt_diario",next);
    setForm({ref:"",aprendizado:"",aplicacao:"",jeova:"",ideias:""});
    setShowForm(false);
  };

  const deleteEntry=async(id)=>{
    const next=entries.filter(e=>e.id!==id);
    setEntries(next);await stor.set("nt_diario",next);
    setSelected(null);
  };

  if(selected){
    const e=entries.find(x=>x.id===selected);if(!e)return null;
    return(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setSelected(null)} style={{
            background:S[100],border:"none",borderRadius:99,width:32,height:32,
            cursor:"pointer",fontSize:15,color:S[600]}}>‹</button>
          <div style={{flex:1}}>
            <p style={{fontWeight:800,color:S[800],fontSize:15,margin:0}}>{e.ref||"Entrada"}</p>
            <p style={{fontSize:11,color:S[400],margin:0}}>{e.date}</p>
          </div>
          <button onClick={()=>deleteEntry(e.id)} style={{
            fontSize:11,color:R[500],background:"#fef2f2",border:`1px solid ${R[200]}`,
            padding:"5px 10px",borderRadius:99,cursor:"pointer"}}>Excluir</button>
        </div>
        {[
          ["📚 Referência / Tema",e.ref],
          ["💎 Principal aprendizado",e.aprendizado],
          ["🌱 Como aplicar na prática",e.aplicacao],
          ["🙏 O que me ensina sobre Jeová",e.jeova],
          ["💡 Ideias para comentários / textos relacionados",e.ideias],
        ].filter(([,v])=>v).map(([label,val])=>(
          <div key={label} style={{...card,borderLeft:`3px solid ${P[400]}`}}>
            <p style={{fontSize:11,fontWeight:700,color:P[600],textTransform:"uppercase",
              letterSpacing:0.5,margin:"0 0 6px"}}>{label}</p>
            <p style={{fontSize:14,color:S[700],lineHeight:1.6,margin:0}}>{val}</p>
          </div>
        ))}
      </div>
    );
  }

  if(showForm){
    return(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setShowForm(false)} style={{
            background:S[100],border:"none",borderRadius:99,width:32,height:32,
            cursor:"pointer",fontSize:15,color:S[600]}}>‹</button>
          <p style={{fontWeight:800,color:S[800],fontSize:15,margin:0}}>Nova entrada</p>
        </div>
        <div style={card}>
          {[
            ["📚 Referência / Tema","ref","Ex: João 17:3 · O Nome de Jeová · Fé de Abraão",1],
            ["💎 Principal aprendizado","aprendizado","O que você aprendeu neste estudo?",4],
            ["🌱 Como aplicar na prática","aplicacao","Como você vai aplicar isso na sua vida?",3],
            ["🙏 O que me ensina sobre Jeová","jeova","Que qualidade de Jeová isso revela?",3],
            ["💡 Ideias para comentários / versículos relacionados","ideias","Outros textos, insights, ideias…",3],
          ].map(([label,field,ph,rows])=>(
            <div key={field} style={{marginBottom:12}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:S[500],
                textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>{label}</label>
              <textarea value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))}
                placeholder={ph} rows={rows}
                style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${S[200]}`,
                  background:S[50],resize:"none",fontSize:13,color:S[800],outline:"none",fontFamily:"inherit"}}/>
            </div>
          ))}
          <button onClick={saveEntry} style={{...btnPrimary,background:P[600]}}>
            💾 Guardar entrada
          </button>
        </div>
      </div>
    );
  }

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <p style={{fontWeight:800,color:S[800],fontSize:16,margin:0}}>Diário Espiritual</p>
          <p style={{fontSize:12,color:S[400],margin:"2px 0 0"}}>{entries.length} {entries.length===1?"entrada":"entradas"}</p>
        </div>
        <button onClick={()=>setShowForm(true)} style={{...btnPrimary,width:"auto",padding:"9px 16px",
          fontSize:12,background:P[600]}}>+ Nova entrada</button>
      </div>

      {entries.length===0?(
        <div style={{textAlign:"center",padding:"40px 0"}}>
          <p style={{fontSize:40,marginBottom:10}}>📔</p>
          <p style={{fontWeight:700,color:S[600],fontSize:14,margin:0}}>Nenhuma entrada ainda</p>
          <p style={{fontSize:13,color:S[400],marginTop:6}}>Regista o que aprendeste nos teus estudos</p>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {entries.map(e=>(
            <button key={e.id} onClick={()=>setSelected(e.id)} style={{
              ...card,textAlign:"left",cursor:"pointer",width:"100%",
              display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",
            }}>
              <div style={{width:38,height:38,borderRadius:10,background:P[100],flexShrink:0,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📖</div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:14,fontWeight:700,color:S[800],margin:"0 0 2px",
                  overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {e.ref||"Entrada sem título"}
                </p>
                <p style={{fontSize:12,color:S[400],margin:"0 0 4px"}}>{e.date}</p>
                {e.aprendizado&&(
                  <p style={{fontSize:12,color:S[600],margin:0,overflow:"hidden",
                    textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.aprendizado}</p>
                )}
              </div>
              <span style={{color:S[300],fontSize:18,flexShrink:0}}>›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── EstudoTab (container com sub-abas) ───────────────────────────
function EstudoTab(){
  const [sec,setSec]=useState("estudo");
  const SECS=[
    {id:"estudo",   label:"Estudo",     emoji:"🔍"},
    {id:"coment",   label:"Comentários",emoji:"🗒️"},
    {id:"minist",   label:"Ministério", emoji:"🏠"},
    {id:"diario",   label:"Diário",     emoji:"📔"},
  ];
  return(
    <div style={{paddingBottom:80}}>
      {/* Sub-nav horizontal */}
      <div style={{display:"flex",gap:6,padding:"14px 16px 10px",
        overflowX:"auto",scrollbarWidth:"none"}}>
        {SECS.map(s=>(
          <button key={s.id} onClick={()=>setSec(s.id)} style={{
            flexShrink:0,display:"flex",alignItems:"center",gap:5,
            padding:"7px 14px",borderRadius:99,border:"none",cursor:"pointer",
            background:sec===s.id?P[600]:"#fff",
            color:sec===s.id?"#fff":S[500],
            fontSize:12,fontWeight:sec===s.id?700:500,
            boxShadow:sec===s.id?"none":"0 1px 4px rgba(0,0,0,0.06)",
          }}>
            <span>{s.emoji}</span><span>{s.label}</span>
          </button>
        ))}
      </div>
      <div style={{padding:"0 16px"}}>
        {sec==="estudo"&&<EstudoProfundo/>}
        {sec==="coment"&&<PrepararComentarios/>}
        {sec==="minist"&&<SimuladorMinisterio/>}
        {sec==="diario"&&<DiarioEspiritual/>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  SAÚDE — Ciclo menstrual + Medicação
// ═══════════════════════════════════════════════════════════════════
const ROSA={50:"#fdf2f8",100:"#fce7f3",200:"#fbcfe8",300:"#f9a8d4",
            400:"#f472b6",500:"#ec4899",600:"#db2777",700:"#be185d"};

function SaudeTab({saudeData,onSave}){
  const[sec,setSec]=useState("ciclo");
  const[data,setData]=useState(saudeData||{});
  const save=async(next)=>{setData(next);onSave(next);};
  const SECS=[{id:"ciclo",label:"Ciclo",emoji:"🌙"},{id:"meds",label:"Medicação",emoji:"💊"}];

  function CicloSection(){
    const[lastPeriod,setLastPeriod]=useState(data.lastPeriod||"");
    const[cycleLen,setCycleLen]=useState(data.cycleLen||28);
    const[periLen,setPeriLen]=useState(data.periLen||5);
    const[logs,setLogs]=useState(data.cycleLogs||[]);
    const[symptom,setSymptom]=useState("");
    const[logDate,setLogDate]=useState(new Date().toISOString().split("T")[0]);
    const[logType,setLogType]=useState("início");
    let nextPeriod=null,ovulDay=null,phase="",daysToNext=null,cycleDay=null;
    if(lastPeriod){
      const lp=new Date(lastPeriod+"T12:00:00");
      const today=new Date();today.setHours(12,0,0,0);
      cycleDay=Math.floor((today-lp)/86400000)+1;
      const cyclePos=((cycleDay-1)%cycleLen)+1;
      const np=new Date(lp);
      while(np<=today)np.setDate(np.getDate()+cycleLen);
      nextPeriod=np;daysToNext=Math.ceil((np-today)/86400000);
      ovulDay=new Date(np);ovulDay.setDate(ovulDay.getDate()-14);
      const daysToOv=Math.ceil((ovulDay-today)/86400000);
      if(cyclePos<=periLen)phase="🔴 Menstruação";
      else if(daysToOv>0&&daysToOv<=5)phase="🌸 Pré-ovulação";
      else if(daysToOv>=0&&daysToOv<=1)phase="🥚 Ovulação";
      else if(cyclePos>cycleLen-7)phase="🌕 Pré-menstrual (TPM)";
      else phase="🌿 Fase folicular";
    }
    async function addLog(){
      if(!logDate)return;
      const l={id:Date.now(),date:logDate,type:logType,note:symptom};
      const nl=[l,...logs].sort((a,b)=>b.date.localeCompare(a.date));
      setLogs(nl);setSymptom("");
      save({...data,lastPeriod:logType==="início"?logDate:data.lastPeriod,
        cycleLen:parseInt(cycleLen),periLen:parseInt(periLen),cycleLogs:nl});
    }
    async function updateSettings(){
      save({...data,lastPeriod,cycleLen:parseInt(cycleLen),periLen:parseInt(periLen)});
    }
    return(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {lastPeriod&&(
          <div style={{...card,background:`linear-gradient(135deg,${ROSA[50]},#fff)`,border:`1px solid ${ROSA[200]}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <p style={{fontSize:11,fontWeight:700,color:S[400],textTransform:"uppercase",letterSpacing:0.8,margin:"0 0 4px"}}>Fase atual</p>
                <p style={{fontSize:18,fontWeight:900,color:ROSA[700],margin:0}}>{phase}</p>
              </div>
              <div style={{textAlign:"center",background:ROSA[100],borderRadius:12,padding:"10px 14px"}}>
                <p style={{fontSize:26,fontWeight:900,color:ROSA[600],margin:0,lineHeight:1}}>{daysToNext}</p>
                <p style={{fontSize:9,color:ROSA[500],fontWeight:600,margin:"2px 0 0"}}>dias p/ próx.</p>
              </div>
            </div>
            <div style={{marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:S[400],marginBottom:4}}>
                <span>Dia {Math.min(cycleDay,cycleLen)} de {cycleLen}</span>
                <span>Próx. {nextPeriod?.toLocaleDateString("pt-BR",{day:"numeric",month:"short"})}</span>
              </div>
              <div style={{height:8,background:S[100],borderRadius:99,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:99,width:`${Math.min(100,(cycleDay/cycleLen)*100)}%`,
                  background:`linear-gradient(90deg,${ROSA[400]},${ROSA[600]})`}}/>
              </div>
            </div>
            <span style={{fontSize:11,color:S[500]}}>🥚 Ovulação: {ovulDay?.toLocaleDateString("pt-BR",{day:"numeric",month:"short"})}</span>
          </div>
        )}
        <div style={card}>
          <p style={{fontWeight:700,color:S[700],fontSize:13,margin:"0 0 12px"}}>Configurar ciclo</p>
          <div style={{marginBottom:10}}>
            <label style={{display:"block",fontSize:10,fontWeight:600,color:S[500],textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>Data da última menstruação</label>
            <input type="date" value={lastPeriod} onChange={e=>setLastPeriod(e.target.value)}
              style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${S[200]}`,background:S[50],fontSize:14,fontFamily:"inherit",outline:"none",color:S[800]}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[["Duração do ciclo",cycleLen,setCycleLen],["Duração do período",periLen,setPeriLen]].map(([label,val,setVal])=>(
              <div key={label}>
                <label style={{display:"block",fontSize:10,fontWeight:600,color:S[500],textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{label}</label>
                <input type="number" value={val} min="1" max="45" onChange={e=>setVal(e.target.value)}
                  style={{width:"100%",padding:"10px",borderRadius:12,border:`1px solid ${S[200]}`,background:S[50],fontSize:16,fontWeight:700,textAlign:"center",fontFamily:"inherit",outline:"none",color:S[800]}}/>
              </div>
            ))}
          </div>
          <button onClick={updateSettings} style={{...btnPrimary,background:ROSA[600]}}>Guardar configurações</button>
        </div>
        <div style={card}>
          <p style={{fontWeight:700,color:S[700],fontSize:13,margin:"0 0 10px"}}>Registar evento</p>
          <input type="date" value={logDate} onChange={e=>setLogDate(e.target.value)}
            style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${S[200]}`,background:S[50],fontSize:14,fontFamily:"inherit",outline:"none",color:S[800],marginBottom:8}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
            {["início","fim","cólica","TPM","manchas","outros"].map(t=>(
              <button key={t} onClick={()=>setLogType(t)} style={{padding:"6px 14px",borderRadius:99,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:logType===t?ROSA[500]:S[100],color:logType===t?"#fff":S[600]}}>{t}</button>
            ))}
          </div>
          <input value={symptom} onChange={e=>setSymptom(e.target.value)} placeholder="Nota opcional…"
            style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${S[200]}`,background:S[50],fontSize:13,fontFamily:"inherit",outline:"none",color:S[800],marginBottom:10}}/>
          <button onClick={addLog} style={{...btnPrimary,background:ROSA[600]}}>+ Registar</button>
        </div>
        {logs.length>0&&(
          <div style={card}>
            <p style={{fontWeight:700,color:S[700],fontSize:13,margin:"0 0 10px"}}>Histórico</p>
            {logs.slice(0,15).map(l=>(
              <div key={l.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${S[50]}`}}>
                <span style={{fontSize:20}}>{l.type==="início"?"🔴":l.type==="fim"?"⚪":l.type==="cólica"?"😣":l.type==="TPM"?"😰":l.type==="manchas"?"🟡":"📝"}</span>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:600,color:S[800],margin:0,textTransform:"capitalize"}}>{l.type}</p>
                  <p style={{fontSize:11,color:S[400],margin:0}}>{l.date}{l.note?` · ${l.note}`:""}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  function MedicacaoSection(){
    const[meds,setMeds]=useState(data.meds||[]);
    const[medLogs,setMedLogs]=useState(data.medLogs||{});
    const[showAdd,setShowAdd]=useState(false);
    const[form,setForm]=useState({nome:"",dose:"",horarios:["08:00"],notas:""});
    const todayS=new Date().toISOString().split("T")[0];
    const todayLogs=medLogs[todayS]||{};
    const totalDoses=meds.reduce((s,m)=>s+m.horarios.length,0);
    const takenDoses=meds.reduce((s,m)=>s+m.horarios.filter(h=>todayLogs[`${m.id}_${h}`]).length,0);

    async function saveMed(){
      if(!form.nome.trim())return;
      const m={id:Date.now(),...form};const nm=[...meds,m];setMeds(nm);
      save({...data,meds:nm});setForm({nome:"",dose:"",horarios:["08:00"],notas:""});setShowAdd(false);
    }
    async function deleteMed(id){const nm=meds.filter(m=>m.id!==id);setMeds(nm);save({...data,meds:nm});}
    async function toggleDose(medId,horario){
      const key=`${medId}_${horario}`;
      const tl={...todayLogs,[key]:!todayLogs[key]};
      const nl={...medLogs,[todayS]:tl};setMedLogs(nl);save({...data,medLogs:nl});
    }

    return(
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <div style={{...card,background:"linear-gradient(135deg,#f0fdf4,#fff)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div>
              <p style={{fontSize:11,fontWeight:700,color:S[400],textTransform:"uppercase",letterSpacing:0.8,margin:"0 0 2px"}}>Medicação de hoje</p>
              <p style={{fontSize:20,fontWeight:900,color:S[800],margin:0}}>{takenDoses}/{totalDoses}<span style={{fontSize:12,fontWeight:500,color:S[400],marginLeft:6}}>doses</span></p>
            </div>
            {totalDoses>0&&takenDoses===totalDoses&&<span style={{fontSize:24}}>✅</span>}
          </div>
          {totalDoses>0&&(<div style={{height:6,background:S[100],borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${(takenDoses/totalDoses)*100}%`,background:E[500],borderRadius:99,transition:"width 0.4s"}}/>
          </div>)}
        </div>
        {meds.length>0&&(
          <div style={card}>
            <p style={{fontWeight:700,color:S[700],fontSize:13,margin:"0 0 10px"}}>Marcar doses de hoje</p>
            {meds.map(med=>(
              <div key={med.id} style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${S[50]}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <p style={{fontSize:14,fontWeight:700,color:S[800],margin:0}}>{med.nome}</p>
                    <p style={{fontSize:12,color:S[400],margin:"2px 0 0"}}>{med.dose}{med.notas?` · ${med.notas}`:""}</p>
                  </div>
                  <button onClick={()=>deleteMed(med.id)} style={{fontSize:12,color:S[400],background:"none",border:"none",cursor:"pointer"}}>✕</button>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {med.horarios.map(h=>{const key=`${med.id}_${h}`;const taken=!!todayLogs[key];return(
                    <button key={h} onClick={()=>toggleDose(med.id,h)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:12,border:`2px solid ${taken?E[400]:S[200]}`,background:taken?E[50]:"#fff",cursor:"pointer"}}>
                      <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${taken?E[500]:S[300]}`,background:taken?E[500]:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {taken&&<span style={{color:"#fff",fontSize:10,fontWeight:700}}>✓</span>}
                      </div>
                      <span style={{fontSize:13,fontWeight:600,color:taken?E[700]:S[600]}}>{h}</span>
                    </button>
                  );})}
                </div>
              </div>
            ))}
          </div>
        )}
        {showAdd?(
          <div style={card}>
            <p style={{fontWeight:700,color:S[700],fontSize:13,margin:"0 0 12px"}}>Novo medicamento</p>
            {[["Nome","nome","Ex: Levotiroxina"],["Dose","dose","Ex: 50mcg"]].map(([label,field,ph])=>(
              <div key={field} style={{marginBottom:10}}>
                <label style={{display:"block",fontSize:10,fontWeight:600,color:S[500],textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>{label}</label>
                <input value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} placeholder={ph}
                  style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${S[200]}`,background:S[50],fontSize:13,fontFamily:"inherit",outline:"none",color:S[800]}}/>
              </div>
            ))}
            <label style={{display:"block",fontSize:10,fontWeight:600,color:S[500],textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>Horários</label>
            {form.horarios.map((h,i)=>(
              <div key={i} style={{display:"flex",gap:8,marginBottom:6}}>
                <input type="time" value={h} onChange={e=>setForm(f=>({...f,horarios:f.horarios.map((v,j)=>j===i?e.target.value:v)}))}
                  style={{flex:1,padding:"9px 12px",borderRadius:12,border:`1px solid ${S[200]}`,background:S[50],fontSize:14,fontFamily:"inherit",outline:"none",color:S[800]}}/>
                {form.horarios.length>1&&<button onClick={()=>setForm(f=>({...f,horarios:f.horarios.filter((_,j)=>j!==i)}))} style={{width:36,borderRadius:10,border:"none",background:S[100],color:S[500],cursor:"pointer",fontSize:16}}>×</button>}
              </div>
            ))}
            <button onClick={()=>setForm(f=>({...f,horarios:[...f.horarios,"08:00"]}))} style={{...btnSecondary,marginBottom:10,fontSize:12,padding:"8px"}}>+ Horário</button>
            <div style={{marginBottom:10}}>
              <label style={{display:"block",fontSize:10,fontWeight:600,color:S[500],textTransform:"uppercase",letterSpacing:0.5,marginBottom:4}}>Notas (opcional)</label>
              <input value={form.notas} onChange={e=>setForm(f=>({...f,notas:e.target.value}))} placeholder="Ex: tomar em jejum"
                style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${S[200]}`,background:S[50],fontSize:13,fontFamily:"inherit",outline:"none",color:S[800]}}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setShowAdd(false)} style={{...btnSecondary,flex:1}}>Cancelar</button>
              <button onClick={saveMed} style={{...btnPrimary,flex:2}}>Guardar</button>
            </div>
          </div>
        ):(
          <button onClick={()=>setShowAdd(true)} style={{...card,border:`1.5px dashed ${S[300]}`,cursor:"pointer",textAlign:"center",color:S[500],fontWeight:600,fontSize:13,background:"transparent",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:16}}>
            <span>💊</span> Adicionar medicamento
          </button>
        )}
      </div>
    );
  }

  return(
    <div style={{paddingBottom:80}}>
      <div style={{display:"flex",gap:8,padding:"14px 16px 10px"}}>
        {SECS.map(s=>(
          <button key={s.id} onClick={()=>setSec(s.id)} style={{
            flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,
            padding:"10px",borderRadius:12,border:"none",cursor:"pointer",
            background:sec===s.id?ROSA[600]:"#fff",color:sec===s.id?"#fff":S[500],
            fontWeight:sec===s.id?700:500,fontSize:13,
            boxShadow:sec===s.id?"none":"0 1px 4px rgba(0,0,0,0.06)"}}>
            <span>{s.emoji}</span><span>{s.label}</span>
          </button>
        ))}
      </div>
      <div style={{padding:"0 16px"}}>
        {sec==="ciclo"&&<CicloSection/>}
        {sec==="meds"&&<MedicacaoSection/>}
      </div>
    </div>
  );
}

export default function App(){
  const today=new Date(),todayKey=getTodayKey(),todayS=todayStr();

  const[tab,setTab]=useState("rotina");
  const[cardapioTab,setCardapioTab]=useState("dashboard");
  const[activeDay,setActiveDay]=useState(todayKey);
  const[schedule,setSchedule]=useState(DEFAULT_SCHEDULE);
  const[alarm,setAlarm]=useState(null);
  const[alarmActive,setAlarmActive]=useState(false);
  const[showAlarmModal,setShowAlarmModal]=useState(false);
  const[cleanTasks,setCleanTasks]=useState(DEFAULT_CLEANING);
  const[cleanComp,setCleanComp]=useState({});
  const[expenses,setExpenses]=useState([]);
  // NutriTrack state
  const[selections,setSelections]=useState({}); // { date: { mealId: { groupId: item_label } } }
  const[hasBinge,setHasBinge]=useState(false);
  const[weekScores,setWeekScores]=useState({});
  const[rewards,setRewards]=useState([]);
  const[weekPlan,setWeekPlan]=useState({});
  const[saudeData,setSaudeData]=useState({});
  // UI state
  const[infoBlock,setInfoBlock]=useState(null);
  const[editBlock,setEditBlock]=useState(null);
  const[addingBlock,setAddingBlock]=useState(false);
  const[alarmBanner,setAlarmBanner]=useState(false);
  const[loaded,setLoaded]=useState(false);
  const firedRef=useRef(new Set());

  // Load
  useEffect(()=>{
    (async()=>{
      const[sc,al,alAct,ct,cc,ex,sel,binge,ws,wp,sd]=await Promise.all([
        stor.get("nt_sched",null),stor.get("nt_alarm",null),stor.get("nt_alarmActive",false),
        stor.get("nt_clean",null),stor.get("nt_comp",{}),stor.get("nt_exp",[]),
        stor.get("nt_selections",{}),stor.get("nt_binge_"+todayS,false),stor.get("nt_weekscores",{}),
        stor.get("nt_weekplan",{}),stor.get("nt_saude",{}),
      ]);
      if(sc)setSchedule(sc);if(al)setAlarm(al);setAlarmActive(alAct);
      if(ct)setCleanTasks(ct);setCleanComp(cc);setExpenses(ex);
      setSelections(sel);setHasBinge(binge);setWeekScores(ws);setWeekPlan(wp);
      setSaudeData(sd);setLoaded(true);
    })();
  },[]);

  // Save score on selection change
  useEffect(()=>{
    if(!loaded)return;
    const todaySel=selections[todayS]||{};
    const score=computeScore(todaySel,hasBinge);
    const next={...weekScores,[todayS]:score};
    setWeekScores(next);
    stor.set("nt_weekscores",next);
  },[selections,hasBinge,loaded]);

  // Alarm check
  useEffect(()=>{
    if(!alarm||!alarmActive)return;
    const[h,m]=alarm.split(":");const target=parseInt(h)*60+parseInt(m);
    const check=()=>{
      const nm=getNowMins(),key=`alarm-${alarm}-${Math.floor(nm)}`;
      if(Math.abs(nm-target)<=1&&!firedRef.current.has(key)){
        firedRef.current.add(key);playAlarm();vibrate();
        setAlarmBanner(true);setTimeout(()=>setAlarmBanner(false),10000);
      }
    };
    const iv=setInterval(check,30000);return()=>clearInterval(iv);
  },[alarm,alarmActive]);

  // Block tap
  const handleBlockTap=(block)=>{
    const mod=CAT_MODULE[block.c];
    if(mod==="limpeza"){setTab("limpeza");return;}
    if(mod==="cardapio"){setTab("cardapio");setCardapioTab("refeicoes");return;}
    if(mod==="estudo"){setTab("estudo");return;}
    setInfoBlock(block);
  };

  // Schedule CRUD
  const updateBlock=async(dk,bid,upd)=>{const n={...schedule,[dk]:{...schedule[dk],blocks:schedule[dk].blocks.map(b=>b.id===bid?{...b,...upd}:b)}};setSchedule(n);await stor.set("nt_sched",n);setEditBlock(null);setInfoBlock(null);};
  const deleteBlock=async(dk,bid)=>{const n={...schedule,[dk]:{...schedule[dk],blocks:schedule[dk].blocks.filter(b=>b.id!==bid)}};setSchedule(n);await stor.set("nt_sched",n);setEditBlock(null);setInfoBlock(null);};
  const addBlock=async(dk,block)=>{const n={...schedule,[dk]:{...schedule[dk],blocks:[...schedule[dk].blocks,block]}};setSchedule(n);await stor.set("nt_sched",n);};
  const saveAlarm=async(t)=>{setAlarm(t);setAlarmActive(!!t);await stor.set("nt_alarm",t);await stor.set("nt_alarmActive",!!t);setShowAlarmModal(false);};

  // Limpeza
  const toggleClean=async(dk,id)=>{const c={...cleanComp,[dk]:(cleanComp[dk]||[]).includes(id)?(cleanComp[dk]||[]).filter(x=>x!==id):[...(cleanComp[dk]||[]),id]};setCleanComp(c);await stor.set("nt_comp",c);};
  const addCleanTask=async(dk,text)=>{const ct={...cleanTasks,[dk]:[...(cleanTasks[dk]||[]),{id:"c"+Date.now(),text}]};setCleanTasks(ct);await stor.set("nt_clean",ct);};
  const editCleanTask=async(dk,id,text)=>{const ct={...cleanTasks,[dk]:cleanTasks[dk].map(t=>t.id===id?{...t,text}:t)};setCleanTasks(ct);await stor.set("nt_clean",ct);};
  const deleteCleanTask=async(dk,id)=>{const ct={...cleanTasks,[dk]:(cleanTasks[dk]||[]).filter(t=>t.id!==id)};setCleanTasks(ct);await stor.set("nt_clean",ct);};

  // Gastos
  const addExpense=async(e)=>{const n=[e,...expenses];setExpenses(n);await stor.set("nt_exp",n);};
  const deleteExpense=async(id)=>{const n=expenses.filter(e=>e.id!==id);setExpenses(n);await stor.set("nt_exp",n);};

  // Selections NutriTrack
  const handleSelect=async(mealId,groupId,item)=>{
    const mealSels={...((selections[todayS]||{})[mealId]||{})};
    if(item===null){delete mealSels[groupId];}
    else{mealSels[groupId]=item;}
    const n={...selections,[todayS]:{...(selections[todayS]||{}),[mealId]:mealSels}};
    setSelections(n);await stor.set("nt_selections",n);
  };
  const handleFreeMeal=async(mealId,label)=>{
    const n={...selections,[todayS]:{...(selections[todayS]||{}),[mealId]:{...((selections[todayS]||{})[mealId]||{}),FREE:label}}};
    setSelections(n);await stor.set("nt_selections",n);
  };
  const handleBinge=async(note)=>{
    setHasBinge(true);await stor.set("nt_binge_"+todayS,true);
  };

  // Cardápio semanal
  const handleSelectWeek=async(day,mealId,groupId,item)=>{
    const mealSels={...((weekPlan[day]||{})[mealId]||{})};
    if(item===null){delete mealSels[groupId];}
    else{mealSels[groupId]=item;}
    const n={...weekPlan,[day]:{...(weekPlan[day]||{}),[mealId]:mealSels}};
    setWeekPlan(n);await stor.set("nt_weekplan",n);
  };

  const todaySelections=selections[todayS]||{};

  const handleSaude=async(next)=>{setSaudeData(next);await stor.set("nt_saude",next);};

  const TABS=[
    {id:"rotina",label:"Rotina"},
    {id:"cardapio",label:"Cardápio"},
    {id:"limpeza",label:"Limpeza"},
    {id:"gastos",label:"Gastos"},
    {id:"saude",label:"Saúde"},
    {id:"estudo",label:"Estudo"},
  ];

  const CARDAPIO_TABS=[
    {id:"dashboard",label:"Hoje"},
    {id:"refeicoes",label:"Refeições"},
    {id:"cardapio",label:"Cardápio"},
    {id:"receitas",label:"Receitas IA"},
  ];

  if(!loaded)return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      minHeight:"100vh",background:S[50],fontFamily:"Inter,sans-serif",color:E[600],fontSize:16,fontWeight:600}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,border:`4px solid ${E[200]}`,borderTopColor:E[500],
          borderRadius:99,animation:"spin 0.8s linear infinite"}}/>
        <span style={{color:S[500],fontSize:13}}>A carregar…</span>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return(
    <div style={{fontFamily:"Inter,'system-ui',sans-serif",background:S[50],
      minHeight:"100vh",maxWidth:440,margin:"0 auto",position:"relative",paddingBottom:64}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:0;}body{background:#f8fafc;}
        button,input,textarea{font-family:inherit;}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* Alarm banner */}
      {alarmBanner&&(
        <div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",
          width:"100%",maxWidth:440,zIndex:300,
          background:"linear-gradient(135deg,#16a34a,#15803d)",
          padding:"14px 16px",boxShadow:"0 6px 20px rgba(22,163,74,0.35)"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{flex:1}}>
              <div style={{color:"rgba(255,255,255,0.75)",fontSize:10,fontWeight:700,
                textTransform:"uppercase",letterSpacing:1,marginBottom:2}}>Alarme</div>
              <div style={{color:"#fff",fontSize:15,fontWeight:600}}>Hora de acordar · {alarm}</div>
            </div>
            <button onClick={()=>setAlarmBanner(false)} style={{
              background:"rgba(255,255,255,0.15)",border:"none",borderRadius:99,
              color:"#fff",width:30,height:30,cursor:"pointer",fontSize:14}}>✕</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{
        background:"linear-gradient(135deg,#16a34a 0%,#15803d 100%)",
        padding:"20px 16px 0",
        boxShadow:"0 4px 20px rgba(22,163,74,0.25)",
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <p style={{color:"rgba(255,255,255,0.65)",fontSize:10,letterSpacing:3,
              textTransform:"uppercase",marginBottom:4}}>Minha Rotina</p>
            <h1 style={{color:"#fff",fontSize:20,fontWeight:900,margin:0,lineHeight:1.2}}>
              {today.getDate()} de {MONTHS_LONG[today.getMonth()]}
            </h1>
          </div>
          <button onClick={()=>setShowAlarmModal(true)} style={{
            background:"rgba(255,255,255,0.12)",
            border:`1px solid rgba(255,255,255,${alarmActive&&alarm?0.3:0.1})`,
            borderRadius:12,padding:"9px 14px",cursor:"pointer",textAlign:"right"}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,0.6)",fontWeight:700,
              textTransform:"uppercase",letterSpacing:0.8,marginBottom:2}}>Acordar</div>
            <div style={{fontSize:15,fontWeight:800,
              color:alarmActive&&alarm?"#fff":"rgba(255,255,255,0.35)"}}>
              {alarmActive&&alarm?alarm:"— —"}
            </div>
          </button>
        </div>

        {/* Dias (só na rotina) */}
        {tab==="rotina"&&(
          <div style={{display:"flex",gap:4,overflowX:"auto",scrollbarWidth:"none",paddingBottom:14}}>
            {DAYS.map(d=>{
              const isTd=d===todayKey,isSel=d===activeDay;
              const dt=cleanTasks[d]||[],dd=(cleanComp[d]||[]).length;
              const allDone=dt.length>0&&dd===dt.length;
              return(
                <button key={d} onClick={()=>setActiveDay(d)} style={{
                  flexShrink:0,padding:"7px 13px",borderRadius:9,border:"none",
                  fontSize:13,fontWeight:600,cursor:"pointer",
                  background:isSel?"#fff":isTd?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.08)",
                  color:isSel?E[700]:"rgba(255,255,255,0.75)",position:"relative",
                }}>
                  {d}
                  {allDone&&<span style={{position:"absolute",top:4,right:4,
                    width:4,height:4,borderRadius:99,background:E[400]}}/>}
                </button>
              );
            })}
          </div>
        )}

        {/* Sub-tabs do Cardápio */}
        {tab==="cardapio"&&(
          <div style={{display:"flex",gap:2,paddingBottom:0}}>
            {CARDAPIO_TABS.map(ct=>(
              <button key={ct.id} onClick={()=>setCardapioTab(ct.id)} style={{
                flex:1,padding:"10px 4px",border:"none",cursor:"pointer",
                background:"transparent",
                color:cardapioTab===ct.id?"#fff":"rgba(255,255,255,0.55)",
                fontSize:11,fontWeight:cardapioTab===ct.id?700:500,
                borderBottom:cardapioTab===ct.id?"2px solid #fff":"2px solid transparent",
                transition:"all 0.15s",
              }}>{ct.label}</button>
            ))}
          </div>
        )}

        {/* Breadcrumb para outros módulos */}
        {tab!=="rotina"&&tab!=="cardapio"&&(
          <div style={{display:"flex",alignItems:"center",gap:10,paddingBottom:14}}>
            <button onClick={()=>setTab("rotina")} style={{
              background:"rgba(255,255,255,0.12)",border:"none",borderRadius:8,
              padding:"6px 12px",color:"rgba(255,255,255,0.6)",fontSize:12,cursor:"pointer"}}>
              ← Rotina
            </button>
            <span style={{color:"rgba(255,255,255,0.9)",fontSize:14,fontWeight:600}}>
              {TABS.find(t=>t.id===tab)?.label}
            </span>
          </div>
        )}
      </div>

      {/* CONTEÚDO */}
      {tab==="rotina"&&(
        <DayView dayKey={activeDay} schedule={schedule}
          onBlockTap={handleBlockTap} onAddBlock={()=>setAddingBlock(true)}/>
      )}
      {tab==="cardapio"&&cardapioTab==="dashboard"&&(
        <DashboardTab selections={todaySelections} hasBinge={hasBinge}
          onRegisterBinge={handleBinge} onNavMealLog={()=>setCardapioTab("refeicoes")}
          weekScores={weekScores}/>
      )}
      {tab==="cardapio"&&cardapioTab==="refeicoes"&&(
        <MealLogTab selections={todaySelections} onSelect={handleSelect}
          rewards={rewards} onFreeMeal={handleFreeMeal}/>
      )}
      {tab==="cardapio"&&cardapioTab==="cardapio"&&(
        <CardapioSemanalTab weekPlan={weekPlan} onSelectWeek={handleSelectWeek}/>
      )}
      {tab==="cardapio"&&cardapioTab==="receitas"&&(
        <RecipesTab/>
      )}
      {tab==="limpeza"&&(
        <LimpezaTab dayKey={activeDay} cleanTasks={cleanTasks} completions={cleanComp}
          onToggle={toggleClean} onAddTask={addCleanTask}
          onEditTask={editCleanTask} onDeleteTask={deleteCleanTask}/>
      )}
      {tab==="gastos"&&(
        <GastosTab expenses={expenses} onAdd={addExpense} onDelete={deleteExpense}/>
      )}
      {tab==="saude"&&<SaudeTab saudeData={saudeData} onSave={handleSaude}/>}
      {tab==="estudo"&&<EstudoTab/>}

      {/* MODAIS */}
      {infoBlock&&!editBlock&&(
        <InfoPanel block={infoBlock} onClose={()=>setInfoBlock(null)} onEdit={b=>setEditBlock(b)}/>
      )}
      {editBlock&&(
        <EditBlockModal block={editBlock} dayKey={activeDay}
          onSave={updateBlock} onDelete={deleteBlock} onClose={()=>setEditBlock(null)}/>
      )}
      {addingBlock&&(
        <AddBlockModal dayKey={activeDay}
          onAdd={(dk,b)=>{addBlock(dk,b);setAddingBlock(false);}}
          onClose={()=>setAddingBlock(false)}/>
      )}
      {showAlarmModal&&(
        <AlarmModal alarm={alarm} onSave={saveAlarm} onClose={()=>setShowAlarmModal(false)}/>
      )}

      {/* NAV INFERIOR — com ícones e safe area */}
      <nav style={{
        position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:440,background:"#fff",
        borderTop:"1px solid #f1f5f9",
        display:"flex",zIndex:50,
        boxShadow:"0 -2px 16px rgba(0,0,0,0.06)",
        paddingBottom:"env(safe-area-inset-bottom, 0px)",
      }}>
        {TABS.map(t=>{
          const isSel=tab===t.id;
          const icons={rotina:"📅",cardapio:"🥗",limpeza:"🧹",gastos:"💰",saude:"🌸",estudo:"📖"};
          return(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1,display:"flex",flexDirection:"column",alignItems:"center",
              justifyContent:"center",gap:5,padding:"12px 4px",minHeight:68,
              background:"none",border:"none",cursor:"pointer",
              WebkitTapHighlightColor:"transparent",
            }}>
              <div style={{
                width:isSel?36:32,height:isSel?36:32,borderRadius:10,
                background:isSel?"#16a34a":"transparent",
                border:isSel?"none":"1px solid #e2e8f0",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:18,transition:"all 0.2s",
              }}>
                {icons[t.id]}
              </div>
              <span style={{
                fontSize:10,fontWeight:isSel?700:500,
                color:isSel?"#16a34a":"#94a3b8",
              }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
