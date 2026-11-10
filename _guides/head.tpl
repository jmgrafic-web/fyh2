<!DOCTYPE html>
<html lang="{lang}"><head><meta charset="UTF-8">
<!-- Generado por build_guides.py: no editar a mano (editar head.tpl o los textos del script). -->
<style>

@page{{ margin:0; }}
html{{ zoom:1.3; }}   /* compensa el escalado (≈77 %) de wkhtmltopdf sin Qt parcheado */
*{{ box-sizing:border-box; margin:0; padding:0; }}
html,body{{ width:210mm; background:#F7F5F2; }}
body{{ font-family:"FYHDM", Arial, sans-serif; font-size:10.5pt; line-height:1.62; color:#1E1C1A; }}
.page{{ position:relative; width:210mm; height:296.6mm; overflow:hidden; page-break-after:always; background:#F7F5F2; }}
.page:last-child{{ page-break-after:auto; }}
.inner{{ padding:30mm 24mm 0 24mm; }}

h1,h2{{ font-family:"FYHCG Light", Georgia, serif; font-weight:normal; color:#1E1C1A; }}
b, strong{{ font-weight:normal; }}
h2{{ font-size:30pt; line-height:1.1; letter-spacing:-.2pt; margin:0 0 7mm; }}
h2 em, h1 em{{ font-family:"FYHCG Italic", Georgia, serif; font-style:normal; font-weight:normal; color:#A8794F; }}
h3{{ font-family:"FYHCG Medium", Georgia, serif; font-weight:normal; color:#1E1C1A; font-size:15pt; line-height:1.25; margin:7mm 0 1.6mm; }}
.kicker{{ font-family:"FYHDM SemiBold", Arial, sans-serif; font-size:8pt; font-weight:normal; letter-spacing:2.2pt; text-transform:uppercase; color:#8C8680; margin-bottom:4mm; }}
p{{ margin:0 0 3.6mm; color:#3b3835; }}
.rule{{ width:16mm; height:2px; background:#405C70; margin:0 0 7mm; }}

.box{{ background:#E8E0D4; border-left:3px solid #405C70; padding:5mm 6mm; margin:8mm 0 0; font-size:10.5pt; }}
.num{{ font-family:"FYHCG Italic", Georgia, serif; font-style:normal; font-weight:normal; color:#A8794F; font-size:15pt; margin-right:2mm; }}

table.cols{{ width:100%; border-collapse:collapse; margin-top:3mm; }}
table.cols td{{ width:50%; vertical-align:top; padding:0 6mm 7mm 0; }}
.zone{{ border-top:1px solid #C9BCAB; padding-top:3.5mm; }}
.zone h4{{ font-family:"FYHCG Medium", Georgia, serif; font-weight:normal; font-size:15pt; margin-bottom:1mm; }}
.zone p{{ font-size:9.5pt; color:#5A5652; margin:0; }}
.price{{ font-family:"FYHDM SemiBold", Arial, sans-serif; font-size:8.5pt; font-weight:normal; letter-spacing:.6pt; color:#405C70; margin-top:1.6mm; }}
.err{{ border-top:1px solid #C9BCAB; padding:4.2mm 0; }}
.err:last-of-type{{ border-bottom:1px solid #C9BCAB; }}
.err b{{ font-family:"FYHDM SemiBold", Arial, sans-serif; font-weight:normal; color:#1E1C1A; }}

.foot{{ position:absolute; left:24mm; right:24mm; bottom:12mm; font-size:7.5pt; letter-spacing:1.6pt; text-transform:uppercase; color:#8C8680; border-top:1px solid #C9BCAB; padding-top:3mm; }}
.foot span{{ float:right; }}
.note{{ font-size:8.5pt; color:#8C8680; margin-top:6mm; }}

/* portada y cierre (a sangre) */
.dark{{ color:#F7F5F2; }}
.cover{{ background:#22333F; box-shadow:8mm 8mm 0 0 #22333F, 0 8mm 0 0 #22333F, 8mm 0 0 0 #22333F; }}
.cover table, .closing table{{ width:100%; height:296mm; border-collapse:collapse; }}
.cover td, .closing td{{ text-align:center; vertical-align:middle; }}
.cover img{{ width:21mm; height:auto; margin:0 auto 12mm; display:block; }}
.cover .eyebrow{{ font-family:"FYHDM SemiBold", Arial, sans-serif; font-size:8.5pt; font-weight:normal; letter-spacing:3.2pt; text-transform:uppercase; color:rgba(247,245,242,.7); margin-bottom:9mm; }}
.cover h1{{ font-family:"FYHCG Light", Georgia, serif; font-size:50pt; line-height:1.03; letter-spacing:-.6pt; color:#F7F5F2; padding:0 22mm; margin-bottom:7mm; }}
.cover h1 em{{ color:#C4956A; }}
.cover .sub{{ font-family:"FYHCG Italic", Georgia, serif; font-style:normal; font-size:19pt; color:#C4956A; margin-bottom:26mm; }}
.cover .tag{{ font-size:8pt; letter-spacing:2.4pt; text-transform:uppercase; color:rgba(247,245,242,.6); }}
.closing{{ background:#405C70; box-shadow:8mm 8mm 0 0 #405C70, 0 8mm 0 0 #405C70, 8mm 0 0 0 #405C70; }}
.closing .wrapc{{ padding:0 28mm; }}
.closing img{{ width:15mm; height:auto; margin:0 auto 10mm; display:block; }}
.closing h2{{ color:#F7F5F2; font-size:34pt; margin-bottom:8mm; }}
.closing h2 em{{ color:#E8E0D4; }}
.closing p{{ color:rgba(247,245,242,.88); font-size:11pt; }}
.closing .mail{{ font-family:"FYHCG Light", Georgia, serif; font-size:21pt; color:#F7F5F2; margin-top:12mm; margin-bottom:1mm; }}
.closing .web{{ font-size:9pt; letter-spacing:2pt; text-transform:uppercase; color:rgba(247,245,242,.72); }}
.closing .legal{{ position:absolute; left:28mm; right:28mm; bottom:12mm; font-size:7.5pt; line-height:1.5; color:rgba(247,245,242,.6); border-top:1px solid rgba(247,245,242,.25); padding-top:3mm; text-align:left; }}
</style></head>
