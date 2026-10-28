/* Landing page translations. Hebrew is the page itself; each entry maps the Hebrew text to [en, es, fr]. */
(function(){
const LANGS=["he","en","es","fr"], SHORT={he:"עב",en:"EN",es:"ES",fr:"FR"};
const D={
"מה תקבלו":["What you get","Qué recibes","Ce que vous obtenez"],
"איך זה עובד":["How it works","Cómo funciona","Comment ça marche"],
"נקודת פתיחה":["A starting point","Un punto de partida","Un point de départ"],
"מי אנחנו":["Who we are","Quiénes somos","Qui nous sommes"],
"בינה מלאכותית היא של כולם":["AI belongs to everyone","La IA es de todos","L'IA appartient à tout le monde"],
"Wazo נולד מאמונה פשוטה: כל אחד ואחת ראויים ללמוד להשתמש בבינה מלאכותית ולהפיק ממנה את המיטב בשבילם. לא רק מי שמבין בטכנולוגיה.":["Wazo comes from a simple belief: everyone deserves to learn to use AI and get the best out of it for themselves. Not only people who understand technology.","Wazo nace de una creencia simple: todos merecen aprender a usar la IA y sacarle el mejor provecho. No solo quienes entienden de tecnología.","Wazo naît d'une conviction simple : chacun mérite d'apprendre à utiliser l'IA et d'en tirer le meilleur pour soi. Pas seulement ceux qui s'y connaissent en technologie."],
"למידה מתוך עשייה":["Learning by doing","Aprender haciendo","Apprendre en faisant"],
"כל תשובה מסבירה למה, ולא רק מה. אחרי כמה בדיקות תדעו לשאול את הבינה המלאכותית שאלות טובות בעצמכם.":["Every answer explains why, not only what. After a few checks you will know how to ask AI good questions yourself.","Cada respuesta explica por qué, no solo qué. Tras unas cuantas pruebas sabrás hacerle buenas preguntas a la IA por tu cuenta.","Chaque réponse explique pourquoi, pas seulement quoi. Après quelques essais, vous saurez poser vous-même de bonnes questions à l'IA."],
"שימושי":["Useful","Útil","Utile"],
"כלי פשוט שנותן תשובה שאפשר לפעול לפיה כבר השבוע. בלי מילים גבוהות ובלי ללמוד מערכת חדשה.":["A simple tool that gives an answer you can act on this week. No big words, and no new system to learn.","Una herramienta simple que da una respuesta con la que puedes actuar esta semana. Sin palabras complicadas ni sistemas nuevos que aprender.","Un outil simple qui donne une réponse sur laquelle agir dès cette semaine. Sans grands mots et sans nouveau système à apprendre."],
"אנושי":["Human","Humano","Humain"],
"נבנה לאנשים ולא למומחים, מכל גיל ומכל רקע. אין צורך לדעת כלום מראש, ואף פעם לא מאוחר מדי להתחיל.":["Built for people, not experts, of any age and any background. No prior knowledge needed, and it is never too late to start.","Hecho para personas, no para expertos, de cualquier edad y origen. No hace falta saber nada de antemano, y nunca es tarde para empezar.","Conçu pour les gens, pas pour les experts, de tous âges et de tous horizons. Aucune connaissance préalable requise, et il n'est jamais trop tard pour commencer."],
"דואט":["Duet","Dúo","Duo"],
"לעבוד יחד":["Working together","Trabajar juntos","Travailler ensemble"],
"שלחו קישור לאדם שאוהבים. הוא עונה על שלוש שאלות קצרות, ואתם רואים ביחד איפה אתם מסכימים ואיפה כדאי לדבר.":["Send a link to someone you love. They answer three short questions, and together you see where you agree and where it's worth talking.","Envía un enlace a alguien a quien quieres. Responde tres preguntas cortas y juntos ven en qué coinciden y de qué vale la pena hablar.","Envoyez un lien à une personne que vous aimez. Elle répond à trois questions courtes, et ensemble vous voyez où vous êtes d'accord et de quoi il vaut la peine de parler."],
"שולחים קישור":["Send a link","Envías un enlace","Vous envoyez un lien"],
"אחרי שקיבלתם תשובה, לוחצים על דואט ושולחים קישור פרטי. בלי הרשמה, ובלי שהאדם השני צריך חשבון.":["After you get your answer, tap Duet and send a private link. No sign-up, and the other person doesn't need an account.","Después de tu respuesta, pulsas Dúo y envías un enlace privado. Sin registro, y la otra persona no necesita cuenta.","Après votre réponse, appuyez sur Duo et envoyez un lien privé. Sans inscription, et l'autre personne n'a pas besoin de compte."],
"האדם השני עונה":["The other person answers","La otra persona responde","L'autre personne répond"],
"כמה זמן אפשר להשקיע, מה מדאיג, וכמה מאמינים ברעיון. זה לוקח דקה.":["How much time they can put in, what worries them, and how much they believe in the idea. It takes a minute.","Cuánto tiempo puede dedicar, qué le preocupa y cuánto cree en la idea. Toma un minuto.","Combien de temps elle peut y consacrer, ce qui l'inquiète et à quel point elle croit à l'idée. Cela prend une minute."],
"רואים ביחד":["You see it together","Lo ven juntos","Vous voyez ensemble"],
"ההשוואה מראה במה אתם מסכימים, במה לא, ושאלה אחת לשיחה. הקישור פג אחרי 7 ימים ואפשר למחוק אותו בכל רגע.":["The comparison shows where you agree, where you don't, and one question to talk about. The link expires after 7 days and you can delete it any time.","La comparación muestra en qué coinciden, en qué no, y una pregunta para conversar. El enlace caduca a los 7 días y puedes borrarlo cuando quieras.","La comparaison montre où vous êtes d'accord, où non, et une question pour en parler. Le lien expire après 7 jours et vous pouvez le supprimer à tout moment."],
"דואט: שולחים קישור לאדם שאוהבים ורואים במה אתם מסכימים":["Duet: send a link to someone you love and see where you agree","Dúo: envía un enlace a alguien a quien quieres y mira en qué coinciden","Duo : envoyez un lien à une personne que vous aimez et voyez où vous êtes d'accord"],
"דואט: השאלה לשיחה, לפי מה שלא מסכימים עליו":["Duet: the question to talk about, based on where you disagree","Dúo: la pregunta para conversar, según en qué no coinciden","Duo : la question pour en parler, selon ce sur quoi vous n'êtes pas d'accord"],
"דואט: בדיקה ביחד עם אדם שאוהבים":["Duet: check an idea together with someone you love","Dúo: comprobar la idea juntos con alguien a quien quieres","Duo : vérifier l'idée ensemble avec une personne que vous aimez"],
"בדיקה ביחד עם אדם שאוהבים":["Check an idea together with someone you love","Comprobar la idea juntos con alguien a quien quieres","Vérifier l'idée ensemble avec une personne que vous aimez"],
"פרטיות":["Privacy","Privacidad","Confidentialité"],
"מחירים":["Pricing","Precios","Tarifs"],
"נסו עכשיו":["Try it now","Pruébalo ya","Essayez maintenant"],
"נסו עכשיו, בחינם":["Try it now, free","Pruébalo ya, gratis","Essayez maintenant, gratuitement"],
"יש לי רעיון":["I have an idea","Tengo una idea","J'ai une idée"],
"אין לי רעיון":["I have no idea yet","Aún no tengo idea","Je n'ai pas encore d'idée"],
"הרעיון שלך":["Your idea","Tu idea","Votre idée"],
"הרחב לי":["Expand it for me","Amplíala","Développez-la"],
"כתבו אותו בכמה מילים, ובדקות תדעו אם להתחיל, לחדד או לחשוב מחדש.":["Write it down and know in minutes: start, sharpen or rethink.","Escríbela y en minutos sabrás si empezar, afinar o replantear.","Écrivez-la et sachez en quelques minutes : démarrer, affiner ou repenser."],
"חמישה כרטיסים. כל אחד עונה על שאלה אחת פשוטה":["Five cards. Each one answers one simple question","Cinco tarjetas. Cada una responde una pregunta sencilla","Cinq cartes. Chacune répond à une question simple"],
"דלגו לתוכן":["Skip to content","Saltar al contenido","Aller au contenu"],
"גללו להציץ פנימה":["Scroll to peek inside","Desplázate para echar un vistazo","Faites défiler pour jeter un œil"],
"תשובה ברורה, בחמישה כרטיסים":["A clear answer, in five cards","Una respuesta clara, en cinco tarjetas","Une réponse claire, en cinq cartes"],
"01 · כמה חזק":["01 · How strong","01 · Qué tan fuerte","01 · Quelle force"],
"02 · הכסף":["02 · The money","02 · El dinero","02 · L'argent"],
"03 · ניסוי לשבוע":["03 · One-week test","03 · Prueba de una semana","03 · Test d'une semaine"],
"04 · מי כבר ניסה":["04 · Who tried","04 · Quién lo intentó","04 · Qui a essayé"],
"05 · ומה עכשיו":["05 · And now?","05 · ¿Y ahora?","05 · Et maintenant ?"],
"כדאי להתחיל":["Worth starting","Vale la pena empezar","À tenter"],
"כמה הרעיון חזק":["How strong the idea is","Qué tan fuerte es la idea","La force de l'idée"],
"כמה אפשר להרוויח":["How much it could earn","Cuánto podría ganar","Combien ça peut rapporter"],
"ניסוי קטן לשבוע":["A small test for a week","Una prueba pequeña para una semana","Un petit test pour une semaine"],
"מי כבר ניסה":["Who already tried","Quién ya lo intentó","Qui a déjà essayé"],
"ומה עושים עכשיו":["And what now","Y ahora qué hacer","Et maintenant, que faire"],
"ארבע נקודות פשוטות: האם הבעיה אמיתית, יש מי שרוצה, כמה מתחרים, והאם ישלמו.":["Four simple scores: is the problem real, does anyone want it, how many competitors, and will they pay.","Cuatro notas sencillas: ¿el problema es real?, ¿alguien lo quiere?, ¿cuántos competidores hay? y ¿pagarán?","Quatre notes simples : le problème est-il réel, quelqu'un en veut-il, combien de concurrents, et paiera-t-on ?"],
"מחיר שאפשר לשנות, שלושה תרחישים, ומה יכול לקלקל את החישוב.":["A price you can change, three scenarios, and what could spoil the math.","Un precio que puedes cambiar, tres escenarios y qué podría estropear las cuentas.","Un prix modifiable, trois scénarios, et ce qui pourrait fausser le calcul."],
"דבר אחד לעשות, כמה זה עולה ואיך תדעו שהצליח. אפשר לקבל תזכורת ביומן.":["One thing to do, what it costs and how you'll know it worked. You can get a calendar reminder.","Una cosa que hacer, cuánto cuesta y cómo sabrás que funcionó. Puedes recibir un recordatorio en el calendario.","Une chose à faire, son coût et comment savoir si ça a marché. Vous pouvez recevoir un rappel dans votre agenda."],
"מי ניסה דבר דומה ומה קרה לו, מי עושה את זה היום, ומה עוד חסר בישראל.":["Who tried something similar and what happened, who does it today, and what's still missing in Israel.","Quién probó algo parecido y qué pasó, quién lo hace hoy y qué falta todavía en Israel.","Qui a essayé quelque chose de semblable et ce qui s'est passé, qui le fait aujourd'hui, et ce qui manque encore en Israël."],
"תשובה כנה במשפט אחד, על מה היא נשענת, וטיפ אחד מעשי שאפשר לעשות כבר השבוע.":["An honest answer in one sentence, what it rests on, and one practical tip you can do this week.","Una respuesta honesta en una frase, en qué se apoya y un consejo práctico para esta semana.","Une réponse honnête en une phrase, ce sur quoi elle repose, et un conseil pratique pour cette semaine."],
"חינם":["Free","Gratis","Gratuit"],
"הניתוח נכתב על ידי בינה מלאכותית (Claude)":["The analysis is written by AI (Claude)","El análisis lo escribe una inteligencia artificial (Claude)","L'analyse est rédigée par une IA (Claude)"],
"הנתונים נשמרים באירופה":["Data is stored in Europe","Los datos se guardan en Europa","Les données sont stockées en Europe"],
"לא מוכרים מידע":["We don't sell your data","No vendemos tus datos","Nous ne vendons pas vos données"],
"עברית, אנגלית, ספרדית וצרפתית":["Hebrew, English, Spanish and French","Hebreo, inglés, español y francés","Hébreu, anglais, espagnol et français"],
"שלושה צעדים":["Three steps","Tres pasos","Trois étapes"],
"כותבים את הרעיון":["Write your idea","Escribes tu idea","Vous écrivez votre idée"],
"משפט או שניים מספיקים. אין רעיון עדיין? כתבו מה מעניין אתכם ואציע רעיונות.":["A sentence or two is enough. No idea yet? Write what interests you and Wazo will suggest ideas.","Con una o dos frases basta. ¿Aún no tienes idea? Escribe qué te interesa y Wazo te sugiere ideas.","Une phrase ou deux suffisent. Pas encore d'idée ? Écrivez ce qui vous intéresse et Wazo vous en propose."],
"מקבלים תמונה ברורה":["You get a clear picture","Recibes una imagen clara","Vous obtenez une image claire"],
"כמה הרעיון חזק, כמה אפשר להרוויח ממנו, וניסוי קטן לשבוע.":["How strong the idea is, how much it could earn, and a small test for a week.","Qué tan fuerte es la idea, cuánto podría ganar y una pequeña prueba para una semana.","La force de l'idée, ce qu'elle peut rapporter, et un petit test pour une semaine."],
"מחליטים מה הלאה":["You decide what's next","Decides qué sigue","Vous décidez de la suite"],
"תשובה כנה: כדאי להתחיל, כדאי לחדד, או כדאי לעצור כאן, ומה עושים במקום.":["An honest answer: worth starting, worth sharpening, or better to stop here, and what to do instead.","Una respuesta honesta: vale la pena empezar, conviene afinar o es mejor parar aquí, y qué hacer en su lugar.","Une réponse honnête : ça vaut le coup, il faut affiner, ou mieux vaut s'arrêter là, et que faire à la place."],
"לכל מי שיש משהו בראש":["For anyone with something on their mind","Para cualquiera que tenga algo en mente","Pour toute personne qui a quelque chose en tête"],
"לא צריך להיות יזם או להבין בעסקים. כתבו בשפה שלכם לטובת:":["You don't need to be an entrepreneur or understand business. Write in your own words, for:","No hace falta ser emprendedor ni entender de negocios. Escribe con tus palabras, para:","Pas besoin d'être entrepreneur ni de s'y connaître en affaires. Écrivez avec vos mots, pour :"],
"השהיה":["Pause","Pausar","Pause"],
"המשך":["Resume","Reanudar","Reprendre"],
"עסק קטן":["Small business","Negocio pequeño","Petite entreprise"],
"עבודה חדשה והסבה":["A new job or career change","Un nuevo trabajo o cambio de carrera","Un nouveau travail ou une reconversion"],
"ללמד משהו":["Teach something","Enseñar algo","Enseigner quelque chose"],
"פרויקט שישאר אחריי":["A project that outlasts me","Un proyecto que me sobreviva","Un projet qui me survivra"],
"אתר או אפליקציה":["A website or app","Un sitio web o una app","Un site ou une appli"],
"מוצר שבונים יחד עם אדם שאוהבים":["A product you build with someone you love","Un producto que construyes con alguien a quien quieres","Un produit que l'on construit avec une personne qu'on aime"],
"תוכן וקהילה":["Content and community","Contenido y comunidad","Contenu et communauté"],
"הרעיון שלכם נשאר שלכם":["Your idea stays yours","Tu idea sigue siendo tuya","Votre idée reste la vôtre"],
"אנחנו לא מוכרים אותו, לא משתפים אותו ולא מפרסמים אותו. Wazo נועד לעזור לכם להתחיל בלבד.":["We don't sell it, share it or publish it. Wazo is here only to help you start.","No la vendemos, no la compartimos ni la publicamos. Wazo está solo para ayudarte a empezar.","Nous ne la vendons pas, ne la partageons pas et ne la publions pas. Wazo est là uniquement pour vous aider à commencer."],
"שיתוף הוא בחירה שלכם":["Sharing is your choice","Compartir es tu decisión","Partager est votre choix"],
"אם תבדקו רעיון עם אדם שאוהבים, מי שיש לו את הקישור יראה את הרעיון ואת התשובות. הקישור פג אחרי 7 ימים, ואפשר למחוק אותו בכל רגע.":["If you check an idea with someone you love, anyone with the link will see the idea and the answers. The link expires after 7 days, and you can delete it any time.","Si compruebas una idea con alguien a quien quieres, quien tenga el enlace verá la idea y las respuestas. El enlace caduca a los 7 días y puedes borrarlo cuando quieras.","Si vous vérifiez une idée avec une personne que vous aimez, toute personne ayant le lien verra l'idée et les réponses. Le lien expire après 7 jours et vous pouvez le supprimer à tout moment."],
"נשמר רק כדי לעבוד":["Saved only so it can work","Se guarda solo para funcionar","Conservée seulement pour fonctionner"],
"הרעיון והניתוח נשמרים בשרת באיחוד האירופי כדי להפיק את הניתוח ולהחזיר לך אותו. עותק נשמר גם במכשיר שלך. אפשר לבקש מחיקה של הפרטים בכל רגע, מתוך האפליקציה.":["The idea and analysis are stored on a server in the European Union so we can produce the analysis and return it to you. A copy is also kept on your device. You can ask for your details to be deleted at any time, from the app.", "La idea y el análisis se guardan en un servidor de la Unión Europea para generar el análisis y devolvértelo. También se guarda una copia en tu dispositivo. Puedes pedir que se borren tus datos en cualquier momento, desde la aplicación.", "L'idée et l'analyse sont stockées sur un serveur de l'Union européenne pour produire l'analyse et vous la rendre. Une copie est aussi conservée sur votre appareil. Vous pouvez demander la suppression de vos données à tout moment, depuis l'application."],
"לא נמכר, לא משותף":["Not sold, not shared","Ni vendida ni compartida","Ni vendue, ni partagée"],
"הרעיון לא נמכר ולא מועבר לאף אחד כדי לפרסם או לשווק. הוא נשלח ל־Anthropic רק לצורך כתיבת הניתוח.":["The idea isn't sold or handed to anyone to advertise or market. It is sent to Anthropic only to write the analysis.","La idea no se vende ni se entrega a nadie para publicidad o marketing. Se envía a Anthropic solo para escribir el análisis.","L'idée n'est ni vendue ni transmise à quiconque pour de la publicité ou du marketing. Elle est envoyée à Anthropic uniquement pour rédiger l'analyse."],
"בלי מעקב":["No tracking","Sin seguimiento","Sans suivi"],
"אין עוגיות מעקב, ואין פרופיל פרסום עליכם. יש רק בדיקה שמוודאת שאתם אדם ולא רובוט.":["There are no tracking cookies and no advertising profile of you. There is only a check that you're a person, not a robot.","No hay cookies de seguimiento ni un perfil publicitario tuyo. Solo hay una comprobación de que eres una persona y no un robot.","Il n'y a ni cookies de suivi ni profil publicitaire sur vous. Il y a seulement une vérification que vous êtes une personne et non un robot."],
"אתם מחליטים":["You decide","Tú decides","Vous décidez"],
"אפשר לבקש מחיקה של הפרטים בכל רגע, מתוך האפליקציה.":["You can ask for your details to be deleted at any time, from the app.","Puedes pedir que se borren tus datos en cualquier momento, desde la aplicación.","Vous pouvez demander la suppression de vos données à tout moment, depuis l'application."],
"עוזר להתחיל, לא מחליף אותך.":["Helps you start, doesn't replace you.","Te ayuda a empezar, no te sustituye.","Aide à commencer, ne vous remplace pas."],
"ל־Wazo אין סמכות שוק. הניתוח נכתב על ידי בינה מלאכותית שלא מחפשת באינטרנט בזמן הכתיבה, ולכן מספרים ושמות של חברות עלולים להיות לא מעודכנים. לכל ציון יש הסבר על מה הוא נשען. זו המלצה בלבד, ולא ייעוץ משפטי, כספי או עסקי.":["Wazo has no market authority. The analysis is written by an AI that doesn't search the internet while writing, so numbers and company names may be out of date. Every score comes with an explanation of what it rests on. This is a recommendation only, not legal, financial or business advice.","Wazo no tiene autoridad de mercado. El análisis lo escribe una IA que no busca en internet mientras escribe, así que las cifras y los nombres de empresas pueden estar desactualizados. Cada nota viene con una explicación de en qué se apoya. Es solo una recomendación, no asesoría legal, financiera ni empresarial.","Wazo n'a aucune autorité de marché. L'analyse est rédigée par une IA qui ne cherche pas sur internet pendant l'écriture, donc les chiffres et noms d'entreprises peuvent être périmés. Chaque note est accompagnée d'une explication de ce sur quoi elle repose. Ce n'est qu'une recommandation, pas un conseil juridique, financier ou commercial."],
"בודקים בחינם, משלמים כשצריך את העומק":["Check for free, pay when you need the depth","Revisa gratis, paga cuando necesites profundidad","Vérifiez gratuitement, payez quand vous avez besoin de profondeur"],
"/ לתמיד":["/ forever","/ para siempre","/ pour toujours"],
"/ לחודש":["/ month","/ mes","/ mois"],
"וואזו ללא הגבלה":["Unlimited wazos","Wazos sin límite","Wazos illimités"],
"כמה הרעיון חזק, בארבע נקודות":["How strong the idea is, in four scores","Qué tan fuerte es la idea, en cuatro notas","La force de l'idée, en quatre notes"],
"כמה אפשר להרוויח, עם מחיר שאפשר לשנות":["How much it could earn, with a price you can change","Cuánto podría ganar, con un precio que puedes cambiar","Combien ça peut rapporter, avec un prix modifiable"],
"עזרה בהרחבת רעיון, ורעיונות כשעוד אין":["Help expanding an idea, and ideas when you have none","Ayuda para ampliar una idea, e ideas cuando aún no tienes","De l'aide pour développer une idée, et des idées quand vous n'en avez pas"],
"20 מגמות עולמיות לדוגמה":["20 global trends as examples","20 tendencias mundiales de ejemplo","20 tendances mondiales en exemple"],
"היסטוריה שנשמרת במכשיר":["History saved on your device","Historial guardado en tu dispositivo","Historique conservé sur votre appareil"],
"הכול מהחבילה החינמית":["Everything in Free","Todo lo del plan gratuito","Tout ce qui est dans l'offre gratuite"],
"ניסוי קטן לשבוע, עם מעקב ותזכורת":["A small one-week test, with tracking and a reminder","Una pequeña prueba de una semana, con seguimiento y recordatorio","Un petit test d'une semaine, avec suivi et rappel"],
"מי כבר ניסה, מי מתחרה, ומה חסר בישראל":["Who already tried, who competes, and what's missing in Israel","Quién ya lo intentó, quién compite y qué falta en Israel","Qui a déjà essayé, qui est en concurrence, et ce qui manque en Israël"],
"התשובה המלאה: מה עושים עכשיו":["The full answer: what to do now","La respuesta completa: qué hacer ahora","La réponse complète : que faire maintenant"],
"ניתוח מעמיק: תוכנית, סיכונים וצעדים ל־90 יום":["Deep analysis: plan, risks and 90-day steps","Análisis profundo: plan, riesgos y pasos para 90 días","Analyse approfondie : plan, risques et étapes sur 90 jours"],
"שמירת תמונה והעתקה ל־AI":["Save as an image and copy to AI","Guardar como imagen y copiar a una IA","Enregistrer en image et copier vers une IA"],
"מנוי חודשי: מתחדש מדי חודש עד שתחליטו להפסיק, ואפשר לבטל בכל רגע.":["A monthly subscription: it renews each month until you decide to stop, and you can cancel any time.","Suscripción mensual: se renueva cada mes hasta que decidas parar, y puedes cancelar cuando quieras.","Abonnement mensuel : il se renouvelle chaque mois jusqu'à ce que vous décidiez d'arrêter, et vous pouvez annuler à tout moment."],
"בואו נתחיל":["Let's start","Empecemos","Commençons"],
"Wazo · וואזו © 2026 ·":["Wazo © 2026 ·","Wazo © 2026 ·","Wazo © 2026 ·"],
"תנאי שימוש":["Terms of use","Condiciones de uso","Conditions d'utilisation"],
"החזרים":["Refunds","Reembolsos","Remboursements"]
};
/* elements with inline markup, translated as a whole (data-i="key") */
const H={
paynote:['פרטים מלאים ב<a href="/he/pricing">עמוד המחירים</a> וב<a href="/he/refunds">מדיניות ההחזרים</a>.','Full details are on the <a href="/pricing">pricing page</a> and in the <a href="/refunds">refund policy</a>.','Los detalles completos están en la <a href="/pricing">página de precios</a> y en la <a href="/refunds">política de reembolsos</a>.','Tous les détails sont sur la <a href="/pricing">page des tarifs</a> et dans la <a href="/refunds">politique de remboursement</a>.'],
h1:['האם הרעיון שלי <em>יעשה כסף</em>?','Will my idea <em>make money</em>?','¿Mi idea <em>ganará dinero</em>?','Mon idée va-t-elle <em>rapporter</em> ?'],
say:['Wazo לא מחליט בשבילך<br>הוא <em>עוזר להתחיל</em>','Wazo doesn\'t decide for you<br>It <em>helps you start</em>','Wazo no decide por ti<br>Te <em>ayuda a empezar</em>','Wazo ne décide pas à votre place<br>Il <em>aide à commencer</em>'],
tl1:['<b>לפני שמשקיעים זמן וכסף</b>בדיקה של כמה דקות, לפני חודשים של עבודה.','<b>Before you invest time and money</b>A few minutes of checking, before months of work.','<b>Antes de invertir tiempo y dinero</b>Unos minutos de revisión, antes de meses de trabajo.','<b>Avant d\'investir temps et argent</b>Quelques minutes de vérification, avant des mois de travail.'],
tl2:['<b>עם ניסוי קטן ביד</b>דבר אחד לעשות השבוע, ואיך תדעו אם הצליח.','<b>With a small test in hand</b>One thing to do this week, and how you\'ll know if it worked.','<b>Con una pequeña prueba en la mano</b>Una cosa que hacer esta semana y cómo sabrás si funcionó.','<b>Avec un petit test en main</b>Une chose à faire cette semaine, et comment savoir si ça a marché.'],
tl3:['<b>ואז ההחלטה שלכם</b>זו המלצה ראשונה, לא תחליף לאדם מקצועי או לשיקול הדעת שלכם.','<b>Then the decision is yours</b>This is a first recommendation, not a replacement for a professional or your own judgment.','<b>Y luego la decisión es tuya</b>Es una primera recomendación, no sustituye a un profesional ni a tu criterio.','<b>Ensuite, la décision vous appartient</b>C\'est une première recommandation, pas un remplacement d\'un professionnel ni de votre jugement.']
};
/* dynamic UI strings: [he,en,es,fr] */
const U={
phHave:["כתבו כאן את הרעיון, בכמה מילים. למשל: ללמד מבוגרים להשתמש בטלפון החכם.","Write your idea here, in a few words. For example: teach older adults to use their smartphone.","Escribe aquí tu idea, en pocas palabras. Por ejemplo: enseñar a personas mayores a usar el teléfono inteligente.","Écrivez votre idée ici, en quelques mots. Par exemple : apprendre aux personnes âgées à utiliser leur smartphone."],
phNone:["מה מעניין אתכם? למשל: ילדים, בישול, מחשבים, לעזור לאנשים...","What interests you? For example: kids, cooking, computers, helping people...","¿Qué te interesa? Por ejemplo: niños, cocina, ordenadores, ayudar a la gente...","Qu'est-ce qui vous intéresse ? Par exemple : enfants, cuisine, informatique, aider les gens..."],
goHave:["בדקו את הרעיון","Check my idea","Revisar mi idea","Vérifier mon idée"],
goNone:["הציעו לי רעיונות","Suggest ideas","Sugiéreme ideas","Proposez-moi des idées"],
hintHave:["מה שכתבתם נשאר שלכם.","What you write stays yours.","Lo que escribes sigue siendo tuyo.","Ce que vous écrivez reste à vous."],
hintNone:["גם מילה אחת מספיקה.","Even one word is enough.","Con una palabra basta.","Un seul mot suffit."],
pause:["עצרו תנועה","Pause motion","Detener movimiento","Arrêter le mouvement"],
resume:["המשיכו תנועה","Resume motion","Reanudar movimiento","Reprendre le mouvement"],
tryIdea:["נסו עם הרעיון שלכם","Try it with your idea","Pruébalo con tu idea","Essayez avec votre idée"],
title:["Wazo · בודקים את הרעיון לפני שעושים אותו","Wazo · check your idea before you build it","Wazo · revisa tu idea antes de ponerla en marcha","Wazo · vérifiez votre idée avant de vous lancer"],
aNav:["ניווט ראשי","Main navigation","Navegación principal","Navigation principale"],
aLang:["שפה","Language","Idioma","Langue"],
aMenu:["תפריט","Menu","Menú","Menu"],
aStart:["איך מתחילים","How to start","Cómo empezar","Comment commencer"],
aCards:["חמשת הכרטיסים","The five cards","Las cinco tarjetas","Les cinq cartes"]
};
/* the five example cards. row: [label, value, isTip?] */
const F={
he:[
 {q:"יש מי שישלם על זה?",d:"ארבע נקודות מ־1 עד 10: האם הבעיה אמיתית, האם יש מי שרוצה, כמה מתחרים יש, והאם ישלמו.",top:["01 · כמה חזק","1–10"],big:"8 6 5 7",cap:"ארבע נקודות, כל אחת מ־1 עד 10",rows:[["הבעיה אמיתית","8/10"],["יש מי שרוצה","6/10"],["אין הרבה מתחרים","5/10"],["ישלמו על זה","7/10"]]},
 {q:"כמה אפשר להרוויח?",d:"שלושה תרחישים בלי הפרזות: מעט, סביר והרבה, עם המספרים שמאחוריהם.",top:["02 · הכסף","$"],big:"$12,000",cap:"בחודש, בתרחיש הסביר",rows:[["מעט · 120 לקוחות","$3,600"],["סביר · 400 לקוחות","$12,000"],["הרבה · 1,200 לקוחות","$36,000"]]},
 {q:"אפשר לנסות את זה בשבוע?",d:"מבחן אחד קטן לשבוע, וקריטריון ברור להצלחה, עוד לפני שמשקיעים.",top:["03 · ניסוי לשבוע","PRO"],big:"$200",cap:"7 ימים, מבחן אחד",rows:[["מה עושים","מוכרים מראש"],["הצלחה אם","10 הזמנות"]]},
 {q:"מי כבר ניסה, ומה קרה?",d:"מי עשה משהו דומה, מה קרה לו, ומה אפשר ללמוד מזה.",top:["04 · מי כבר ניסה","PRO"],big:"3·3",cap:"נסגרו · עדיין פעילים",rows:[["Shoeboxed","נסגר"],["Receipt Bank","הוחלף"],["מה חסר","עברית ומע״מ"]]},
 {q:"כדאי להתחיל?",d:"תשובה כנה: כדאי להתחיל, כדאי לחדד, או כדאי לעצור כאן. ובסוף, טיפ אחד מעשי שאפשר לעשות כבר השבוע.",top:["05 · ומה עכשיו","PRO"],big:"כדאי להתחיל",cap:"מתחילים בקטן, עם עצמאים בישראל.",rows:[["הכול תלוי ב","שמישהו ישלם מראש"],["טיפ","תמכרו קודם ל־10 אנשים",1]],final:true}
 ],
en:[
 {q:"Would anyone pay for this?",d:"Four scores from 1 to 10: is the problem real, does anyone want it, how many competitors are there, and will they pay.",top:["01 · How strong","1–10"],big:"8 6 5 7",cap:"Four scores, each from 1 to 10",rows:[["The problem is real","8/10"],["Someone wants it","6/10"],["Few competitors","5/10"],["They will pay","7/10"]]},
 {q:"How much could it earn?",d:"Three scenarios without exaggeration: low, likely and high, with the numbers behind them.",top:["02 · The money","$"],big:"$12,000",cap:"Per month, in the likely scenario",rows:[["Low · 120 customers","$3,600"],["Likely · 400 customers","$12,000"],["High · 1,200 customers","$36,000"]]},
 {q:"Can you test it in a week?",d:"One small test for a week, with a clear success rule, before you invest.",top:["03 · One-week test","PRO"],big:"$200",cap:"7 days, one test",rows:[["What to do","Pre-sell"],["Success if","10 orders"]]},
 {q:"Who already tried, and what happened?",d:"Who did something similar, what happened to them, and what you can learn from it.",top:["04 · Who tried","PRO"],big:"3·3",cap:"Closed · still running",rows:[["Shoeboxed","Closed"],["Receipt Bank","Replaced"],["What's missing","Hebrew and VAT"]]},
 {q:"Worth starting?",d:"An honest answer: worth starting, worth sharpening, or better to stop here. And one practical tip you can do this week.",top:["05 · And now?","PRO"],big:"Worth starting",cap:"Start small, with freelancers in Israel.",rows:[["It all depends on","someone paying up front"],["Tip","Sell to 10 people first",1]],final:true}
 ],
es:[
 {q:"¿Alguien pagaría por esto?",d:"Cuatro notas del 1 al 10: ¿el problema es real?, ¿alguien lo quiere?, ¿cuántos competidores hay? y ¿pagarán?",top:["01 · Qué tan fuerte","1–10"],big:"8 6 5 7",cap:"Cuatro notas, cada una del 1 al 10",rows:[["El problema es real","8/10"],["Alguien lo quiere","6/10"],["Pocos competidores","5/10"],["Pagarán por ello","7/10"]]},
 {q:"¿Cuánto podría ganar?",d:"Tres escenarios sin exagerar: poco, probable y mucho, con los números detrás.",top:["02 · El dinero","$"],big:"$12.000",cap:"Al mes, en el escenario probable",rows:[["Poco · 120 clientes","$3.600"],["Probable · 400 clientes","$12.000"],["Mucho · 1.200 clientes","$36.000"]]},
 {q:"¿Se puede probar en una semana?",d:"Una prueba pequeña para una semana, con un criterio claro de éxito, antes de invertir.",top:["03 · Prueba de una semana","PRO"],big:"$200",cap:"7 días, una prueba",rows:[["Qué hacer","Preventa"],["Éxito si","10 pedidos"]]},
 {q:"¿Quién ya lo intentó y qué pasó?",d:"Quién hizo algo parecido, qué le pasó y qué puedes aprender.",top:["04 · Quién lo intentó","PRO"],big:"3·3",cap:"Cerraron · siguen activos",rows:[["Shoeboxed","Cerró"],["Receipt Bank","Reemplazado"],["Qué falta","Hebreo e IVA"]]},
 {q:"¿Vale la pena empezar?",d:"Una respuesta honesta: vale la pena empezar, conviene afinar o es mejor parar aquí. Y un consejo práctico para esta semana.",top:["05 · ¿Y ahora?","PRO"],big:"Vale la pena empezar",cap:"Empieza pequeño, con autónomos en Israel.",rows:[["Todo depende de","que alguien pague por adelantado"],["Consejo","Vende primero a 10 personas",1]],final:true}
 ],
fr:[
 {q:"Quelqu'un paierait-il pour ça ?",d:"Quatre notes de 1 à 10 : le problème est-il réel, quelqu'un en veut-il, combien de concurrents, et paiera-t-on ?",top:["01 · Quelle force","1–10"],big:"8 6 5 7",cap:"Quatre notes, chacune de 1 à 10",rows:[["Le problème est réel","8/10"],["Quelqu'un en veut","6/10"],["Peu de concurrents","5/10"],["On paiera pour ça","7/10"]]},
 {q:"Combien ça peut rapporter ?",d:"Trois scénarios sans exagération : faible, probable et élevé, avec les chiffres derrière.",top:["02 · L'argent","$"],big:"12 000 $",cap:"Par mois, dans le scénario probable",rows:[["Faible · 120 clients","3 600 $"],["Probable · 400 clients","12 000 $"],["Élevé · 1 200 clients","36 000 $"]]},
 {q:"Peut-on le tester en une semaine ?",d:"Un petit test d'une semaine, avec un critère de réussite clair, avant d'investir.",top:["03 · Test d'une semaine","PRO"],big:"200 $",cap:"7 jours, un test",rows:[["Que faire","Prévente"],["Réussi si","10 commandes"]]},
 {q:"Qui a déjà essayé, et que s'est-il passé ?",d:"Qui a fait quelque chose de semblable, ce qui s'est passé, et ce qu'on peut en apprendre.",top:["04 · Qui a essayé","PRO"],big:"3·3",cap:"Fermés · toujours actifs",rows:[["Shoeboxed","Fermé"],["Receipt Bank","Remplacé"],["Ce qui manque","Hébreu et TVA"]]},
 {q:"Ça vaut le coup de commencer ?",d:"Une réponse honnête : ça vaut le coup, il faut affiner, ou mieux vaut s'arrêter là. Et un conseil pratique pour cette semaine.",top:["05 · Et maintenant ?","PRO"],big:"À tenter",cap:"Commencez petit, avec des indépendants en Israël.",rows:[["Tout dépend de","quelqu'un qui paie d'avance"],["Conseil","Vendez d'abord à 10 personnes",1]],final:true}
 ]
};
const rtl=l=>l==="he";
const reg=[]; let lang="he";
const heb=/[֐-׿]/;
function scan(){
  const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>{
    if(!heb.test(n.nodeValue)&&!/Wazo ·/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
    const p=n.parentElement; if(!p||p.closest("script,style,[data-i],[data-u],.lm,.sl,#card,#pane,#qs")) return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT; }});
  let n; while((n=w.nextNode())){ const raw=n.nodeValue, k=raw.trim(); if(D[k]) reg.push({n,k,lead:raw.match(/^\s*/)[0],trail:raw.match(/\s*$/)[0]}); else reg.push({n,k,miss:1,lead:"",trail:""}); }
}
function apply(l){
  const i=LANGS.indexOf(l);
  reg.forEach(r=>{ if(r.miss) return; r.n.nodeValue=r.lead+(i===0?r.k:D[r.k][i-1])+r.trail; });
  document.querySelectorAll("[data-i]").forEach(e=>{ e.innerHTML=H[e.dataset.i][i]; });
  document.documentElement.lang=l; document.documentElement.dir=rtl(l)?"rtl":"ltr";
  document.title=U.title[i];
  const a=(sel,key)=>document.querySelectorAll(sel).forEach(e=>e.setAttribute("aria-label",U[key][i]));
  a(".nav .links","aNav"); a("#langBtn","aLang"); a(".sl","aLang"); a("#burger","aMenu"); a(".tabs","aStart"); a("#qs","aCards");
  document.getElementById("langBtn").textContent=SHORT[l];
  const w=document.getElementById("win"); if(w) w.setAttribute("aria-label",i===0?"מה תקבלו":D["מה תקבלו"][i-1]);
  document.querySelectorAll("[data-l]").forEach(b=>b.setAttribute("aria-current",String(b.dataset.l===l)));
  document.querySelectorAll('footer nav a').forEach(a2=>{ const p=a2.getAttribute("href").replace(/^\/he/,""); a2.setAttribute("href",(l==="he"?"/he":"")+p); });
}
window.WZI={
  langs:LANGS, get lang(){return lang}, faces:l=>F[l||lang], u:k=>U[k][LANGS.indexOf(lang)],
  init(){ scan(); let s=null; try{ s=localStorage.getItem("wz.lang"); }catch(e){}
    lang=LANGS.includes(s)?s:"he"; if(lang!=="he") apply(lang); },
  set(l){ if(!LANGS.includes(l)) return; lang=l; try{ localStorage.setItem("wz.lang",l); }catch(e){} apply(l); },
  missing(){ return reg.filter(r=>r.miss).map(r=>r.k); }
};
})();
