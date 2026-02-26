import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCourseStore } from '../stores/courseStore';
import { HiSearch, HiFilter } from 'react-icons/hi';

const LEVEL_NAMES: Record<number, string> = {
    1: 'HTML & CSS საფუძვლები', 2: 'Advanced CSS', 3: 'JavaScript Core',
    4: 'Modern JS & Tools', 5: 'React', 6: 'Advanced Frameworks',
    7: 'CSS Frameworks', 8: 'Build Tools', 9: 'Real-World Projects',
};

const DIFFICULTY_MAP: Record<string, { label: string; color: string }> = {
    beginner: { label: 'დამწყები', color: 'badge-success' },
    intermediate: { label: 'საშუალო', color: 'badge-warning' },
    advanced: { label: 'მოწინავე', color: 'badge-danger' },
};

export default function CoursesPage() {
    const { courses, isLoading, fetchCourses } = useCourseStore();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<number | null>(
        searchParams.get('level') ? parseInt(searchParams.get('level')!) : null
    );
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

    // Debounce search: wait 400ms after last keystroke before firing
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        const filters: any = {};
        if (selectedLevel) filters.level = selectedLevel;
        if (selectedDifficulty) filters.difficulty = selectedDifficulty;
        if (debouncedSearch) filters.search = debouncedSearch;
        // BUG-10: Don't show loading spinner when clearing search
        fetchCourses(filters);
    }, [selectedLevel, selectedDifficulty, debouncedSearch]);

    // Level-ებად დაჯგუფება
    const coursesByLevel: Record<number, typeof courses> = {};
    (courses || []).forEach(c => {
        if (!coursesByLevel[c.level]) coursesByLevel[c.level] = [];
        coursesByLevel[c.level].push(c);
    });

    return (
        <div className="page-container animate-fade-in">
            <div className="mb-8">
                <h1 className="section-title">კურსები</h1>
                <p className="text-dark-400">აირჩიეთ კურსი და დაიწყეთ სწავლა</p>
            </div>

            {/* ფილტრები */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500 w-5 h-5" />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-10" placeholder="კურსის ძიება..." />
                </div>
                <select value={selectedLevel || ''} onChange={(e) => setSelectedLevel(e.target.value ? parseInt(e.target.value) : null)}
                    className="input-field w-auto min-w-[200px]">
                    <option value="">ყველა დონე</option>
                    {Object.entries(LEVEL_NAMES).map(([num, name]) => (
                        <option key={num} value={num}>Level {num}: {name}</option>
                    ))}
                </select>
                <select value={selectedDifficulty || ''} onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                    className="input-field w-auto min-w-[160px]">
                    <option value="">ყველა სირთულე</option>
                    <option value="beginner">დამწყები</option>
                    <option value="intermediate">საშუალო</option>
                    <option value="advanced">მოწინავე</option>
                </select>
            </div>

            {/* კურსების სია */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                </div>
            ) : selectedLevel ? (
                // ერთი Level-ის ნახვა
                <div>
                    <h2 className="text-xl font-bold text-white mb-6">
                        Level {selectedLevel}: {LEVEL_NAMES[selectedLevel]}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                    {courses.length === 0 && (
                        <p className="text-center text-dark-500 py-10">კურსი ვერ მოიძებნა.</p>
                    )}
                </div>
            ) : Object.keys(coursesByLevel).length === 0 ? (
                // BUG-3: Empty state when no courses match search
                <div className="text-center py-16">
                    <div className="text-6xl mb-4 opacity-30">🔍</div>
                    <p className="text-dark-400 text-lg">კურსი ვერ მოიძებნა.</p>
                    <p className="text-dark-600 text-sm mt-2">სცადეთ სხვა საძიებო სიტყვა.</p>
                </div>
            ) : (
                // ყველა Level-ის ნახვა
                Object.entries(coursesByLevel).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([level, levelCourses]) => (
                    <div key={level} className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center space-x-3">
                                <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white font-bold">
                                    {level}
                                </span>
                                <span>{LEVEL_NAMES[parseInt(level)]}</span>
                            </h2>
                            <button onClick={() => setSelectedLevel(parseInt(level))}
                                className="text-sm text-primary-400 hover:text-primary-300">
                                ყველას ნახვა →
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {levelCourses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

function CourseCard({ course }: { course: any }) {
    const diff = DIFFICULTY_MAP[course.difficulty] || DIFFICULTY_MAP.beginner;
    const lessonCount = course.total_lessons || course.lesson_count || 0;

    return (
        <Link to={`/courses/${course.slug}`} className="card-hover group relative">
            {lessonCount === 0 && (
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-dark-700 text-dark-300 text-xs font-bold rounded-lg border border-dark-600 z-10">
                    🕐 მალე
                </span>
            )}
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${course.color}20` }}>
                    {course.icon}
                </div>
                {lessonCount > 0 && <span className={diff.color}>{diff.label}</span>}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                {course.title}
            </h3>
            <p className="text-dark-400 text-sm mb-4 line-clamp-2">{course.short_description}</p>
            <div className="flex items-center justify-between text-sm text-dark-500">
                <span>📚 {lessonCount} ლექცია</span>
                <span>⏱️ {course.estimated_hours || '?'}სთ</span>
            </div>
        </Link>
    );
}
