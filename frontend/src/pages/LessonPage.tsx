import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import CodeEditor from '../components/CodeEditor';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    HiArrowLeft, HiArrowRight, HiCheck, HiLightBulb,
    HiCode, HiBookOpen, HiEye, HiPlay, HiClipboard,
    HiTerminal, HiBeaker, HiRefresh, HiX
} from 'react-icons/hi';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import LessonComments from '../components/LessonComments';

import { fixTypos } from '../utils/georgianUtils';
import { Lesson, Course } from '../types';

// ─────────────────────────────────────────────────────────────
// Parse hints from DB (may be JSON string or array)
// ─────────────────────────────────────────────────────────────
const parseHints = (raw: any): string[] => {
    if (!raw) return [];
    // Helper to extract text from a hint item (could be string, JSON string, or object with .text/.hint)
    const extractText = (item: any): string => {
        if (typeof item === 'string') {
            // Try to parse JSON strings like '{"text":"...","penalty":0}'
            if (item.startsWith('{') || item.startsWith('[')) {
                try {
                    const parsed = JSON.parse(item);
                    if (parsed && typeof parsed === 'object') {
                        return parsed.text || parsed.hint || parsed.message || item;
                    }
                } catch { /* not JSON, return as-is */ }
            }
            return item;
        }
        if (item && typeof item === 'object') {
            return item.text || item.hint || item.message || JSON.stringify(item);
        }
        return String(item);
    };
    if (Array.isArray(raw)) return raw.map(extractText);
    try { const p = JSON.parse(raw); return Array.isArray(p) ? p.map(extractText) : [extractText(p)]; } catch { return [extractText(raw)]; }
};

// ─────────────────────────────────────────────────────────────
// Markdown → HTML renderer (line-by-line, no p-wrap bugs)
// ─────────────────────────────────────────────────────────────
const renderContent = (content: string) => {
    if (!content) return null;
    const saved: string[] = [];
    let html = content.replace(/```(\w+)?\n?([\s\S]*?)```/g, (_: string, lang: string, code: string) => {
        const safe = code.trim().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const el = `<div class="relative group my-6">
            <div class="absolute -top-3 left-4 px-2 py-0.5 bg-dark-800 border border-dark-700 rounded text-[10px] font-bold text-dark-400 uppercase tracking-widest z-10">${lang || 'code'}</div>
            <pre class="bg-dark-950/80 border border-dark-700/50 rounded-2xl p-5 pt-7 overflow-x-auto custom-scrollbar shadow-2xl"><code class="text-primary-300 font-mono text-sm leading-relaxed">${safe}</code></pre>
        </div>`;
        saved.push(el);
        return `\x00CB${saved.length - 1}\x00`;
    });
    // ── HTML-escape raw text BEFORE markdown processing
    // Ensures bare tags like <h1> in paragraphs show as literal text, not real HTML
    html = html
        .replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Bold & italic
        .replace(/__([^_]+)__/g, '<strong>$1</strong>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/_([^_]+)_/g, '<em>$1</em>').replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // Inline code (content already escaped above)
        .replace(/`([^`]+)`/g, (_: string, c: string) => `<code class="bg-dark-800 text-primary-300 px-1.5 py-0.5 rounded font-mono text-sm border border-dark-700">${c}</code>`)
        // Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-xl my-6 border border-dark-700 shadow-lg object-cover" />')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300 underline decoration-primary-500/30 font-medium">$1</a>')
        // Headings
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold text-accent-400 mb-3 mt-7 flex items-center"><span class="w-1.5 h-5 bg-accent-500 rounded-full mr-3 flex-shrink-0"></span>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold text-primary-400 mb-4 mt-9 flex items-center"><span class="w-2 h-7 bg-primary-500 rounded-full mr-4 flex-shrink-0"></span>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-black text-white mb-6 pb-3 border-b border-dark-800 mt-10 first:mt-0">$1</h1>')
        // Blockquote
        .replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-primary-500 bg-primary-500/5 px-5 py-3 rounded-r-xl italic mb-5 text-dark-300">$1</blockquote>')
        // Checkboxes
        .replace(/^- \[x\] (.+)$/gm, '<div class="flex items-center space-x-3 text-emerald-400 py-1.5"><span class="w-5 h-5 rounded-lg border-2 border-emerald-500 bg-emerald-500/20 flex items-center justify-center flex-shrink-0 text-xs">✓</span><span class="font-medium">$1</span></div>')
        .replace(/^- \[ \] (.+)$/gm, '<div class="flex items-center space-x-3 text-dark-300 py-1.5"><span class="w-5 h-5 rounded-lg border-2 border-dark-600 flex-shrink-0"></span><span class="font-medium">$1</span></div>')
        // Numbered steps
        .replace(/^(\d+)\. (.+)$/gm, '<div class="flex items-start space-x-4 my-4"><div class="flex-shrink-0 w-8 h-8 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center font-black text-sm">$1</div><div class="flex-1 pt-1 text-dark-200 leading-relaxed font-medium">$2</div></div>')
        // Unordered lists
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (m: string) => `<ul class="list-disc list-inside space-y-2 mb-5 ml-4 text-dark-300">${m}</ul>`);

    const lines = html.split('\n');
    const out: string[] = [];
    const pBuf: string[] = [];
    const flush = () => { if (pBuf.length) { const t = pBuf.join(' ').trim(); if (t) out.push(`<p class="mb-5 leading-relaxed text-dark-200">${t}</p>`); pBuf.length = 0; } };
    const isBlock = (s: string) => /^(<h[1-6]|<ul|<ol|<li|<div|<blockquote|<pre|<\/|<p|\x00)/.test(s.trim()) || s.trim() === '';
    for (const line of lines) {
        if (!line.trim()) { flush(); continue; }
        if (isBlock(line)) { flush(); out.push(line); } else { pBuf.push(line); }
    }
    flush();
    const final = out.join('\n').replace(/\x00CB(\d+)\x00/g, (_: string, i: string) => saved[+i]);
    return <div className="lesson-content" dangerouslySetInnerHTML={{ __html: final }} />;
};

// ─────────────────────────────────────────────────────────────
// Build iframe srcdoc for live preview
// ─────────────────────────────────────────────────────────────
const buildIframeSrc = (code: string, language: string): string => {
    const consoleScript = `
<script>
(function(){
  const _send = (type, args) => {
    try { window.parent.postMessage({ type: 'console', level: type, msg: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') }, '*'); } catch(e){}
  };
  window.console = { log: (...a) => _send('log', a), warn: (...a) => _send('warn', a), error: (...a) => _send('error', a), info: (...a) => _send('log', a) };
  window.addEventListener('error', e => _send('error', [e.message + ' (line ' + e.lineno + ')']));
})();
</script>`;

    if (language === 'javascript' || language === 'js') {
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{background:#0f172a;color:#e2e8f0;font-family:'Fira Code',monospace;font-size:14px;padding:16px;margin:0;}</style></head><body>${consoleScript}<script>try{${code}}catch(e){console.error(e.message)}<\/script></body></html>`;
    }
    if (language === 'css') {
        return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{background:#fff;margin:8px;}${code}</style></head><body>${consoleScript}<div class="demo-box"><p>CSS Preview — ავსებთ კონტენტს...</p><h1>სათაური</h1><button>ღილაკი</button><div class="box">ყუთი</div></div></body></html>`;
    }
    // HTML (default) — inject console script into head
    if (code.includes('</head>')) {
        return code.replace('</head>', consoleScript + '</head>');
    }
    if (code.includes('<body>')) {
        return code.replace('<body>', '<body>' + consoleScript);
    }
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${consoleScript}</head><body>${code}</body></html>`;
};

// ─────────────────────────────────────────────────────────────
// Console line component
// ─────────────────────────────────────────────────────────────
interface ConsoleLine { level: 'log' | 'warn' | 'error'; msg: string; time: string; }
const ConsoleOutput = ({ lines, onClear, onExplain, isExplaining, explanation, onCloseExplanation }: {
    lines: ConsoleLine[];
    onClear: () => void;
    onExplain: (err?: string) => void;
    isExplaining: boolean;
    explanation: string | null;
    onCloseExplanation: () => void;
}) => (
    <div className="h-full flex flex-col bg-dark-950">
        <div className="flex items-center justify-between px-3 py-2 border-b border-dark-800 bg-dark-900/50">
            <span className="text-xs text-dark-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <HiTerminal className="w-3.5 h-3.5" /> Console
            </span>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onExplain(lines.filter(l => l.level === 'error').map(l => l.msg).join('\n'))}
                    disabled={isExplaining || lines.filter(l => l.level === 'error').length === 0}
                    className={`text-[10px] px-2 py-1 rounded transition-all flex items-center gap-1.5 font-bold uppercase tracking-wider ${isExplaining ? 'bg-primary-500/20 text-primary-400 animate-pulse' : 'bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 disabled:opacity-0 pointer-events-none'}`}
                >
                    ✨ AI ახსნა
                </button>
                <button onClick={onClear} className="text-xs text-dark-500 hover:text-white flex items-center gap-1 transition-colors font-bold uppercase tracking-wider">
                    <HiX className="w-3 h-3" /> Clear
                </button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-0.5 font-mono">
            {isExplaining && (
                <div className="mb-4 p-3 bg-primary-500/5 border border-primary-500/20 rounded-xl animate-pulse">
                    <p className="text-xs text-primary-400 font-bold mb-1 uppercase">AI აანალიზებს შეცდომებს...</p>
                </div>
            )}
            {explanation && (
                <div className="mb-4 p-4 bg-primary-500/5 border border-primary-500/20 rounded-xl animate-fade-in relative group">
                    <button onClick={() => onCloseExplanation()} className="absolute top-2 right-2 text-dark-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all">✕</button>
                    <p className="text-xs text-primary-400 font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
                        <span>✨ AI ახსნა-განმარტება</span>
                    </p>
                    <div className="text-sm text-dark-100 leading-relaxed prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{explanation}</ReactMarkdown>
                    </div>
                </div>
            )}
            {lines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-dark-600 text-xs">
                    <HiTerminal className="w-8 h-8 mb-2 opacity-30" />
                    <span>კოდის გაშვების შემდეგ შედეგი გამოჩნდება</span>
                </div>
            ) : lines.map((l, i) => (
                <div key={i} className={`flex items-start gap-2 text-xs py-1 px-2 rounded group hover:bg-dark-800/30 ${l.level === 'error' ? 'text-red-400' : l.level === 'warn' ? 'text-amber-400' : 'text-emerald-300'}`}>
                    <span className="text-dark-600 shrink-0 text-[10px] pt-px">{l.time}</span>
                    <span className={`shrink-0 text-[10px] font-bold uppercase px-1 rounded ${l.level === 'error' ? 'bg-red-500/10 text-red-400' : l.level === 'warn' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {l.level}
                    </span>
                    <pre className="flex-1 whitespace-pre-wrap break-all leading-relaxed">{l.msg}</pre>
                </div>
            ))}
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────
// Main LessonPage Component
// ─────────────────────────────────────────────────────────────
export default function LessonPage() {
    const { courseSlug, lessonSlug } = useParams();
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [course, setCourse] = useState<Course | null>(null);
    const [navigation, setNavigation] = useState<any>({});
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [showHint, setShowHint] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isAskingAI, setIsAskingAI] = useState(false);
    const [aiHint, setAiHint] = useState<string | null>(null);
    const [hintError, setHintError] = useState(false);
    const [isExplainingAI, setIsExplainingAI] = useState(false);
    const [explanation, setExplanation] = useState<string | null>(null);
    const [failedSubmissions, setFailedSubmissions] = useState(0);

    // Mobile tab: 'theory' | 'editor' | 'output'
    const [mobileTab, setMobileTab] = useState<'theory' | 'editor' | 'output'>('theory');
    // Right pane tab: 'preview' | 'console' | 'tests'
    const [rightTab, setRightTab] = useState<'preview' | 'console' | 'tests'>('preview');
    // Preview state
    const [previewSrc, setPreviewSrc] = useState('');
    const [previewKey, setPreviewKey] = useState(0); // force iframe refresh
    const [autoRun, setAutoRun] = useState(true);
    // Console lines
    const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
    // Copy feedback
    const [copied, setCopied] = useState(false);

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Listen for console messages from iframe ──
    useEffect(() => {
        const handler = (e: MessageEvent) => {
            if (e.data?.type === 'console') {
                const now = new Date().toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
                setConsoleLines(prev => [...prev, { level: e.data.level, msg: e.data.msg, time: now }]);
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    const { updateXP } = useAuthStore();

    // ── Fetch lesson ──
    useEffect(() => {
        const fetchLesson = async () => {
            setIsLoading(true);
            setConsoleLines([]);
            setResult(null);
            setShowHint(false);
            try {
                const { data } = await api.get(`/lessons/${courseSlug}/${lessonSlug}`);
                setLesson(data.lesson);
                setCourse(data.course);
                setNavigation(data.navigation || {});
                const starter = data.lesson.starter_code || '';
                setCode(starter);
                // Initial preview
                setPreviewSrc(buildIframeSrc(starter, data.lesson.language || 'html'));
                setPreviewKey(k => k + 1);
                setMobileTab('theory');
                setRightTab('preview');
                // Bug 12: Save last lesson URL
                localStorage.setItem('lastLessonUrl', window.location.pathname);
            } catch {
                toast.error('ლექციის ჩატვირთვა ვერ მოხერხდა.', { id: 'lesson-load-error' });
            } finally {
                setIsLoading(false);
            }
        };
        if (courseSlug && lessonSlug) fetchLesson();
    }, [courseSlug, lessonSlug]);

    // ── Auto-preview debounce ──
    useEffect(() => {
        if (!lesson || !autoRun) return;

        // Bug 4: Guard for "Unexpected end of input" on pure comments
        const cleanCode = code.replace(/\/\/.*/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
        if (!cleanCode) return;

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setConsoleLines([]);
            setPreviewSrc(buildIframeSrc(code, lesson.language || 'html'));
            setPreviewKey(k => k + 1);
        }, 600);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [code, lesson, autoRun]);

    // ── Run manually ──
    const handleRun = () => {
        if (!lesson) return;
        setConsoleLines([]);
        setPreviewSrc(buildIframeSrc(code, lesson.language || 'html'));
        setPreviewKey(k => k + 1);
        if (rightTab !== 'preview' && rightTab !== 'console') setRightTab('preview');
        setMobileTab('output');
    };

    // ── Copy code ──
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, [code]);

    // ── Submit ──
    const handleSubmit = async () => {
        if (!lesson || isSubmitting) return;
        setIsSubmitting(true);
        try {
            // Bug 10: State 'code' already tracks the editor's latest value via CodeEditor's onChange, ensuring accurate submission.
            const { data } = await api.post(`/lessons/${lesson.id}/submit`, { code });
            setResult(data);
            setRightTab('tests');
            if (data.passed) {
                toast.success(`🎉 +${data.xpEarned} XP! ლექცია დასრულდა!`);
                // Bug 5: Update XP in Navbar instantly
                updateXP(data.xpEarned, data.newLevel);
            } else {
                toast.error('სცადეთ ხელახლა. შეამოწმეთ კოდი.');
                setFailedSubmissions(prev => {
                    const next = prev + 1;
                    if (next >= 1) {
                        // ავტომატურად ვთხოვთ AI-ს მინიშნებას პირველივე შეცდომაზე
                        handleAskAI();
                    }
                    return next;
                });
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'შეცდომა კოდის გაგზავნისას.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Ask AI for Hint ──
    const handleAskAI = async () => {
        if (!lesson || isAskingAI) return;
        setIsAskingAI(true);
        setHintError(false);
        try {
            const { data } = await api.post('/lessons/ask-ai', {
                lessonId: lesson.id,
                currentCode: code,
                challengeText: lesson.challenge_text,
                lessonContent: lesson.content,
                language: lesson.language || 'html'
            });
            setAiHint(data.hint);
        } catch (err) {
            setHintError(true);
            toast.error('AI მინიშნების მიღება ვერ მოხერხდა.');
        } finally {
            setIsAskingAI(false);
        }
    };

    // ── Explain with AI ──
    const handleExplainAI = async (specificError?: string) => {
        if (!lesson || isExplainingAI) return;
        setIsExplainingAI(true);
        setExplanation(null);
        setRightTab(specificError ? 'console' : 'tests'); // switch to where clarity is needed
        try {
            const { data } = await api.post('/explain-ai', {
                currentCode: code,
                error: specificError,
                challengeText: lesson.challenge_text,
                language: lesson.language || 'html'
            });
            setExplanation(data.explanation);
        } catch (err) {
            toast.error('AI ახსნა ვერ მოხერხდა.');
        } finally {
            setIsExplainingAI(false);
        }
    };

    const handleReset = () => { setCode(lesson?.starter_code || ''); setResult(null); setConsoleLines([]); };

    // ── Loading / Not Found ──
    if (isLoading) return (
        <div className="flex justify-center items-center" style={{ height: 'calc(100vh - 64px)' }}>
            <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
        </div>
    );
    if (!lesson) return (
        <div className="page-container text-center text-dark-400 py-20">
            <div className="text-6xl mb-4 opacity-30">📖</div>
            <p className="text-lg mb-6">ლექცია ვერ მოიძებნა.</p>
            <Link to={`/courses/${courseSlug}`} className="btn-primary px-6 py-2.5 inline-flex items-center gap-2">
                <HiArrowLeft className="w-4 h-4" /> კურსზე დაბრუნება
            </Link>
        </div>
    );

    const hints = parseHints(lesson.hints);
    const isTheoryOnly = lesson.content_type === 'theory' && !lesson.challenge_text && !lesson.starter_code;
    const canGoNext = isTheoryOnly || !!result?.passed;
    const lang = lesson.language || 'html';

    // ── Right pane top tabs ──
    const rightTabs: { id: 'preview' | 'console' | 'tests'; icon: JSX.Element; label: string; badge?: string | number }[] = [
        { id: 'preview', icon: <HiEye className="w-3.5 h-3.5" />, label: 'Preview' },
        { id: 'console', icon: <HiTerminal className="w-3.5 h-3.5" />, label: 'Console', badge: consoleLines.filter(l => l.level === 'error').length || undefined },
        { id: 'tests', icon: <HiBeaker className="w-3.5 h-3.5" />, label: 'Tests', badge: result ? (result.passed ? '✓' : '✗') : undefined },
    ];

    return (
        <div className="animate-fade-in flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>

            {/* ══ HEADER ══ */}
            <div className="bg-dark-900 border-b border-dark-800 px-3 py-2.5 shrink-0">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0 text-sm">
                            <Link to="/courses" className="text-dark-500 hover:text-primary-400 transition-colors font-medium whitespace-nowrap">
                                კურსები
                            </Link>
                            <span className="text-dark-600">›</span>
                            <Link to={`/courses/${courseSlug}`} className="text-dark-400 hover:text-primary-400 transition-colors font-medium truncate max-w-[140px]">
                                {course?.title}
                            </Link>
                            <span className="text-dark-600">›</span>
                            <span className="text-white font-bold truncate max-w-[180px]">{lesson.title}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20">
                            ⚡ {lesson.xp_reward} XP
                        </span>
                        <span className="hidden sm:inline px-2.5 py-1 bg-primary-500/10 text-primary-400 text-xs font-bold rounded-lg border border-primary-500/20">
                            {isTheoryOnly ? '📖 თეორია' : lesson.content_type === 'quiz' ? '📝 ქვიზი' : '💻 პრაქტიკა'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ══ PROGRESS BAR ══ */}
            <div className="w-full bg-dark-800 h-0.5 shrink-0">
                <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000" style={{ width: `${Math.min((course?.progress || 0), 100)}%` }} />
            </div>

            {/* ══ MOBILE TAB BAR ══ */}
            <div className="lg:hidden flex border-b border-dark-800 bg-dark-900 shrink-0">
                {[
                    { id: 'theory', icon: <HiBookOpen className="w-3.5 h-3.5" />, label: 'თეორია' },
                    { id: 'editor', icon: <HiCode className="w-3.5 h-3.5" />, label: 'კოდი' },
                    { id: 'output', icon: <HiEye className="w-3.5 h-3.5" />, label: 'შედეგი' },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setMobileTab(tab.id as any)}
                        className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${mobileTab === tab.id ? 'text-primary-400 border-b-2 border-primary-500 bg-primary-500/5' : 'text-dark-500 hover:text-dark-300'}`}>
                        {tab.icon}{tab.label}
                    </button>
                ))}
            </div>

            {/* ══ MAIN CONTENT ══ */}
            <div className="flex-1 overflow-hidden">
                <PanelGroup autoSaveId="lesson-layout" direction={isDesktop ? "horizontal" : "vertical"} className="h-full w-full">

                    {/* ▌COLUMN 1 — Theory ▌ */}
                    {(!isDesktop ? mobileTab === 'theory' : true) && (
                        <Panel id="theory" defaultSize={33} minSize={20} className="w-full h-full overflow-hidden flex flex-col border-r border-dark-800/60 bg-dark-950">
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-7 bg-dark-950/20">
                                <div className="max-w-2xl mx-auto">
                                    {lesson.content ? (
                                        renderContent(fixTypos(lesson.content))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full py-16 text-dark-600">
                                            <HiBookOpen className="w-10 h-10 mb-3 opacity-30" />
                                            <p className="text-sm">ამ ლექციაში თეორიული მასალა არ არის.</p>
                                        </div>
                                    )}

                                    {/* AI Assistant Hint */}
                                    {aiHint && (
                                        <div className="mt-12 group relative">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-tilt"></div>
                                            <div className="relative bg-dark-900 ring-1 ring-dark-800 rounded-3xl p-6 sm:p-8 overflow-hidden">
                                                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                        <HiLightBulb className="w-6 h-6 animate-pulse" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-white uppercase tracking-widest">AI მინიშნება</h4>
                                                        <p className="text-[10px] text-dark-500 font-bold uppercase tracking-tighter">დამხმარე ასისტენტი</p>
                                                    </div>
                                                </div>
                                                <div className="text-sm sm:text-base text-dark-100 leading-relaxed font-medium italic border-l-2 border-primary-500/30 pl-4 py-1 bg-primary-500/5 rounded-r-xl">
                                                    {aiHint}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <LessonComments lessonId={lesson.id} courseCreatorId={course?.created_by} />
                                </div>
                            </div>

                            {/* ── Theory pane Next/Prev nav bar ── */}
                            <div className="shrink-0 border-t border-dark-800 px-4 py-3 bg-dark-900/60 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Link to={`/courses/${courseSlug}`}
                                        className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white transition-all border border-dark-700 flex items-center gap-1.5 text-xs font-bold">
                                        <HiArrowLeft className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">კურსი</span>
                                    </Link>
                                    {navigation?.prev && (
                                        <Link to={`/lesson/${courseSlug}/${navigation.prev.slug}`}
                                            className="px-3 py-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white transition-all border border-dark-700 flex items-center gap-1.5 text-xs font-bold">
                                            <HiArrowLeft className="w-3.5 h-3.5" /> წინა
                                        </Link>
                                    )}
                                </div>

                                {isTheoryOnly && (
                                    navigation?.next ? (
                                        <Link to={`/lesson/${courseSlug}/${navigation.next.slug}`}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${canGoNext
                                                ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/20'
                                                : 'bg-dark-800 text-dark-600 opacity-50 pointer-events-none'
                                                }`}>
                                            შემდეგი <HiArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    ) : (
                                        <Link to={`/courses/${courseSlug}`}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${canGoNext
                                                ? 'bg-accent-600 hover:bg-accent-500 text-white shadow-lg'
                                                : 'bg-dark-800 text-dark-600 opacity-50 pointer-events-none'
                                                }`}>
                                            კურსი დასრულდა 🎉
                                        </Link>
                                    )
                                )}
                            </div>
                        </Panel>
                    )}

                    {
                        !isTheoryOnly && (!isDesktop ? mobileTab === 'editor' : true) && (
                            <>
                                {isDesktop && (
                                    <PanelResizeHandle className="w-1.5 bg-dark-800 hover:bg-primary-500 transition-colors cursor-col-resize z-40 flex items-center justify-center border-x border-dark-900">
                                        <div className="w-0.5 h-8 bg-dark-600 rounded-full" />
                                    </PanelResizeHandle>
                                )}
                                <Panel id="editor" defaultSize={34} minSize={20} className="w-full h-full overflow-hidden flex flex-col border-r border-dark-800/60 bg-dark-900/10 relative">
                                    {/* Editor Toolbar */}
                                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-dark-800 bg-dark-900/80 shrink-0">
                                        <span className="text-xs text-dark-500 font-mono font-bold uppercase tracking-wider flex-1 flex items-center gap-1.5">
                                            <HiCode className="w-3.5 h-3.5 text-accent-500" />
                                            {lang.toUpperCase()} Editor
                                        </span>
                                        {/* Copy */}
                                        <button onClick={handleCopy} title="კოდის კოპირება"
                                            className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'text-dark-400 hover:text-white hover:bg-dark-700'}`}>
                                            {copied ? <><HiCheck className="w-3.5 h-3.5" />Copied</> : <HiClipboard className="w-3.5 h-3.5" />}
                                        </button>
                                        {/* Reset */}
                                        <button onClick={handleReset} title="თავიდან"
                                            className="p-1.5 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-all">
                                            <HiRefresh className="w-3.5 h-3.5" />
                                        </button>
                                        {/* Hint */}
                                        {hints.length > 0 && (
                                            <button onClick={() => setShowHint(v => !v)} title="მინიშნება"
                                                className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold ${showHint ? 'bg-amber-500/20 text-amber-400' : 'text-dark-400 hover:text-white hover:bg-dark-700'}`}>
                                                <HiLightBulb className="w-3.5 h-3.5" />
                                                {showHint ? 'Hide' : 'Hint'}
                                            </button>
                                        )}
                                        {/* Auto-run toggle */}
                                        <button onClick={() => setAutoRun(v => !v)} title="Auto-run"
                                            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${autoRun ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-dark-600 hover:text-dark-400 hover:bg-dark-800'}`}>
                                            Auto
                                        </button>
                                    </div>

                                    {/* Hint */}
                                    {showHint && hints.length > 0 && (
                                        <div className="px-3 pt-2 shrink-0 animate-slide-down">
                                            <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 rounded-xl p-3">
                                                <HiLightBulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                                <p className="text-amber-300 text-xs leading-relaxed">{hints[0]}</p>
                                            </div>
                                        </div>
                                    )}

                                    {lesson.challenge_text && (
                                        <div className="px-3 pt-2 shrink-0">
                                            <div className="bg-primary-500/5 border border-primary-500/20 rounded-xl overflow-hidden">
                                                <div className="flex items-center gap-2 px-3 py-2 border-b border-primary-500/20 bg-primary-500/10">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                                                    <span className="text-primary-400 font-black text-[10px] uppercase tracking-widest">დავალება</span>
                                                </div>
                                                <div className="p-3 text-sm leading-relaxed text-dark-200 [&>p]:mb-2 [&>p]:last:mb-0">
                                                    {renderContent(fixTypos(lesson.challenge_text))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Code Editor */}
                                    <div className="flex-1 overflow-hidden p-3 pb-0 flex flex-col gap-2 min-h-0">
                                        <div className="flex-1 rounded-xl overflow-hidden border border-dark-700/50 shadow-xl min-h-0">
                                            <CodeEditor value={code} onChange={setCode} language={lang} height="100%" />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 pb-3 shrink-0">
                                            {/* Run */}
                                            <button onClick={handleRun}
                                                className="flex items-center gap-1.5 px-3 py-2 bg-dark-800 hover:bg-dark-700 text-emerald-400 hover:text-emerald-300 rounded-xl text-xs font-bold transition-all border border-dark-700 hover:border-emerald-500/30">
                                                <HiPlay className="w-3.5 h-3.5" /> გაშვება
                                            </button>

                                            {/* Submit */}
                                            {!isTheoryOnly && (
                                                <button onClick={handleSubmit} disabled={isSubmitting}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${result?.passed
                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 cursor-default'
                                                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-60'}`}>
                                                    {isSubmitting ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>მოწმდება...</span></>
                                                        : result?.passed ? <><HiCheck className="w-3.5 h-3.5" /> შემოწმებულია</>
                                                            : <><HiCheck className="w-3.5 h-3.5" /> შემოწმება</>}
                                                </button>
                                            )}

                                            {/* Prev */}
                                            {navigation?.prev && (
                                                <Link to={`/lesson/${courseSlug}/${navigation.prev.slug}`}
                                                    className="p-2 bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white rounded-xl transition-all border border-dark-700">
                                                    <HiArrowLeft className="w-3.5 h-3.5" />
                                                </Link>
                                            )}

                                            {/* Next (only if theory-only or not passed yet to allow manual skip in dev? No, keep it clean for users) */}
                                            {isTheoryOnly && (
                                                navigation?.next ? (
                                                    <Link to={`/lesson/${courseSlug}/${navigation.next.slug}`}
                                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${canGoNext
                                                            ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-600/20'
                                                            : 'bg-dark-800 text-dark-600 pointer-events-none opacity-50'}`}>
                                                        შემდეგი <HiArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                ) : (
                                                    <Link to={`/courses/${courseSlug}`}
                                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${canGoNext
                                                            ? 'bg-accent-600 hover:bg-accent-500 text-white shadow-md'
                                                            : 'bg-dark-800 text-dark-600 pointer-events-none opacity-50'}`}>
                                                        დასრულება 🎉
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </Panel>
                            </>
                        )
                    }

                    {/* ▌COLUMN 3 — Preview / Console / Tests ▌ */}
                    {
                        !isTheoryOnly && (!isDesktop ? mobileTab === 'output' : true) && (
                            <>
                                {isDesktop && (
                                    <PanelResizeHandle className="w-1.5 bg-dark-800 hover:bg-primary-500 transition-colors cursor-col-resize z-40 flex items-center justify-center border-x border-dark-900">
                                        <div className="w-0.5 h-8 bg-dark-600 rounded-full" />
                                    </PanelResizeHandle>
                                )}
                                <Panel id="output" defaultSize={33} minSize={20} className="w-full h-full overflow-hidden flex flex-col bg-dark-950">
                                    {/* Right Pane Tabs */}
                                    <div className="flex border-b border-dark-800 bg-dark-900 shrink-0">
                                        {rightTabs.map(tab => (
                                            <button key={tab.id} onClick={() => setRightTab(tab.id)}
                                                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-all relative ${rightTab === tab.id ? 'text-white border-b-2 border-primary-500 bg-dark-800/50' : 'text-dark-500 hover:text-dark-300 hover:bg-dark-800/30'}`}>
                                                {tab.icon}
                                                {tab.label}
                                                {tab.badge !== undefined && tab.badge !== 0 && (
                                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${typeof tab.badge === 'string' ? (tab.badge === '✓' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400') : 'bg-red-500 text-white'}`}>
                                                        {tab.badge}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                        {/* Refresh preview button */}
                                        {rightTab === 'preview' && (
                                            <button onClick={handleRun} className="ml-auto px-3 text-dark-500 hover:text-white transition-colors">
                                                <HiRefresh className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Preview Tab */}
                                    {rightTab === 'preview' && (
                                        <div className="flex-1 relative overflow-hidden">
                                            {previewSrc ? (
                                                <iframe
                                                    ref={iframeRef}
                                                    key={previewKey}
                                                    srcDoc={previewSrc}
                                                    sandbox="allow-scripts allow-same-origin allow-forms"
                                                    className="w-full h-full border-0 bg-white"
                                                    title="Live Preview"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-dark-600">
                                                    <HiEye className="w-10 h-10 mb-3 opacity-20" />
                                                    <p className="text-sm">კოდი ჯერ არ არის გაშვებული</p>
                                                    <button onClick={handleRun} className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                                                        <HiPlay className="w-3.5 h-3.5" /> გაშვება
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Console Tab */}
                                    {rightTab === 'console' && (
                                        <div className="flex-1 overflow-hidden">
                                            <ConsoleOutput
                                                lines={consoleLines}
                                                onClear={() => setConsoleLines([])}
                                                onExplain={handleExplainAI}
                                                isExplaining={isExplainingAI}
                                                explanation={explanation}
                                                onCloseExplanation={() => setExplanation(null)}
                                            />
                                        </div>
                                    )}

                                    {/* Tests Tab */}
                                    {rightTab === 'tests' && (
                                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                                            {!result ? (
                                                <div className="flex flex-col items-center justify-center h-full text-dark-600 py-16">
                                                    <HiBeaker className="w-10 h-10 mb-3 opacity-20" />
                                                    <p className="text-sm">კოდი გაგზავნის შემდეგ tests გამოჩნდება</p>
                                                    {!isTheoryOnly && (
                                                        <button onClick={handleSubmit} disabled={isSubmitting}
                                                            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
                                                            <HiCheck className="w-3.5 h-3.5" /> კოდის შემოწმება
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Result banner */}
                                                    <div className={`rounded-2xl p-4 border-2 ${result.passed ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-red-500/40 bg-red-500/5'}`}>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${result.passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                                                {result.passed ? '✨' : '⚠️'}
                                                            </div>
                                                            <div>
                                                                <div className={`font-black text-lg ${result.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                    {result.passed ? 'შესანიშნავია!' : 'სცადეთ ხელახლა'}
                                                                </div>
                                                                <div className="flex items-center gap-3 text-xs text-dark-400">
                                                                    <span>სიზუსტე: <strong className="text-white">{result.score}%</strong></span>
                                                                    {result.xpEarned > 0 && <span className="text-amber-400 font-bold">⚡ +{result.xpEarned} XP</span>}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Score bar */}
                                                        <div className="progress-bar h-1.5 mt-3">
                                                            <div className={`h-full rounded-full transition-all duration-1000 ${result.passed ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${result.score}%` }} />
                                                        </div>
                                                    </div>

                                                    {/* AI Smart Hint Section */}
                                                    {!result.passed && (
                                                        <div className="card p-4 border border-primary-500/20 bg-primary-500/5 overflow-hidden">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-2 text-primary-400 font-bold text-xs uppercase tracking-wider">
                                                                    <span className="text-lg">✨</span>
                                                                    Smart Hint
                                                                </div>
                                                                {!aiHint && !isAskingAI && (
                                                                    <button
                                                                        onClick={handleAskAI}
                                                                        className="text-[10px] bg-primary-600 hover:bg-primary-500 text-white px-2.5 py-1 rounded-lg font-bold transition-all shadow-sm"
                                                                    >
                                                                        მინიშნება
                                                                    </button>
                                                                )}
                                                            </div>

                                                            {isAskingAI && (
                                                                <div className="flex items-center gap-2 py-2">
                                                                    <div className="w-4 h-4 border-2 border-t-primary-500/30 border-primary-500 rounded-full animate-spin" />
                                                                    <span className="text-xs text-dark-400 animate-pulse">AI აანალიზებს თქვენს კოდს...</span>
                                                                </div>
                                                            )}

                                                            {aiHint && (
                                                                <div className="text-sm text-dark-200 leading-relaxed animate-fade-in bg-dark-800/50 p-3 rounded-xl border border-dark-700">
                                                                    {aiHint}
                                                                    <button
                                                                        onClick={handleAskAI}
                                                                        className="block mt-2 text-[10px] text-primary-400 hover:text-primary-300 transition-colors uppercase font-bold"
                                                                    >
                                                                        ახალი მინიშნება ↺
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Test cases */}
                                                    {result.testResults && result.testResults.length > 0 && (
                                                        <div className="space-y-2">
                                                            <p className="text-xs text-dark-500 font-bold uppercase tracking-wider">ტესტ-შემოწმებები</p>
                                                            {result.testResults.map((t: any, i: number) => (
                                                                <div key={i} className={`flex flex-col gap-2 p-3 rounded-xl border ${t.passed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0 ${t.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                            {t.passed ? '✓' : '✗'}
                                                                        </div>
                                                                        <span className={`text-sm flex-1 ${t.passed ? 'text-dark-200' : 'text-red-300'}`}>{t.name}</span>

                                                                        {!t.passed && (
                                                                            <button
                                                                                onClick={() => handleExplainAI(`Test Failed: ${t.name}.`)}
                                                                                disabled={isExplainingAI}
                                                                                className="text-[10px] px-2 py-1 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded transition-all font-bold uppercase tracking-wider whitespace-nowrap"
                                                                            >
                                                                                რატომ?
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    {!t.passed && t.hint && (
                                                                        <div className="text-[11px] text-amber-400/90 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 ml-9">
                                                                            💡 {t.hint}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Next action */}
                                                    {result.passed && navigation?.next && (
                                                        <Link to={`/lesson/${courseSlug}/${navigation.next.slug}`}
                                                            className="flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-600/20 animate-pulse-primary">
                                                            შემდეგი ლექცია <HiArrowRight className="w-4 h-4" />
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </Panel>
                            </>
                        )
                    }
                </PanelGroup >
            </div >
        </div >
    );
}
