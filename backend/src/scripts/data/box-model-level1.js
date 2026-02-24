const crypto = require('crypto');
const getId = () => crypto.randomUUID();

const CSS_BOX_ID = 'c0000000-0000-0000-0001-000000000004';

const boxModelLessons = [
    {
        id: getId(), course_id: CSS_BOX_ID, title: 'Box Model - Padding', slug: 'css-box-padding',
        content: `# CSS Box Model: Padding

HTML დოკუმენტში ყოველი ელემენტი წარმოადგენს მართკუთხა ყუთს (Box). დიზაინის აწყობა ნიშნავს ამ ყუთების ზომების, ჩარჩოებისა და მათ შორის დაშორებების მართვას. ამ სისტემას **CSS Box Model** ეწოდება.

გარედან შიგნით Box Model ასე გამოიყურება: **Margin -> Border -> Padding -> Content (შიგთავსი)**.

## Padding (შიდა დაშორება)
\`padding\` არის სივრცე ელემენტის შიგთავსსა (მაგ: ტექსტს) და მის საზღვარს (border-ს) შორის. 

წარმოიდგინეთ ოთახი: ტექსტი არის ადამიანი. კედლები არის საზღვარი (border). Padding არის მანძილი ადამიანსა და კედლებს შორის.

\`\`\`css
.box {
    /* ოთხივე მხრიდან 20 პიქსელი */
    padding: 20px; 
    
    /* ინდივიდუალურად თითოეული მხარისთვის */
    padding-top: 10px;    /* ზემოდან */
    padding-right: 15px;  /* მარჯვნიდან */
    padding-bottom: 10px; /* ქვემოდან */
    padding-left: 15px;   /* მარცხნიდან */
}
\`\`\`
თუ დაწერთ \`padding: 10px 20px;\`, ეს ნიშნავს 10px ზემოთ-ქვემოთ და 20px მარჯვნივ-მარცხნივ.`,
        content_type: 'practice',
        starter_code: `<!DOCTYPE html>
<html>
<head>
<style>
    .card {
        background-color: lightblue;
        /* დაამატეთ 30px padding ყველა მხრიდან */
        
    }
</style>
</head>
<body>
    <div class="card">ესტეტიკური ბარათი</div>
</body>
</html>`,
        solution_code: `<!DOCTYPE html>
<html>
<head>
<style>
    .card {
        background-color: lightblue;
        padding: 30px;
    }
</style>
</head>
<body>
    <div class="card">ესტეტიკური ბარათი</div>
</body>
</html>`,
        challenge_text: 'ბარათის (.card) ვიზუალის გასაუმჯობესებლად, მიანიჭეთ 30px შიდა დაშორება (padding).',
        language: 'html', xp_reward: 15, sort_order: 1
    },
    {
        id: getId(), course_id: CSS_BOX_ID, title: 'Border და Margin', slug: 'css-border-margin',
        content: `# Border და Margin

## Border (ჩარჩო / საზღვარი)
\`border\` არის ხაზი, რომელიც გარს ერტყმის Padding-ს. მას აქვს სამი კომპონენტი: 
1. ზომა (\`border-width\`)
2. სტილი (\`border-style\` - მაგ. \`solid\` (მთლიანი), \`dashed\` (წყვეტილი), \`dotted\` (წერტილოვანი))
3. ფერი (\`border-color\`)

ხშირად მათ ვწერთ ერთ ხაზზე (Shorthand):
\`\`\`css
.box {
    border: 2px solid black;
}
\`\`\`

## Margin (გარე დაშორება)
\`margin\` არის ცარიელი სივრცე ელემენტის (და მისი ჩარჩოს) გარეთ. ის ქმნის დისტანციას სხვა ახლომდებარე ელემენტებთან.

წარმოიდგინეთ, რომ Margin არის მანძილი თქვენს სახლსა (თქვენს საზღვარსა) და მეზობლის სახლს შორის.

\`\`\`css
.box {
    margin: 20px; /* ყველა მხრიდან დააშორებს 20 პიქსელით */
}
\`\`\`
განსაკუთრებით მნიშვნელოვანია \`margin: 0 auto;\`. თუ ელემენეტს აქვს განსაზღვრული სიგანე (მაგ. \`width: 50%;\`), ეს წესი ამ ელემენტს **ჰორიზონტალურად ცენტრში** გაასწორებს ეკრანზე. (\`0\` არის ზედა-ქვედა margin, ხოლო \`auto\` მარჯვენა-მარცხენა ნაწილებს ავტომატურად (თანაბრად) ანაწილებს).`,
        content_type: 'practice',
        starter_code: `<!DOCTYPE html>
<html>
<head>
<style>
    .box {
        width: 300px;
        background-color: #f1c40f;
        padding: 20px;
        /* გაუკეთეთ ელემენტს 3px სისქის, მყარი (solid) 
           შავი (black) ჩარჩო (border) */
        
        /* გაასწორეთ ელემენტი ეკრანის ცენტრში (margin auto-ს დახმარებით) */
        
    }
</style>
</head>
<body>
    <div class="box">ცენტრირებული ყუთი</div>
</body>
</html>`,
        solution_code: `<!DOCTYPE html>
<html>
<head>
<style>
    .box {
        width: 300px;
        background-color: #f1c40f;
        padding: 20px;
        border: 3px solid black;
        margin: 0 auto;
    }
</style>
</head>
<body>
    <div class="box">ცენტრირებული ყუთი</div>
</body>
</html>`,
        challenge_text: 'მიანიჭეთ მშობელ `div`-ს შავი ჩარჩო და დააცენტრირეთ margin თვისების საშუალებით.',
        language: 'html', xp_reward: 20, sort_order: 2
    },
    {
        id: getId(), course_id: CSS_BOX_ID, title: 'სიგანე, სიმაღლე და Box-Sizing', slug: 'css-width-height',
        content: `# სიგანე, სიმაღლე და Box-Sizing 

## Width და Height
ელემენტის ფიზიკური ზომების სამართავად ვიყენებთ \`width\` (სიგანე) და \`height\` (სიმაღლე) თვისებებს.

ისინი შეიძლება გაიზომოს:
- **პიქსელებში (px)**: აბსოლუტური ზომა. (მაგ. \`300px\`)
- **პროცენტებში (%)**: ფარდობითი ზომა მშობელი ელემენტის მიმართ. (მაგ. \`50%\` ნიშნავს რომ დაიკავებს მშობლის სიგანის ნახევარს).

## მნიშვნელოვანი პრობლემა!
ნაგულისხმევად, CSS-ში ელემენტის სიგანე გამოითვლება ასე: \`width\` + \`padding\` + \`border\`.
ანუ თუ \`width: 200px\` და \`padding: 20px\`, ელემენტის რეალური სიგანე ეკრანზე იქნება \`240px\` (200 + მარცხენა 20 + მარჯვენა 20). ეს განლაგების აწყობისას სერიოზულ პრობლემებს ქმნის.

## გამოსავალი: Box-Sizing
პრაქტიკულად ყველა თანამედროვე ვებსაიტი იყენებს \`box-sizing: border-box;\` წესს. ეს CSS-ს ეუბნება, რომ ელემენტის მიცემულ \`width\`-ში **ჩაითვალოს** \`padding\`-იც და \`border\`-იც.

თუ გიწერიათ გამოძახება \`* { box-sizing: border-box; }\` (ვარსკვლავი ნიშნავს "ყველა ელემენტს"), აღარასოდეს მოგიწევთ მათემატიკური გამოთვლების კეთება padding-ის დამატებისას!`,
        content_type: 'practice',
        starter_code: `<!DOCTYPE html>
<html>
<head>
<style>
    /* ამ კოდით ყველა ელემენტი გლობალურად border-box პრინციპზე გადადის */
    * {
        box-sizing: border-box;
    }
    
    .container {
        /* მიანიჭეთ 50% სიგანე (%) მოცემულ კონტეინერს */
        background: #e74c3c;
        color: white;
        padding: 50px;
    }
</style>
</head>
<body>
    <div class="container">ზომების მართვა</div>
</body>
</html>`,
        solution_code: `<!DOCTYPE html>
<html>
<head>
<style>
    * {
        box-sizing: border-box;
    }
    
    .container {
        width: 50%;
        background: #e74c3c;
        color: white;
        padding: 50px;
    }
</style>
</head>
<body>
    <div class="container">ზომების მართვა</div>
</body>
</html>`,
        challenge_text: 'მიანიჭეთ შიგთავსს 50%-იანი სიგანე (width).',
        language: 'html', xp_reward: 20, sort_order: 3
    }
];

module.exports = boxModelLessons;
