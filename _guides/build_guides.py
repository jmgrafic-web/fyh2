#!/usr/bin/env python3
"""
Genera la guía gratuita "Guía para comprar en la Costa Brava 2026" en los 4 idiomas
(ES, EN, NL, FR) con la identidad de Find Your Haven, y la exporta a PDF.

Uso:   python3 _guides/build_guides.py          (desde la raíz del repo)

Requisitos: wkhtmltopdf y las fuentes Cormorant Garamond (Light, Medium, Italic) y DM Sans
(Regular, Medium, SemiBold) instaladas en el sistema con los nombres de familia
"FYHCG Light", "FYHCG Medium", "FYHCG Italic", "FYHDM", "FYHDM Medium", "FYHDM SemiBold"
(son las fuentes de Google Fonts, licencia abierta, renombradas así).
Los textos de cada idioma están en el diccionario STR de abajo; el diseño, en head.tpl.
"""
import os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "..", "assets", "downloads")

STR = {
"es": dict(
  pdf="guia-costa-brava-2026.pdf",
  eyebrow="Find Your Haven &nbsp;·&nbsp; Costa Catalana",
  h1="Guía para comprar en la <em>Costa Brava</em>", sub="Edición 2026",
  tag="Arraigados en la arquitectura. Centrados en ti.",
  foot="Find Your Haven · Guía Costa Brava 2026",
  k2="Antes de empezar", h2_2="Lo que vas a encontrar <em>en esta guía</em>",
  p2a="Esta guía reúne, de forma directa y sin relleno, lo que cualquier comprador extranjero necesita saber antes de comprar una vivienda en la Costa Brava o en el resto de la costa catalana: el proceso real paso a paso, los errores más caros y más frecuentes, y una primera fotografía de las zonas donde trabajamos.",
  p2b="No es un argumentario comercial. Es el mismo criterio que aplicamos con cada cliente, resumido en unas páginas.",
  box_lead="Un consejo antes de seguir leyendo.",
  box=" Si ya tienes un inmueble concreto en mente, la recomendación más valiosa de esta guía es la del paso 3: no avances sin una valoración técnica, sea con nosotros o con cualquier otro profesional serio.",
  k3="Parte 01", h2_3="El proceso real, <em>paso a paso</em>",
  steps=[("NIE, antes de necesitarlo","Es obligatorio para comprar, abrir cuenta bancaria o contratar suministros. Tramitarlo con antelación evita perder un buen inmueble mientras esperas cita."),
         ("Presupuesto real, no solo el precio del inmueble","Suma impuestos de transmisión, notaría, registro, gestoría y, si aplica, una horquilla de reforma desde el primer momento."),
         ("Valoración técnica antes de comprometerte","Estructura, cubierta, instalaciones, situación urbanística. Es lo único que te permite negociar con datos reales, no con esperanza."),
         ("Arras y contrato, revisados por un profesional","Cláusulas de penalización, plazos y condición suspensiva si dependes de financiación: nunca con una plantilla genérica traducida."),
         ("Firma ante notario y trámites posteriores","Registro de la propiedad, cambio de titularidad de suministros, IBI y, si no residirás de forma permanente, representación fiscal como no residente.")],
  k4="Parte 02", h2_4="Los cinco errores <em>más caros</em>",
  errs=[("Comprar solo con fotos y vídeo",", sin ninguna valoración técnica presencial antes de comprometerse."),
        ("Subestimar el coste real de una reforma"," en un edificio antiguo, sobre todo cubierta, estructura e instalaciones."),
        ("Firmar arras con un contrato genérico",", sin revisión legal adaptada al caso concreto."),
        ("No verificar licencias"," de ocupación ni si las reformas anteriores estaban legalizadas."),
        ("Coordinar en solitario"," a inmobiliaria, notario, arquitecto y reformista, sin que se conozcan entre ellos.")],
  box4="Ninguno de estos errores es exclusivo de compradores inexpertos. Son, casi siempre, el resultado de comprar a distancia sin alguien que trabaje exclusivamente para ti sobre el terreno.",
  k5="Parte 03", h2_5="Cinco zonas, <em>cinco caracteres</em>",
  zones=[("Costa Brava","Calas, patrimonio y mercado internacional consolidado. Begur, Pals, Llafranc, Cadaqués.","400K – 1,2M €"),
         ("Empordà interior","Masías y fincas con identidad propia. Peralada, Ullastret, Monells.","200K – 750K €"),
         ("Sitges / Garraf","Referencia internacional a un paso de Barcelona.","350K – 900K €"),
         ("Maresme","Cercanía a Barcelona, carácter costero tranquilo.","280K – 700K €"),
         ("Costa Daurada","Sol, playas extensas y potencial por descubrir.","160K – 450K €")],
  note="Precios orientativos de mercado (2025-2026). Sujetos a variación según inmueble, estado y ubicación exacta.",
  c_h2="¿Y si el siguiente paso <em>fuera una conversación</em>?",
  c_p1="Esta guía es el resumen. Lo que realmente cambia el resultado de una compra es tener a alguien de tu lado desde la primera llamada, sin coste añadido por la coordinación.",
  c_p2="Escríbenos y te respondemos en 24 horas, con preguntas concretas y un primer paso claro.",
  legal="Find Your Haven — Costa Catalana. Guía informativa general; no sustituye asesoramiento legal, fiscal o técnico individualizado."),

"en": dict(
  pdf="costa-brava-buying-guide-2026.pdf",
  eyebrow="Find Your Haven &nbsp;·&nbsp; Catalan Coast",
  h1="A Guide to Buying on the <em>Costa Brava</em>", sub="2026 Edition",
  tag="Rooted in architecture. Focused entirely on you.",
  foot="Find Your Haven · Costa Brava Guide 2026",
  k2="Before you begin", h2_2="What you'll find <em>in this guide</em>",
  p2a="This guide brings together, plainly and without filler, what any foreign buyer needs to know before buying a home on the Costa Brava or elsewhere on the Catalan coast: the real process step by step, the costliest and most common mistakes, and a first look at the areas where we work.",
  p2b="It isn't a sales pitch. It's the same judgement we apply with every client, boiled down to a few pages.",
  box_lead="One tip before you read on.",
  box=" If you already have a specific property in mind, the most valuable advice in this guide is step 3: don't move forward without a technical assessment, whether with us or with any other serious professional.",
  k3="Part 01", h2_3="The real process, <em>step by step</em>",
  steps=[("Your NIE, before you need it","It's required to buy, open a bank account or set up utilities. Applying early stops you losing a good property while you wait for an appointment."),
         ("Your real budget, not just the asking price","Add transfer tax, notary, land registry and administrative fees and, where it applies, a renovation range from day one."),
         ("A technical assessment before you commit","Structure, roof, installations, planning status. It's the only thing that lets you negotiate with real data, not hope."),
         ("Reservation contract, reviewed by a professional","Penalty clauses, deadlines and a financing contingency if you depend on a mortgage: never a generic translated template."),
         ("Completion at the notary, and what follows","Land registry, transferring utilities, local property tax (IBI) and, if you won't live here full-time, fiscal representation as a non-resident.")],
  k4="Part 02", h2_4="The five <em>costliest mistakes</em>",
  errs=[("Buying from photos and video alone",", with no in-person technical assessment before committing."),
        ("Underestimating the real cost of a renovation"," in an older building, above all the roof, structure and installations."),
        ("Signing a reservation contract from a generic template",", with no legal review tailored to the case."),
        ("Not checking licences",": the occupancy licence, and whether earlier renovations were legalised."),
        ("Coordinating everyone yourself",": agency, notary, architect and builder, none of whom know each other.")],
  box4="None of these mistakes is exclusive to inexperienced buyers. Almost always, they come from buying at a distance without someone working exclusively for you on the ground.",
  k5="Part 03", h2_5="Five areas, <em>five characters</em>",
  zones=[("Costa Brava","Coves, heritage and a well-established international market. Begur, Pals, Llafranc, Cadaqués.","€400K – €1.2M"),
         ("Inland Empordà","Farmhouses and estates with a character of their own. Peralada, Ullastret, Monells.","€200K – €750K"),
         ("Sitges / Garraf","An international landmark a short drive from Barcelona.","€350K – €900K"),
         ("Maresme","Close to Barcelona, with a quiet coastal character.","€280K – €700K"),
         ("Costa Daurada","Sun, long beaches and untapped potential.","€160K – €450K")],
  note="Indicative market prices (2025-2026). Subject to change depending on the property, its condition and exact location.",
  c_h2="What if the next step were <em>a conversation</em>?",
  c_p1="This guide is the summary. What really changes the outcome of a purchase is having someone on your side from the first call, with no extra charge for the coordination.",
  c_p2="Write to us and we'll reply within 24 hours, with specific questions and a clear first step.",
  legal="Find Your Haven — Catalan Coast. General informational guide; not a substitute for individual legal, tax or technical advice."),

"nl": dict(
  pdf="costa-brava-koopgids-2026.pdf",
  eyebrow="Find Your Haven &nbsp;·&nbsp; Catalaanse kust",
  h1="Gids voor het kopen aan de <em>Costa Brava</em>", sub="Editie 2026",
  tag="Geworteld in architectuur. Volledig gefocust op jou.",
  foot="Find Your Haven · Costa Brava Gids 2026",
  k2="Voordat je begint", h2_2="Wat je <em>in deze gids</em> vindt",
  p2a="Deze gids bundelt, direct en zonder opvulling, wat elke buitenlandse koper moet weten voordat hij een woning koopt aan de Costa Brava of elders aan de Catalaanse kust: het echte proces stap voor stap, de duurste en meest voorkomende fouten, en een eerste blik op de gebieden waar wij werken.",
  p2b="Het is geen verkooppraatje. Het is dezelfde afweging die wij bij elke klant maken, samengevat op een paar pagina's.",
  box_lead="Een tip voordat je verder leest.",
  box=" Heb je al een specifieke woning op het oog, dan is het waardevolste advies in deze gids dat van stap 3: ga niet verder zonder een technische beoordeling, bij ons of bij een andere serieuze professional.",
  k3="Deel 01", h2_3="Het echte proces, <em>stap voor stap</em>",
  steps=[("Je NIE, voordat je hem nodig hebt","Het is verplicht om te kopen, een bankrekening te openen of nutsvoorzieningen aan te sluiten. Op tijd aanvragen voorkomt dat je een goede woning mist terwijl je op een afspraak wacht."),
         ("Je echte budget, niet alleen de vraagprijs","Tel overdrachtsbelasting, notaris, kadaster en administratiekosten op en, indien van toepassing, vanaf het begin een renovatiemarge."),
         ("Een technische beoordeling voordat je je vastlegt","Structuur, dak, installaties, bouwkundige status. Het is het enige waarmee je kunt onderhandelen op basis van echte gegevens, niet van hoop."),
         ("Reserveringscontract, gecontroleerd door een professional","Boeteclausules, termijnen en een ontbindende voorwaarde voor financiering als je van een hypotheek afhangt: nooit met een generiek vertaald sjabloon."),
         ("Notariële overdracht en wat daarna komt","Inschrijving in het kadaster, overzetten van nutsvoorzieningen, onroerendgoedbelasting (IBI) en, als je er niet permanent woont, fiscale vertegenwoordiging als niet-ingezetene.")],
  k4="Deel 02", h2_4="De vijf <em>duurste fouten</em>",
  errs=[("Alleen kopen op basis van foto's en video",", zonder technische beoordeling ter plaatse voordat je je vastlegt."),
        ("De werkelijke renovatiekosten onderschatten"," in een ouder gebouw, vooral dak, structuur en installaties."),
        ("Een reserveringscontract tekenen op een generiek sjabloon",", zonder juridische controle op maat."),
        ("Vergunningen niet controleren",": de bewoningsvergunning, en of eerdere verbouwingen gelegaliseerd zijn."),
        ("Alles zelf coördineren",": makelaar, notaris, architect en aannemer, die elkaar niet kennen.")],
  box4="Geen van deze fouten is voorbehouden aan onervaren kopers. Bijna altijd komen ze voort uit op afstand kopen zonder iemand die ter plaatse uitsluitend voor jou werkt.",
  k5="Deel 03", h2_5="Vijf gebieden, <em>vijf karakters</em>",
  zones=[("Costa Brava","Baaien, erfgoed en een gevestigde internationale markt. Begur, Pals, Llafranc, Cadaqués.","€400K – €1,2M"),
         ("Binnenland Empordà","Boerderijen en landgoederen met een eigen karakter. Peralada, Ullastret, Monells.","€200K – €750K"),
         ("Sitges / Garraf","Een internationaal baken op korte afstand van Barcelona.","€350K – €900K"),
         ("Maresme","Dicht bij Barcelona, met een rustig kustkarakter.","€280K – €700K"),
         ("Costa Daurada","Zon, lange stranden en onaangeboord potentieel.","€160K – €450K")],
  note="Indicatieve marktprijzen (2025-2026). Onder voorbehoud van wijzigingen naargelang woning, staat en exacte ligging.",
  c_h2="En als de volgende stap <em>een gesprek</em> was?",
  c_p1="Deze gids is de samenvatting. Wat het resultaat van een aankoop echt verandert, is vanaf het eerste telefoontje iemand aan je zijde hebben, zonder extra kosten voor de coördinatie.",
  c_p2="Schrijf ons en we antwoorden binnen 24 uur, met concrete vragen en een duidelijke eerste stap.",
  legal="Find Your Haven — Catalaanse kust. Algemene informatieve gids; vervangt geen individueel juridisch, fiscaal of technisch advies."),

"fr": dict(
  pdf="guide-achat-costa-brava-2026.pdf",
  eyebrow="Find Your Haven &nbsp;·&nbsp; Côte catalane",
  h1="Guide pour acheter sur la <em>Costa Brava</em>", sub="Édition 2026",
  tag="Enracinés dans l'architecture. Entièrement centrés sur vous.",
  foot="Find Your Haven · Guide Costa Brava 2026",
  k2="Avant de commencer", h2_2="Ce que vous allez trouver <em>dans ce guide</em>",
  p2a="Ce guide réunit, de façon directe et sans remplissage, ce que tout acheteur étranger doit savoir avant d'acheter un bien sur la Costa Brava ou ailleurs sur la côte catalane&nbsp;: le vrai processus étape par étape, les erreurs les plus coûteuses et les plus fréquentes, et un premier aperçu des zones où nous travaillons.",
  p2b="Ce n'est pas un argumentaire commercial. C'est le même regard que nous appliquons avec chaque client, résumé en quelques pages.",
  box_lead="Un conseil avant de poursuivre.",
  box=" Si vous avez déjà un bien précis en tête, la recommandation la plus précieuse de ce guide est celle de l'étape 3&nbsp;: n'avancez pas sans évaluation technique, avec nous ou avec tout autre professionnel sérieux.",
  k3="Partie 01", h2_3="Le vrai processus, <em>étape par étape</em>",
  steps=[("Votre NIE, avant d'en avoir besoin","Il est obligatoire pour acheter, ouvrir un compte bancaire ou souscrire des abonnements. Le demander en amont évite de perdre un bon bien en attendant un rendez-vous."),
         ("Votre vrai budget, pas seulement le prix affiché","Ajoutez les droits de mutation, le notaire, l'enregistrement, la gestoria et, le cas échéant, une fourchette de rénovation dès le départ."),
         ("Une évaluation technique avant de vous engager","Structure, toiture, installations, situation urbanistique. C'est la seule façon de négocier avec des données réelles, pas avec de l'espoir."),
         ("Compromis et contrat, révisés par un professionnel","Clauses de pénalité, délais et condition suspensive de financement si vous dépendez d'un prêt&nbsp;: jamais avec un modèle générique traduit."),
         ("Signature chez le notaire et démarches suivantes","Registre foncier, transfert des abonnements, taxe foncière (IBI) et, si vous ne résidez pas ici à titre permanent, représentation fiscale en tant que non-résident.")],
  k4="Partie 02", h2_4="Les cinq erreurs <em>les plus coûteuses</em>",
  errs=[("Acheter uniquement sur photos et vidéo",", sans aucune évaluation technique sur place avant de s'engager."),
        ("Sous-estimer le coût réel d'une rénovation"," dans un bâtiment ancien, surtout toiture, structure et installations."),
        ("Signer un compromis sur un modèle générique",", sans révision juridique adaptée au cas précis."),
        ("Ne pas vérifier les permis","&nbsp;: le permis d'habiter, et si les rénovations antérieures ont été régularisées."),
        ("Tout coordonner seul","&nbsp;: agence, notaire, architecte et entrepreneur, qui ne se connaissent pas.")],
  box4="Aucune de ces erreurs n'est réservée aux acheteurs inexpérimentés. Presque toujours, elles viennent d'un achat à distance sans quelqu'un qui travaille exclusivement pour vous sur place.",
  k5="Partie 03", h2_5="Cinq zones, <em>cinq caractères</em>",
  zones=[("Costa Brava","Criques, patrimoine et marché international bien établi. Begur, Pals, Llafranc, Cadaqués.","400K – 1,2M €"),
         ("Empordà intérieur","Masies et domaines au caractère propre. Peralada, Ullastret, Monells.","200K – 750K €"),
         ("Sitges / Garraf","Une référence internationale à deux pas de Barcelone.","350K – 900K €"),
         ("Maresme","Proche de Barcelone, au caractère côtier tranquille.","280K – 700K €"),
         ("Costa Daurada","Soleil, longues plages et potentiel encore à découvrir.","160K – 450K €")],
  note="Prix indicatifs du marché (2025-2026). Variables selon le bien, son état et sa localisation exacte.",
  c_h2="Et si la prochaine étape <em>était une conversation</em>&nbsp;?",
  c_p1="Ce guide est le résumé. Ce qui change vraiment le résultat d'un achat, c'est d'avoir quelqu'un à vos côtés dès le premier appel, sans frais supplémentaires pour la coordination.",
  c_p2="Écrivez-nous et nous vous répondons sous 24 heures, avec des questions précises et une première étape claire.",
  legal="Find Your Haven — Côte catalane. Guide informatif général&nbsp;; ne remplace pas un conseil juridique, fiscal ou technique individualisé."),
}

MARK = "../assets/img/brand/fyh-mark-white.png"

def body(s):
    steps = "".join(
        f'  <h3{" style=\"margin-top:0\"" if i == 0 else ""}><span class="num">{i+1}.</span>{t}</h3>\n  <p>{d}</p>\n'
        for i, (t, d) in enumerate(s["steps"]))
    errs = "".join(f'  <div class="err"><span class="num">{i+1}.</span><b style="font-family:\'FYHDM SemiBold\', Arial, sans-serif;">{b}</b>{r}</div>\n'
                   for i, (b, r) in enumerate(s["errs"]))
    z = s["zones"]
    def cell(x):
        n, d, p = x
        return f'<td><div class="zone"><h4>{n}</h4><p>{d}</p><div class="price">{p}</div></div></td>'
    zones = (f'<tr>{cell(z[0])}{cell(z[1])}</tr>\n    <tr>{cell(z[2])}{cell(z[3])}</tr>\n    <tr>{cell(z[4])}<td></td></tr>')
    return f'''<body>

<div class="page cover"><table><tr><td>
  <img src="{MARK}" alt="">
  <div class="eyebrow">{s["eyebrow"]}</div>
  <h1>{s["h1"]}</h1>
  <div class="sub">{s["sub"]}</div>
  <div class="tag">{s["tag"]}</div>
</td></tr></table></div>

<div class="page"><div class="inner">
  <div class="kicker">{s["k2"]}</div>
  <h2>{s["h2_2"]}</h2>
  <div class="rule"></div>
  <p>{s["p2a"]}</p>
  <p>{s["p2b"]}</p>
  <div class="box"><b style="font-family:'FYHDM SemiBold', Arial, sans-serif;">{s["box_lead"]}</b>{s["box"]}</div>
</div>
<div class="foot">{s["foot"]} <span>2</span></div></div>

<div class="page"><div class="inner">
  <div class="kicker">{s["k3"]}</div>
  <h2>{s["h2_3"]}</h2>
  <div class="rule"></div>
{steps}</div>
<div class="foot">{s["foot"]} <span>3</span></div></div>

<div class="page"><div class="inner">
  <div class="kicker">{s["k4"]}</div>
  <h2>{s["h2_4"]}</h2>
  <div class="rule"></div>
{errs}  <div class="box">{s["box4"]}</div>
</div>
<div class="foot">{s["foot"]} <span>4</span></div></div>

<div class="page"><div class="inner">
  <div class="kicker">{s["k5"]}</div>
  <h2>{s["h2_5"]}</h2>
  <div class="rule"></div>
  <table class="cols">
    {zones}
  </table>
  <p class="note">{s["note"]}</p>
</div>
<div class="foot">{s["foot"]} <span>5</span></div></div>

<div class="page closing"><table><tr><td><div class="wrapc">
  <img src="{MARK}" alt="">
  <h2>{s["c_h2"]}</h2>
  <p>{s["c_p1"]}</p>
  <p>{s["c_p2"]}</p>
  <div class="mail">hello@findyourhaven.com</div>
  <div class="web">findyourhaven.com</div>
</div></td></tr></table>
<div class="legal">{s["legal"]}</div></div>

</body></html>
'''

def main():
    head_tpl = open(os.path.join(HERE, "head.tpl"), encoding="utf-8").read()
    only = sys.argv[1:] or list(STR)
    for lang in only:
        s = STR[lang]
        html = head_tpl.format(lang=lang) + body(s)
        src = os.path.join(HERE, f"guide-{lang}.html")
        open(src, "w", encoding="utf-8").write(html)
        pdf = os.path.join(OUT_DIR, s["pdf"])
        r = subprocess.run(["wkhtmltopdf", "--quiet", "--enable-local-file-access", "--page-size", "A4",
                            "-T", "0", "-B", "0", "-L", "0", "-R", "0", "--disable-smart-shrinking", src, pdf],
                           capture_output=True, text=True)
        err = "\n".join(l for l in r.stderr.splitlines() if "XDG_RUNTIME_DIR" not in l)
        print(f"{lang}: {os.path.basename(pdf)}" + (f"\n{err}" if err.strip() else ""))

if __name__ == "__main__":
    main()
