const crypto = require('crypto');
const getId = () => crypto.randomUUID();

// Tools & Advanced კურსები (ID-ები seed.sql-დან)
const NPM_ID = 'c0000000-0000-0000-0004-000000000002';
const GIT_ID = 'c0000000-0000-0000-0004-000000000003';
const REACT_BASICS_ID = 'c0000000-0000-0000-0005-000000000001';
const REACT_HOOKS_ID = 'c0000000-0000-0000-0005-000000000002';
const REACT_ROUTER_ID = 'c0000000-0000-0000-0005-000000000003';
const STATE_MGMT_ID = 'c0000000-0000-0000-0005-000000000004';
const NEXTJS_ID = 'c0000000-0000-0000-0006-000000000002';
const REACT_TS_ID = 'c0000000-0000-0000-0006-000000000003';
const UI_LIB_ID = 'c0000000-0000-0000-0007-000000000002';
const VITE_ID = 'c0000000-0000-0000-0008-000000000001';

const reactAndMoreLessons = [
    // ==========================================
    // 1. მართვის სისტემები (Git, npm)
    // ==========================================
    {
        id: getId(), course_id: NPM_ID, title: 'რა არის npm?', slug: 'npm-intro',
        content: '# Node Package Manager (NPM)\n\n`npm` არის პაკეტების მენეჯერი JavaScript-ისთვის. როცა პროექტს სჭირდება სხვისი დაწერილი ბიბლიოთეკა (მაგ. React, Axios), ვიყენებთ `npm`-ს მის დასაყენებლად.\n\n```bash\nnpm init -y   # პროექტის დაწყება (ქმნის package.json-ს)\nnpm install lodash # პაკეტის გადმოწერა\n```',
        content_type: 'theory',
        starter_code: '// აქ წარმოიდგინეთ რომ ტერმინალში ხართ.\n// რა ბრძანებას დაწერთ ახალი პაკეტის (მაგალითად "express") დასაყენებლად?\n',
        solution_code: 'npm install express',
        challenge_text: 'დაწერეთ ბრძანება `express` ბიბლიოთეკის ინსტალაციისთვის.',
        language: 'javascript', xp_reward: 10, sort_order: 1
    },
    {
        id: getId(), course_id: GIT_ID, title: 'Git საფუძვლები', slug: 'git-basics-intro',
        content: '# Git და Version Control\n\nGit არის ვერსიების კონტროლის სისტემა. ის გვეხმარება კოდის ისტორიის შენახვასა და გუნდურ მუშაობაში.\n\n#### ძირითადი ბრძანებები:\n- `git init`: ინიციალიზაცია\n- `git add .`: ცვლილებების მონიშვნა (staging)\n- `git commit -m "შეტყობინება"`: დამახსოვრება (save)\n- `git push`: სერვერზე გაგზავნა (მაგ. GitHub-ზე)',
        content_type: 'theory',
        starter_code: '// დაწერეთ სამი ბრძანება თანმიმდევრობით, რათა:\n// 1. მონიშნოთ ყველა ფაილი\n// 2. შექმნათ commit სახელით "Initial commit" \n// 3. გააგზავნოთ (push) main ბრენჩზე.\n',
        solution_code: 'git add .\ngit commit -m "Initial commit"\ngit push origin main',
        challenge_text: 'შეასრულეთ Git add, commit და push ბრძანებები.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    },

    // ==========================================
    // 2. React საფუძვლები
    // ==========================================
    {
        id: getId(), course_id: REACT_BASICS_ID, title: 'პირველი კომპონენტი', slug: 'react-first-component',
        content: '# რა არის React კომპონენტი?\n\nReact-ში ვებ-გვერდი იყოფა პატარა ნაწილებად - **კომპონენტებად**.\n\nკომპონენტი არის უბრალო JavaScript ფუნქცია, რომელიც აბრუნებს HTML-ს (ზუსტად კი - JSX-ს).\n\n```jsx\nfunction Header() {\n  return <h1>გამარჯობა React!</h1>;\n}\n```',
        content_type: 'practice',
        starter_code: '// შექმენით კომპონენტი MyButton, რომელიც დააბრუნებს <button> დაწკაპე </button> ელემენტს.\n\nexport default function App() {\n  return (\n    <div>\n      {/* გამოიძახეთ კომპონენტი აქ: <MyButton /> */}\n    </div>\n  );\n}',
        solution_code: 'function MyButton() {\n  return <button>დაწკაპე</button>;\n}\n\nexport default function App() {\n  return (\n    <div>\n      <MyButton />\n    </div>\n  );\n}',
        challenge_text: 'შექმენით და გამოიძახეთ თქვენი პირველი `MyButton` კომპონენტი.',
        language: 'javascript', xp_reward: 20, sort_order: 1
    },
    {
        id: getId(), course_id: REACT_BASICS_ID, title: 'JSX სინტაქსი', slug: 'react-jsx',
        content: '# JSX - JavaScript XML\n\nJSX საშუალებას გვაძლევს დავწეროთ HTML პირდაპირ JavaScript-ში. თუ გვსურს HTML-ში JS ცვლადის ჩასმა, ვიყენებთ ფიგურულ ფრჩხილებს `{ }`.\n\n```jsx\nfunction Welcome() {\n  const name = "გიორგი";\n  return <p>გამარჯობა, {name}!</p>;\n}\n```',
        content_type: 'practice',
        starter_code: 'export default function Profile() {\n  const user = { name: "ანა", age: 25 };\n  // დააბრუნეთ h2 ტეგი, სადაც ეწერება "სახელი: ანა, ასაკი: 25"\n  // დინამიურად, ობიექტიდან აღებული.\n  return (\n    \n  );\n}',
        solution_code: 'export default function Profile() {\n  const user = { name: "ანა", age: 25 };\n  return (\n    <h2>სახელი: {user.name}, ასაკი: {user.age}</h2>\n  );\n}',
        challenge_text: 'გამოიყენეთ ფიგურული ფრჩხილები `{}` ობიექტის მონაცემების გამოსაჩენად.',
        language: 'javascript', xp_reward: 20, sort_order: 2
    },
    {
        id: getId(), course_id: REACT_BASICS_ID, title: 'Props (თვისებები)', slug: 'react-props',
        content: '# Props\n\nმშობელი კომპონენტიდან შვილ კომპონენტს შეგვიძლია გადავცეთ მონაცემები `props`-ის საშუალებით. (ისევე, როგორც HTML-ში ატრიბუტებს ვიყენებთ).\n\n```jsx\nfunction Card(props) {\n  return <div>{props.title}</div>;\n}\n\n// გამოყენება:\n<Card title="ჩემი საქაღალდე" />\n```',
        content_type: 'practice',
        starter_code: '// 1. შეცვალეთ Greeting ისე, რომ მიიღოს name prop.\nfunction Greeting(props) {\n  return <h1>გამარჯობა, ... !</h1>;\n}\n\nexport default function App() {\n  // 2. გადაეცით name="ლუკა" Greeting-ს\n  return <Greeting />;\n}',
        solution_code: 'function Greeting(props) {\n  return <h1>გამარჯობა, {props.name}!</h1>;\n}\n\nexport default function App() {\n  return <Greeting name="ლუკა" />;\n}',
        challenge_text: 'მიიღეთ `name` prop `Greeting` კომპონენტში დ გამოიყენეთ.',
        language: 'javascript', xp_reward: 20, sort_order: 3
    },

    // ==========================================
    // 3. React Hooks
    // ==========================================
    {
        id: getId(), course_id: REACT_HOOKS_ID, title: 'useState Hook', slug: 'react-usestate',
        content: '# State (მდგომარეობა)\n\nიმისათვის, რომ კომპონენტმა "დაიმახსოვროს" მონაცემი (მაგ. დაჭერილი ღილაკების რაოდენობა), ვიყენებთ `useState`-ს.\n\n```jsx\nimport { useState } from "react";\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return <button onClick={() => setCount(count+1)}>{count}</button>;\n}\n```',
        content_type: 'practice',
        starter_code: 'import { useState } from "react";\n\nexport default function Toggle() {\n  // 1. შექმენით isOn state (საწყისი მნიშვნელობა false)\n  \n  // 2. ღილაკზე დაჭერისას isOn შეცვალეთ საპირისპირო მნიშვნელობით (!isOn)\n  return (\n    <button>\n      {/* 3. თუ isOn არის true, დაწერეთ "ჩართული", თუ არა - "გამორთული" */}\n    </button>\n  );\n}',
        solution_code: 'import { useState } from "react";\n\nexport default function Toggle() {\n  const [isOn, setIsOn] = useState(false);\n  \n  return (\n    <button onClick={() => setIsOn(!isOn)}>\n      {isOn ? "ჩართული" : "გამორთული"}\n    </button>\n  );\n}',
        challenge_text: 'შექმენით ჩამრთველი ღილაკი (ON/OFF) `useState`-ის გამოყენებით.',
        language: 'javascript', xp_reward: 25, sort_order: 1
    },
    {
        id: getId(), course_id: REACT_HOOKS_ID, title: 'useEffect Hook', slug: 'react-useeffect',
        content: '# ეფექტები (useEffect)\n\nთუ გვინდა, რომ რაღაც კოდი (მაგ. სერვერიდან მონაცემების წამოღება) შესრულდეს მაშინ, როცა კომპონენტი გამოჩნდება ეკრანზე, ვიყენებთ `useEffect`-ს.\n\n```jsx\nimport { useEffect } from "react";\n\nuseEffect(() => {\n  console.log("კომპონენტი ჩაიტვირთოს!");\n}, []); // ცარიელი მასივი ნიშნავს რომ მხოლოდ 1-ჯერ შესრულდება\n```',
        content_type: 'theory',
        starter_code: 'import { useEffect, useState } from "react";\n\nexport default function App() {\n  const [data, setData] = useState("იტვირთება...");\n\n  // გამოიყენეთ useEffect, რომ 2 წამის შემდეგ setData-თი შეცვალოთ წარწერა "ჩაიტვირთა!"-ზე\n\n  return <h2>{data}</h2>;\n}',
        solution_code: 'import { useEffect, useState } from "react";\n\nexport default function App() {\n  const [data, setData] = useState("იტვირთება...");\n\n  useEffect(() => {\n    setTimeout(() => {\n      setData("ჩაიტვირთა!");\n    }, 2000);\n  }, []);\n\n  return <h2>{data}</h2>;\n}',
        challenge_text: 'გამოიყენეთ `useEffect` და `setTimeout` დროის გასვლის შემდეგ state-ის შესაცვლელად.',
        language: 'javascript', xp_reward: 25, sort_order: 2
    },

    // ==========================================
    // 4. Advanced React Tools
    // ==========================================
    {
        id: getId(), course_id: STATE_MGMT_ID, title: 'Context API', slug: 'react-context-api',
        content: '# Context API\n\nროდესაც გვაქვს ძალიან ბევრი შვილი კომპონენტი, მონაცემების ხელით (props-ით) ჩაწოდება რთულდება (Prop Drilling). ამისთვის ვიყენებთ Context-ს, რათა გლობალურად გავაზიაროთ მონაცემები.\n\n```jsx\nconst ThemeContext = createContext("light");\n```',
        content_type: 'theory',
        starter_code: '// იდეის დონეზე, დაწერეთ createContext-ის გამოყენების მაგალითი UserContext-ისთვის.',
        solution_code: 'import { createContext } from "react";\nconst UserContext = createContext(null);\nexport default UserContext;',
        challenge_text: 'შექმენით უბრალო UserContext-ი `createContext`-ით.',
        language: 'javascript', xp_reward: 25, sort_order: 1
    },
    {
        id: getId(), course_id: REACT_ROUTER_ID, title: 'React Router დანერგვა', slug: 'react-router-setup',
        content: '# React Router v6\n\nSingle Page Application (SPA)-ში გვერდებს შორის ნავიგაციისთვის გვჭირდება დამატებითი ბიბლიოთეკა - React Router.\n\n```jsx\nimport { BrowserRouter, Routes, Route } from "react-router-dom";\n\n<BrowserRouter>\n  <Routes>\n    <Route path="/" element={<Home />} />\n    <Route path="/about" element={<About />} />\n  </Routes>\n</BrowserRouter>\n```',
        content_type: 'practice',
        starter_code: '// შექმენით Routes და Route კომპონენტები (path="/contact" და element={<Contact />})',
        solution_code: '<Routes>\n  <Route path="/contact" element={<Contact />} />\n</Routes>',
        challenge_text: 'დაამატეთ Contact გვერდის მარშრუტი (Route).',
        language: 'javascript', xp_reward: 20, sort_order: 1
    },
    {
        id: getId(), course_id: NEXTJS_ID, title: 'რატომ Next.js?', slug: 'nextjs-intro-ssr',
        content: '# Next.js მოკლე მიმოხილვა\n\nNext.js არის React-ის ფრეიმვორქი, რომელიც გვაძლევს File-based routing-ს (ფაილური ნავიგაცია), და სერვერზე რენდერს (SSR - Server Side Rendering) სეოს (SEO) და სისწრაფის გასაუმჯობესებლად.\n\n`app/page.tsx` პირდაპირ ხდება მთავარი გვერდი.',
        content_type: 'theory',
        starter_code: '// Next.js-ში App Router-ით,\n// რას ერქმევა მისამართს სადაც შეიქმნება ფაილი: app/about/page.tsx ?',
        solution_code: '// მისამართი იქნება: /about',
        challenge_text: 'გაშიფრეთ File-system routing Next.js-ში.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    }
];

module.exports = reactAndMoreLessons;
