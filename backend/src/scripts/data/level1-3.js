const crypto = require('crypto');

// Helpers for cleaner UUID generation per course
const getId = () => crypto.randomUUID();

const level1to3 = [
    // ==========================================
    // COURSE: HTML ფორმები და ცხრილები (c0...0003)
    // ==========================================
    {
        id: getId(),
        course_id: 'c0000000-0000-0000-0001-000000000003',
        title: 'HTML ფორმების შექმნა',
        slug: 'html-forms-intro',
        content: '# HTML ფორმები\n\nფორმები `<form>` გამოიყენება მომხმარებლისგან ინფორმაციის მისაღებად.\n\n```html\n<form action="/submit" method="POST">\n  <!-- ფორმის ელემენტები -->\n</form>\n```\n\n- `action` ატრიბუტი განსაზღვრავს სად უნდა გაიგზავნოს მონაცემები.\n- `method` განსაზღვრავს HTTP მეთოდს (GET ან POST).',
        content_type: 'theory',
        starter_code: '<!DOCTYPE html>\n<html>\n<body>\n  <!-- შექმენით form ელემენტი action="/login" და method="POST" ატრიბუტებით -->\n</body>\n</html>',
        solution_code: '<!DOCTYPE html>\n<html>\n<body>\n  <form action="/login" method="POST"></form>\n</body>\n</html>',
        challenge_text: 'შექმენით ცარიელი ფორმა, რომელიც მონაცემებს გააგზავნის /login მისამართზე POST მეთოდით.',
        language: 'html', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(),
        course_id: 'c0000000-0000-0000-0001-000000000003',
        title: 'Input ველები და ტიპები',
        slug: 'input-types',
        content: '# Input ველები\n\n`<input>` ტეგი ფორმის ყველაზე მნიშვნელოვანი ელემენტია და მისი ქცევა დამოკიდებულია `type` ატრიბუტზე.\n\n- `type="text"` - ტექსტური ველი\n- `type="password"` - პაროლის ველი (ფარავს სიმბოლოებს)\n- `type="email"` - ელ-ფოსტის ველი (ამოწმებს ვალიდურობას)\n\nდამხმარე ტეგი: `<label>` ფიზიკურად უკავშირდება input-ს `for` და `id` ატრიბუტებით.',
        content_type: 'practice',
        starter_code: '<form>\n  <!-- 1. დაამატეთ label და text input სახელისთვის -->\n  <!-- 2. დაამატეთ label და string input პაროლისთვის -->\n</form>',
        solution_code: '<form>\n  <label for="username">სახელი:</label>\n  <input type="text" id="username" name="username">\n  <label for="pass">პაროლი:</label>\n  <input type="password" id="pass" name="password">\n</form>',
        challenge_text: 'შექმენით ფორმა მომხმარებლის სახელის (text) და პაროლის (password) ველებით. დაურთეთ შესაბამისი labels.',
        language: 'html', xp_reward: 20, sort_order: 2
    },
    {
        id: getId(),
        course_id: 'c0000000-0000-0000-0001-000000000003',
        title: 'ცხრილების სტრუქტურა',
        slug: 'table-structure',
        content: '# HTML ცხრილები\n\nცხრილი იქმნება `<table>` ტეგით.\n\n- `<tr>` (Table Row) - სტრიქონი\n- `<th>` (Table Header) - სათაურის უჯრა\n- `<td>` (Table Data) - ჩვეულებრივი მონაცემთა უჯრა\n- `<thead>` და `<tbody>` აჯგუფებს სათაურებსა და მთავარ შიგთავსს.',
        content_type: 'theory',
        starter_code: '<!-- შექმენით table 2 სვეტით (სახელი, ასაკი) და 1 სტრიქონი მონაცემით -->\n',
        solution_code: '<table>\n  <tr>\n    <th>სახელი</th>\n    <th>ასაკი</th>\n  </tr>\n  <tr>\n    <td>გიორგი</td>\n    <td>22</td>\n  </tr>\n</table>',
        challenge_text: 'შექმენით მარტივი ცხრილი სათაურის სტრიქონით (სახელი, ასაკი) და ერთი მონაცემთა სტრიქონით.',
        language: 'html', xp_reward: 15, sort_order: 3
    },

    // ==========================================
    // COURSE: CSS Box Model და Layout (c0...0004)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0001-000000000004', title: 'რა არის Box Model?', slug: 'what-is-box-model',
        content: '# CSS Box Model\n\nყველა HTML ელემენტი არის ყუთი (box). Box Model აღწერს თუ როგორ ითვლება ელემენტის საბოლოო ზომა.\n\n1. `content` - თავად შიგთავსი (ტექსტი, სურათი)\n2. `padding` - შიდა დაშორება (ბორდერსა და შიგთავსს შორის)\n3. `border` - ელემენტის ჩარჩო\n4. `margin` - გარე დაშორება (სხვა ელემენტებამდე მანძილი)',
        content_type: 'theory',
        starter_code: '<style>\n.box {\n  /* განსაზღვრეთ 10px padding, 2px solid black border და 15px margin */\n}\n</style>\n<div class="box">Box Model ოსტატი</div>',
        solution_code: '<style>\n.box {\n  padding: 10px;\n  border: 2px solid black;\n  margin: 15px;\n}\n</style>\n<div class="box">Box Model ოსტატი</div>',
        challenge_text: 'მიანიჭეთ .box კლასს 10px padding, 2px-იანი შავი border-ი და 15px margin.',
        language: 'html', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0001-000000000004', title: 'Display თვისება', slug: 'display-property',
        content: '# Display თვისება\n\nელემენტის განლაგების ტიპს აკონტროლებს `display` თვისება.\n\n- `block` - იკავებს მთლიან სიგანეს (მაგ. `<div>`, `<p>`)\n- `inline` - იკავებს მხოლოდ თავისი შიგთავსის სიგანეს, ვერ იღებს width/height-ს (მაგ. `<span>`, `<a>`)\n- `inline-block` - ჰგავს inline-ს, მაგრამ შესაძლებელია ზომების მინიჭება!\n- `none` - ელემენტი ქრება ეკრანიდან.',
        content_type: 'practice',
        starter_code: '<style>\n.inline-item {\n  /* შეცვალეთ display ისე, რომ Width და Height მიიღოს, მაგრამ ერთ ხაზზე დარჩეს */\n  width: 100px;\n  height: 50px;\n  background: red;\n}\n</style>\n<span class="inline-item"></span>\n<span class="inline-item"></span>',
        solution_code: '<style>\n.inline-item {\n  display: inline-block;\n  width: 100px;\n  height: 50px;\n  background: red;\n}\n</style>\n<span class="inline-item"></span>\n<span class="inline-item"></span>',
        challenge_text: 'მიანიჭეთ span-ებს ისეთი display, რომელიც საშუალებას მოგცემთ ზომების (width, height) განსაზღვრას დაკარგვის გარეშე, თანაც ერთ ხაზზე დატოვებს ელემენტებს.',
        language: 'html', xp_reward: 20, sort_order: 2
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0001-000000000004', title: 'Positioning: Static, Relative, Absolute', slug: 'css-positioning',
        content: '# Element Positioning\n\n`position` თვისება აკონტროლებს ელემენტის პოზიციას.\n\n- `static` - (default) ბუნებრივი განლაგება რიგის მიხედვით.\n- `relative` - პოზიციონირდება მის საწყის ადგილთან მიმართებაში.\n- `absolute` - პოზიციონირდება პირველივე მშობლის მიმართ, რომელსაც აქვს relative/absolute.\n- `fixed` - პოზიციონირდება ეკრანის (viewport) მიმართ.',
        content_type: 'theory',
        starter_code: '<style>\n.parent {\n  /* გახადეთ parent relative */\n  height: 200px;\n  background: lightblue;\n}\n.child {\n  /* გახადეთ child absolute და დააყენეთ top: 10px, right: 10px */\n  background: coral;\n}\n</style>\n<div class="parent">\n  <div class="child">Child</div>\n</div>',
        solution_code: '<style>\n.parent {\n  position: relative;\n  height: 200px;\n  background: lightblue;\n}\n.child {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  background: coral;\n}\n</style>\n<div class="parent">\n  <div class="child">Child</div>\n</div>',
        challenge_text: 'გახადეთ .parent კლასი relative, ხოლო .child - absolute და მიამაგრეთ მშობლის მარჯვენა ზედა კუთხეში.',
        language: 'html', xp_reward: 20, sort_order: 3
    },

    // ==========================================
    // COURSE: Flexbox - მოქნილი განლაგება (c0...02...01)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0002-000000000001', title: 'Flex Container', slug: 'flex-container',
        content: '# რა არის Flexbox?\n\nFlexbox არის განლაგების მოდელი, რომელიც 1-განზომილებიან სივრცეში (მხოლოდ ჰორიზონტალურად ან ვერტიკალურად) ელემენტების განაწილებას ამარტივებს.\n\nმის გამოსაყენებლად მშობელს უნდა მივანიჭოთ `display: flex;`',
        content_type: 'theory',
        starter_code: '<style>\n.container {\n  /* გააქტიურეთ flexbox */ \n  background: #eee;\n}\n.item { background: #3498db; margin: 5px; padding: 10px; color: white; }\n</style>\n<div class="container">\n  <div class="item">1</div><div class="item">2</div><div class="item">3</div>\n</div>',
        solution_code: '<style>\n.container {\n  display: flex;\n  background: #eee;\n}\n.item { background: #3498db; margin: 5px; padding: 10px; color: white; }\n</style>\n<div class="container">\n  <div class="item">1</div><div class="item">2</div><div class="item">3</div>\n</div>',
        challenge_text: 'მიანიჭეთ display: flex მშობელ .container კლასს.',
        language: 'html', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0002-000000000001', title: 'Justify-Content', slug: 'flex-justify-content',
        content: '# Justify Content\n\n`justify-content` განკარგავს ელემენტებს **მთავარ ღერძზე** (ჩვეულებრივ ჰორიზონტალურად).\n\nმნიშვნელობები:\n- `flex-start` (საწყისი)\n- `center` (შუაში)\n- `flex-end` (ბოლოში)\n- `space-between` (თანაბარი დაშორება შუაში)\n- `space-around` (თანაბარი დაშორება გარშემო)',
        content_type: 'practice',
        starter_code: '<style>\n.container {\n  display: flex;\n  /* გაანაწილეთ ელემენტები ისე, რომ მათ შორის იყოს მაქსიმალური დაშორება */\n}\n.item { padding: 10px; background: orange; }\n</style>\n<div class="container">\n  <div class="item">A</div><div class="item">B</div>\n</div>',
        solution_code: '<style>\n.container {\n  display: flex;\n  justify-content: space-between;\n}\n.item { padding: 10px; background: orange; }\n</style>\n<div class="container">\n  <div class="item">A</div><div class="item">B</div>\n</div>',
        challenge_text: 'გამოიყენეთ justify-content: space-between რომ ელემენტები განცალკევდეს კიდეებში.',
        language: 'html', xp_reward: 20, sort_order: 2
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0002-000000000001', title: 'Align-Items', slug: 'flex-align-items',
        content: '# Align Items\n\n`align-items` განკარგავს ელემენტებს **ჯვარედინ ღერძზე** (ჩვეულებრივ ვერტიკალურად).\n\nმნიშვნელობები:\n- `stretch` (ჭიმავს სიმაღლეში)\n- `center` (შუაში ვერტიკალურად)\n- `flex-start` (ზემოთ)\n- `flex-end` (ქვემოთ)',
        content_type: 'practice',
        starter_code: '<style>\n.container {\n  display: flex;\n  height: 200px;\n  background: #2c3e50;\n  /* გაასწორეთ ელემენტები ვერტიკალურად ცენტრში */\n}\n.item { background: #ecf0f1; padding: 20px; }\n</style>\n<div class="container">\n  <div class="item">შუაში ვარ</div>\n</div>',
        solution_code: '<style>\n.container {\n  display: flex;\n  height: 200px;\n  background: #2c3e50;\n  align-items: center;\n}\n.item { background: #ecf0f1; padding: 20px; }\n</style>\n<div class="container">\n  <div class="item">შუაში ვარ</div>\n</div>',
        challenge_text: 'გამოიყენეთ align-items: center კონტეინერში.',
        language: 'html', xp_reward: 20, sort_order: 3
    },

    // ==========================================
    // COURSE: CSS Grid - ბადისებრი განლაგება (c0...02...02)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0002-000000000002', title: 'Grid Basics', slug: 'grid-basics',
        content: '# CSS Grid Layout\n\nGrid არის 2-განზომილებიანი განლაგების სისტემა. ჩვენ შეგვიძლია განვსაზღვროთ როგორც სვეტები (columns) ისე სტრიქონები (rows).\n\nიწყება `display: grid;`-ით. შემდეგ უნდა განვსაზღვროთ სვეტები `grid-template-columns`-ით.',
        content_type: 'theory',
        starter_code: '<style>\n.grid {\n  /* გააქტიურეთ grid და შექმენით 3 სვეტი 100px 100px 100px სიგანის */\n}\n.item { border: 1px solid black; padding: 10px; }\n</style>\n<div class="grid">\n  <div class="item">1</div><div class="item">2</div><div class="item">3</div>\n</div>',
        solution_code: '<style>\n.grid {\n  display: grid;\n  grid-template-columns: 100px 100px 100px;\n}\n.item { border: 1px solid black; padding: 10px; }\n</style>\n<div class="grid">\n  <div class="item">1</div><div class="item">2</div><div class="item">3</div>\n</div>',
        challenge_text: 'შექმენით CSS Grid და მიანიჭეთ 3 ცალი 100px სვეტი.',
        language: 'html', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0002-000000000002', title: 'Grid Fractions (fr) და Gap', slug: 'grid-fr-gap',
        content: '# fractions & gap\n\n`fr` ერთეული არის თავისუფალი სივრცის წილი.\n\n`grid-template-columns: 1fr 2fr;` მარცხენა სვეტი დაიკავებს 1 წილს, მარჯვენა 2 წილს.\n\n`gap` გამოიყენება ელემენტებს შორის დაშორების გასაკეთებლად.',
        content_type: 'practice',
        starter_code: '<style>\n.grid {\n  display: grid;\n  /* გამოიყენეთ 1fr 1fr დიზაინი სვეტებისთვის და 20px gap */\n}\n.item { background: teal; color: white; padding: 20px; }\n</style>\n<div class="grid">\n  <div class="item">Left</div><div class="item">Right</div>\n</div>',
        solution_code: '<style>\n.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 20px;\n}\n.item { background: teal; color: white; padding: 20px; }\n</style>\n<div class="grid">\n  <div class="item">Left</div><div class="item">Right</div>\n</div>',
        challenge_text: 'დაამატეთ ორი თანაბარი სვეტი `1fr` ერთეულით და `20px` დაშორება gap-ის გამოყენებით.',
        language: 'html', xp_reward: 20, sort_order: 2
    },

    // ==========================================
    // COURSE: Responsive Design (c0...02...03)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0002-000000000003', title: 'Media Queries', slug: 'media-queries',
        content: '# Media Queries\n\nResponsive Design ნიშნავს, რომ საიტი კარგად გამოიყურება ყველა მოწყობილობაზე.\n\n`@media` გვეხმარება CSS წესების გამოყენებაში ეკრანის ზომის მიხედვით.\n\n```css\n@media (max-width: 600px) {\n  .box {\n    width: 100%;\n  }\n}\n```',
        content_type: 'theory',
        starter_code: '<style>\n.box {\n  background: green;\n  width: 50%;\n}\n/* დაამატეთ media query რომელიც მაქსიმუმ 500px ეკრანზე სიგანეს გახდის 100% და ფერს - წითელს */\n\n</style>\n<div class="box">Responsive</div>',
        solution_code: '<style>\n.box {\n  background: green;\n  width: 50%;\n}\n@media (max-width: 500px) {\n  .box {\n    background: red;\n    width: 100%;\n  }\n}\n</style>\n<div class="box">Responsive</div>',
        challenge_text: 'შექმენით media query max-width: 500px-თვის, რომელიც .box კლასს მისცემს red ფერს და 100% სიგანეს.',
        language: 'html', xp_reward: 20, sort_order: 1
    },

    // ==========================================
    // COURSE: CSS ანიმაციები (c0...02...04)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0002-000000000004', title: 'CSS Transitions', slug: 'css-transitions',
        content: '# Transitions\n\n`transition` გვაძლევს საშუალებას CSS თვისებების ცვლილება იყოს მდორედ შესრულებული (მაგალითად hover-ის დროს).\n\n```css\n.btn {\n  transition: background-color 0.3s ease;\n}\n```',
        content_type: 'theory',
        starter_code: '<style>\n.btn {\n  background: blue;\n  color: white;\n  padding: 10px;\n  /* დაამატეთ მდორე ტრანზიცია background-color-თვის, რომელიც გასტანს 0.5 წამს */\n}\n.btn:hover {\n  background: red;\n}\n</style>\n<div class="btn">Hover Me</div>',
        solution_code: '<style>\n.btn {\n  background: blue;\n  color: white;\n  padding: 10px;\n  transition: background-color 0.5s ease;\n}\n.btn:hover {\n  background: red;\n}\n</style>\n<div class="btn">Hover Me</div>',
        challenge_text: 'დაუმატეთ transition თვისება .btn-ს: `background-color 0.5s ease`',
        language: 'html', xp_reward: 15, sort_order: 1
    },

    // ==========================================
    // COURSE: JS Functions (c0...03...02)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0003-000000000002', title: 'ფუნქციის დეკლარაცია (Declaration)', slug: 'function-declaration',
        content: '# Functions\n\nფუნქცია არის კოდის ბლოკი, რომელიც ასრულებს გარკვეულ დავალებას და მისი მრავალჯერ გამოყენებაა შესაძლებელი.\n\n```javascript\nfunction sayHello(name) {\n  return "გამარჯობა " + name;\n}\nlet message = sayHello("გიორგი");\n```',
        content_type: 'theory',
        starter_code: '// შექმენით ფუნქცია add, რომელიც მიიღებს ორ პერსონაჟს (a და b) და დააბრუნებს მათ ჯამს.\n',
        solution_code: 'function add(a, b) {\n  return a + b;\n}\nconsole.log(add(5, 10));',
        challenge_text: 'დაწერეთ `add` ფუნქცია გამოთვლისთვის.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0003-000000000002', title: 'Arrow Functions', slug: 'arrow-functions',
        content: '# Arrow Functions\n\nES6-ში დაემატა ეგრეთ წოდებული `Arrow` ფუნქციები, რაც სინტაქსს ამოკლებს.\n\n```javascript\nconst multiply = (x, y) => {\n  return x * y;\n};\n\n// თუ მხოლოდ 1 ხაზია, return არ არის საჭირო:\nconst square = x => x * x;\n```',
        content_type: 'practice',
        starter_code: '// გადააკეთეთ ეს ფუნქცია Arrow-ფუნქციად:\n// function divide(a, b) {\n//   return a / b;\n// }\n',
        solution_code: 'const divide = (a, b) => a / b;',
        challenge_text: 'შექმენით Arrow ფუნქცია `divide` ორ რიცხვთან სამუშაოდ.',
        language: 'javascript', xp_reward: 20, sort_order: 2
    },

    // ==========================================
    // COURSE: JS DOM Manipulation (c0...03...03)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0003-000000000003', title: 'ელემენტების მოძიება (QuerySelector)', slug: 'js-query-selector',
        content: '# querySelector\n\nDOM (Document Object Model) გვაძლევს HTML-თან მანიპულაციის საშუალებას.\n\n`document.querySelector(".title")` აბრუნებს პირველ ელემენტს, რომელსაც აქვს კლასი `title`.\n\n`document.getElementById("btn")` აბრუნებს ელემენტს id-ით `btn`.',
        content_type: 'theory',
        starter_code: '<h1 id="heading">ძველი სათაური</h1>\n<script>\n  // იპოვეთ ელემენტი getId-ით ან querySelector-ით\n  // და შეცვალეთ მისი ტექსტი (textContent), რომ ეწეროს "ახალი სათაური"\n</script>',
        solution_code: '<h1 id="heading">ძველი სათაური</h1>\n<script>\n  const h1 = document.getElementById("heading");\n  h1.textContent = "ახალი სათაური";\n</script>',
        challenge_text: 'შეცვალეთ h1 ელემენტის textContent JS-ის გამოყენებით.',
        language: 'html', xp_reward: 20, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0003-000000000003', title: 'Event-ების დამატება (addEventListener)', slug: 'js-events',
        content: '# Events\n\nEvent (მოვლენა) არის ის, რაც ხდება ბრაუზერში, როგორიცაა `click`, `mouseover`, ან `keydown`.\n\n```javascript\nbutton.addEventListener("click", () => {\n  alert("გილოცავ! დააკლიკე!");\n});\n```',
        content_type: 'practice',
        starter_code: '<button id="myBtn">Click Me</button>\n<script>\n  // დაამატეთ click event myBtn-ზე და გაუშვით alert("Clicked!")\n</script>',
        solution_code: '<button id="myBtn">Click Me</button>\n<script>\n  document.getElementById("myBtn").addEventListener("click", () => {\n    alert("Clicked!");\n  });\n</script>',
        challenge_text: 'დაამატეთ click მოვლენა მითითებულ ღილაკზე.',
        language: 'html', xp_reward: 25, sort_order: 2
    },

    // ==========================================
    // COURSE: JS მასივები და ობიექტები (c0...03...04)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0003-000000000004', title: 'მასივების საფუძვლები', slug: 'arrays-basics',
        content: '# Arrays (მასივები)\n\nმასივი არის ცვლადი, რომელიც ინახავს მრავალ მნიშვნელობას თანმიმდევრულად. ინდექსაცია იწყება ნულიდან.\n\n```javascript\nlet fruits = ["Apple", "Banana", "Cherry"];\nconsole.log(fruits[0]); // Apple\nfruits.push("Orange");  // ამატებს ბოლოში\n```',
        content_type: 'theory',
        starter_code: 'let colors = ["Red", "Green", "Blue"];\n// 1. დაბეჭდეთ Green ეკრანზე\n// 2. დაამატეთ Yellow ბოლოში (push მეთოდით)\n',
        solution_code: 'let colors = ["Red", "Green", "Blue"];\nconsole.log(colors[1]);\ncolors.push("Yellow");',
        challenge_text: 'მიიღეთ ელემენტი 인덱სიქსით და გამოიყენეთ push() ახლის დასამატებლად.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0003-000000000004', title: 'ობიექტების საფუძვლები', slug: 'objects-basics',
        content: '# Objects (ობიექტები)\n\nობიექტები ინახავენ მონაცემებს `key: value` წყვილებად.\n\n```javascript\nlet user = {\n  name: "ანა",\n  age: 25,\n  city: "ბათუმი"\n};\nconsole.log(user.name); // ანა\n```',
        content_type: 'theory',
        starter_code: '// შექმენით car ობიექტი თვისებებით: brand ("Toyota"), year (2020), და დაბეჭდეთ brand თვისება\n',
        solution_code: 'let car = {\n  brand: "Toyota",\n  year: 2020\n};\nconsole.log(car.brand);',
        challenge_text: 'შექმენით ობიექტი და წვდომა მიიღეთ მის ერთ-ერთ Property-ზე.',
        language: 'javascript', xp_reward: 15, sort_order: 2
    }
];

module.exports = level1to3;
