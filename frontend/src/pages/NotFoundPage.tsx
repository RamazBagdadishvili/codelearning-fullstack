import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div className="page-container animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-8xl mb-6 opacity-30">🔍</div>
            <h1 className="text-4xl font-bold text-white mb-3">404</h1>
            <p className="text-xl text-dark-300 mb-2">გვერდი ვერ მოიძებნა</p>
            <p className="text-dark-500 mb-8 max-w-md">
                მოთხოვნილი გვერდი არ არსებობს ან წაშლილია. შეამოწმეთ მისამართი ან დაბრუნდით მთავარ გვერდზე.
            </p>
            <Link
                to="/"
                className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                მთავარ გვერდზე დაბრუნება
            </Link>
        </div>
    );
}
