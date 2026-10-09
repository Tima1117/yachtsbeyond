export type Lang = "en" | "ru" | "ka";
export type Text = Record<Lang, string>;
export const t = (en: string, ru: string, ka: string): Text => ({ en, ru, ka });

export type Kind = "air" | "sea" | "combo";

export type Trip = {
  id: string;
  n: number;
  kind: Kind;
  name: Text;
  photo: string;
  photoPos?: string;
  duration: Text;
  level: Text;
  stops: Text[];
  includes: Text;
  price: number;
  priceUnit: "pp" | "boat";
  tag?: Text;
};

export const kinds: { id: Kind | "all"; label: Text }[] = [
  { id: "all", label: t("Everything", "Всё", "ყველაფერი") },
  { id: "air", label: t("Parasailing", "Парасейлинг", "პარასეილინგი") },
  { id: "sea", label: t("Boat trips", "Прогулки на катере", "კატერით გასეირნება") },
  { id: "combo", label: t("Combos & groups", "Комбо и группы", "კომბო და ჯგუფები") },
];

export const trips: Trip[] = [
  {
    id: "parasail", n: 1, kind: "air", photo: "/images/chute-mountains.webp", photoPos: "50% 40%", price: 120, priceUnit: "pp",
    name: t("Parasailing flight", "Полёт на парашюте", "პარასეილინგი"),
    duration: t("10–12 min in the air", "10–12 мин в воздухе", "10–12 წთ ჰაერში"),
    level: t("Solo or tandem, from 6 years", "Соло или тандем, от 6 лет", "სოლო ან ტანდემი, 6 წლიდან"),
    stops: [t("Harness and briefing on the boat", "Подвесная система и инструктаж на катере", "აღკაზმულობა და ინსტრუქტაჟი კატერზე"), t("Take-off straight from the deck, no swimming", "Взлёт прямо с палубы, в воду не нужно", "აფრენა პირდაპირ გემბანიდან, წყალში არ ჩახვალთ"), t("Batumi skyline and the mountains from 100 m", "Панорама Батуми и горы со 100 метров", "ბათუმის პანორამა და მთები 100 მეტრიდან"), t("Dip in the sea on the way down, if you like", "«Макание» в море на спуске по желанию", "ზღვაში ჩაშვება დაშვებისას სურვილით")],
    includes: t("Boat ride out and back, harness, life vest, captain and winch operator, photos from the boat.", "Выход на катере и обратно, подвеска, спасжилет, капитан и оператор лебёдки, фото с катера.", "კატერით გასვლა და დაბრუნება, აღკაზმულობა, სამაშველო ჟილეტი, კაპიტანი და ოპერატორი, ფოტოები კატერიდან."),
    tag: t("Most booked", "Самое популярное", "ყველაზე პოპულარული"),
  },
  {
    id: "sunset", n: 2, kind: "sea", photo: "/images/sunset.webp", photoPos: "50% 60%", price: 250, priceUnit: "boat",
    name: t("Sunset cruise", "Прогулка на закате", "მზის ჩასვლის კრუიზი"),
    duration: t("1 h", "1 ч", "1 სთ"),
    level: t("Private boat, up to 8 guests", "Частный катер, до 8 гостей", "კერძო კატერი, 8 სტუმრამდე"),
    stops: [t("Out of the marina past the Alphabet tower", "Выход из марины мимо башни Алфавита", "მარინიდან ანბანის კოშკის გასწვრივ"), t("Open sea with the sun going into the water", "Открытое море и солнце, уходящее в воду", "ღია ზღვა და წყალში ჩამავალი მზე"), t("Your music on board", "Ваша музыка на борту", "თქვენი მუსიკა ბორტზე"), t("Back along the lit-up boulevard", "Обратно вдоль подсвеченного бульвара", "უკან განათებული ბულვარის გასწვრივ")],
    includes: t("Captain, fuel, life vests, drinks on request, photos on the bow.", "Капитан, топливо, спасжилеты, напитки по запросу, фото на носу катера.", "კაპიტანი, საწვავი, ჟილეტები, სასმელი სურვილით, ფოტოები ცხვირზე."),
    tag: t("Golden hour", "Золотой час", "ოქროს საათი"),
  },
  {
    id: "private", n: 3, kind: "sea", photo: "/images/deck.webp", photoPos: "50% 50%", price: 200, priceUnit: "boat",
    name: t("Private boat trip", "Частная прогулка на катере", "კერძო გასეირნება კატერით"),
    duration: t("45–60 min", "45–60 мин", "45–60 წთ"),
    level: t("Any time 10:00–22:00", "В любое время 10:00–22:00", "ნებისმიერ დროს 10:00–22:00"),
    stops: [t("Fast run along the coast", "Быстрый проход вдоль побережья", "სწრაფი გასვლა სანაპიროს გასწვრივ"), t("Swim stop in open water", "Остановка на купание в открытом море", "გაჩერება საბანაოდ ღია ზღვაში"), t("Skyline photos from the water", "Фото панорамы с воды", "პანორამის ფოტოები წყლიდან"), t("Dolphins in the morning, if they show up", "Дельфины утром, если выйдут", "დელფინები დილით, თუ გამოჩნდნენ")],
    includes: t("Boat for your group only, captain, fuel, vests, towels.", "Катер только для вашей компании, капитан, топливо, жилеты, полотенца.", "კატერი მხოლოდ თქვენი ჯგუფისთვის, კაპიტანი, საწვავი, ჟილეტები, პირსახოცები."),
  },
  {
    id: "jetski", n: 4, kind: "sea", photo: "/images/jetski.webp", photoPos: "50% 55%", price: 100, priceUnit: "pp",
    name: t("Jet ski ride", "Гидроцикл", "ჯეტ-სკი"),
    duration: t("15–30 min", "15–30 мин", "15–30 წთ"),
    level: t("With an instructor or solo", "С инструктором или самостоятельно", "ინსტრუქტორთან ან დამოუკიდებლად"),
    stops: [t("Briefing at the pier", "Инструктаж на пирсе", "ინსტრუქტაჟი პირსზე"), t("Ride in the bay with the skyline behind you", "Катание в бухте с панорамой за спиной", "სიარული ყურეში პანორამით ზურგს უკან"), t("Two-up seat for a passenger", "Второе место для пассажира", "მეორე ადგილი მგზავრისთვის")],
    includes: t("Jet ski, fuel, vest, instructor nearby on the boat.", "Гидроцикл, топливо, жилет, инструктор рядом на катере.", "ჯეტ-სკი, საწვავი, ჟილეტი, ინსტრუქტორი ახლოს კატერზე."),
  },
  {
    id: "combo", n: 5, kind: "combo", photo: "/images/mustang.webp", photoPos: "50% 55%", price: 350, priceUnit: "boat",
    name: t("Boat trip + parasailing", "Катер + парашют", "კატერი + პარასეილინგი"),
    duration: t("1.5 h", "1,5 ч", "1,5 სთ"),
    level: t("Groups of 2–6", "Компании от 2 до 6", "ჯგუფები 2–6"),
    stops: [t("Private boat trip along the coast", "Частная прогулка вдоль побережья", "კერძო გასეირნება სანაპიროზე"), t("Everyone flies in turn, tandem for couples", "Все летают по очереди, тандем для пар", "ყველა რიგრიგობით დაფრინავს, ტანდემი წყვილებისთვის"), t("Swim stop and photos", "Купание и фото", "ბანაობა და ფოტოები")],
    includes: t("Boat for your group, flights for everyone, captain and operator, vests, photos.", "Катер для вашей компании, полёты для всех, капитан и оператор, жилеты, фото.", "კატერი თქვენი ჯგუფისთვის, ფრენა ყველასთვის, კაპიტანი და ოპერატორი, ჟილეტები, ფოტოები."),
    tag: t("Best value", "Выгодно", "საუკეთესო ფასი"),
  },
  {
    id: "party", n: 6, kind: "combo", photo: "/images/guests.webp", photoPos: "50% 40%", price: 500, priceUnit: "boat",
    name: t("Boat party and group charters", "Вечеринка и групповой чартер", "ვეჩერინკა და ჯგუფური ჩარტერი"),
    duration: t("2–3 h", "2–3 ч", "2–3 სთ"),
    level: t("Birthdays, proposals, company days", "Дни рождения, предложения, корпоративы", "დაბადების დღეები, წინადადებები, კორპორატივები"),
    stops: [t("Decoration and music on request", "Украшение и музыка по запросу", "დეკორი და მუსიკა სურვილით"), t("Sunset at sea, lights of Batumi on the way back", "Закат в море, огни Батуми на обратном пути", "მზის ჩასვლა ზღვაში, ბათუმის შუქები დაბრუნებისას"), t("Parasailing for the brave", "Парашют для смелых", "პარასეილინგი გაბედულებისთვის")],
    includes: t("Boat and crew for the whole time, fuel, vests, help with cake, flowers and a photographer.", "Катер и экипаж на всё время, топливо, жилеты, помощь с тортом, цветами и фотографом.", "კატერი და ეკიპაჟი მთელი დროით, საწვავი, ჟილეტები, დახმარება ტორტით, ყვავილებითა და ფოტოგრაფით."),
  },
];

export type Review = { author: string; date: Text; text: Text };

export const reviews: Review[] = [
  {
    author: "Shirkou Bakhtyari", date: t("a year ago", "год назад", "ერთი წლის წინ"),
    text: t("We went parasailing yesterday as a group of 6 and it was an amazing experience! Everything was safe, well organized, and so much fun. The views were incredible, and George made the whole adventure even more enjoyable. Highly recommended!", "Вчера летали на парашюте компанией из шести человек, впечатления потрясающие! Всё безопасно, хорошо организовано и очень весело. Виды невероятные, а Георгий сделал приключение ещё приятнее. Очень рекомендую!", "გუშინ ექვსიანი ჯგუფით პარასეილინგზე ვიყავით და საოცარი გამოცდილება იყო! ყველაფერი უსაფრთხო, კარგად ორგანიზებული და ძალიან სახალისო. ხედები წარმოუდგენელია, გიორგიმ კი თავგადასავალი კიდევ უფრო სასიამოვნო გახადა. ნამდვილად გირჩევთ!"),
  },
  {
    author: "Omar Alzahrani", date: t("a year ago", "год назад", "ერთი წლის წინ"),
    text: t("I did parasailing and was planning to do jet skiing too, but the weather had other plans. Still, the experience was top-notch thanks to George, who was incredibly informative and clearly passionate about his work. He genuinely cares about safety and making sure everyone has a great time.", "Летал на парашюте и собирался ещё на гидроцикл, но погода распорядилась иначе. Всё равно впечатления на высшем уровне благодаря Георгию: он всё подробно объясняет и явно любит своё дело. По-настоящему заботится о безопасности и о том, чтобы всем было хорошо.", "პარასეილინგი გავაკეთე და ჯეტ-სკიზეც ვაპირებდი, მაგრამ ამინდმა სხვაგვარად გადაწყვიტა. მაინც უმაღლესი დონის გამოცდილება იყო გიორგის წყალობით: ყველაფერს დეტალურად ხსნის და აშკარად უყვარს თავისი საქმე. ნამდვილად ზრუნავს უსაფრთხოებაზე და იმაზე, რომ ყველამ კარგად გაატაროს დრო."),
  },
  {
    author: "Abdulaziz Bashanfer", date: t("a year ago", "год назад", "ერთი წლის წინ"),
    text: t("We rented a boat through George, and the entire experience was smooth, honest, and very enjoyable. He went out of his way to make sure everything was perfect, not just with the boat rental. If you're in Batumi and looking for someone trustworthy and professional, George is the one.", "Арендовали катер через Георгия, и всё прошло гладко, честно и с удовольствием. Он сделал всё, чтобы было идеально, и не только с арендой. Если вы в Батуми и ищете надёжного и профессионального человека, это Георгий.", "კატერი გიორგის მეშვეობით ვიქირავეთ და ყველაფერი შეუფერხებლად, პატიოსნად და სასიამოვნოდ წარიმართა. ყველაფერი გააკეთა, რომ იდეალური ყოფილიყო, და არა მხოლოდ ქირაობასთან დაკავშირებით. თუ ბათუმში ხართ და სანდო პროფესიონალს ეძებთ, ეს გიორგია."),
  },
  {
    author: "Samia Ayn", date: t("3 years ago", "3 года назад", "3 წლის წინ"),
    text: t("Amazing experience at an affordable cost! A private boat ride along with the best parasailing experience. Super friendly crew as well!", "Потрясающие впечатления по доступной цене! Частная прогулка на катере и лучший парасейлинг. И очень дружелюбный экипаж!", "საოცარი გამოცდილება ხელმისაწვდომ ფასად! კერძო გასეირნება კატერით და საუკეთესო პარასეილინგი. ძალიან მეგობრული ეკიპაჟიც!"),
  },
  {
    author: "IFaris Bu50", date: t("3 years ago", "3 года назад", "3 წლის წინ"),
    text: t("Really nice experience, very nice and talented people who know what they are doing, so you don't have to worry. Just live the amazing experience and see the beautiful Batumi city from above.", "Очень приятный опыт: славные и умелые ребята, которые знают своё дело, так что волноваться не о чем. Просто проживите это и посмотрите на красивый Батуми сверху.", "ძალიან სასიამოვნო გამოცდილება: კარგი და გამოცდილი ბიჭები, რომლებმაც იციან რას აკეთებენ, ასე რომ სანერვიულო არაფერია. უბრალოდ განიცადეთ და ზემოდან ნახეთ ლამაზი ბათუმი."),
  },
  {
    author: "shaikh abdulla", date: t("3 years ago", "3 года назад", "3 წლის წინ"),
    text: t("Very safe and very friendly crew, helped me get over my fear of heights.", "Очень безопасно и очень дружелюбный экипаж, помогли мне справиться со страхом высоты.", "ძალიან უსაფრთხო და ძალიან მეგობრული ეკიპაჟი, სიმაღლის შიშის დაძლევაში დამეხმარნენ."),
  },
  {
    author: "Dinesh Sharma", date: t("3 years ago", "3 года назад", "3 წლის წინ"),
    text: t("Very good experience. It was fantastic and safe. My son and daughter did it and they both enjoyed it.", "Очень хороший опыт. Было здорово и безопасно. Сын и дочь летали, и обоим очень понравилось.", "ძალიან კარგი გამოცდილება. ფანტასტიკური და უსაფრთხო იყო. ჩემი ვაჟი და ქალიშვილი დაფრინავდნენ და ორივეს მოეწონა."),
  },
  {
    author: "Faisal M", date: t("a year ago", "год назад", "ერთი წლის წინ"),
    text: t("George was such a good guy, he was very helpful and honest, ten out of ten.", "Георгий замечательный человек, очень помог и был честен, десять из десяти.", "გიორგი ძალიან კარგი ადამიანია, ძალიან დაგვეხმარა და პატიოსანი იყო, ათიდან ათი."),
  },
  {
    author: "vaja ninidze", date: t("3 years ago", "3 года назад", "3 წლის წინ"),
    text: t("The best experience in Batumi, amazed by the views from above.", "Лучшее впечатление в Батуми, виды сверху поразили.", "საუკეთესო გამოცდილება ბათუმში, ზემოდან ხედებმა გაგვაოცა."),
  },
  {
    author: "amjad al-alawi", date: t("3 years ago", "3 года назад", "3 წლის წინ"),
    text: t("I recommend him; he's a cheerful man who listens to what travellers want, and his boat is brand new.", "Рекомендую: весёлый человек, который слушает, чего хотят путешественники, а катер у него совсем новый.", "გირჩევთ: მხიარული ადამიანია, რომელიც უსმენს მოგზაურების სურვილებს, კატერი კი სულ ახალი აქვს."),
  },
  {
    author: "Маргарита Кононова", date: t("3 years ago", "3 года назад", "3 წლის წინ"),
    text: t("I loved everything! Great flight and boat ride. I recommend it.", "Мне всё понравилось! Отличный полёт и прогулка на катере. Рекомендую.", "ყველაფერი მომეწონა! შესანიშნავი ფრენა და გასეირნება კატერით. გირჩევთ."),
  },
  {
    author: "Кумуш Омархонтура", date: t("2 years ago", "2 года назад", "2 წლის წინ"),
    text: t("Incredible experience and wonderful guys, very polite and kind. Thank you so much for the flight!", "Невероятные впечатления и замечательные ребята, очень вежливые и добрые. Огромное спасибо за полёт!", "წარმოუდგენელი გამოცდილება და შესანიშნავი ბიჭები, ძალიან თავაზიანი და კეთილი. დიდი მადლობა ფრენისთვის!"),
  },
];

export type Photo = { src: string; w: number; h: number; cap: Text };
export const gallery: Photo[] = [
  { src: "/images/chute-mountains.webp", w: 1000, h: 1778, cap: t("Over the bay", "Над бухтой", "ყურის ზემოთ") },
  { src: "/images/sunset.webp", w: 1000, h: 1778, cap: t("Sunset from the boat", "Закат с катера", "მზის ჩასვლა კატერიდან") },
  { src: "/images/harness.webp", w: 1000, h: 1778, cap: t("Ready for take-off", "Готов к взлёту", "აფრენისთვის მზად") },
  { src: "/images/chute-wake.webp", w: 1000, h: 1778, cap: t("Behind the Mustang", "За кормой Mustang", "Mustang-ის უკან") },
  { src: "/images/rope.webp", w: 1000, h: 1778, cap: t("View from the harness", "Вид из подвески", "ხედი აღკაზმულობიდან") },
  { src: "/images/chute-far.webp", w: 1000, h: 1778, cap: t("One hundred metres up", "Сто метров вверх", "ასი მეტრი ზემოთ") },
  { src: "/images/sun-glare.webp", w: 1000, h: 1778, cap: t("Open sea", "Открытое море", "ღია ზღვა") },
  { src: "/images/chute-tower.webp", w: 1000, h: 1778, cap: t("Alphabet tower from the air", "Башня Алфавита с воздуха", "ანბანის კოშკი ჰაერიდან") },
  { src: "/images/rope3.webp", w: 1000, h: 1778, cap: t("Coming back down", "Спуск", "დაშვება") },
  { src: "/images/sunset2.webp", w: 1000, h: 1778, cap: t("Golden hour", "Золотой час", "ოქროს საათი") },
  { src: "/images/chute-sky.webp", w: 1000, h: 1778, cap: t("Rainbow chute", "Радужный купол", "ცისარტყელა პარაშუტი") },
  { src: "/images/rope2.webp", w: 1000, h: 1778, cap: t("Up and away", "Вверх", "ზემოთ") },
];
