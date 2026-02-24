const crypto = require('crypto');
const getId = () => crypto.randomUUID();

const TS_BASICS_ID = 'c0000000-0000-0000-0006-000000000001';
const TS_REACT_ID = 'c0000000-0000-0000-0006-000000000003';
const PERF_ID = 'c0000000-0000-0000-0008-000000000002';
const TEST_ID = 'c0000000-0000-0000-0008-000000000003';
const PORTFOLIO_ID = 'c0000000-0000-0000-0009-000000000001';
const ECOM_ID = 'c0000000-0000-0000-0009-000000000002';
const DASH_ID = 'c0000000-0000-0000-0009-000000000003';
const SOCIAL_ID = 'c0000000-0000-0000-0009-000000000004';

const advancedLessons = [
    // ==========================================
    // 1. TypeScript
    // ==========================================
    {
        id: getId(), course_id: TS_BASICS_ID, title: 'ტიპები (Types და Interfaces)', slug: 'ts-types-interfaces',
        content: '# TypeScript\n\nTypeScript არის JavaScript მკაცრი ტიპიზაციით. ის გვეხმარება შეცდომების თავიდან აცილებაში კოდის გაშვებამდე.\n\n```typescript\nlet name: string = "დავითი";\nlet age: number = 25;\n\n// ობიექტის აღწერა (Interface)\ninterface User {\n  name: string;\n  age: number;\n}\nlet admin: User = { name: "ანა", age: 30 };\n```',
        content_type: 'practice',
        starter_code: 'interface Product {\n  // 1. აღწერეთ title (ტექსტი) და price (რიცხვი)\n}\n\n// 2. შექმენით item ცვლადი Product ტიპით: { title: "Laptop", price: 1000 }',
        solution_code: 'interface Product {\n  title: string;\n  price: number;\n}\n\nlet item: Product = { title: "Laptop", price: 1000 };\nconsole.log(item);',
        challenge_text: 'აღწერეთ `Product` ინტერფეისი და გამოიყენეთ ცვლადის შესაქმნელად.',
        language: 'javascript', xp_reward: 25, sort_order: 1
    },
    {
        id: getId(), course_id: TS_REACT_ID, title: 'React Props ტიპიზაცია', slug: 'ts-react-props',
        content: '# React და TypeScript\n\nReact-ში Props-ების გადაცემისას, TypeScript ამოწმებს სწორი ტიპის მონაცემი მიიღო თუ არა შვილმა კომპონენტმა.\n\n```tsx\ninterface ButtonProps {\n  text: string;\n  disabled?: boolean; // ? ნიშნავს რომ აუცილებელი არაა\n}\n\nfunction Button({ text, disabled }: ButtonProps) {\n  return <button disabled={disabled}>{text}</button>;\n}\n```',
        content_type: 'practice',
        starter_code: 'interface CardProps {\n  title: string;\n}\n// მიანიჭეთ Card ფუნქციას CardProps ტიპი\nfunction Card({ title }) {\n  return <div>{title}</div>;\n}',
        solution_code: 'interface CardProps {\n  title: string;\n}\nfunction Card({ title }: CardProps) {\n  return <div>{title}</div>;\n}',
        challenge_text: 'ტიპიზაცია გაუკეთეთ Card კომპონენტის ობიექტს.',
        language: 'javascript', xp_reward: 30, sort_order: 1
    },

    // ==========================================
    // 2. Build, Perf & Testing
    // ==========================================
    {
        id: getId(), course_id: PERF_ID, title: 'ვებ ოპტიმიზაცია (Lazy Loading)', slug: 'perf-lazy-loading',
        content: '# Lazy Loading\n\nთუ გვერდზე ბევრი სურათი ან დიდი კომპონენტი გვაქვს, უმჯობესია არ ჩავტვირთოთ ისინი ერთდროულად. ამისთვის ვიყენებთ "ზარმაც ჩატვირთვას" (Lazy Loading). სურათი იტვირთება მხოლოდ მაშინ, როცა ეკრანზე გამოჩნდება.',
        content_type: 'theory',
        starter_code: '<!-- დაამატეთ ატრიბუტი loading="lazy" სურათის ტეგში -->\n<img src="large-image.jpg" alt="ფოტო">',
        solution_code: '<img src="large-image.jpg" alt="ფოტო" loading="lazy">',
        challenge_text: 'გააქტიურეთ სურათისთვის lazy ნაგულისხმევი ჩატვირთვა.',
        language: 'html', xp_reward: 20, sort_order: 1
    },
    {
        id: getId(), course_id: TEST_ID, title: 'რა არის Unit Testing?', slug: 'testing-intro',
        content: '# ტესტირება Jest-ით\n\nპროგრამული უზრუნველყოფის ხარისხისთვის ვწერთ ავტომატურ ტესტებს (მაგალითად ბიბლიოთეკა Jest-ით).\n\n```javascript\ntest("adds 1 + 2 to equal 3", () => {\n  expect(add(1, 2)).toBe(3);\n});\n```',
        content_type: 'theory',
        starter_code: 'function multiply(a, b) {\n  return a * b;\n}\n// წარმოიდგინეთ ტესტი:\n// test("ამრავლებს 2-ს 3-ზე", () => { \n//   expect(multiply(2, 3)).toBe(...); \n// });',
        solution_code: 'function multiply(a, b) {\n  return a * b;\n}\ntest("ამრავლებს 2-ს 3-ზე", () => { \n  expect(multiply(2, 3)).toBe(6); \n});',
        challenge_text: 'გამოიცანით ტესტის შედეგი.',
        language: 'javascript', xp_reward: 20, sort_order: 1
    },

    // ==========================================
    // 3. Projects (დასრულებული სახით წარდგენილი)
    // ==========================================
    {
        id: getId(), course_id: PORTFOLIO_ID, title: 'პირადი პორტფოლიოს აწყობა', slug: 'project-portfolio',
        content: '# პორტფოლიო პროექტი\n\nამ პროექტში თქვენ უნდა გამოიყენოთ აქამდე ნასწავლი HTML (სექციები, სემანტიკა) და CSS (Flexbox ნავიგაციისთვის, Grid პროექტების სიისთვის).',
        content_type: 'project',
        starter_code: '<!-- დაწერეთ მარტივი სტრუქტურა -->\n<nav>ნავიგაცია</nav>\n<section id="about">ჩემ შესახებ</section>\n<section id="projects">პროექტები</section>\n<footer>საკონტაქტო ინფო</footer>',
        solution_code: '<nav>ნავიგაცია</nav>\n<section id="about">ჩემ შესახებ</section>\n<section id="projects">პროექტები</section>\n<footer>საკონტაქტო ინფო</footer>',
        challenge_text: 'ააწყვეთ Landing Page-ის სტრუქტურა.',
        language: 'html', xp_reward: 50, sort_order: 1
    },
    {
        id: getId(), course_id: ECOM_ID, title: 'E-Commerce კალათა', slug: 'project-ecom-cart',
        content: '# E-Commerce კალათა (React)\n\nონლაინ მაღაზიაში მნიშვნელოვანია `Cart` მდგომარეობა (State).',
        content_type: 'project',
        starter_code: 'import { useState } from "react";\n\nexport default function Cart() {\n  // შექმენით cartItems state (ცარიელი მასივით)\n  return <div>კალათაშია: X ნივთი</div>\n}',
        solution_code: 'import { useState } from "react";\n\nexport default function Cart() {\n  const [cartItems, setCartItems] = useState([]);\n  return <div>კალათაშია: {cartItems.length} ნივთი</div>\n}',
        challenge_text: 'შექმენით useState კალათის ნივთებისთვის.',
        language: 'javascript', xp_reward: 50, sort_order: 1
    },
    {
        id: getId(), course_id: DASH_ID, title: 'ადმინ პანელი სტატისტიკით', slug: 'project-dashboard',
        content: '# Dashboard (React + Chart.js)\n\nადმინ პანელში ხშირად გვჭირდება მონაცემების ვიზუალიზაცია (გრაფიკები), და Grid ლეიაუტი გვერდითა ნავიგაციის (Sidebar) განსათავსებლად.',
        content_type: 'project',
        starter_code: '<div class="admin-layout">\n  <aside>Sidebar</aside>\n  <main>გრაფიკები</main>\n</div>',
        solution_code: '<div class="admin-layout" style="display: flex;">\n  <aside style="width: 250px;">Sidebar</aside>\n  <main style="flex: 1;">გრაფიკები</main>\n</div>',
        challenge_text: 'ჩარჩო ააწყვეთ Sidebar-ისა და Main შიგთავსით.',
        language: 'html', xp_reward: 50, sort_order: 1
    },
    {
        id: getId(), course_id: SOCIAL_ID, title: 'სოციალური ქსელის Post კომპონენტი', slug: 'project-social-post',
        content: '# სოციალური ქსელი (React Fullstack)\n\nშეუქმენით მომხმარებელს შესაძლებლობა მოიწონოს თქვენი პოსტი (Like button).',
        content_type: 'project',
        starter_code: 'const Post = ({ author, content }) => {\n  // დაწერეთ like state\n  return <div>...</div>;\n}',
        solution_code: 'import {useState} from "react";\nconst Post = ({ author, content }) => {\n  const [likes, setLikes] = useState(0);\n  return (\n    <div className="post">\n      <h4>{author}</h4>\n      <p>{content}</p>\n      <button onClick={() => setLikes(likes + 1)}>👍 {likes}</button>\n    </div>\n  );\n}',
        challenge_text: 'შექმენით Post კომპონენტი Like ღილაკით.',
        language: 'javascript', xp_reward: 50, sort_order: 1
    }
];

module.exports = advancedLessons;
