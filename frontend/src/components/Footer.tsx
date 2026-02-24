import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-dark-900/80 border-t border-dark-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* ლოგო */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-3">
                            <span className="text-xl">💻</span>
                            <span className="text-lg font-bold gradient-text">CodeLearning</span>
                        </Link>
                        <p className="text-dark-400 text-sm max-w-md leading-relaxed">
                            ქართული Front-End სასწავლო პლატფორმა. ისწავლეთ ვებ-პროგრამირება ქართულად, სრულიად უფასოდ.
                        </p>
                    </div>

                    {/* ბმულები */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-3">პლატფორმა</h4>
                        <ul className="space-y-1.5">
                            <li><Link to="/courses" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">კურსები</Link></li>
                            <li><Link to="/leaderboard" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">ლიდერბორდი</Link></li>
                            <li><Link to="/achievements" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">მიღწევები</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold text-sm mb-3">ტექნოლოგიები</h4>
                        <ul className="space-y-1.5 text-dark-400 text-sm">
                            <li>HTML & CSS</li>
                            <li>JavaScript</li>
                            <li>React</li>
                            <li>TypeScript</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-dark-800 mt-6 pt-6 text-center">
                    <p className="text-dark-500 text-xs">
                        © {new Date().getFullYear()} CodeLearning. ყველა უფლება დაცულია. შექმნილია 🇬🇪 საქართველოში
                    </p>
                </div>
            </div>
        </footer>
    );
}
