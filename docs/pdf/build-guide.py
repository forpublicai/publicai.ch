"""Build the illustrated guide. Requires reportlab and Pillow."""
from pathlib import Path
import re, html
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Preformatted, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image as PILImage

ROOT=Path(__file__).resolve().parent
FONT=Path('/System/Library/Fonts/Supplemental')
if (FONT/'Arial.ttf').exists():
 for n,f in [('Guide','Arial.ttf'),('GuideBold','Arial Bold.ttf'),('GuideItalic','Arial Italic.ttf')]:
  pdfmetrics.registerFont(TTFont(n,str(FONT/f)))
 pdfmetrics.registerFontFamily('Guide',normal='Guide',bold='GuideBold',italic='GuideItalic',boldItalic='GuideBold')
else:
 for n,f in [('Guide','Helvetica'),('GuideBold','Helvetica-Bold'),('GuideItalic','Helvetica-Oblique')]:
  pdfmetrics.registerFont(pdfmetrics.Font(n, f, 'WinAnsiEncoding'))
 pdfmetrics.registerFontFamily('Guide',normal='Guide',bold='GuideBold',italic='GuideItalic',boldItalic='GuideBold')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyGuide',fontName='Guide',fontSize=10,leading=14.2,textColor=HexColor('#25303a'),spaceAfter=8))
styles.add(ParagraphStyle(name='TitleGuide',fontName='GuideBold',fontSize=25,leading=29,textColor=HexColor('#c82632'),spaceAfter=15))
styles.add(ParagraphStyle(name='HeadingGuide',fontName='GuideBold',fontSize=13,leading=17,spaceBefore=10,spaceAfter=7,textColor=HexColor('#17212c')))
styles.add(ParagraphStyle(name='CaptionGuide',fontName='GuideItalic',fontSize=8,leading=11,spaceAfter=10,textColor=HexColor('#596571')))
styles.add(ParagraphStyle(name='CodeGuide',fontName='Courier',fontSize=8,leading=11,backColor=HexColor('#f1f3f5'),borderPadding=9,spaceBefore=4,spaceAfter=12))

def fmt(s):
 s=html.escape(s)
 s=re.sub(r'`([^`]+)`',r'<font name="Courier" size="9">\1</font>',s)
 s=re.sub(r'\*\*([^*]+)\*\*',r'<b>\1</b>',s)
 return s

story=[]
lines=(ROOT/'quick-guide-for-content-contributors.md').read_text().splitlines()
i=0
while i<len(lines):
 line=lines[i]; i+=1
 if not line.strip(): continue
 if line=='<!-- page -->': story.append(PageBreak()); continue
 if line.startswith('```'):
  code=[]
  while i<len(lines) and not lines[i].startswith('```'):
   value=lines[i]
   code.append(value); i+=1
  i+=1
  story.append(Preformatted('\n'.join(code),styles['CodeGuide'])); continue
 m=re.match(r'!\[(.*?)\]\((.*?)\)',line)
 if m:
  path=ROOT/m[2]
  with PILImage.open(path) as im: w,h=im.size
  width=487
  maxheight={'home.png':265,'mission.png':235,'news.png':190,'article.png':175,'mobile-menu.png':255}.get(path.name,210)
  scale=min(width/w,maxheight/h)
  img=Image(str(path),width=w*scale,height=h*scale)
  img.hAlign='LEFT'
  story.append(KeepTogether([Spacer(1,5),img,Spacer(1,6),Paragraph(fmt(m[1]),styles['CaptionGuide'])])); continue
 if line.startswith('# '): story.append(Paragraph(fmt(line[2:]),styles['TitleGuide'])); continue
 if line.startswith('## '): story.append(Paragraph(fmt(line[3:]),styles['HeadingGuide'])); continue
 bullet=re.match(r'^(?:- |(\d+)\. )(.*)',line)
 if bullet:
  story.append(Paragraph(fmt(bullet[2]),styles['BodyGuide'],bulletText=(bullet[1]+'.' if bullet[1] else '\u2022'))); continue
 para=[line]
 while i<len(lines) and lines[i].strip() and not re.match(r'^(#|```|!\[|<!--|- |\d+\. )',lines[i]):
  para.append(lines[i]);i+=1
 story.append(Paragraph(fmt(' '.join(para)),styles['BodyGuide']))

def chrome(c,doc):
 c.setStrokeColor(HexColor('#dce0e4')); c.line(54,801,541,801)
 c.setFont('Helvetica',8);c.setFillColor(HexColor('#68717b'))
 c.drawString(54,812,'PUBLIC AI SWITZERLAND / CONTRIBUTOR GUIDE')
 c.drawString(54,30,'Quick Guide for Content Contributors | 8 October 2026')
 c.drawRightString(541,30,str(doc.page))
 c.setTitle('Quick Guide for Content Contributors')
 c.setAuthor('Public AI Switzerland')

SimpleDocTemplate(str(ROOT/'quick-guide-for-content-contributors.pdf'),pagesize=(595.28,841.89),rightMargin=54,leftMargin=54,topMargin=57,bottomMargin=52).build(story,onFirstPage=chrome,onLaterPages=chrome)
print(ROOT/'quick-guide-for-content-contributors.pdf')
