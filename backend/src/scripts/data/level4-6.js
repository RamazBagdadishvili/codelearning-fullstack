const crypto = require('crypto');
const getId = () => crypto.randomUUID();

const level4to6 = [
    // ==========================================
    // LEVEL 4: ES6+ (c0...0004...0001)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0004-000000000001',
        title: 'let და const vs var', slug: 'let-const',
        content: '# let და const\n\nES6-მდე ვიყენებდით `var`-ს ცვლადების შესაქმნელად, რაც ბევრ პრობლემას იწვევდა hoisting-ისა და scope-ის გამო.\n\n- `let` - გამოიყენება ისეთი ცვლადებისთვის, რომელთა მნიშვნელობაც შეიძლება შეიცვალოს.\n- `const` - გამოიყენება მუდმივებისთვის.\n\n```javascript\nconst PI = 3.14;\nlet score = 0;\nscore += 10;\n```',
        content_type: 'theory',
        starter_code: '// შეცვალეთ var თანამედროვე let და const-ით\nvar name = "Nino";\nvar age = 22;\nname = "Nino T.";',
        solution_code: 'let name = "Nino";\nconst age = 22;\nname = "Nino T.";',
        challenge_text: 'გამოიყენეთ `let` სახელისთვის და `const` ასაკისთვის.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0004-000000000001',
        title: 'Template Literals', slug: 'template-literals',
        content: '# Template Literals\n\nტექსტების გაერთიანება `+` ნიშნით მომქანცველია. ES6 გვთავაზობს ბექტიკებს (``` ` ```) და `${}` სინტაქსს ცვლადების ჩასასმელად.\n\n```javascript\nconst name = "გიორგი";\nconst msg = `გამარჯობა, ${name}! კეთილი იყოს შენი მობრძანება.`;\nconsole.log(msg);\n```',
        content_type: 'practice',
        starter_code: 'const item = "iPhone";\nconst price = 999;\n// შექმენით message ცვლადი ბექტიკებით, სადაც ეწერება: "ნივთი: iPhone, ფასი: 999$"\n',
        solution_code: 'const item = "iPhone";\nconst price = 999;\nconst message = `ნივთი: ${item}, ფასი: ${price}$`;\nconsole.log(message);',
        challenge_text: 'გამოიყენეთ Template Literal და ჩასვით ორივე ცვლადი სტრინგში.',
        language: 'javascript', xp_reward: 20, sort_order: 2
    },

    // ==========================================
    // LEVEL 4: npm (c0...0004...0002)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0004-000000000002',
        title: 'რა არის npm?', slug: 'what-is-npm',
        content: '# npm შესავალი\n\n**npm** (Node Package Manager) არის პაკეტების მენეჯერი JavaScript-ისთვის. მისი საშუალებით ვაინსტალირებთ სხვების მიერ დაწერილ ბიბლიოთეკებს.\n\nპროექტის ინიციალიზაცია ხდება ბრძანებით:\n`npm init -y`\nეს ქმნის `package.json` ფაილს, სადაც ინახება პროექტის კონფიგურაცია.',
        content_type: 'theory',
        starter_code: '// დაწერეთ ბრძანება პროექტის ინიციალიზაციისთვის კომენტარის სახით\n',
        solution_code: '// npm init -y',
        challenge_text: 'დაწერეთ npm init -y კომენტარის სახით.',
        language: 'javascript', xp_reward: 10, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0004-000000000002',
        title: 'პაკეტების ინსტალაცია', slug: 'npm-install',
        content: '# npm install\n\nპაკეტის დასაინსტალირებლად ვიყენებთ `npm install <package-name>` (ან შემოკლებით `npm i`).\n\nმაგალითად, `axios` ბიბლიოთეკის დაყენება:\n`npm install axios`\n\nთუ პაკეტი მხოლოდ დეველოპმენტისთვის გვჭირდება (მაგალითად nodemon):\n`npm install nodemon -D`',
        content_type: 'theory',
        starter_code: '// დაწერეთ ბრძანება react და react-dom პაკეტების დასაინსტალირებლად\n',
        solution_code: '// npm install react react-dom',
        challenge_text: 'დაწერეთ ბრძანება react პაკეტის ინსტალაციისთვის კომენტარის სახით.',
        language: 'javascript', xp_reward: 15, sort_order: 2
    },

    // ==========================================
    // LEVEL 4: Git (c0...0004...0003)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0004-000000000003',
        title: 'Git-ის საფუძვლები', slug: 'git-basics',
        content: '# Git შესავალი\n\nGit ვერსიების კონტროლის სისტემაა, რომელიც ინახავს კოდის ცვლილებების ისტორიას.\n\n1. `git init` - ახალი რეპოზიტორიის შექმნა\n2. `git add .` - ყველა ცვლილების დამატება Staging ზონაში\n3. `git commit -m "მესიჯი"` - ცვლილების დაფიქსირება',
        content_type: 'theory',
        starter_code: '// ჩაწერეთ რიგრიგობით 3 ძირითადი git ბრძანება ახალი პროექტის შესანახად\n',
        solution_code: '// git init\n// git add .\n// git commit -m "Initial commit"',
        challenge_text: 'ჩაწერეთ კომენტარებად git init, git add . და git commit ბრძანებები.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    },

    // ==========================================
    // LEVEL 4: Async JS (c0...0004...0004)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0004-000000000004',
        title: 'Promises', slug: 'js-promises',
        content: '# პრომისები (Promises)\n\nPromise არის ობიექტი, რომელიც წარმოადგენს ასინქრონული ოპერაციის საბოლოო დასრულებას (წარმატებით ან შეცდომით).\n\n```javascript\nfetch("https://api.example.com/data")\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error(error));\n```',
        content_type: 'theory',
        starter_code: 'const myPromise = new Promise((resolve, reject) => {\n  // 1 წამის შემდეგ დაარეზოლვეთ ტექსტი "წარმატებულია!"\n  \n});',
        solution_code: 'const myPromise = new Promise((resolve, reject) => {\n  setTimeout(() => {\n    resolve("წარმატებულია!");\n  }, 1000);\n});\nmyPromise.then(res => console.log(res));',
        challenge_text: 'შექმენით Promise, რომელიც 1 წამის (setTimeout) შემდეგ resolve-ს გამოიძახებს.',
        language: 'javascript', xp_reward: 25, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0004-000000000004',
        title: 'Async / Await', slug: 'async-await',
        content: '# Async / Await\n\nES8-მ შემოიტანა `async/await`, რომელიც Promise-ებთან მუშაობას ამარტივებს და კოდს სინქრონულს ამსგავსებს.\n\n```javascript\nasync function getData() {\n  try {\n    const res = await fetch("...");\n    const data = await res.json();\n    console.log(data);\n  } catch (err) {\n    // Error handling\n  }\n}\n```',
        content_type: 'practice',
        starter_code: '// გადააკეთეთ ასინქრონულ (async) ფუნქციად\nfunction fetchUser() {\n  // გამოიყენეთ await იმიტირებული Promise-ისთვის Promise.resolve({name: "Luka"})\n}',
        solution_code: 'async function fetchUser() {\n  const user = await Promise.resolve({name: "Luka"});\n  console.log(user.name);\n  return user;\n}',
        challenge_text: 'დაწერეთ async ფუნქცია, რომელიც იყენებს await საკვანძო სიტყვას.',
        language: 'javascript', xp_reward: 30, sort_order: 2
    },

    // ==========================================
    // LEVEL 5: React Basics (c0...0005...0001)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0005-000000000001',
        title: 'რა არის React?', slug: 'what-is-react',
        content: '# React.js\n\nReact არის პოპულარული ბიბლიოთეკა UI-ის (User Interface) ასაწყობად.\nის იყენებს **კომპონენტების** არქიტექტურას და **JSX** სინტაქსს (HTML-ის მაგვარი სინტაქსი JS-ში).\n\n```jsx\nfunction Welcome() {\n  return <h1>გამარჯობა, React!</h1>;\n}\n```',
        content_type: 'theory',
        starter_code: 'import React from "react";\n\n// შექმენით ფუნქციონალური კომპონენტი Button, რომელიც აბრუნებს <button>Click</button>\n',
        solution_code: 'import React from "react";\nfunction Button() {\n  return <button>Click</button>;\n}\nexport default Button;',
        challenge_text: 'შექმენით React კომპონენტი სახელად Button.',
        language: 'jsx', xp_reward: 20, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0005-000000000001',
        title: 'Props (თვისებები)', slug: 'react-props',
        content: '# Props\n\nკომპონენტებს შორის მონაცემების გადაცემა ხდება `props`-ის საშუალებით. ისინი ფუნქციის არგუმენტების მსგავსია.\n\n```jsx\nfunction Greeting(props) {\n  return <h2>გამარჯობა, {props.name}</h2>;\n}\n\n// გამოძახება:\n<Greeting name="მარიამი" />\n```',
        content_type: 'practice',
        starter_code: 'function UserCard(props) {\n  return (\n    <div>\n      {/* გამოიტანეთ ომხმარებლის სახელი props.name-დან */}\n    </div>\n  );\n}',
        solution_code: 'function UserCard(props) {\n  return (\n    <div>\n      <h3>{props.name}</h3>\n    </div>\n  );\n}',
        challenge_text: 'გამოიყენეთ props და გამოიტანეთ მონაცემი ეკრანზე.',
        language: 'jsx', xp_reward: 25, sort_order: 2
    },

    // ==========================================
    // LEVEL 5: React Hooks (c0...0005...0002)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0005-000000000002',
        title: 'useState Hook', slug: 'react-usestate',
        content: '# useState\n\nReact-ში მონაცემთა შესანახად და UI-ის გასაახლებლად ვიყენებთ `useState` ჰუკს.\n\n```jsx\nimport { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}\n```',
        content_type: 'practice',
        starter_code: 'import { useState } from "react";\n\nfunction Toggle() {\n  // შექმენით isOn state და დააყენეთ false-ზე\n  \n  return (\n    <button>\n      {/* დაწერეთ ლოგიკა toggling-თვის */}\n    </button>\n  );\n}',
        solution_code: 'import { useState } from "react";\nfunction Toggle() {\n  const [isOn, setIsOn] = useState(false);\n  return (\n    <button onClick={() => setIsOn(!isOn)}>\n      {isOn ? "ჩართული" : "გამორთული"}\n    </button>\n  );\n}',
        challenge_text: 'შექმენით State boolean ტიპით და შეცვალეთ მისი მნიშვნელობა ღილაკზე დაჭერისას.',
        language: 'jsx', xp_reward: 30, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0005-000000000002',
        title: 'useEffect Hook', slug: 'react-useeffect',
        content: '# useEffect\n\n`useEffect` გამოიყენება side-effect-ებისთვის, როგორიცაა მონაცემების წამოღება (fetch), event listener-ების დამატება და ა.შ.\n\n```jsx\nuseEffect(() => {\n  console.log("კომპონენტი ჩაიტვირთა!");\n  // ...\n}, []); // ცარიელი მასივი ნიშნავს რომ მხოლოდ ერთხელ გაეშვება\n```',
        content_type: 'theory',
        starter_code: 'import { useEffect, useState } from "react";\n\nfunction App() {\n  const [data, setData] = useState(null);\n  // დაამატეთ useEffect რომელიც ჩატვირთვისას "Fetched!"-ს მიანიჭებს data-ს\n  \n  return <div>{data}</div>;\n}',
        solution_code: 'import { useEffect, useState } from "react";\nfunction App() {\n  const [data, setData] = useState("Loading...");\n  useEffect(() => {\n    setData("Fetched!");\n  }, []);\n  return <div>{data}</div>;\n}',
        challenge_text: 'შექმენით useEffect ცარიელი dependency array-ით.',
        language: 'jsx', xp_reward: 35, sort_order: 2
    },

    // ==========================================
    // LEVEL 5: React Router (c0...0005...0003)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0005-000000000003',
        title: 'Router და Routes', slug: 'react-router-setup',
        content: '# React Router Setup\n\nრამდენიმე გვერდის დასამატებლად ვიყენებთ `react-router-dom`-ს.\n\n```jsx\nimport { BrowserRouter, Routes, Route } from "react-router-dom";\n\n<BrowserRouter>\n  <Routes>\n    <Route path="/" element={<Home />} />\n    <Route path="/about" element={<About />} />\n  </Routes>\n</BrowserRouter>\n```',
        content_type: 'theory',
        starter_code: 'import { Routes, Route } from "react-router-dom";\n\n// დაამატეთ Route "/contact" მისამართზე\nfunction App() {\n  return (\n    <Routes>\n      <Route path="/" element={<h1>Home</h1>} />\n      \n    </Routes>\n  );\n}',
        solution_code: 'import { Routes, Route } from "react-router-dom";\nfunction App() {\n  return (\n    <Routes>\n      <Route path="/" element={<h1>Home</h1>} />\n      <Route path="/contact" element={<h1>Contact</h1>} />\n    </Routes>\n  );\n}',
        challenge_text: 'დაამატეთ ახალი Route contact გვერდისთვის.',
        language: 'jsx', xp_reward: 20, sort_order: 1
    },

    // ==========================================
    // LEVEL 6: TypeScript Basics (c0...0006...0001)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0006-000000000001',
        title: 'TypeScript რა არის?', slug: 'what-is-ts',
        content: '# TypeScript\n\nTypeScript არის JavaScript-ის გაფართოება, რომელიც ამატებს **სტატიკურ ტიპებს**.\n\n```typescript\nlet name: string = "დავითი";\nlet age: number = 30;\nlet isDeveloper: boolean = true;\n\n// შეცდომას გამოაგდებს ედიტორი:\n// age = "ოცდაათი"; // Type string is not assignable to type number\n```',
        content_type: 'theory',
        starter_code: '// შექმენით num1 და num2 ცვლადები number ტიპით\n',
        solution_code: 'let num1: number = 10;\nlet num2: number = 20;',
        challenge_text: 'განსაზღვრეთ ცვლადები სტატიკური ტიპებით.',
        language: 'typescript', xp_reward: 20, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0006-000000000001',
        title: 'Interfaces', slug: 'ts-interfaces',
        content: '# Interfaces\n\nინტერფეისები ობიექტების სტრუქტურის აღსაწერად გამოიყენება.\n\n```typescript\ninterface User {\n  id: number;\n  name: string;\n  email?: string; // ? ნიშნავს რომ არასავალდებულოა (optional)\n}\n\nconst user1: User = {\n  id: 1,\n  name: "გიორგი"\n};\n```',
        content_type: 'practice',
        starter_code: 'interface Product {\n  // დაუმატეთ title (string) და price (number)\n}\nconst item: Product = { title: "Laptop", price: 1500 };',
        solution_code: 'interface Product {\n  title: string;\n  price: number;\n}\nconst item: Product = { title: "Laptop", price: 1500 };',
        challenge_text: 'შექმენით Product ინტერფეისი.',
        language: 'typescript', xp_reward: 30, sort_order: 2
    },

    // ==========================================
    // LEVEL 6: Next.js Basics (c0...0006...0002)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0006-000000000002',
        title: 'Next.js App Router', slug: 'nextjs-app-router',
        content: '# Next.js Framework\n\nNext.js არის პოპულარული React framework, რომელიც გვთავაზობს Server-Side Rendering-ს (SSR) და მარტივ Routing-ს.\n\nApp Router-ში ფაილური სისტემა ქმნის მისამართებს (routes).\nმაგალითად, ფაილი `app/about/page.tsx` გამოჩნდება `/about` მისამართზე.',
        content_type: 'theory',
        starter_code: 'export default function AboutPage() {\n  return <div>ჩვენს შესახებ</div>;\n}',
        solution_code: 'export default function AboutPage() {\n  return <div>ჩვენს შესახებ</div>;\n}',
        challenge_text: 'უბრალოდ გაეცანით კოდს. Next.js ში Page კომპონენტები default export-ით გადაიცემა.',
        language: 'tsx', xp_reward: 25, sort_order: 1
    }
];

module.exports = level4to6;
