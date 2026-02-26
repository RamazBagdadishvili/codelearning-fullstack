import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { HiAcademicCap, HiCode, HiChartBar, HiLightningBolt, HiStar, HiUserGroup } from 'react-icons/hi';

const LEVELS = [
    { num: 1, title: 'HTML & CSS საფუძვლები', icon: '🌐', courses: 4, color: 'from-orange-500 to-red-500' },
    { num: 2, title: 'Advanced CSS', icon: '🎨', courses: 4, color: 'from-purple-500 to-indigo-500' },
    { num: 3, title: 'JavaScript Core', icon: '⚡', courses: 4, color: 'from-yellow-500 to-amber-500' },
    { num: 4, title: 'Modern JS & Tools', icon: '🚀', courses: 4, color: 'from-green-500 to-emerald-500' },
    { num: 5, title: 'React', icon: '⚛️', courses: 4, color: 'from-cyan-500 to-blue-500' },
    { num: 6, title: 'Advanced Frameworks', icon: '🔷', courses: 3, color: 'from-blue-500 to-indigo-500' },
    { num: 7, title: 'CSS Frameworks', icon: '🌊', courses: 2, color: 'from-teal-500 to-cyan-500' },
    { num: 8, title: 'Build Tools', icon: '🛠️', courses: 3, color: 'from-slate-500 to-zinc-500' },
    { num: 9, title: 'Real-World Projects', icon: '💼', courses: 4, color: 'from-pink-500 to-rose-500' },
];

const FEATURES = [
    { icon: <HiCode className="w-8 h-8" />, title: 'ინტერაქტიული კოდის რედაქტორი', desc: 'წერეთ და ტესტირეთ კოდი პირდაპირ ბრაუზერში' },
    { icon: <HiAcademicCap className="w-8 h-8" />, title: '500+ ლექცია', desc: 'სრული სასწავლო პროგრამა ნულიდან პროფესიონალამდე' },
    { icon: <HiChartBar className="w-8 h-8" />, title: 'პროგრესის თვალყურის დევნება', desc: 'XP ქულები, Level-ები და დეტალური სტატისტიკა' },
    { icon: <HiStar className="w-8 h-8" />, title: 'მიღწევები და ბეჯები', desc: 'მოაგროვეთ ბეჯები და შეჯიბრეთ სხვა მოსწავლეებს' },
    { icon: <HiLightningBolt className="w-8 h-8" />, title: 'სრულიად უფასო', desc: 'არანაირი ფასიანი კონტენტი ან გამოწერა' },
    { icon: <HiUserGroup className="w-8 h-8" />, title: 'ქართულ ენაზე', desc: 'ყველაფერი ქართულად - ლექციები, UI, კომენტარები' },
];

export default function HomePage() {
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-950 to-accent-900/20" />
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-8">
                            <span className="text-primary-400 text-sm font-medium">🇬🇪 პირველი ქართული კოდინგ პლატფორმა</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
                            <span className="text-white">ისწავლე </span>
                            <span className="gradient-text" style={{ whiteSpace: 'nowrap' }}>Front-End</span>
                            <br />
                            <span className="text-white">ქართულად</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-dark-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                            სრული სასწავლო პროგრამა HTML-დან React-მდე. 500+ ინტერაქტიული ლექცია,
                            კოდის რედაქტორი, და გეიმიფიკაცია — სრულიად უფასოდ.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {isAuthenticated ? (
                                <Link to={localStorage.getItem('lastLessonUrl') || "/courses"} className="btn-primary text-lg px-8 py-3">
                                    გააგრძელე სწავლა →
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn-primary text-lg px-8 py-3">
                                        დაიწყე უფასოდ →
                                    </Link>
                                    <Link to="/courses" className="btn-secondary text-lg px-8 py-3">
                                        კურსების ნახვა
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* სტატისტიკა */}
                        <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">30+</div>
                                <div className="text-dark-400 text-sm">კურსი</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">300+</div>
                                <div className="text-dark-400 text-sm">ლექცია</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white">9</div>
                                <div className="text-dark-400 text-sm">დონე</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ფუნქციები */}
            <section className="py-20 bg-dark-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="section-title text-center mb-12">რატომ CodeLearning?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((feature, i) => (
                            <div key={i} className="card-hover p-6">
                                <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-dark-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* სასწავლო გზა */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="section-title text-center mb-4">სასწავლო გზა</h2>
                    <p className="text-dark-400 text-center mb-12 max-w-2xl mx-auto">
                        ნაბიჯ-ნაბიჯ მიიწინაურეთ HTML/CSS საფუძვლებიდან React და TypeScript-ის პროფესიონალურ დონემდე
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {LEVELS.map((level) => (
                            <Link key={level.num} to={`/courses?level=${level.num}`}
                                className="card-hover p-5 group">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                        {level.num}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xl">{level.icon}</span>
                                            <h3 className="text-white font-semibold group-hover:text-primary-400 transition-colors">{level.title}</h3>
                                        </div>
                                        <p className="text-dark-500 text-sm">{level.courses} კურსი</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            {!isAuthenticated && (
                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="card bg-gradient-to-br from-primary-900/50 to-accent-900/50 border-primary-700/30 text-center p-12">
                            <h2 className="text-3xl font-bold text-white mb-4">მზად ხართ სწავლის დასაწყებად?</h2>
                            <p className="text-dark-300 mb-8 max-w-lg mx-auto">
                                შეუერთდით CodeLearning-ს და დაიწყეთ Front-End პროგრამირების სწავლა ქართულად, სრულიად უფასოდ.
                            </p>
                            <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2 whitespace-nowrap">
                                <span>უფასო რეგისტრაცია</span>
                                <span className="text-xl">→</span>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
