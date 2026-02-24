const crypto = require('crypto');
const getId = () => crypto.randomUUID();

const CSS_BASICS_ID = 'c0000000-0000-0000-0001-000000000002';

const cssLevel1Lessons = [
    {
        id: getId(), course_id: CSS_BASICS_ID, title: 'რა არის CSS და სად იწერება', slug: 'what-is-css',
        content: `# რა არის CSS?

CSS (Cascading Style Sheets - კასკადური სტილების ფურცლები) არის ენა, რომელიც პასუხობს ვებ-გვერდის **ვიზუალზე**.

თუ HTML განსაზღვრავს **რა** არის გვერდზე (სათაური, ტექსტი, სურათი), CSS განსაზღვრავს **როგორ** გამოიყურება ის (ფერები, შრიფტები, ზომები, განლაგება).

## როგორ დავამატოთ CSS HTML-ში?
არსებობს CSS-ის დამატების სამი გზა:

1. **Inline CSS (ხაზში)**: იწერება უშუალოდ HTML ტეგის \`style\` ატრიბუტში.
   \`<h1 style="color: blue;">მთავარი სათაური</h1>\`

2. **Internal CSS (შიდა)**: იწერება \`<style>\` ტეგების შიგნით, \`<head>\` სექციაში.
   \`\`\`html
   <head>
       <style>
           h1 { color: red; }
       </style>
   </head>
   \`\`\`

3. **External CSS (გარე)**: იწერება ცალკე ფაილში (მაგ. \`style.css\`) და HTML-ში ვამატებთ \`<link>\` ტეგით. ეს არის **საუკეთესო პრაქტიკა**.
   \`<link rel="stylesheet" href="style.css">\`

ამ კურსში ჩვენ ძირითადად **Internal CSS**-ს გამოვიყენებთ (ანუ \`<style>\` ტეგს), რათა შედეგი კოდთან ერთად მარტივად დაინახოთ.`,
        content_type: 'theory',
        starter_code: `<!DOCTYPE html>
<html>
<head>
    <!-- აქ ჩაამატეთ სტილი -->
</head>
<body>
    <h1>ეს სათაური უნდა იყოს მწვანე</h1>
</body>
</html>`,
        solution_code: `<!DOCTYPE html>
<html>
<head>
    <style>
        h1 { color: green; }
    </style>
</head>
<body>
    <h1>ეს სათაური უნდა იყოს მწვანე</h1>
</body>
</html>`,
        challenge_text: '<head> სექციაში დაამატეთ <style> ტეგები და h1 სათაურს მიანიჭეთ ფერი მწვანე (green).',
        language: 'html', xp_reward: 10, sort_order: 1
    },
    {
        id: getId(), course_id: CSS_BASICS_ID, title: 'CSS სელექტორები: Element, Class, ID', slug: 'css-selectors',
        content: `# სელექტორები (Selectors)

CSS-მა უნდა იცოდეს, თუ **რომელ** HTML ელემენტზე გსურთ სტილის მინიჭება. ამისთვის ვიყენებთ სელექტორებს. სელექტორით ვირჩევთ (Select) ელემენტს და ვუწერთ წესებს.

\`\`\`css
სელექტორი {
    თვისება: მნიშვნელობა;
}
\`\`\`

## 1. Element Selector (ტეგის სელექტორი)
ირჩევს ყველა მითითებულ ტეგს მთელ ვებ-გვერდზე.
\`\`\`css
p {
    color: red; /* ყველა <p> პარაგრაფი გახდება წითელი */
}
\`\`\`

## 2. Class Selector (კლასის სელექტორი)
ყველაზე ხშირად გამოყენებადი! HTML-ში ელემენტს ენიჭება \`class="something"\`, ხოლო CSS-ში მას ვირჩევთ **წერტილით** (.). კლასი შეიძლება შევუქმნათ ბევრ ელემენტს ერთდროულად.
\`\`\`css
.highlight {
    background-color: yellow;
}
\`\`\`

## 3. ID Selector (იდენტიფიკატორის სელექტორი)
იდენტიფიკატორი ვებ-გვერდზე უნიკალურია. მხოლოდ ერთ ელემენტს შეიძლება ჰქონდეს კონკრეტული ID (მაგ: \`id="header"\`). CSS-ში მას ვირჩევთ **დიეზით** (#).
\`\`\`css
#main-title {
    font-size: 24px;
}
\`\`\``,
        content_type: 'practice',
        starter_code: `<!DOCTYPE html>
<html>
<head>
<style>
    /* 1. p ტეგს მიანიჭეთ ლურჯი (blue) ფერი */
    
    /* 2. .box კლასს მიანიჭეთ წითელი (red) ფონი (background-color) */
    
    /* 3. #special ID-ს მიანიჭეთ მწვანე (green) ფერი */
    
</style>
</head>
<body>
    <p>ჩვეულებრივი პარაგრაფი.</p>
    <div class="box">ეს არის ყუთი წითელი ფონით.</div>
    <div id="special">ეს არის სპეც-ელემენტი მწვანე ფერით.</div>
</body>
</html>`,
        solution_code: `<!DOCTYPE html>
<html>
<head>
<style>
    p { color: blue; }
    .box { background-color: red; }
    #special { color: green; }
</style>
</head>
<body>
    <p>ჩვეულებრივი პარაგრაფი.</p>
    <div class="box">ეს არის ყუთი წითელი ფონით.</div>
    <div id="special">ეს არის სპეც-ელემენტი მწვანე ფერით.</div>
</body>
</html>`,
        challenge_text: 'გამოიყენეთ Element, Class (.) და ID (#) სელექტორები შესაბამისი თვისებების მისანიჭებლად.',
        language: 'html', xp_reward: 15, sort_order: 2
    },
    {
        id: getId(), course_id: CSS_BASICS_ID, title: 'ფერები და ფონი (Color & Background)', slug: 'css-colors-backgrounds',
        content: `# ფერები და ფონი

CSS-ში ფერების მითითების რამდენიმე გზა არსებობს:

## ფერის დაწერის ფორმატები
1. **სახელით**: ინგლისური სახელებით (\`red\`, \`blue\`, \`green\`, \`tomato\`, \`lightblue\`).
2. **HEX კოდით (Hexadecimal)**: იწყება \`#\`-ით და შედგება 6 სიმბოლოსგან. მაგ: \`#ff0000\` არის წითელი, \`#000000\` შავი, \`#ffffff\` თეთრი.
3. **RGB / RGBA**: (Red, Green, Blue, Alpha). Alpha ნიშნავს გამჭვირვალობას. მაგ: \`rgba(0, 0, 255, 0.5)\` არის ნახევრად გამჭვირვალე ლურჯი ფერი.

## ტექსტის ფერი \n
ტექსტის ფერის შესაცვლელად ვიყენებთ თვისებას \`color\`.
\`\`\`css
h1 { color: #333333; }
\`\`\`

## ფონის ფერი (Background)
ელემენტის ფონის შესაცვლელად ვიყენებთ \`background-color\`.
\`\`\`css
.card {
    background-color: lightgray;
}
\`\`\``,
        content_type: 'practice',
        starter_code: `<!DOCTYPE html>
<html>
<head>
<style>
    body {
        /* ფონად (background-color) გამოიყენეთ #f0f0f0 */
    }
    .alert {
        /* ფონი იყოს წითელი (red), ხოლო ტექსტის ფერი (color) თეთრი (white) */
    }
</style>
</head>
<body>
    <div class="alert">მნიშვნელოვანი შეტყობინება!</div>
</body>
</html>`,
        solution_code: `<!DOCTYPE html>
<html>
<head>
<style>
    body {
        background-color: #f0f0f0;
    }
    .alert {
        background-color: red;
        color: white;
    }
</style>
</head>
<body>
    <div class="alert">მნიშვნელოვანი შეტყობინება!</div>
</body>
</html>`,
        challenge_text: 'შეცვალეთ სხეულის (`body`) ფონი `#f0f0f0`-ით და `.alert` კლასის მქონე ელემენტის ფონი და ტექსტის ფერი.',
        language: 'html', xp_reward: 15, sort_order: 3
    },
    {
        id: getId(), course_id: CSS_BASICS_ID, title: 'შრიფტი, ზომა და გასწორება', slug: 'css-text-fonts',
        content: `# შრიფტები და ტექსტის გასწორება

ტექსტის ვიზუალის სრულყოფისთვის CSS გთავაზობთ კონტროლის ფართო არჩევანს.

## 1. font-family
იცვლის შრიფტის ოჯახს (ტიპს). როგორც წესი, იწერება რამდენიმე შრიფტი, თუ ბრაუზერს პირველი არ აქვს, გადავა მეორეზე.
\`\`\`css
p { font-family: "Arial", sans-serif; }
\`\`\`

## 2. font-size
ცვლის ტექსტის ზომას. ყველაზე გავრცელებული საზომი ერთეულია პიქსელები (px).
\`\`\`css
h1 { font-size: 36px; }
\`\`\`

## 3. font-weight
განსაზღვრავს ტექსტის სისქეს (სიგამხდრეს).
- სქდელი: \`bold\` ან რიცხვებით (მაგ: \`700\`).
- ნორმალური: \`normal\` ან \`400\`.
\`\`\`css
strong { font-weight: bold; }
\`\`\`

## 4. text-align
ტექსტის განლაგება (ალიგნაცია). შიგთავსის გასწორება 가능ობებია \`left\`, \`right\`, \`center\`, \`justify\`.
\`\`\`css
h2 { text-align: center; } /* ტექსტს მოაქცევს კონტეინერის ცენტრში */
\`\`\``,
        content_type: 'practice',
        starter_code: `<!DOCTYPE html>
<html>
<head>
<style>
    .article-title {
        /* შრიფტი იყოს 32px, სისქე bold და გაასწორეთ ცენტრში */
        
    }
    .article-text {
        /* შეცვალეთ შრიფტი Arial-ზე */
        
    }
</style>
</head>
<body>
    <h1 class="article-title">ჩემი პირველი ბლოგი</h1>
    <p class="article-text">ძალიან საინტერესო სტატია, რომელსაც ყველა წაიკითხავს.</p>
</body>
</html>`,
        solution_code: `<!DOCTYPE html>
<html>
<head>
<style>
    .article-title {
        font-size: 32px;
        font-weight: bold;
        text-align: center;
    }
    .article-text {
        font-family: Arial, sans-serif;
    }
</style>
</head>
<body>
    <h1 class="article-title">ჩემი პირველი ბლოგი</h1>
    <p class="article-text">ძალიან საინტერესო სტატია, რომელსაც ყველა წაიკითხავს.</p>
</body>
</html>`,
        challenge_text: 'მიანიჭეთ სათაურს შესაბამისი ზომა, სისქე და გასწორება, ხოლო პარაგრაფს Arial შრიფტი.',
        language: 'html', xp_reward: 20, sort_order: 4
    }
];

module.exports = cssLevel1Lessons;
