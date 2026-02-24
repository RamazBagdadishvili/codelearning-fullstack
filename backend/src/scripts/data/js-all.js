const crypto = require('crypto');
const getId = () => crypto.randomUUID();

// JavaScript კურსები ბազიდან (ID-ები აღებულია seed.sql-დან)
const JS_BASICS_ID = 'c0000000-0000-0000-0003-000000000001';
const JS_FUNCTIONS_ID = 'c0000000-0000-0000-0003-000000000002';
const JS_DOM_ID = 'c0000000-0000-0000-0003-000000000003';
const JS_ARRAYS_ID = 'c0000000-0000-0000-0003-000000000004';
const JS_ES6_ID = 'c0000000-0000-0000-0004-000000000001';
const JS_ASYNC_ID = 'c0000000-0000-0000-0004-000000000004';

const jsLessons = [
    // ==========================================
    // 1. JS საფუძვლები
    // ==========================================
    {
        id: getId(), course_id: JS_BASICS_ID, title: 'პირველი ნაბიჯები და ცვლადები', slug: 'js-variables-intro',
        content: '# ცვლადები (Variables)\n\nJavaScript-ში მონაცემების შესანახად ვიყენებთ ცვლადებს.\n\nარსებობს 3 გზა:\n- `let` - შეგვიძლია მნიშვნელობის შეცვლა\n- `const` - მუდმივია, მნიშვნელობა არ იცვლება\n- `var` - მოძველებული გზა, იშვიათად ვიყენებთ\n\n```javascript\nlet age = 20;\nage = 21; // მუშაობს\n\nconst name = "გიორგი";\nname = "ლუკა"; // შეცდომა!*\n```',
        content_type: 'theory',
        starter_code: '// შექმენით ასაკის (let) და სახელის (const) ცვლადები.\n// დაბეჭდეთ ორივე კონსოლში.',
        solution_code: 'let age = 25;\nconst name = "ანა";\nconsole.log(name, age);',
        challenge_text: 'შექმენით `age` ცვლადი და `name` მუდმივა და დაბეჭდეთ.',
        language: 'javascript', xp_reward: 10, sort_order: 1
    },
    {
        id: getId(), course_id: JS_BASICS_ID, title: 'მონაცემთა ტიპები', slug: 'js-data-types',
        content: '# მონაცემთა ტიპები\n\nJS-ში გვაქვს სხვადასხვა ტიპის მნიშვნელობები:\n\n1. **String** (სტრიქონი): `"ტექსტი"`, `\'ტექსტი\'`\n2. **Number** (რიცხვი): `42`, `3.14`\n3. **Boolean** (ლოგიკური): `true`, `false`\n4. **Null** (ცარიელი): `null`\n5. **Undefined** (განუსაზღვრელი): `undefined`\n\nტიპის გასაგებად ვიყენებთ `typeof` ოპერატორს.',
        content_type: 'theory',
        starter_code: 'let isStudent = true;\nlet score = 95.5;\nlet greeting = "გამარჯობა";\n\n// დაბეჭდეთ თითოეული ცვლადის ტიპი (typeof)',
        solution_code: 'let isStudent = true;\nlet score = 95.5;\nlet greeting = "გამარჯობა";\n\nconsole.log(typeof isStudent);\nconsole.log(typeof score);\nconsole.log(typeof greeting);',
        challenge_text: 'გამოიყენეთ `typeof` სამივე ცვლადის ტიპის სანახავად კონსოლში.',
        language: 'javascript', xp_reward: 10, sort_order: 2
    },
    {
        id: getId(), course_id: JS_BASICS_ID, title: 'პირობითი ოპერატორები (if/else)', slug: 'js-if-else',
        content: '# If/Else განცხადებები\n\nპროგრამამ რომ გადაწყვეტილებები მიიღოს, ვიყენებთ პირობებს:\n\n```javascript\nlet age = 18;\nif (age >= 18) {\n  console.log("თქვენ სრულწლოვანი ხართ");\n} else {\n  console.log("თქვენ არ ხართ სრულწლოვანი");\n}\n```',
        content_type: 'practice',
        starter_code: 'let score = 85;\n// დაწერეთ if/else პირობა.\n// თუ score მეტია ან ტოლი 50-ზე, დაბეჭდეთ "ჩააბარე"\n// სხვა შემთხვევაში დაბეჭდეთ "ჩაიჭერი"\n',
        solution_code: 'let score = 85;\nif (score >= 50) {\n  console.log("ჩააბარე");\n} else {\n  console.log("ჩაიჭერი");\n}',
        challenge_text: 'დაწერეთ if/else ლოგიკა ქულის შესამოწმებლად.',
        language: 'javascript', xp_reward: 15, sort_order: 3
    },

    // ==========================================
    // 2. JS ფუნქციები
    // ==========================================
    {
        id: getId(), course_id: JS_FUNCTIONS_ID, title: 'რა არის ფუნქცია?', slug: 'js-functions-intro',
        content: '# ფუნქციები\n\nფუნქცია არის კოდის ბლოკი საქმის გასაკეთებლად. მას შეგვიძლია გადავცეთ პარამეტრები და დავაბრუნოთ მნიშვნელობა (`return`).\n\n```javascript\nfunction greet(name) {\n  return "გამარჯობა, " + name;\n}\n\nlet message = greet("გიორგი");\nconsole.log(message);\n```',
        content_type: 'practice',
        starter_code: '// შექმენით ფუნქცია add, რომელიც მიიღებს ორ რიცხვს (a, b)\n// და დააბრუნებს მათ ჯამს.\n// შემდეგ გამოიძახეთ ის.',
        solution_code: 'function add(a, b) {\n  return a + b;\n}\nconsole.log(add(5, 10));',
        challenge_text: 'შექმენით და გამოიძახეთ ჯამის გამომთვლელი ფუნქცია.',
        language: 'javascript', xp_reward: 20, sort_order: 1
    },
    {
        id: getId(), course_id: JS_FUNCTIONS_ID, title: 'Arrow (ისრისებრი) ფუნქციები', slug: 'js-arrow-functions',
        content: '# Arrow Functions\n\nES6-ში გაჩნდა ფუნქციების მოკლედ ჩაწერის გზა - `=>`.\n\n```javascript\n// ჩვეულებრივი\nfunction multiply(a, b) {\n  return a * b;\n}\n\n// Arrow ფუნქცია\nconst multiply = (a, b) => a * b;\n```',
        content_type: 'practice',
        starter_code: '// გადააკეთეთ ეს ფუნქცია Arrow ფუნქციად:\nfunction square(x) {\n  return x * x;\n}',
        solution_code: 'const square = (x) => x * x;\nconsole.log(square(5));',
        challenge_text: 'შეცვალეთ ჩვეულებრივი ფუნქცია Arrow ფუნქციის სტილზე.',
        language: 'javascript', xp_reward: 20, sort_order: 2
    },

    // ==========================================
    // 3. JS DOM მანიპულაცია
    // ==========================================
    {
        id: getId(), course_id: JS_DOM_ID, title: 'ელემენტების არჩევა', slug: 'js-dom-selectors',
        content: '# DOM\n\n**D**ocument **O**bject **M**odel საშუალებას გვაძლევს JavaScript-ით ვმართოთ ვებ-გვერდის HTML/CSS.\n\n- `document.getElementById("myId")` - იძახებს id-ით\n- `document.querySelector(".myClass")` - იძახებს კლასით',
        content_type: 'theory',
        starter_code: '// მოძებნეთ h1 ელემენტი id-ით "title" და შეინახეთ ცვლადში. \n// შემდეგ შეუცვალეთ ტექსტი',
        solution_code: 'let title = document.getElementById("title");\ntitle.textContent = "შეცვლილი სათაური";',
        challenge_text: 'იპოვეთ სათაური (id "title") და შეუცვალეთ ტექსტი `textContent`-ით.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: JS_DOM_ID, title: 'ღილაკზე რეაგირება (Events)', slug: 'js-dom-events',
        content: '# Event Listeners\n\nმომხმარებლის მოქმედებებზე (დაკლიკება, კლავიატურა) საპასუხოდ ვიყენებთ `addEventListener`-ს.\n\n```javascript\nlet btn = document.querySelector(".btn");\n\nbtn.addEventListener("click", function() {\n  console.log("ღილაკს დააჭირეს!");\n});\n```',
        content_type: 'practice',
        starter_code: '// იპოვეთ ღილაკი id-ით "myBtn".\n// დაუმატეთ click ივენთი, რომელიც alert()-ს გამოიტანს.',
        solution_code: 'let btn = document.getElementById("myBtn");\nbtn.addEventListener("click", () => {\n  alert("გილოცავთ!");\n});',
        challenge_text: 'აამუშავეთ `click` ივენთი ღილაკზე.',
        language: 'javascript', xp_reward: 20, sort_order: 2
    },

    // ==========================================
    // 4. Array და Objects
    // ==========================================
    {
        id: getId(), course_id: JS_ARRAYS_ID, title: 'მასივები (Arrays)', slug: 'js-arrays-intro',
        content: '# მასივები\n\nმასივი არის სია, რომელშიც რამდენიმე მონაცემს ვინახავთ 1 ცვლადში. ვიყენებთ კვადრატულ ფრჩხილებს `[]`.\n\n```javascript\nlet fruits = ["ვაშლი", "ბანანი", "მსხალი"];\nconsole.log(fruits[0]); // ვაშლი (ინდექსები იწყება 0-დან)\n\nfruits.push("კივი"); // ამატებს ბოლოში\n```',
        content_type: 'theory',
        starter_code: 'let colors = ["red", "green", "blue"];\n// 1. დაბეჭდეთ მეორე ელემენტი (green)\n// 2. დაამატეთ "yellow" მასივში',
        solution_code: 'let colors = ["red", "green", "blue"];\nconsole.log(colors[1]);\ncolors.push("yellow");\nconsole.log(colors);',
        challenge_text: 'გამოიყენეთ ინდექსი და `push` მეთოდი მასივზე სამუშაოდ.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: JS_ARRAYS_ID, title: 'ობიექტები (Objects)', slug: 'js-objects-intro',
        content: '# ობიექტები\n\nობიექტი ინახავს მონაცემებს **გასაღები-მნიშვნელობის** (Key-Value) ფორმატით, ფიგურული ფრჩხილებით `{}`.\n\n```javascript\nlet user = {\n  name: "გიორგი",\n  age: 25,\n  isAdmin: true\n};\n\nconsole.log(user.name); // გიორგი\nconsole.log(user["age"]); // 25\n```',
        content_type: 'practice',
        starter_code: '// შექმენით ობიექტი car, რომელსაც ექნება brand ("BMW") და year (2020) თვისებები.\n',
        solution_code: 'let car = {\n  brand: "BMW",\n  year: 2020\n};\nconsole.log(car.brand);',
        challenge_text: 'შექმენით ობიექტი `car` 2 Property-თ.',
        language: 'javascript', xp_reward: 20, sort_order: 2
    },
    {
        id: getId(), course_id: JS_ARRAYS_ID, title: 'Array Methods (map, filter)', slug: 'js-array-methods',
        content: '# Array Map & Filter\n\nროცა გვინდა მასივის ყველა ზოლზე გადატარება, არ ვიყენებთ სტანდარტულ `for` ციკლს, გვაქვს `map`.\n\nთუ გვინდა გაფილტვრა - ვიყენებთ `filter`-ს.\n\n```javascript\nlet numbers = [1, 2, 3];\nlet doubled = numbers.map(num => num * 2); // [2, 4, 6]\n\nlet evens = numbers.filter(num => num % 2 === 0); // [2]\n```',
        content_type: 'practice',
        starter_code: 'let scores = [40, 60, 50, 90, 80];\n// გამოიყენეთ filter() რომ მიიღოთ მხოლოდ 50-ზე მაღალი ქულები.\n',
        solution_code: 'let scores = [40, 60, 50, 90, 80];\nlet passingScores = scores.filter(s => s > 50);\nconsole.log(passingScores);',
        challenge_text: 'დაფილტრეთ (filter) ქულები 50-ზე ზემოთ.',
        language: 'javascript', xp_reward: 25, sort_order: 3
    },

    // ==========================================
    // 5. ES6+ Modern JavaScript
    // ==========================================
    {
        id: getId(), course_id: JS_ES6_ID, title: 'Template Literals', slug: 'js-es6-templates',
        content: '# Template Literals\n\nეს არის ES6-ის სინტაქსი ტექსტის (String) და ცვლადების მარტივად გასაერთიანებლად, ბექ-ტიკების (` `) საშუალებით.\n\n```javascript\nlet name = "სანდრო";\n// ძველი\nlet text1 = "აქ არის " + name + "!"; \n\n// ახალი\nlet text2 = `აქ არის ${name}!`;\n```',
        content_type: 'practice',
        starter_code: 'let product = "ლეპტოპი";\nlet price = 1500;\n// შექმენით message ცვლადი ბექტიკებით (` `), სადაც ეწერება: "პროდუქტი: ლეპტოპი, ფასი: 1500₾"',
        solution_code: 'let product = "ლეპტოპი";\nlet price = 1500;\nlet message = `პროდუქტი: ${product}, ფასი: ${price}₾`;\nconsole.log(message);',
        challenge_text: 'გამოიყენეთ Template Literals მონაცემების ასაწყობად.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: JS_ES6_ID, title: 'Destructuring და Spread', slug: 'js-es6-destructuring',
        content: '# Destructuring & Spread Operator\n\n#### Destructuring\nობიექტიდან მნიშვნელობების ამოღებას ამარტივებს.\n```javascript\nlet user = { n: "Gia", a: 30 };\nlet { n, a } = user; \n```\n\n#### Spread Operator (...)\nამატებს ელემენტებს ახალ ობიექტსა თუ მასივში.\n```javascript\nlet nums = [1, 2, 3];\nlet newNums = [...nums, 4, 5]; // [1, 2, 3, 4, 5]\n```',
        content_type: 'practice',
        starter_code: 'let userA = { name: "ლუკა" };\n// შექმენით ახალი ობიექტი userB spread (...) ოპერატორით.\n// მასში უნდა იყოს userA-ს მნიშვნელობები დას დამატებით age: 20.\n',
        solution_code: 'let userA = { name: "ლუკა" };\nlet userB = { ...userA, age: 20 };\nconsole.log(userB);',
        challenge_text: 'გამოიყენეთ `...` ობიექტების გასაერთიანებლად.',
        language: 'javascript', xp_reward: 20, sort_order: 2
    },

    // ==========================================
    // 6. Async JavaScript
    // ==========================================
    {
        id: getId(), course_id: JS_ASYNC_ID, title: 'რა არის Asynchronous 코드?', slug: 'js-async-intro',
        content: '# Async მიმოხილვა\n\nJS ნაგულისხმევად არის **სინქრონული** (მუშაობს რიგ-რიგობით).\nმაგრამ ხანდახან ვასრულებთ ისეთ კოდს (მაგ. მონაცემების მოთხოვნა ბაზიდან), რომელსაც დრო სჭირდება. რომ არ ველოდოთ, ვიყენებთ **ასინქრონულ** (Async) კოდს.\n\nყველაზე მარტივი მაგალითი `setTimeout`-ია:',
        content_type: 'theory',
        starter_code: 'console.log("პირველი");\n\n// setTimeout 2 წამის დაყოვნებით\nsetTimeout(() => {\n  console.log("მეორე (დაყოვნებით)");\n}, 2000);\n\nconsole.log("მესამე");\n// რა თანმიმდევრობით დაიბეჭდება?',
        solution_code: 'console.log("პირველი");\nsetTimeout(() => {\n  console.log("მეორე (დაყოვნებით)");\n}, 2000);\nconsole.log("მესამე");',
        challenge_text: 'გაუშვით კოდი და დააკვირდით ასინქრონულობას.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: JS_ASYNC_ID, title: 'Promises (დაპირებები)', slug: 'js-promises',
        content: '# Promises (დაპირებები)\n\nPromise არის ობიექტი, რომელიც ინახავს ასინქრონული ოპერაციის საბოლოო მდგომარეობას - `resolved` (დასრულდა წარმატებით) ან `rejected` (მოხდა შეცდომა).\n\nწარმატების შემთხვევაში ვითხოვთ მნიშვნელობას `.then()` მეთოდით, ხოლო შეცდომას ვიჭერთ `.catch()`.-ით.',
        content_type: 'practice',
        starter_code: 'let myPromise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("მონაცემები მოვიდა!"), 1000);\n});\n\n// გამოიძახეთ myPromise და დალოდეთ (.then) შედეგს\n',
        solution_code: 'let myPromise = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("მონაცემები მოვიდა!"), 1000);\n});\n\nmyPromise.then(res => console.log(res));',
        challenge_text: 'გამოიყენეთ `.then()` 1 წამიანი დალოდების შემდეგ.',
        language: 'javascript', xp_reward: 20, sort_order: 2
    },
    {
        id: getId(), course_id: JS_ASYNC_ID, title: 'Async/Await', slug: 'js-async-await',
        content: '# Async / Await\n\nES8-ში დაემატა `async` / `await` - ეს არის `Promise`-ების მართვის უფრო სუფთა, სინქრონული გზა.\n\n`await` აჩერებს ფუნქციის მუშაობას მანამ, სანამ Promise არ დაბრუნდება.\n\n```javascript\nasync function getData() {\n  let response = await fetch("https://api.example.com");\n  let data = await response.json();\n  console.log(data);\n}\n```',
        content_type: 'practice',
        starter_code: 'const fetchData = async () => {\n  // დაწერეთ try/catch ბლოკი. \n  // ეცადეთ დაბეჭდოთ "მუშაობს!" try-ში.\n};\nfetchData();',
        solution_code: 'const fetchData = async () => {\n  try {\n    console.log("მუშაობს!");\n  } catch (error) {\n    console.log("შეცდომა!", error);\n  }\n};\nfetchData();',
        challenge_text: 'შექმენით `async` ფუნქცია `try/catch`-ით შეცდომების დასაჭერად.',
        language: 'javascript', xp_reward: 30, sort_order: 3
    }
];

module.exports = jsLessons;
