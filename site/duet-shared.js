/* Duet: strings and comparison shared by the app (index.html) and the invitation page (d.html). */
(function(){
const S={
 he:{btn:"דואט",t:"בודקים ביחד",lead:"בדקו את הרעיון יחד עם אדם שאוהבים",p:"האדם השני עונה על כמה שאלות קצרות מהצד שלו, ואתם רואים איפה אתם מסכימים ואיפה כדאי לדבר.",
  priv:"מי שיש לו את הקישור יראה את הרעיון ואת התשובות. הקישור פג אחרי 7 ימים, ואפשר למחוק אותו בכל רגע.",you:"התשובות שלכם",
  q:[["כמה זמן אפשר להשקיע בשבוע",["שעתיים","5 שעות","10 שעות ומעלה"]],["מה הכי מדאיג אתכם",["כסף","זמן","שזה לא ילך"]],["כמה אתם מאמינים ברעיון",["1","2","3","4","5"]]],
  create:"צרו קישור",creating:"יוצרים קישור…",linkT:"הקישור מוכן",linkS:"שלחו אותו לאדם שאוהבים. כשיענה, ההשוואה תופיע כאן.",share:"שלחו",copy:"העתקת קישור",copied:"הקישור הועתק",
  waiting:"ממתינים לתשובה של האדם השני",check:"בדקו אם ענו",expires:"הקישור פג ב־{d}",del:"מחיקת הקישור",shareText:"בדקתי רעיון ב־Wazo ואשמח לדעת מה דעתכם. עונים על שלוש שאלות קצרות:",
  err:"לא הצלחנו כרגע. נסו שוב עוד רגע.",off:"הפיצר עוד לא זמין כרגע.",limit:"יצרתם הרבה קישורים היום. נסו שוב מחר.",
  go:"ראו את ההשוואה",back:"חזרה",cmpT:"איפה אתם נפגשים",ok:"מסכימים",no:"לא מסכימים",you1:"אתם",other:"האדם השני",titles:["כמה זמן להשקיע","מה מדאיג","כמה מאמינים ברעיון"],talkT:"שאלה אחת לשיחה",
  talks:{time:"מה יקרה לרעיון אם יש רק {x} בשבוע?",worry:"מה אפשר לעשות השבוע כדי להקטין את הדאגה הזו: \"{x}\"?",belief:"מה צריך לקרות כדי ששניכם תאמינו ברעיון באותה מידה?",all:"מה הצעד הראשון שאתם מוכנים לעשות יחד השבוע?"},proT:"השאלה לשיחה היא חלק מ־Pro",proGo:"פתחו את Pro",
  inviteT:"הוזמנתם לבדוק רעיון ביחד",inviteP:"מישהו שאוהב אתכם רוצה לדעת מה דעתכם על הרעיון הזה. עונים על שלוש שאלות, ורואים ביחד איפה אתם מסכימים.",ideaLbl:"הרעיון",seen:"התשובות שלכם יופיעו גם אצל מי ששלח את הקישור.",sending:"שולחים…",
  already:"כבר ענו על ההזמנה הזאת.",gone:"הקישור פג או נמחק.",tryOwn:"בדקו רעיון משלכם",tryS:"בחינם, בלי הרשמה"},
 en:{btn:"Duet",t:"Checking together",lead:"Check the idea with someone you love",p:"The other person answers a few short questions from their side, and you see where you agree and where it's worth talking.",
  priv:"Anyone with the link will see the idea and the answers. The link expires after 7 days, and you can delete it any time.",you:"Your answers",
  q:[["How much time can you put in each week",["2 hours","5 hours","10 hours or more"]],["What worries you most",["Money","Time","That it won't work"]],["How much do you believe in the idea",["1","2","3","4","5"]]],
  create:"Create a link",creating:"Creating the link…",linkT:"Your link is ready",linkS:"Send it to someone you love. When they answer, the comparison appears here.",share:"Send",copy:"Copy link",copied:"Link copied",
  waiting:"Waiting for the other person to answer",check:"Check for an answer",expires:"The link expires on {d}",del:"Delete the link",shareText:"I checked an idea on Wazo and I'd love to know what you think. Three short questions:",
  err:"That didn't work just now. Try again in a moment.",off:"This feature isn't available right now.",limit:"You created a lot of links today. Try again tomorrow.",
  go:"See the comparison",back:"Back",cmpT:"Where you meet",ok:"Agree",no:"Differ",you1:"You",other:"Other person",titles:["How much time to put in","What worries you","How much you believe in it"],talkT:"One question to talk about",
  talks:{time:"What happens to the idea if there are only {x} a week?",worry:"What could you do this week to make this worry smaller: \"{x}\"?",belief:"What would need to happen for you both to believe in the idea equally?",all:"What is the first step you're ready to take together this week?"},proT:"The question to talk about is part of Pro",proGo:"Open Pro",
  inviteT:"You're invited to check an idea together",inviteP:"Someone who cares about you wants to know what you think of this idea. Answer three questions and see together where you agree.",ideaLbl:"The idea",seen:"Your answers will also appear for the person who sent the link.",sending:"Sending…",
  already:"This invitation was already answered.",gone:"This link expired or was deleted.",tryOwn:"Check an idea of your own",tryS:"Free, no sign-up"},
 es:{btn:"Dúo",t:"Comprobar juntos",lead:"Comprueba la idea con alguien a quien quieres",p:"La otra persona responde unas preguntas cortas desde su lado, y tú ves en qué coinciden y de qué vale la pena hablar.",
  priv:"Quien tenga el enlace verá la idea y las respuestas. El enlace caduca a los 7 días y puedes borrarlo cuando quieras.",you:"Tus respuestas",
  q:[["Cuánto tiempo puedes dedicar por semana",["2 horas","5 horas","10 horas o más"]],["Qué es lo que más te preocupa",["El dinero","El tiempo","Que no funcione"]],["Cuánto crees en la idea",["1","2","3","4","5"]]],
  create:"Crear enlace",creating:"Creando el enlace…",linkT:"Tu enlace está listo",linkS:"Envíaselo a alguien a quien quieres. Cuando responda, la comparación aparecerá aquí.",share:"Enviar",copy:"Copiar enlace",copied:"Enlace copiado",
  waiting:"Esperando la respuesta de la otra persona",check:"Ver si ya respondió",expires:"El enlace caduca el {d}",del:"Borrar el enlace",shareText:"Comprobé una idea en Wazo y me encantaría saber qué piensas. Tres preguntas cortas:",
  err:"No funcionó ahora. Inténtalo de nuevo en un momento.",off:"Esta función no está disponible ahora.",limit:"Creaste muchos enlaces hoy. Inténtalo mañana.",
  go:"Ver la comparación",back:"Volver",cmpT:"Dónde se encuentran",ok:"Coinciden",no:"Difieren",you1:"Tú",other:"La otra persona",titles:["Cuánto tiempo dedicar","Qué preocupa","Cuánto se cree en la idea"],talkT:"Una pregunta para conversar",
  talks:{time:"¿Qué pasa con la idea si solo hay {x} por semana?",worry:"¿Qué podrían hacer esta semana para reducir esta preocupación: «{x}»?",belief:"¿Qué tendría que pasar para que ambos crean en la idea por igual?",all:"¿Cuál es el primer paso que están dispuestos a dar juntos esta semana?"},proT:"La pregunta para conversar es parte de Pro",proGo:"Abrir Pro",
  inviteT:"Te invitaron a comprobar una idea juntos",inviteP:"Alguien que te quiere desea saber qué piensas de esta idea. Responde tres preguntas y vean juntos en qué coinciden.",ideaLbl:"La idea",seen:"Tus respuestas también las verá quien envió el enlace.",sending:"Enviando…",
  already:"Esta invitación ya fue respondida.",gone:"Este enlace caducó o fue borrado.",tryOwn:"Comprueba una idea tuya",tryS:"Gratis, sin registro"},
 fr:{btn:"Duo",t:"Vérifier ensemble",lead:"Vérifiez l'idée avec une personne que vous aimez",p:"L'autre personne répond à quelques questions courtes de son côté, et vous voyez où vous êtes d'accord et de quoi il vaut la peine de parler.",
  priv:"Toute personne ayant le lien verra l'idée et les réponses. Le lien expire après 7 jours et vous pouvez le supprimer à tout moment.",you:"Vos réponses",
  q:[["Combien de temps pouvez-vous y consacrer par semaine",["2 heures","5 heures","10 heures ou plus"]],["Qu'est-ce qui vous inquiète le plus",["L'argent","Le temps","Que ça ne marche pas"]],["À quel point croyez-vous à l'idée",["1","2","3","4","5"]]],
  create:"Créer un lien",creating:"Création du lien…",linkT:"Votre lien est prêt",linkS:"Envoyez-le à une personne que vous aimez. Quand elle aura répondu, la comparaison apparaîtra ici.",share:"Envoyer",copy:"Copier le lien",copied:"Lien copié",
  waiting:"En attente de la réponse de l'autre personne",check:"Vérifier s'il y a une réponse",expires:"Le lien expire le {d}",del:"Supprimer le lien",shareText:"J'ai vérifié une idée sur Wazo et j'aimerais savoir ce que vous en pensez. Trois questions courtes :",
  err:"Ça n'a pas marché à l'instant. Réessayez dans un moment.",off:"Cette fonction n'est pas disponible pour le moment.",limit:"Vous avez créé beaucoup de liens aujourd'hui. Réessayez demain.",
  go:"Voir la comparaison",back:"Retour",cmpT:"Où vous vous retrouvez",ok:"D'accord",no:"Pas d'accord",you1:"Vous",other:"L'autre personne",titles:["Temps à consacrer","Ce qui inquiète","Confiance dans l'idée"],talkT:"Une question pour en parler",
  talks:{time:"Que devient l'idée s'il n'y a que {x} par semaine ?",worry:"Que pourriez-vous faire cette semaine pour réduire cette inquiétude : « {x} » ?",belief:"Que faudrait-il pour que vous croyiez tous les deux autant à l'idée ?",all:"Quelle est la première étape que vous êtes prêts à franchir ensemble cette semaine ?"},proT:"La question pour en parler fait partie de Pro",proGo:"Ouvrir Pro",
  inviteT:"Vous êtes invité à vérifier une idée ensemble",inviteP:"Une personne qui tient à vous veut savoir ce que vous pensez de cette idée. Répondez à trois questions et voyez ensemble où vous êtes d'accord.",ideaLbl:"L'idée",seen:"Vos réponses apparaîtront aussi chez la personne qui a envoyé le lien.",sending:"Envoi…",
  already:"Cette invitation a déjà reçu une réponse.",gone:"Ce lien a expiré ou a été supprimé.",tryOwn:"Vérifiez une idée à vous",tryS:"Gratuit, sans inscription"}
};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const str=l=>S[l]||S.en;
/* a = answers of the first person, p = of the second; the belief question counts as agreement within one step */
function compare(a,p){
  const same=[a[0]===p[0],a[1]===p[1],Math.abs(a[2]-p[2])<=1], k=same.indexOf(false);
  return {same,kind:k<0?"all":["time","worry","belief"][k]};
}
function chips(l,qi,sel,{locked}={}){
  const q=str(l).q[qi];
  return `<div class="dchips" role="group" aria-label="${esc(q[0])}">${q[1].map((o,i)=>`<button type="button" class="dchip" ${locked?"disabled":`data-dq="${qi}" data-dv="${i}"`} aria-pressed="${i===sel}">${esc(o)}</button>`).join("")}</div>`;
}
function questions(l,a){ return str(l).q.map((q,i)=>`<div class="dq"><b>${esc(q[0])}</b>${chips(l,i,a[i])}</div>`).join(""); }
/* the comparison block; `a` is "you", `p` the other person. proHref: where the locked question sends people */
function compareHTML(l,a,p,talkOpen,{proAction}={}){
  const d=str(l), {same,kind}=compare(a,p), val=(i,k)=>d.q[i][1][k];
  const rows=d.titles.map((ti,i)=>`<div class="cmprow ${same[i]?"ok":"no"}"><span class="tg">${esc(same[i]?d.ok:d.no)}</span><strong>${esc(ti)}</strong><div class="dtwo"><span>${esc(d.you1)} <b>${esc(val(i,a[i]))}</b></span><span>${esc(d.other)} <b>${esc(val(i,p[i]))}</b></span></div></div>`).join("");
  const x=kind==="time"?val(0,Math.min(a[0],p[0])):kind==="worry"?val(1,p[1]):"";
  return `<h3 tabindex="-1" class="dh" id="duetH">${esc(d.cmpT)}</h3>${rows}
    <div class="dtalk ${talkOpen?"":"locked"}"><span class="tg">${esc(d.talkT)}</span><strong ${talkOpen?"":'aria-hidden="true"'}>${esc(d.talks[kind].replace("{x}",x))}</strong>${talkOpen?"":`<span>${esc(d.proT)}</span><button type="button" class="cta" ${proAction||'data-dgo="pro"'}>${esc(d.proGo)}</button>`}</div>`;
}
window.WZD={S,str,esc,compare,chips,questions,compareHTML};
})();
