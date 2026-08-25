"""Selina SM — Selina com o latim completo.

A SELINA.otf entregue no Brand Kit (TOKOPRESS, gerada no Fontself) cobre só o
ASCII: nenhum glifo acentuado existe — 'á', 'ç', 'ã'… constam do cmap mas
apontam para a letra-base sem acento — e o 'i'/'j' saíram sem pingo. Este
script repara a fonte compondo os glifos que faltam a partir das marcas do
próprio desenho (grave, asciicircum, asciitilde, comma, period) e grava um
OTF novo, do qual sai o WOFF2 servido pelo site.

    python buildfont.py SELINA.otf SelinaSM.otf
"""
import math
import sys

from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

SRC, DST = sys.argv[1], sys.argv[2]

f = TTFont(SRC)
# descompila tudo o que depende da ordem de glifos ANTES de mexer nela
f.getGlyphOrder()
for _t in f["cmap"].tables:
    _t.cmap
f["hmtx"].metrics

gs = f.getGlyphSet()
topDict = f["CFF "].cff.topDictIndex[0]
charStrings = topDict.CharStrings
hmtx = f["hmtx"]

CAP = 700.0   # altura de caixa alta
XH = 463.0    # altura de x (a/o/e passam para 474 por overshoot)

new_names = []


def bounds(g):
    p = BoundsPen(gs)
    gs[g].draw(p)
    return p.bounds


def add_glyph(name, pen, width, lsb=0):
    """Insere um glifo novo no CFF (o __setitem__ do fontTools só troca existentes)."""
    cs = pen.getCharString(private=topDict.Private, globalSubrs=topDict.GlobalSubrs)
    if name in charStrings.charStrings:
        charStrings[name] = cs
    else:
        charStrings.charStringsIndex.append(cs)
        charStrings.charStrings[name] = len(charStrings.charStringsIndex) - 1
        topDict.charset.append(name)
        new_names.append(name)
    hmtx[name] = (int(round(width)), int(round(lsb)))


def place(pen, glyph, sx, sy, x, y):
    """Desenha `glyph` escalado (sx, sy) com o canto inferior-esquerdo em (x, y)."""
    x0, y0, x1, y1 = bounds(glyph)
    t = Transform().translate(x - sx * x0, y - sy * y0).scale(sx, sy)
    gs[glyph].draw(TransformPen(pen, t))


def circle(pen, cx, cy, r, ccw=False):
    k = 0.5523 * r
    pts = [(cx + r, cy), (cx, cy + r), (cx - r, cy), (cx, cy - r)]
    tan = [(0, k), (-k, 0), (0, -k), (k, 0)]
    if ccw:
        pts = [pts[0]] + pts[:0:-1]
        tan = [(0, -k), (k, 0), (0, k), (-k, 0)]
    pen.moveTo(pts[0])
    for i in range(4):
        a, b = pts[i], pts[(i + 1) % 4]
        ta, tb = tan[i], tan[(i + 1) % 4]
        pen.curveTo((a[0] + ta[0], a[1] + ta[1]), (b[0] - tb[0], b[1] - tb[1]), b)
    pen.closePath()


def ring_shape(pen, cx, cy, r_out, stroke):
    circle(pen, cx, cy, r_out)
    circle(pen, cx, cy, r_out - stroke, ccw=True)


# ---------------------------------------------------------------- marcas
# O desenho original só tem `, ^, ~, vírgula e ponto. Cada acento nasce de um
# deles, escalado pela ALTURA (escalar pela largura esticaria o traço) e, no
# caso do agudo/grave, inclinado — o ` da Selina é quase vertical.
#   (origem, altura-min, altura-caixa-alta, esticão-x, inclinação°, folga-min, folga-caixa-alta)
MARKS = {
    "grave":      ("grave",       118, 132, 1.10, -17, 46, 52),
    "acute":      ("grave",       118, 132, 1.10, +17, 46, 52),   # espelhado em x
    # o ^ do desenho original é um filete que some em corpo de texto:
    # o circunflexo é redesenhado como galo afilado, no peso do agudo.
    "circumflex": (None,          104, 116, 1.92,   0, 40, 46),
    "tilde":      ("asciitilde",   74,  84, 1.05,   0, 54, 60),
    "dieresis":   ("period",       76,  84, 1.00,   0, 54, 60),
}


def _bbox_after(glyph, t):
    p = BoundsPen(gs)
    gs[glyph].draw(TransformPen(p, t))
    return p.bounds


def chevron(pen, cx, y, w, h, tv):
    """Galo (circunflexo): grosso no vértice, afilado nas pontas."""
    ta = tv * w / (4 * h)
    left, right, apex = cx - w / 2, cx + w / 2, cx
    pen.moveTo((left, y))
    pen.lineTo((apex, y + h))
    pen.lineTo((right, y))
    pen.lineTo((right - ta, y))
    pen.lineTo((apex, y + h - tv))
    pen.lineTo((left + ta, y))
    pen.closePath()


def mark(pen, kind, cx, y, upper):
    src, hmin, hcap, xstretch, slant, _, _ = MARKS[kind]
    h = hcap if upper else hmin

    if kind == "circumflex":
        chevron(pen, cx, y, h * xstretch, h, h * 0.30)
        return

    x0, y0, x1, y1 = bounds(src)
    s = h / (y1 - y0)

    if kind == "dieresis":
        gap = 104 if upper else 92
        for sign in (-1, 1):
            place(pen, src, s, s, cx + sign * gap - s * (x1 - x0) / 2, y)
        return

    # escala (espelhando o grave para virar agudo) + inclinação
    sx = -s * xstretch if kind == "acute" else s * xstretch
    t = Transform().skew(math.radians(slant), 0).scale(sx, s)
    bx0, by0, bx1, by1 = _bbox_after(src, t)
    t = Transform().translate(cx - (bx0 + bx1) / 2, y - by0).transform(t)
    gs[src].draw(TransformPen(pen, t))


def accent(name, base, kind, upper, dx=0.0):
    x0, _, x1, y1 = bounds(base)
    *_, gmin, gcap = MARKS[kind]
    top = CAP if upper else max(y1, XH)
    y = top + (gcap if upper else gmin)
    w = hmtx[base][0]
    pen = T2CharStringPen(w, gs)
    gs[base].draw(pen)
    mark(pen, kind, (x0 + x1) / 2 + dx, y, upper)
    add_glyph(name, pen, w, hmtx[base][1])


def cedilla(name, base):
    x0, _, x1, _ = bounds(base)
    mx0, my0, mx1, my1 = bounds("comma")
    s = 1.04
    w = hmtx[base][0]
    pen = T2CharStringPen(w, gs)
    gs[base].draw(pen)
    place(pen, "comma", s, s, (x0 + x1) / 2 - s * (mx1 - mx0) / 2, -14 - s * (my1 - my0))
    add_glyph(name, pen, w, hmtx[base][1])


def with_ring(name, base, upper):
    x0, _, x1, y1 = bounds(base)
    r, stroke = (76.0, 25.0) if upper else (66.0, 22.0)
    y = (CAP if upper else max(y1, XH)) + (50 if upper else 44) + r
    w = hmtx[base][0]
    pen = T2CharStringPen(w, gs)
    gs[base].draw(pen)
    ring_shape(pen, (x0 + x1) / 2, y, r, stroke)
    add_glyph(name, pen, w, hmtx[base][1])


def with_slash(name, base, upper):
    x0, y0, x1, y1 = bounds(base)
    th = 46.0 if upper else 40.0
    pad = 40.0
    ax, ay, bx, by = x0 - pad, y0 - pad, x1 + pad, y1 + pad
    dx, dy = bx - ax, by - ay
    L = math.hypot(dx, dy)
    nx, ny = -dy / L * th / 2, dx / L * th / 2
    w = hmtx[base][0]
    pen = T2CharStringPen(w, gs)
    gs[base].draw(pen)
    pen.moveTo((ax + nx, ay + ny))
    pen.lineTo((bx + nx, by + ny))
    pen.lineTo((bx - nx, by - ny))
    pen.lineTo((ax - nx, ay - ny))
    pen.closePath()
    add_glyph(name, pen, w, hmtx[base][1])


def dotted(name, base):
    """i/j com pingo — a Selina original saiu sem ele."""
    x0, _, x1, y1 = bounds(base)
    px0, py0, px1, py1 = bounds("period")
    s = 1.02
    w = hmtx[base][0]
    pen = T2CharStringPen(w, gs)
    gs[base].draw(pen)
    place(pen, "period", s, s, (x0 + x1) / 2 - s * (px1 - px0) / 2, y1 + 54)
    add_glyph(name, pen, w, hmtx[base][1])


def rect(pen, x0, y0, x1, y1):
    pen.moveTo((x0, y0))
    pen.lineTo((x1, y0))
    pen.lineTo((x1, y1))
    pen.lineTo((x0, y1))
    pen.closePath()


def dash(name, width, ink):
    _, hy0, _, hy1 = bounds("hyphen")
    side = (width - ink) / 2
    pen = T2CharStringPen(width, gs)
    rect(pen, side, hy0, side + ink, hy1)
    add_glyph(name, pen, width, side)


def make_ellipsis():
    pw = hmtx["period"][0]
    pen = T2CharStringPen(pw * 3, gs)
    for i in range(3):
        gs["period"].draw(TransformPen(pen, Transform().translate(i * pw, 0)))
    add_glyph("ellipsis", pen, pw * 3, hmtx["period"][1])


def make_middot():
    _, y0, _, y1 = bounds("period")
    pen = T2CharStringPen(hmtx["period"][0], gs)
    gs["period"].draw(TransformPen(pen, Transform().translate(0, XH / 2 - (y0 + y1) / 2)))
    add_glyph("periodcentered", pen, hmtx["period"][0], hmtx["period"][1])


def make_degree():
    r, stroke = 88.0, 28.0
    cx, cy = 44 + r, CAP - r - 44
    pen = T2CharStringPen(0, gs)
    ring_shape(pen, cx, cy, r, stroke)
    add_glyph("degree", pen, cx + r + 44, 44)


def ordinal(name, base):
    """º e ª: letra reduzida, elevada e sublinhada."""
    x0, y0, x1, y1 = bounds(base)
    s = 0.56
    lift = CAP - s * (y1 - y0)
    w = s * (x1 - x0) + 72
    pen = T2CharStringPen(w, gs)
    place(pen, base, s, s, 36, lift)
    rect(pen, 36, lift - 62, 36 + s * (x1 - x0), lift - 32)
    add_glyph(name, pen, w, 36)


# ---------------------------------------------------------------- montagem
ACCENTED = [
    ("Agrave", "A", "grave"), ("Aacute", "A", "acute"), ("Acircumflex", "A", "circumflex"),
    ("Atilde", "A", "tilde"), ("Adieresis", "A", "dieresis"),
    ("Egrave", "E", "grave"), ("Eacute", "E", "acute"), ("Ecircumflex", "E", "circumflex"),
    ("Edieresis", "E", "dieresis"),
    ("Igrave", "I", "grave"), ("Iacute", "I", "acute"), ("Icircumflex", "I", "circumflex"),
    ("Idieresis", "I", "dieresis"),
    ("Ntilde", "N", "tilde"),
    ("Ograve", "O", "grave"), ("Oacute", "O", "acute"), ("Ocircumflex", "O", "circumflex"),
    ("Otilde", "O", "tilde"), ("Odieresis", "O", "dieresis"),
    ("Ugrave", "U", "grave"), ("Uacute", "U", "acute"), ("Ucircumflex", "U", "circumflex"),
    ("Udieresis", "U", "dieresis"),
    ("Yacute", "Y", "acute"), ("Ydieresis", "Y", "dieresis"),
]
LOWER = [
    ("agrave", "a", "grave"), ("aacute", "a", "acute"), ("acircumflex", "a", "circumflex"),
    ("atilde", "a", "tilde"), ("adieresis", "a", "dieresis"),
    ("egrave", "e", "grave"), ("eacute", "e", "acute"), ("ecircumflex", "e", "circumflex"),
    ("edieresis", "e", "dieresis"),
    ("igrave", "dotlessi", "grave"), ("iacute", "dotlessi", "acute"),
    ("icircumflex", "dotlessi", "circumflex"), ("idieresis", "dotlessi", "dieresis"),
    ("ntilde", "n", "tilde"),
    ("ograve", "o", "grave"), ("oacute", "o", "acute"), ("ocircumflex", "o", "circumflex"),
    ("otilde", "o", "tilde"), ("odieresis", "o", "dieresis"),
    ("ugrave", "u", "grave"), ("uacute", "u", "acute"), ("ucircumflex", "u", "circumflex"),
    ("udieresis", "u", "dieresis"),
    ("yacute", "y", "acute"), ("ydieresis", "y", "dieresis"),
]

# o 'i'/'j' originais são a forma sem pingo: preserva-os e devolve o pingo a i/j
for src, dst in (("i", "dotlessi"), ("j", "dotlessj")):
    pen = T2CharStringPen(hmtx[src][0], gs)
    gs[src].draw(pen)
    add_glyph(dst, pen, hmtx[src][0], hmtx[src][1])
gs = f.getGlyphSet()          # reabre para enxergar dotlessi/dotlessj
dotted("i", "dotlessi")
dotted("j", "dotlessj")
gs = f.getGlyphSet()

for name, base, kind in ACCENTED:
    accent(name, base, kind, upper=True)
for name, base, kind in LOWER:
    accent(name, base, kind, upper=False)

cedilla("Ccedilla", "C")
cedilla("ccedilla", "c")
with_ring("Aring", "A", True)
with_ring("aring", "a", False)
with_slash("Oslash", "O", True)
with_slash("oslash", "o", False)

dash("endash", 500, 460)
dash("emdash", 1000, 940)
make_ellipsis()
make_middot()
make_degree()
ordinal("ordmasculine", "o")
ordinal("ordfeminine", "a")

CODES = {
    0x00C0: "Agrave", 0x00C1: "Aacute", 0x00C2: "Acircumflex", 0x00C3: "Atilde",
    0x00C4: "Adieresis", 0x00C5: "Aring", 0x00C7: "Ccedilla",
    0x00C8: "Egrave", 0x00C9: "Eacute", 0x00CA: "Ecircumflex", 0x00CB: "Edieresis",
    0x00CC: "Igrave", 0x00CD: "Iacute", 0x00CE: "Icircumflex", 0x00CF: "Idieresis",
    0x00D1: "Ntilde", 0x00D2: "Ograve", 0x00D3: "Oacute", 0x00D4: "Ocircumflex",
    0x00D5: "Otilde", 0x00D6: "Odieresis", 0x00D8: "Oslash",
    0x00D9: "Ugrave", 0x00DA: "Uacute", 0x00DB: "Ucircumflex", 0x00DC: "Udieresis",
    0x00DD: "Yacute", 0x0178: "Ydieresis",
    0x00E0: "agrave", 0x00E1: "aacute", 0x00E2: "acircumflex", 0x00E3: "atilde",
    0x00E4: "adieresis", 0x00E5: "aring", 0x00E7: "ccedilla",
    0x00E8: "egrave", 0x00E9: "eacute", 0x00EA: "ecircumflex", 0x00EB: "edieresis",
    0x00EC: "igrave", 0x00ED: "iacute", 0x00EE: "icircumflex", 0x00EF: "idieresis",
    0x00F1: "ntilde", 0x00F2: "ograve", 0x00F3: "oacute", 0x00F4: "ocircumflex",
    0x00F5: "otilde", 0x00F6: "odieresis", 0x00F8: "oslash",
    0x00F9: "ugrave", 0x00FA: "uacute", 0x00FB: "ucircumflex", 0x00FC: "udieresis",
    0x00FD: "yacute", 0x00FF: "ydieresis",
    0x0131: "dotlessi", 0x2013: "endash", 0x2014: "emdash", 0x2026: "ellipsis",
    0x00B7: "periodcentered", 0x00B0: "degree", 0x00BA: "ordmasculine", 0x00AA: "ordfeminine",
}

order = f.getGlyphOrder()
f.setGlyphOrder(list(order) + [n for n in new_names if n not in order])
for t in f["cmap"].tables:
    if t.isUnicode():
        t.cmap.update(CODES)

# métricas verticais: os acentos de caixa alta sobem acima de 700
os2 = f["OS/2"]
os2.usWinAscent = max(os2.usWinAscent, 900)
f["hhea"].ascent = max(f["hhea"].ascent, 900)
os2.ulUnicodeRange1 |= 0b11          # Basic Latin + Latin-1 Supplement

for r in f["name"].names:
    if r.nameID in (1, 3, 4, 6, 16):
        try:
            v = r.toUnicode()
        except Exception:
            continue
        r.string = v.replace("SELINA", "SelinaSM" if r.nameID == 6 else "Selina SM")

f.save(DST)
print(f"glifos acrescentados: {len(new_names)}")
print("gravado:", DST)
