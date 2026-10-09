"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Lenis from "lenis";
import { trips, kinds, reviews, gallery, type Lang, type Kind } from "./data";
import { HeroGlobe, type GlobeCopy } from "./hero-globe";
import { DaySection, type DayCopy } from "./day-section";
import { DominoGallery } from "./domino-gallery";

const phone = "+995555328778";
const phonePretty = "+995 555 32 87 78";
const waBase = "https://wa.me/995555328778";
const placeUrl = "https://www.google.com/maps/place/Yachts+%26+Beyond/@41.6547929,41.6429517,17z/data=!4m6!3m5!1s0x406787b54d737c6f:0x43aea840dc73a3b7!8m2!3d41.6547929!4d41.6429517";
const directionsUrl = "https://www.google.com/maps/dir/?api=1&destination=41.6547929,41.6429517&travelmode=walking";
const mapEmbed = "https://maps.google.com/maps?q=41.6547929,41.6429517&z=16&output=embed";

const copy = {
  en: {
    nav: ["Experiences", "Your hour", "Reviews", "Gallery", "Contacts"],
    cta: "WhatsApp",
    hero: {
      eyebrow: "PARASAILING · BOAT TRIPS · JET SKI · BATUMI YACHT CLUB",
      top: "Yachts & Beyond",
      lines: ["Fly over Batumi.", "Sunset at sea.", "Your own boat for an hour.", "Jet ski in the bay."],
      lede: "Parasailing from the deck of the Mustang speedboat, private boat trips and sunset cruises from the yacht club pier on the boulevard. Captain George answers every message himself.",
      cta: "Choose an experience", cta2: "Write on WhatsApp",
      rating: "4.5 · 44 Google reviews",
      hint: "Choose your perspective", modes: ["Panorama", "On the water", "In the air"],
      badges: [["100 m", "flight height"], ["10–12 min", "in the air"], ["6+", "tandem age"], ["10:00–22:00", "every day"]],
    } as GlobeCopy,
    facts: [["Take-off from the deck", "No swimming, no wet start"], ["Captain George", "Replies to every review and message"], ["Rainbow chute over the bay", "Photos from the boat included"], ["Yacht club pier", "By the Alphabet tower and the Ferris wheel"]],
    toursEyebrow: "EXPERIENCES",
    toursTitle: "Pick your hour on the water",
    toursLede: "Parasailing is what everyone comes for; the boat is yours for sunsets, swims and parties. Everything starts at the yacht club pier on Batumi boulevard.",
    from: "from", pp: "/ person", boat: "/ boat",
    book: "Book", details: "Details", hide: "Hide",
    stopsLabel: "How it goes", includesLabel: "Included",
    priceNote: "Prices are indicative and depend on the season, the weather and the group size. The final price is confirmed in WhatsApp before you pay anything.",
    day: {
      eyebrow: "HOW IT GOES", title: "Your hour on the water",
      lede: "The parasailing ride, minute by minute, the way guests describe it in their reviews.",
      stops: [
        { time: "00:00", title: "Meet at the yacht club pier", text: "Opposite the Ferris wheel on the boulevard. The Mustang is the lime-green boat with the winch on the stern." },
        { time: "00:05", title: "Briefing and harness", text: "Life vest, harness, two clips. The operator explains the signals and what happens on the way down." },
        { time: "00:15", title: "Out to open water", text: "A fast run along the boulevard. The city is behind you in five minutes." },
        { time: "00:25", title: "Take-off", text: "The winch lets the line out slowly. No jump, no swim: you lift straight off the deck." },
        { time: "00:37", title: "Ten minutes over Batumi", text: "Skyline, mountains and the Black Sea under your feet. A dip in the water on the way down if you ask for it." },
        { time: "00:50", title: "Back at the pier", text: "Photos go to your WhatsApp, the next flyer goes up." },
      ],
      facts: [
        { b: "Safety first", s: "Harness, vests and a briefing before every flight. The weather decides whether we go out." },
        { b: "English, Russian, Georgian", s: "George and the crew host guests from the Gulf, Europe and Georgia." },
        { b: "Pay after the ride", s: "No prepayment. The time is confirmed in WhatsApp, you pay at the pier." },
      ],
      cta: "Book a flight",
    } as DayCopy,
    revEyebrow: "REVIEWS", revTitle: "What guests say", revLede: "Real reviews from Google Maps. George replies to every one of them.", revMore: "Show more", revGoogle: "All 44 reviews on Google",
    galEyebrow: "GALLERY", galTitle: "From the sky and the deck", galLede: "Real moments from the water and the sky. Pause, browse and open a photo to look closer.",
    conEyebrow: "CONTACTS", conTitle: "Book in two minutes",
    addrLabel: "Pier", addr: "Batumi Yacht Club, boulevard by the Ferris wheel",
    phoneLabel: "Phone", hoursLabel: "Hours", hours: "Every day, 10:00–22:00, May to October",
    directions: "Directions", call: "Call",
    bookTitle: "Request a ride",
    bookText: "Choose the experience and the date. The request opens in WhatsApp and we confirm the time and the price in the chat.",
    fName: "Your name", fTour: "Experience", fDate: "Date", fPeople: "People", fAny: "Not sure yet, advise me",
    send: "Send via WhatsApp",
    bookNote: "No prepayment. The booking is confirmed by our reply in WhatsApp.",
    waMsg: (tour: string, date: string, people: string, name: string) => `Hello! I'd like to book ${tour} on ${date || "…"} for ${people || "…"} people. My name is ${name || "…"}.`,
    waTour: (tour: string) => `Hello! I'm interested in "${tour}". Which times are available?`,
    foot: "A concept website for Yachts & Beyond · Batumi",
    photo: "Photo",
  },
  ru: {
    nav: ["Что выбрать", "Ваш час", "Отзывы", "Галерея", "Контакты"],
    cta: "WhatsApp",
    hero: {
      eyebrow: "ПАРАСЕЙЛИНГ · КАТЕР · ГИДРОЦИКЛ · ЯХТ-КЛУБ БАТУМИ",
      top: "Yachts & Beyond",
      lines: ["Полёт над Батуми.", "Закат в море.", "Свой катер на час.", "Гидроцикл в бухте."],
      lede: "Парасейлинг прямо с палубы катера Mustang, частные прогулки и закаты в море с пирса яхт-клуба на бульваре. Капитан Георгий отвечает на каждое сообщение сам.",
      cta: "Выбрать", cta2: "Написать в WhatsApp",
      rating: "4.5 · 44 отзыва в Google",
      hint: "Выберите свой ракурс", modes: ["Панорама", "На воде", "В небе"],
      badges: [["100 м", "высота полёта"], ["10–12 мин", "в воздухе"], ["6+", "возраст для тандема"], ["10:00–22:00", "ежедневно"]],
    } as GlobeCopy,
    facts: [["Взлёт с палубы", "Без купания и мокрого старта"], ["Капитан Георгий", "Отвечает на каждый отзыв и сообщение"], ["Радужный купол над бухтой", "Фото с катера включены"], ["Пирс яхт-клуба", "У башни Алфавита и колеса обозрения"]],
    toursEyebrow: "ЧТО ВЫБРАТЬ",
    toursTitle: "Ваш час на воде",
    toursLede: "За парашютом приезжают все; катер ваш для закатов, купания и праздников. Всё начинается на пирсе яхт-клуба на бульваре Батуми.",
    from: "от", pp: "/ чел.", boat: "/ катер",
    book: "Забронировать", details: "Подробнее", hide: "Скрыть",
    stopsLabel: "Как проходит", includesLabel: "Включено",
    priceNote: "Цены ориентировочные и зависят от сезона, погоды и размера группы. Итоговую стоимость подтверждаем в WhatsApp до любой оплаты.",
    day: {
      eyebrow: "КАК ЭТО ПРОХОДИТ", title: "Ваш час на воде",
      lede: "Полёт на парашюте по минутам — так, как его описывают гости в отзывах.",
      stops: [
        { time: "00:00", title: "Встреча на пирсе яхт-клуба", text: "Напротив колеса обозрения на бульваре. Mustang — салатовый катер с лебёдкой на корме." },
        { time: "00:05", title: "Инструктаж и подвеска", text: "Спасжилет, подвесная система, два карабина. Оператор объясняет сигналы и что будет на спуске." },
        { time: "00:15", title: "Выход в открытое море", text: "Быстрый проход вдоль бульвара. Через пять минут город уже за спиной." },
        { time: "00:25", title: "Взлёт", text: "Лебёдка медленно отпускает трос. Без прыжка и без воды: вы поднимаетесь прямо с палубы." },
        { time: "00:37", title: "Десять минут над Батуми", text: "Панорама, горы и Чёрное море под ногами. На спуске можно «макнуться» в воду, если попросите." },
        { time: "00:50", title: "Снова на пирсе", text: "Фото уходят вам в WhatsApp, взлетает следующий." },
      ],
      facts: [
        { b: "Безопасность прежде всего", s: "Подвеска, жилеты и инструктаж перед каждым полётом. Выходить ли в море, решает погода." },
        { b: "Английский, русский, грузинский", s: "Георгий и экипаж принимают гостей из Залива, Европы и Грузии." },
        { b: "Оплата после", s: "Без предоплаты. Время подтверждаем в WhatsApp, платите на пирсе." },
      ],
      cta: "Забронировать полёт",
    } as DayCopy,
    revEyebrow: "ОТЗЫВЫ", revTitle: "Что говорят гости", revLede: "Настоящие отзывы с Google Maps. Георгий отвечает на каждый.", revMore: "Показать ещё", revGoogle: "Все 44 отзыва в Google",
    galEyebrow: "ГАЛЕРЕЯ", galTitle: "С неба и с палубы", galLede: "Моменты с воды и с неба. Остановите ленту, полистайте и откройте фото поближе.",
    conEyebrow: "КОНТАКТЫ", conTitle: "Бронь за две минуты",
    addrLabel: "Пирс", addr: "Яхт-клуб Батуми, бульвар у колеса обозрения",
    phoneLabel: "Телефон", hoursLabel: "Часы", hours: "Ежедневно 10:00–22:00, май – октябрь",
    directions: "Маршрут", call: "Позвонить",
    bookTitle: "Заявка",
    bookText: "Выберите, что хотите, и дату. Заявка откроется в WhatsApp, время и цену подтвердим в чате.",
    fName: "Ваше имя", fTour: "Что выбираете", fDate: "Дата", fPeople: "Человек", fAny: "Пока не знаю — посоветуйте",
    send: "Отправить в WhatsApp",
    bookNote: "Без предоплаты. Бронь подтверждается нашим ответом в WhatsApp.",
    waMsg: (tour: string, date: string, people: string, name: string) => `Здравствуйте! Хочу забронировать ${tour} на ${date || "…"} для ${people || "…"} чел. Меня зовут ${name || "…"}.`,
    waTour: (tour: string) => `Здравствуйте! Интересует «${tour}». Какое время свободно?`,
    foot: "Концепт сайта для Yachts & Beyond · Батуми",
    photo: "Фото",
  },
  ka: {
    nav: ["შეთავაზებები", "თქვენი საათი", "შეფასებები", "გალერეა", "კონტაქტი"],
    cta: "WhatsApp",
    hero: {
      eyebrow: "პარასეილინგი · კატერი · ჯეტ-სკი · ბათუმის იახტკლუბი",
      top: "Yachts & Beyond",
      lines: ["ფრენა ბათუმის თავზე.", "მზის ჩასვლა ზღვაში.", "საკუთარი კატერი ერთი საათით.", "ჯეტ-სკი ყურეში."],
      lede: "პარასეილინგი პირდაპირ კატერ Mustang-ის გემბანიდან, კერძო გასეირნებები და მზის ჩასვლა ზღვაში ბულვარზე იახტკლუბის პირსიდან. კაპიტანი გიორგი ყველა შეტყობინებას თავად პასუხობს.",
      cta: "არჩევა", cta2: "მოწერა WhatsApp-ზე",
      rating: "4.5 · 44 შეფასება Google-ზე",
      hint: "აირჩიეთ ხედვის კუთხე", modes: ["პანორამა", "წყალზე", "ჰაერში"],
      badges: [["100 მ", "ფრენის სიმაღლე"], ["10–12 წთ", "ჰაერში"], ["6+", "ასაკი ტანდემისთვის"], ["10:00–22:00", "ყოველდღე"]],
    } as GlobeCopy,
    facts: [["აფრენა გემბანიდან", "ბანაობისა და სველი სტარტის გარეშე"], ["კაპიტანი გიორგი", "ყველა შეფასებასა და შეტყობინებას პასუხობს"], ["ცისარტყელა პარაშუტი ყურის თავზე", "ფოტოები კატერიდან შედის ფასში"], ["იახტკლუბის პირსი", "ანბანის კოშკთან და ეშმაკის ბორბალთან"]],
    toursEyebrow: "შეთავაზებები",
    toursTitle: "თქვენი საათი წყალზე",
    toursLede: "პარაშუტისთვის ყველა მოდის; კატერი თქვენია მზის ჩასვლის, ბანაობისა და ზეიმებისთვის. ყველაფერი იწყება იახტკლუბის პირსზე ბათუმის ბულვარზე.",
    from: "-დან", pp: "/ ადამიანი", boat: "/ კატერი",
    book: "დაჯავშნა", details: "დეტალები", hide: "დამალვა",
    stopsLabel: "როგორ მიდის", includesLabel: "შედის ფასში",
    priceNote: "ფასები სავარაუდოა და დამოკიდებულია სეზონზე, ამინდსა და ჯგუფის ზომაზე. საბოლოო ფასს WhatsApp-ში ვადასტურებთ ნებისმიერ გადახდამდე.",
    day: {
      eyebrow: "როგორ მიდის", title: "თქვენი საათი წყალზე",
      lede: "პარასეილინგი წუთობრივად, ისე როგორც სტუმრები აღწერენ შეფასებებში.",
      stops: [
        { time: "00:00", title: "შეხვედრა იახტკლუბის პირსზე", text: "ეშმაკის ბორბლის პირდაპირ, ბულვარზე. Mustang ღია მწვანე კატერია კიჩოზე ჯალამბრით." },
        { time: "00:05", title: "ინსტრუქტაჟი და აღკაზმულობა", text: "სამაშველო ჟილეტი, აღკაზმულობა, ორი კარაბინი. ოპერატორი ხსნის სიგნალებს და რა მოხდება დაშვებისას." },
        { time: "00:15", title: "გასვლა ღია ზღვაში", text: "სწრაფი გასვლა ბულვარის გასწვრივ. ხუთ წუთში ქალაქი უკვე ზურგს უკანაა." },
        { time: "00:25", title: "აფრენა", text: "ჯალამბარი ნელა უშვებს თოკს. ნახტომისა და წყლის გარეშე: პირდაპირ გემბანიდან ადიხართ." },
        { time: "00:37", title: "ათი წუთი ბათუმის თავზე", text: "პანორამა, მთები და შავი ზღვა ფეხქვეშ. დაშვებისას წყალში ჩაშვებაც შეიძლება, თუ ითხოვთ." },
        { time: "00:50", title: "ისევ პირსზე", text: "ფოტოები WhatsApp-ში მოგდით, შემდეგი აფრინდება." },
      ],
      facts: [
        { b: "უსაფრთხოება პირველ რიგში", s: "აღკაზმულობა, ჟილეტები და ინსტრუქტაჟი ყოველი ფრენის წინ. ზღვაში გასვლას ამინდი წყვეტს." },
        { b: "ინგლისური, რუსული, ქართული", s: "გიორგი და ეკიპაჟი სტუმრებს ყურედან, ევროპიდან და საქართველოდან მასპინძლობენ." },
        { b: "გადახდა შემდეგ", s: "წინასწარი გადახდის გარეშე. დროს WhatsApp-ში ვადასტურებთ, იხდით პირსზე." },
      ],
      cta: "ფრენის დაჯავშნა",
    } as DayCopy,
    revEyebrow: "შეფასებები", revTitle: "რას ამბობენ სტუმრები", revLede: "ნამდვილი შეფასებები Google Maps-დან. გიორგი ყველას პასუხობს.", revMore: "მეტის ჩვენება", revGoogle: "ყველა 44 შეფასება Google-ზე",
    galEyebrow: "გალერეა", galTitle: "ციდან და გემბანიდან", galLede: "მომენტები წყლიდან და ციდან. შეაჩერეთ, გადაფურცლეთ და გახსენით ფოტო.",
    conEyebrow: "კონტაქტი", conTitle: "დაჯავშნა ორ წუთში",
    addrLabel: "პირსი", addr: "ბათუმის იახტკლუბი, ბულვარი ეშმაკის ბორბალთან",
    phoneLabel: "ტელეფონი", hoursLabel: "საათები", hours: "ყოველდღე 10:00–22:00, მაისი – ოქტომბერი",
    directions: "მარშრუტი", call: "დარეკვა",
    bookTitle: "მოთხოვნა",
    bookText: "აირჩიეთ შეთავაზება და თარიღი. მოთხოვნა გაიხსნება WhatsApp-ში, დროსა და ფასს ჩატში დავადასტურებთ.",
    fName: "თქვენი სახელი", fTour: "შეთავაზება", fDate: "თარიღი", fPeople: "ადამიანი", fAny: "ჯერ არ ვიცი — მირჩიეთ",
    send: "გაგზავნა WhatsApp-ით",
    bookNote: "წინასწარი გადახდის გარეშე. ჯავშანი დასტურდება ჩვენი პასუხით WhatsApp-ში.",
    waMsg: (tour: string, date: string, people: string, name: string) => `გამარჯობა! მინდა დავჯავშნო ${tour} ${date || "…"}-ს ${people || "…"} ადამიანზე. მე მქვია ${name || "…"}.`,
    waTour: (tour: string) => `გამარჯობა! მაინტერესებს „${tour}“. რომელი დროა თავისუფალი?`,
    foot: "კონცეპტუალური საიტი Yachts & Beyond-ისთვის · ბათუმი",
    photo: "ფოტო",
  },
};
type Copy = typeof copy["en"];

const wa = (text: string) => `${waBase}?text=${encodeURIComponent(text)}`;

const Ico = {
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  clockS: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  level: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15c2.5 0 2.5 2.5 5 2.5s2.5-2.5 5-2.5 2.5 2.5 5 2.5 2.5-2.5 3-2.5" /><path d="M3 9c2.5 0 2.5 2.5 5 2.5S10.5 9 13 9s2.5 2.5 5 2.5S20.5 9 21 9" /></svg>,
  pin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>,
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>,
  wa: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>,
};

const Mark = () => (
  <i aria-hidden>
    <svg viewBox="0 0 64 64"><path d="M12 30a20 20 0 0 1 40 0" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /><path d="M12 30 32 50 52 30" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" opacity=".7" /><path d="M22 30v0M32 30v0M42 30v0" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /><path d="M8 54c4 0 4 4 8 4s4-4 8-4 4 4 8 4 4-4 8-4 4 4 8 4 4-4 8-4" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" /></svg>
  </i>
);

function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.09 });
    return () => lenis.destroy();
  }, [reduce]);
  return null;
}


function Trips({ lang, c, onPhoto }: { lang: Lang; c: Copy; onPhoto: (src: string) => void }) {
  const [kind, setKind] = useState<Kind | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const list = kind === "all" ? trips : trips.filter(x => x.kind === kind);
  const unit = (u: "pp" | "boat") => (u === "pp" ? c.pp : c.boat);
  return (
    <section className="tours" id="trips">
      <div className="container">
        <div className="section-head">
          <div><p className="eyebrow">{c.toursEyebrow}</p><h2 className="section-title">{c.toursTitle}</h2></div>
          <p className="section-lede">{c.toursLede}</p>
        </div>
        <div className="tabs" role="tablist" style={{ marginBottom: 28 }}>
          {kinds.map(k => <button key={k.id} role="tab" aria-selected={kind === k.id} className={`tab${kind === k.id ? " active" : ""}`} onClick={() => setKind(k.id)}>{k.label[lang]}</button>)}
        </div>
        <motion.div key={kind} className="tour-grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {list.map((x, i) => {
            const open = openId === x.id;
            return (
              <motion.article key={x.id} className="tour-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}>
                <button className="tour-media" onClick={() => onPhoto(x.photo)} aria-label={`${c.photo}: ${x.name[lang]}`}>
                  <Image src={x.photo} alt={x.name[lang]} fill sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" style={{ objectFit: "cover", objectPosition: x.photoPos || "50% 50%" }} />
                  <span className="tour-n">{String(x.n).padStart(2, "0")}</span>
                  <span className="tour-dur">{Ico.clockS}{x.duration[lang]}</span>
                  {x.tag && <span className="tour-tag">{x.tag[lang]}</span>}
                </button>
                <div className="tour-body">
                  <h3>{x.name[lang]}</h3>
                  <p className="tour-level">{Ico.level}{x.level[lang]}</p>
                  <p className="tour-stops">{x.stops.map(s => s[lang]).join(" · ")}</p>
                  <div className="tour-price">{lang === "ka" ? <><b>{x.price} ₾</b><span>{c.from}</span><span>{unit(x.priceUnit)}</span></> : <><span>{c.from}</span><b>{x.price} ₾</b><span>{unit(x.priceUnit)}</span></>}</div>
                  <div className="tour-actions">
                    <a className="btn btn-wa" href={wa(c.waTour(x.name[lang]))} target="_blank" rel="noopener noreferrer">{Ico.wa}{c.book}</a>
                    <button className="btn btn-outline" onClick={() => setOpenId(open ? null : x.id)} aria-expanded={open}>{open ? c.hide : c.details}</button>
                  </div>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div className="tour-details" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                        <div>
                          <b>{c.stopsLabel}</b>
                          <ol>{x.stops.map(s => <li key={s.en}>{s[lang]}</li>)}</ol>
                          <b>{c.includesLabel}</b>
                          <p>{x.includes[lang]}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
        <p className="price-note">{c.priceNote}</p>
      </div>
    </section>
  );
}

function Reviews({ lang, c }: { lang: Lang; c: Copy }) {
  const [n, setN] = useState(6);
  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div className="section-head">
          <div><p className="eyebrow light">{c.revEyebrow}</p><h2 className="section-title light">{c.revTitle}</h2></div>
          <p className="section-lede light">{c.revLede}</p>
        </div>
        <div className="rev-grid">
          {reviews.slice(0, n).map((r, i) => (
            <motion.article key={r.author + i} className="rev" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}>
              <div className="rev-stars">★★★★★</div>
              <p>{r.text[lang]}</p>
              <div className="rev-meta">
                <span className="rev-ava">{r.author.trim().charAt(0).toUpperCase()}</span>
                <div><b>{r.author}</b>{r.date[lang]} · Google</div>
              </div>
            </motion.article>
          ))}
        </div>
        <div className="rev-more">
          {n < reviews.length && <button className="btn btn-ghost" onClick={() => setN(n + 6)}>{c.revMore}</button>}
          <a className="btn btn-amber" href={placeUrl} target="_blank" rel="noopener noreferrer">{c.revGoogle} ↗</a>
        </div>
      </div>
    </section>
  );
}

function Contacts({ lang, c }: { lang: Lang; c: Copy }) {
  const [name, setName] = useState("");
  const [tour, setTour] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("2");
  const msg = c.waMsg(tour || c.fAny, date, people, name);
  return (
    <section className="contacts" id="contacts">
      <div className="container">
        <div className="contacts-grid">
          <div>
            <p className="eyebrow light">{c.conEyebrow}</p>
            <h2 className="section-title light" style={{ marginBottom: 28 }}>{c.conTitle}</h2>
            <div className="contact-list">
              <div className="contact-row"><span className="strip-ico">{Ico.pin}</span><div><b>{c.addrLabel}</b><a href={placeUrl} target="_blank" rel="noopener noreferrer">{c.addr}</a></div></div>
              <div className="contact-row"><span className="strip-ico">{Ico.phone}</span><div><b>{c.phoneLabel}</b><a href={`tel:${phone}`}>{phonePretty}</a></div></div>
              <div className="contact-row"><span className="strip-ico">{Ico.clock}</span><div><b>{c.hoursLabel}</b><span>{c.hours}</span></div></div>
            </div>
            <div className="contact-actions">
              <a className="btn btn-wa" href={waBase} target="_blank" rel="noopener noreferrer">{Ico.wa}WhatsApp</a>
              <a className="btn btn-ghost" href={`tel:${phone}`}>{c.call}</a>
              <a className="btn btn-ghost" href={directionsUrl} target="_blank" rel="noopener noreferrer">{c.directions} ↗</a>
            </div>
          </div>
          <form className="book" onSubmit={e => { e.preventDefault(); window.open(wa(msg), "_blank", "noopener"); }}>
            <h3>{c.bookTitle}</h3>
            <p>{c.bookText}</p>
            <div className="book-grid">
              <div className="field full"><label htmlFor="f-name">{c.fName}</label><input id="f-name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></div>
              <div className="field full"><label htmlFor="f-tour">{c.fTour}</label>
                <select id="f-tour" value={tour} onChange={e => setTour(e.target.value)}>
                  <option value="">{c.fAny}</option>
                  {trips.map(x => <option key={x.id} value={x.name[lang]}>{x.name[lang]}</option>)}
                </select>
              </div>
              <div className="field"><label htmlFor="f-date">{c.fDate}</label><input id="f-date" type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
              <div className="field"><label htmlFor="f-people">{c.fPeople}</label>
                <select id="f-people" value={people} onChange={e => setPeople(e.target.value)}>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "10", "12", "15+"].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-wa" type="submit">{Ico.wa}{c.send}</button>
            <p className="book-note">{c.bookNote}</p>
          </form>
        </div>
      </div>
      <div className="map-wrap" data-lenis-prevent>
        <iframe src={mapEmbed} title="Yachts & Beyond on the map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </div>
    </section>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const c = copy[lang];
  const navIds = useMemo(() => ["trips", "day", "reviews", "gallery", "contacts"], []);

  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  const factPhotos = ["/images/harness.webp", "/images/captain.webp", "/images/chute-mountains.webp", "/images/marina2.webp"];
  const factPos = ["50% 30%", "50% 20%", "50% 35%", "50% 60%"];
  const dominoItems = gallery.map(g => ({ src: g.src, w: g.w, h: g.h, title: g.cap[lang] }));

  return (
    <>
      <SmoothScroll />
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top"><Mark />Yachts<em>&amp; Beyond</em></a>
          <nav className={`nav${open ? " open" : ""}`}>
            {c.nav.map((label, i) => <a key={navIds[i]} href={`#${navIds[i]}`} onClick={() => setOpen(false)}>{label}</a>)}
          </nav>
          <div className="header-actions">
            <div className="languages">
              {(["en", "ru", "ka"] as Lang[]).map(l => <button key={l} className={lang === l ? "active" : ""} onClick={() => { setLang(l); setOpen(false); }} aria-pressed={lang === l}>{l === "ka" ? "GE" : l.toUpperCase()}</button>)}
            </div>
            <a className="header-cta" href={waBase} target="_blank" rel="noopener noreferrer">{Ico.wa}<span>{c.cta}</span></a>
            <button className="mobile-toggle" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
          </div>
        </div>
      </header>

      <main>
        <HeroGlobe c={c.hero} wa={waBase} />

        <div className="strip">
          <div className="container strip-grid">
            {c.facts.map(([b, sub], i) => (
              <motion.div key={b} className="fact" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10% 0px" }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                <Image src={factPhotos[i]} alt="" fill sizes="(max-width: 760px) 50vw, 25vw" style={{ objectFit: "cover", objectPosition: factPos[i] }} />
                <div className="fact-shade" />
                <div className="fact-text"><b>{b}</b><span>{sub}</span></div>
              </motion.div>
            ))}
          </div>
        </div>

        <Trips lang={lang} c={c} onPhoto={setLightbox} />
        <DaySection c={c.day} wa={wa(c.waTour(trips[0].name[lang]))} />
        <Reviews lang={lang} c={c} />

        <section className="gallery" id="gallery">
          <div className="container">
            <div className="section-head">
              <div><p className="eyebrow">{c.galEyebrow}</p><h2 className="section-title">{c.galTitle}</h2></div>
              <p className="section-lede">{c.galLede}</p>
            </div>
          </div>
          <DominoGallery items={dominoItems} labels={lang === "ru" ? ["фотографий", "Предыдущие фото", "Следующие фото", "Пауза", "Продолжить"] : lang === "ka" ? ["ფოტო", "წინა ფოტოები", "შემდეგი ფოტოები", "პაუზა", "გაგრძელება"] : ["photographs", "Previous photos", "Next photos", "Pause", "Play"]} onSelect={setLightbox} />
        </section>

        <Contacts lang={lang} c={c} />
      </main>

      <footer>
        <div className="container footer-inner">
          <a className="brand" href="#top"><Mark />Yachts<em>&amp; Beyond</em></a>
          <span>{c.foot}</span>
          <a href={placeUrl} target="_blank" rel="noopener noreferrer">Google Maps ↗</a>
        </div>
      </footer>

      <AnimatePresence>
        {lightbox && (
          <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setLightbox(null)}>
            <motion.div className="lightbox-img" initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} transition={{ duration: 0.2 }} onClick={e => e.stopPropagation()}>
              <Image src={lightbox} alt="" fill style={{ objectFit: "contain" }} sizes="100vw" />
              <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">×</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
