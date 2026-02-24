const crypto = require('crypto');
const getId = () => crypto.randomUUID();

const HTML_FORMS_ID = 'c0000000-0000-0000-0001-000000000003';

const formsTablesLessons = [
    {
        id: getId(), course_id: HTML_FORMS_ID, title: 'ფორმა და Input ველები', slug: 'html-forms-inputs',
        content: `# ფორმები (Forms)

ვებ-გვერდზე მომხმარებლისგან მონაცემების მისაღებად (მაგ: რეგისტრაცია, შესვლა, შეტყობინების გაგზავნა) გამოიყენება ფორმები. მთავარი ტეგია \`<form>\`.

## Input ველები
ფორმის მთავარი შემადგენელი ნაწილია \`<input>\` ტეგი. ის არის ე.წ. "თვითდახურვადი" (არ აქვს \`</input>\`) და მისი ქცევა დამოკიდებულია \`type\` ატრიბუტზე.

- \`<input type="text">\` - სტანდარტული ტექსტური ველი (მაგ. სახელისთვის).
- \`<input type="password">\` - პაროლის ველი (სიმბოლოები იფარება ვარსკვლავებით ან წერტილებით).
- \`<input type="email">\` - ფოსტის ველი (ბრაუზერი ავტომატურად ამოწმებს, შეიცავს თუ არა @ სიმბოლოს).
- \`<button type="submit">გაგზავნა</button>\` - ფორმის გასაგზავნი ღილაკი.

## Placeholder და Name
- **placeholder**: ეს არის ტექსტი, რომელიც ჩანს ველში მანამ, სანამ მომხმარებელი რამეს ჩაწერს (მაგ: "შეიყვანეთ სახელი").
- **name**: როდესაც ფორმა იგზავნება სერვერზე, სერვერმა უნდა იცოდეს რომელი მონაცემი რომელ ველს ეკუთვნის. ამისთვის ყოველ \`<input>\`-ს სჭირდება \`name\` ატრიბუტი.

\`\`\`html
<form>
    <input type="text" name="firstName" placeholder="თქვენი სახელი">
    <input type="password" name="userPassword" placeholder="პაროლი">
    <button type="submit">რეგისტრაცია</button>
</form>
\`\`\``,
        content_type: 'practice',
        starter_code: `<!DOCTYPE html>
<html>
<body>
    <h2>სისტემაში შესვლა</h2>
    <form>
        <!-- 1. დაამატეთ email ტიპის input, placeholder-ით "ელ-ფოსტა" -->
        
        <!-- 2. დაამატეთ password ტიპის input, placeholder-ით "პაროლი" -->
        
        <!-- 3. დაამატეთ submit ღილაკი წარწერით "შესვლა" -->
        
    </form>
</body>
</html>`,
        solution_code: `<!DOCTYPE html>
<html>
<body>
    <h2>სისტემაში შესვლა</h2>
    <form>
        <input type="email" placeholder="ელ-ფოსტა">
        <input type="password" placeholder="პაროლი">
        <button type="submit">შესვლა</button>
    </form>
</body>
</html>`,
        challenge_text: 'შექმენით ლოგინ ფორმა ელ-ფოსტის, პაროლის ველებით და შესვლის ღილაკით.',
        language: 'html', xp_reward: 20, sort_order: 1
    },
    {
        id: getId(), course_id: HTML_FORMS_ID, title: 'Label ტეგი და Radio/Checkbox', slug: 'html-labels-radio',
        content: `# Label, Radio და Checkbox

## Label ტეგი
კარგი პრაქტიკაა (და აუცილებელია Accessibility-სთვის), რომ თითოეულ ველს ჰქონდეს თავისი სათაური. ამისთვის ვიყენებთ \`<label>\` ტეგს. 
\`<label>\` უკავშირდება \`<input>\`-ს \`for\` ატრიბუტით, რომელიც უნდა დაემთხვეს \`<input>\`-ის \`id\` ატრიბუტს.

\`\`\`html
<label for="username">მომხმარებელი:</label>
<input type="text" id="username" name="username">
\`\`\`
*(დარწმუნდით, რომ \`for\` და \`id\` ზუსტად ემთხვევა ერთმანეთს!)*

## Radio ღილაკები
გამოიყენება მაშინ, როდესაც მომხმარებელს შეუძლია აირჩიოს **მხოლოდ ერთი** პასუხი შეთავაზებული ვარიანტებიდან (მაგალითად სქესი). რათა ბრაუზერმა ეს ღილაკები ერთ ჯგუფად აღიქვას, მათ უნდა ჰქონდეთ **ერთნაირი \`name\`**.

\`\`\`html
<input type="radio" id="male" name="gender" value="male">
<label for="male">კაცი</label>
<input type="radio" id="female" name="gender" value="female">
<label for="female">ქალი</label>
\`\`\`

## Checkbox ველები
გამოიყენება მაშინ, როდესაც მომხმარებელს შეუძლია აირჩიოს **რამდენიმე** (ან არცერთი) პასუხი (მაგ. ჰობი).

\`\`\`html
<input type="checkbox" id="sports" name="hobbies" value="sports">
<label for="sports">სპორტი</label>
<input type="checkbox" id="music" name="hobbies" value="music">
<label for="music">მუსიკა</label>
\`\`\``,
        content_type: 'practice',
        starter_code: `<!DOCTYPE html>
<html>
<body>
    <form>
        <p>ეთანხმებით თუ არა წესებს?</p>
        <!-- შექმენით ორი Radio button (Yes და No). მიანიჭეთ ორივეს name="agree". 
             ნუ დაგავიწყდებათ value ატრიბუტების და label-ების დამატება! -->
        
    </form>
</body>
</html>`,
        solution_code: `<!DOCTYPE html>
<html>
<body>
    <form>
        <p>ეთანხმებით თუ არა წესებს?</p>
        <input type="radio" id="yes" name="agree" value="yes">
        <label for="yes">Yes</label>
        
        <input type="radio" id="no" name="agree" value="no">
        <label for="no">No</label>
    </form>
</body>
</html>`,
        challenge_text: 'შექმენით Yes/No არჩევანი Radio button-ების გამოყენებით. გაითვალისწინეთ Label და საერთო Name თვისებები.',
        language: 'html', xp_reward: 20, sort_order: 2
    },
    {
        id: getId(), course_id: HTML_FORMS_ID, title: 'HTML ცხრილები (Tables)', slug: 'html-tables',
        content: `# HTML ცხრილები

ცხრილები მონაცემთა ორგანიზებისთვის იდეალური გზაა. ცხრილების შესაქმნელად რამდენიმე ტეგი გვჭირდება:

1. \`<table>\`: მთავარი ტეგი, რომელიც კრავს მთელ ცხრილს.
2. \`<tr>\` (Table Row): ქმნის ერთ ჰორიზონტალურ სტრიქონს.
3. \`<th>\` (Table Header): ქმნის სასათაურო უჯრას (ტექსტი იქნება მუქი და ცენტრირებული). ჩვეულებრივ იწერება ცხრილის პირველ რიგში.
4. \`<td>\` (Table Data): ქმნის სტანდარტულ, მონაცემებით სავსე უჯრას.

\`\`\`html
<table>
    <!-- პირველი რიგი (სათაურები) -->
    <tr>
        <th>პროდუქტი</th>
        <th>ფასი</th>
    </tr>
    <!-- მეორე რიგი (მონაცემები) -->
    <tr>
        <td>ლეპტოპი</td>
        <td>1500 ლარი</td>
    </tr>
    <!-- მესამე რიგი -->
    <tr>
        <td>მაუსი</td>
        <td>50 ლარი</td>
    </tr>
</table>
\`\`\`

*(შენიშვნა: ნაგულისხმევად, CSS-ის გარეშე, ცხრილს არ აქვს ხილული ჩარჩოები. მას მოგვიანებით სტილებით გავალამაზებთ).*

## thead, tbody, tfoot
უფრო სუფთა სტრუქტურისთვის, ცხრილებს ხშირად ვყოფთ სექციებად:
- \`<thead>\`: ცხრილის "თავი" (სადაც \`<th>\`-ები იწერება).
- \`<tbody>\`: ცხრილის "ტანი" (ძირითადი მონაცემები).
- \`<tfoot>\`: ცხრილის "ფეხი" (შემაჯამებელი მონაცემები, მაგალითად ჯამური ფასი).`,
        content_type: 'practice',
        starter_code: `<!DOCTYPE html>
<html>
<body>
    <h2>ჩემი სტუდენტები</h2>
    <!-- შექმენით table: 
         1. რიგი - სათაურები: სახელი, ასაკი
         2. რიგი - მონაცემები: ლუკა, 20
    -->
    
</body>
</html>`,
        solution_code: `<!DOCTYPE html>
<html>
<body>
    <h2>ჩემი სტუდენტები</h2>
    <table>
        <tr>
            <th>სახელი</th>
            <th>ასაკი</th>
        </tr>
        <tr>
            <td>ლუკა</td>
            <td>20</td>
        </tr>
    </table>
</body>
</html>`,
        challenge_text: 'ააწყვეთ მარტივი ცხრილი ერთი რიგიანი <th> სათაურებით და ერთი რიგიანი <td> მონაცემებით.',
        language: 'html', xp_reward: 20, sort_order: 3
    }
];

module.exports = formsTablesLessons;
