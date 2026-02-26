import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-dark-900/80 border-t border-dark-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
                    {/* ლოგო */}
                    <div className="col-span-1 sm:col-span-2 text-center md:text-left">
                        <Link to="/" className="inline-flex items-center space-x-2 mb-4">
                            <span className="text-2xl">💻</span>
                            <span className="text-xl font-bold gradient-text">CodeLearning</span>
                        </Link>
                        <p className="text-dark-400 text-sm max-w-sm mx-auto md:mx-0 leading-relaxed">
                            ქართული Front-End სასწავლო პლატფორმა. ისწავლეთ ვებ-პროგრამირება ქართულად, სრულიად უფასოდ.
                        </p>
                    </div>

                    {/* ბმულები */}
                    <div className="text-center md:text-left">
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">პლატფორმა</h4>
                        <ul className="space-y-2.5">
                            <li><Link to="/courses" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">კურსები</Link></li>
                            <li><Link to="/leaderboard" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">ლიდერბორდი</Link></li>
                            <li><Link to="/achievements" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">მიღწევები</Link></li>
                        </ul>
                    </div>

                    <div className="text-center md:text-left">
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">ტექნოლოგიები</h4>
                        <ul className="space-y-2.5 text-dark-400 text-sm">
                            <li>HTML & CSS</li>
                            <li>JavaScript</li>
                            <li>React</li>
                            <li>TypeScript</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-dark-800 mt-10 pt-8 text-center">
                    <p className="text-dark-500 text-[10px] sm:text-xs">
                        © {new Date().getFullYear()} CodeLearning. ყველა უფლება დაცულია. შექმნილია <span className="text-dark-400">GE</span> საქართველოში
                    </p>
                </div>
            </div>
        </footer>
    );
}
