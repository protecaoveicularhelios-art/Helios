#!/usr/bin/env python3
"""Melhorias SEO + unificação do WhatsApp — nov/2026.

1. Unifica todos os números (WhatsApp e telefone) para (31) 99318-9043
2. Limpa os sitemaps: remove URLs com noindex e URLs redirecionadas; atualiza lastmod
3. Consolida as 15 páginas de cidade duplicadas (/betim/ -> /protecao-veicular-betim-mg/) com 301
4. Encurta títulos com mais de 60 caracteres
5. Otimiza o post que já está no top 10 ("qual a melhor proteção veicular")
6. Adiciona bloco de links internos na home apontando para o post e as cidades principais
"""
import os, re, sys, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(ROOT, "novo-site")
SRC = os.path.join(ROOT, "helios-source")
HOJE = datetime.date.today().isoformat()
NOVO = "5531993189043"
NOVO_FMT = "(31) 99318-9043"

TEXT_EXT = (".html", ".txt", ".js", ".json", ".xml", ".ts", ".tsx", ".ps1", ".css", ".md")
log = {}

def bump(k, n=1):
    log[k] = log.get(k, 0) + n

def files(base, skip=("node_modules", ".next", "out", ".git")):
    for d, dirs, fs in os.walk(base):
        dirs[:] = [x for x in dirs if x not in skip]
        for f in fs:
            if f.endswith(TEXT_EXT) or f == "_redirects":
                yield os.path.join(d, f)

def rw(path, fn):
    with open(path, encoding="utf-8", errors="surrogateescape", newline="") as fh:
        t = fh.read()
    n = fn(t)
    if n != t:
        with open(path, "w", encoding="utf-8", errors="surrogateescape", newline="") as fh:
            fh.write(n)
        return True
    return False

# ---------------------------------------------------------------- 1. números
NUM_RULES = [
    (r"\+?55\s?31\s?9?\s?9239[\s-]?5859", None),
    (r"\+?55\s?31\s?9?\s?9372[\s-]?8984", None),
    (r"\+?55\s?31\s?9?\s?7259[\s-]?3075", None),
    (r"\+?55\s?31\s?9?\s?7519[\s-]?2923", None),
    (r"\(31\)\s?9\s?9239-?5859", "fmt"),
    (r"\(31\)\s?9\s?9372-?8984", "fmt"),
    (r"\(31\)\s?9\s?7259-?3075", "fmt"),
    (r"\(31\)\s?9\s?7519-?2923", "fmt"),
]
NUM_RX = [(re.compile(p), k) for p, k in NUM_RULES]

def troca_numeros(t):
    for rx, kind in NUM_RX:
        def rep(m):
            s = m.group(0)
            if kind == "fmt":
                return NOVO_FMT
            return ("+" if s.startswith("+") else "") + NOVO
        t = rx.sub(rep, t)
    return t

targets = list(files(SITE)) + list(files(SRC)) + [
    os.path.join(ROOT, f) for f in os.listdir(ROOT)
    if f.endswith((".js", ".ps1")) and os.path.isfile(os.path.join(ROOT, f))
]
for p in targets:
    if rw(p, troca_numeros):
        bump("1_arquivos_com_numero_trocado")

# ------------------------------------------------- 3. cidades duplicadas (301)
with open(os.path.join(SITE, "sitemap.xml"), encoding="utf-8") as fh:
    sm = fh.read()
cidades_dup = []
for loc in re.findall(r"<loc>https://heliosprotecaoveicular\.com\.br/([a-z-]+)/</loc>", sm):
    if loc != "blog" and os.path.isdir(os.path.join(SITE, f"protecao-veicular-{loc}-mg")):
        cidades_dup.append(loc)

redir_path = os.path.join(SITE, "_redirects")
with open(redir_path, encoding="utf-8-sig", newline="") as fh:
    redir = fh.read()
bloco = "# Consolidação nov/2026: páginas de cidade duplicadas -> página completa\n" + "".join(
    f"/{c}/ /protecao-veicular-{c}-mg/ 301!\n/{c} /protecao-veicular-{c}-mg/ 301!\n" for c in cidades_dup
)
if "Consolidação nov/2026" not in redir:
    with open(redir_path, "w", encoding="utf-8", newline="") as fh:
        fh.write(bloco + "\n" + redir)
    bump("3_cidades_consolidadas_301", len(cidades_dup))

# ----------------------------------------------------------- 2. sitemaps
redirecionadas = set()
for line in (bloco + redir).splitlines():
    parts = line.split()
    if len(parts) >= 3 and parts[0].startswith("/") and parts[2].startswith("30"):
        redirecionadas.add(parts[0].rstrip("/") + "/")

def indexavel(path):
    f = os.path.join(SITE, path.strip("/"), "index.html") if path != "/" else os.path.join(SITE, "index.html")
    if not os.path.isfile(f):
        return True  # não sabemos; mantém
    with open(f, encoding="utf-8", errors="ignore") as fh:
        head = fh.read(20000)
    return not re.search(r'name="robots"\s+content="[^"]*noindex', head)

for sm_file in sorted(x for x in os.listdir(SITE) if x.startswith("sitemap") and x.endswith(".xml")):
    p = os.path.join(SITE, sm_file)
    with open(p, encoding="utf-8", newline="") as fh:
        t = fh.read()
    if "<sitemapindex" in t:
        t2 = re.sub(r"<lastmod>[^<]*</lastmod>", f"<lastmod>{HOJE}</lastmod>", t)
    else:
        def keep(m):
            loc = re.search(r"<loc>https://heliosprotecaoveicular\.com\.br(/[^<]*)</loc>", m.group(0))
            path = loc.group(1) if loc else "/"
            if path in redirecionadas or not indexavel(path):
                bump("2_urls_removidas_do_sitemap")
                return ""
            return m.group(0)
        t2 = re.sub(r"\s*<url>.*?</url>", keep, t, flags=re.S)
    if t2 != t:
        with open(p, "w", encoding="utf-8", newline="") as fh:
            fh.write(t2)

# --------------------------------------------------------- 4. títulos longos
SUFIXOS = [" | Hélios Proteção Veicular", " | Blog Hélios", " | Hélios"]

def encurta(title):
    if len(title) <= 60:
        return title
    t = title.replace(": Guincho, Reboque, Chaveiro e Mais", ": Guincho e Reboque")
    if len(t) <= 60:
        return t
    for s in SUFIXOS:
        if t.endswith(s):
            base = t[: -len(s)]
            if len(base + " | Hélios") <= 60:
                return base + " | Hélios"
            if len(base) <= 60:
                return base
            t = base
            break
    t = t.replace(" Proteção Veicular", "") if len(t) > 60 else t
    return t if len(t) <= 60 else t[:57].rsplit(" ", 1)[0] + "..."

def fix_titles(t):
    def rep(m):
        new = encurta(m.group(2))
        if new != m.group(2):
            bump("4_titulos_encurtados")
        return m.group(1) + new + m.group(3)
    t = re.sub(r"(<title>)([^<]+)(</title>)", rep, t, count=1)
    t = re.sub(r'(<meta property="og:title" content=")([^"]+)(")', lambda m: m.group(1) + encurta(m.group(2)) + m.group(3), t)
    return t

for d in os.listdir(SITE):
    f = os.path.join(SITE, d, "index.html")
    if os.path.isfile(f) and d != "blog":
        rw(f, fix_titles)

# título do template nos geradores (para não voltar no próximo lote)
for g in ("gerar-seo.js", "gerar-lote2.js", "gerar-cidades-expansao.js"):
    p = os.path.join(ROOT, g)
    if os.path.isfile(p):
        rw(p, lambda t: t.replace(": Guincho, Reboque, Chaveiro e Mais", ": Guincho e Reboque"))

# -------------------------------------------------- 5. quick win do blog
POST = "maiores-protecoes-veiculares-do-brasil"
T_OLD = "As 5 maiores proteções veiculares do Brasil em 2026"
T_NEW = "Maiores proteções veiculares do Brasil em 2026: qual a melhor?"
D_OLD = "Conheça as maiores e mais conhecidas proteções veiculares do Brasil, compare coberturas e descubra qual é a melhor opção para você."
D_NEW = ("Qual a melhor proteção veicular do Brasil? Compare APVS, AGV, Proauto, Lions e SaveCar, "
         "veja o que avaliar antes de contratar e faça sua cotação grátis.")

def fix_post(t):
    n = t.replace(T_OLD, T_NEW).replace(D_OLD, D_NEW)
    if n != t:
        bump("5_post_quick_win_atualizado")
    return n

for p in files(os.path.join(SITE, "blog")):
    rw(p, fix_post)
rw(os.path.join(SRC, "data", "artigos.ts"), fix_post)

# home do blog/cards e home do site também podem citar o título
rw(os.path.join(SITE, "index.html"), fix_post)

# ------------------------------------------- 6. links internos na home
home = os.path.join(SITE, "index.html")
principais = ["belo-horizonte", "contagem", "betim", "ribeirao-das-neves", "santa-luzia", "ibirite", "nova-lima", "sete-lagoas"]
nomes = {"belo-horizonte": "Belo Horizonte", "contagem": "Contagem", "betim": "Betim", "ribeirao-das-neves": "Ribeirão das Neves",
         "santa-luzia": "Santa Luzia", "ibirite": "Ibirité", "nova-lima": "Nova Lima", "sete-lagoas": "Sete Lagoas"}
links_cid = " · ".join(
    f'<a href="/protecao-veicular-{c}-mg/" style="color:#ffcc00">{nomes[c]}</a>'
    for c in principais if os.path.isdir(os.path.join(SITE, f"protecao-veicular-{c}-mg"))
)
BLOCO_HOME = f"""
<!-- seo-links-internos-nov2026 -->
<section style="background:#00122b;color:#fff;padding:40px 20px;font-family:Poppins,sans-serif">
  <div style="max-width:1100px;margin:0 auto">
    <h2 style="font-size:22px;margin:0 0 12px">Guia para escolher sua proteção veicular</h2>
    <p style="margin:0 0 10px;color:#c9d6e6">
      <a href="/blog/{POST}/" style="color:#ffcc00">Maiores proteções veiculares do Brasil: qual a melhor?</a> ·
      <a href="/blog/diferenca-entre-seguro-de-carro-e-protecao-veicular/" style="color:#ffcc00">Seguro ou proteção veicular?</a> ·
      <a href="/blog/protecao-veicular-e-confiavel/" style="color:#ffcc00">Proteção veicular é confiável?</a> ·
      <a href="/blog/tipos-de-rastreador-veicular/" style="color:#ffcc00">Tipos de rastreador veicular</a>
    </p>
    <p style="margin:0;color:#c9d6e6">Proteção veicular na Grande BH: {links_cid}</p>
  </div>
</section>
"""
def add_home(t):
    if "seo-links-internos-nov2026" in t:
        return t
    i = t.rfind("<footer")
    if i == -1:
        i = t.rfind("</body>")
    bump("6_bloco_links_internos_home")
    return t[:i] + BLOCO_HOME + t[i:]
rw(home, add_home)

# fonte: sitemap.ts não deve mais listar as páginas de cidade antigas (agora 301)
rw(os.path.join(SRC, "app", "sitemap.ts"), lambda t: t.replace("    ...cidadesUrls,\n", "").replace(
    'const LAST_MODIFIED = new Date("2026-06-06")', f'const LAST_MODIFIED = new Date("{HOJE}")'))

for k in sorted(log):
    print(f"{k}: {log[k]}")
print("cidades consolidadas:", ", ".join(cidades_dup))
