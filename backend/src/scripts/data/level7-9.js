const crypto = require('crypto');
const getId = () => crypto.randomUUID();

const level7to9 = [
    // ==========================================
    // LEVEL 7: Tailwind CSS (c0...0007...0001)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0007-000000000001',
        title: 'Utility-First მიდგომა', slug: 'tailwind-utility-first',
        content: '# Tailwind CSS\n\nTailwind არის utility-first CSS Framework, რაც ნიშნავს რომ მზა კლასებს ვიყენებთ პირდაპირ HTML-ში, ნაცვლად ცალკეული CSS ფაილების წერისა.\n\nმაგალითად, ნაცვლად იმისა რომ შევქმნათ .btn კლასი, ვწერთ:\n`<button class="bg-blue-500 text-white p-2 rounded">ღილაკი</button>`',
        content_type: 'theory',
        starter_code: '<!-- 1. გამოიყენეთ ტექსტის გასაცენტრებლად კლასი text-center -->\n<!-- 2. მიანიჭეთ ლურჯი ფონი (bg-blue-600) და თეთრი ტექსტი (text-white) -->\n<div class="">\n  კეთილი იყოს თქვენი მობრძანება Tailwind-ში!\n</div>',
        solution_code: '<div class="text-center bg-blue-600 text-white p-4">\n  კეთილი იყოს თქვენი მობრძანება Tailwind-ში!\n</div>',
        challenge_text: 'გააკეთეთ HTML ელემენტი ტექსტის ცენტრში, ლურჯი ფონით (bg-blue-600) და 16px დაშორებით (p-4).',
        language: 'html', xp_reward: 20, sort_order: 1
    },
    {
        id: getId(), course_id: 'c0000000-0000-0000-0007-000000000001',
        title: 'Responsive Classes', slug: 'tailwind-responsive',
        content: '# მიმღებლობა (Responsive Design)\n\nTailwind-ში media query-ების დამატება ძალიან მარტივია პრეფიქსებით:\n- `sm:` (მინიმუმ 640px ეკრანი)\n- `md:` (მინიმუმ 768px)\n- `lg:` (მინიმუმ 1024px)\n\n```html\n<div class="bg-red-500 md:bg-green-500">\n  მობაილზე წითელია, პლანშეტზე/PC-ზე მწვანე\n</div>\n```',
        content_type: 'practice',
        starter_code: '<div class="w-full /* md ეკრანზე გაუხადეთ სიგანე w-1/2 */">\n  Responsive Box\n</div>',
        solution_code: '<div class="w-full md:w-1/2 p-4 bg-gray-200">\n  Responsive Box\n</div>',
        challenge_text: 'დაამატეთ md:w-1/2 კლასი რათა დიდ ეკრანებზე ელემენტმა ნახევარი სივრცე დაიკავოს.',
        language: 'html', xp_reward: 30, sort_order: 2
    },

    // ==========================================
    // LEVEL 8: Vite & Build Tools (c0...0008...0001)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0008-000000000001',
        title: 'Vite: თანამედროვე Build Tool', slug: 'vite-intro',
        content: '# Vite (სწრაფი ეკოსისტემა)\n\nVite (ფრანგულად: სწრაფი) არის თანამედროვე build tool-ი, რომელიც ჩაანაცვლებს Webpack/Create React App-ს.\nმისი მთავარი უპირატესობაა **წამიერი ჩატვირთვა (HMR)** საიტის დეველოპმენტის დროს, რადგან ის იყენებს ბრაუზერის ნატიურ ES მოდულებს.\n\nახალი React პროექტის შექმნა Vite-ით:\n`npm create vite@latest my-app -- --template react`',
        content_type: 'theory',
        starter_code: '// Create a react app using Vite\n',
        solution_code: '// npm create vite@latest my-react-app -- --template react',
        challenge_text: 'დაწერეთ კომენტარად ბრძანება ახალი React Vite პროექტის შესაქმნელად.',
        language: 'javascript', xp_reward: 15, sort_order: 1
    },

    // ==========================================
    // LEVEL 9: Portfolio Website (c0...0009...0001)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0009-000000000001',
        title: 'ნავიგაციის შექმნა', slug: 'portfolio-navigation',
        content: '# პორტფოლიოს პროექტი (ნაწილი 1)\n\nჩვენ ვიწყებთ რეალური პროექტის აწყობას! პირველ რიგში, შევქმნით ნავიგაციის (Navbar) მენიუს.\n\nნავიგაციაში უნდა იყოს ლოგო და ბმულები: `ჩემ შესახებ`, `პროექტები`, `კონტაქტი`. განლაგებისთვის გამოვიყენებთ Flexbox-ს დას დაშორებისთვის `justify-between`.',
        content_type: 'theory',
        starter_code: '<nav class="flex">\n  <div class="logo">MyPortfolio</div>\n  <ul class="nav-links flex gap-4">\n    <!-- დაამატეთ ბმულები: Home, Projects, Contact -->\n  </ul>\n</nav>',
        solution_code: '<nav class="flex justify-between items-center p-6 bg-slate-900 text-white">\n  <div class="logo font-bold text-xl">MyPortfolio</div>\n  <ul class="nav-links flex gap-4">\n    <li><a href="#home">Home</a></li>\n    <li><a href="#projects">Projects</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>',
        challenge_text: 'შექმენით სანავიგაციო პანელი სამი ბმულით.',
        language: 'html', xp_reward: 50, sort_order: 1
    },

    // ==========================================
    // LEVEL 9: E-Commerce (c0...0009...0002)
    // ==========================================
    {
        id: getId(), course_id: 'c0000000-0000-0000-0009-000000000002',
        title: 'პროდუქტის ბარათის (Card) კომპონენტი', slug: 'ecommerce-product-card',
        content: '# E-Commerce პროექტი\n\nონლაინ-მაღაზიისთვის მნიშვნელოვანია პროდუქტების დინამიურად გამოტანა.\nჩვენ ვქმნით `ProductCard` კომპონენტს (React + Tailwind).\n\n```jsx\n<div class="border rounded shadow-lg p-4">\n  <img src={imgUrl} />\n  <h2>{title}</h2>\n  <p>${price}</p>\n  <button>კალათაში დამატება</button>\n</div>\n```',
        content_type: 'theory',
        starter_code: 'export default function ProductCard({ title, price }) {\n  return (\n    <div className="card border rounded p-4">\n      <h2 className="text-lg font-bold">{/* ჩასვით სათაური */}</h2>\n      <p className="text-gray-600">{/* ჩასვით ფასი */}</p>\n      <button className="bg-blue-500 text-white p-2 mt-4">ყიდვა</button>\n    </div>\n  )\n}',
        solution_code: 'export default function ProductCard({ title, price }) {\n  return (\n    <div className="card border rounded p-4 hover:shadow-lg transition">\n      <h2 className="text-lg font-bold">{title}</h2>\n      <p className="text-gray-600 font-semibold">${price}</p>\n      <button className="w-full bg-blue-600 text-white py-2 rounded mt-4">ყიდვა</button>\n    </div>\n  )\n}',
        challenge_text: 'დაასრულეთ ProductCard კომპონენტი React-სა და Tailwind-ში.',
        language: 'tsx', xp_reward: 50, sort_order: 1
    }
];

module.exports = level7to9;
