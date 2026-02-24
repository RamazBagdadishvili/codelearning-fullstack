import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching } from '@codemirror/language';
import { html } from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
    value: string;
    onChange: (value: string) => void;
    language?: string;
    readOnly?: boolean;
    height?: string;
}

export default function CodeEditor({ value, onChange, language = 'html', readOnly = false, height = '300px' }: CodeEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);
    const onChangeRef = useRef(onChange);

    // Update the ref whenever onChange changes to avoid stale closures
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    const getLanguageExtension = () => {
        switch (language) {
            case 'javascript': case 'js': return javascript();
            case 'css': return css();
            default: return html();
        }
    };

    useEffect(() => {
        if (!editorRef.current) return;

        const state = EditorState.create({
            doc: value,
            extensions: [
                lineNumbers(),
                highlightActiveLine(),
                highlightActiveLineGutter(),
                history(),
                bracketMatching(),
                syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                getLanguageExtension(),
                oneDark,
                keymap.of([...defaultKeymap, ...historyKeymap]),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChangeRef.current(update.state.doc.toString());
                    }
                }),
                EditorState.readOnly.of(readOnly),
                EditorView.theme({
                    '&': { backgroundColor: '#0f172a' },
                    '.cm-gutters': { backgroundColor: '#0f172a', borderRight: '1px solid #1e293b' },
                    '.cm-activeLineGutter': { backgroundColor: '#1e293b' },
                    '.cm-activeLine': { backgroundColor: '#1e293b40' },
                }),
            ],
        });

        const view = new EditorView({ state, parent: editorRef.current });
        viewRef.current = view;

        return () => { view.destroy(); };
    }, [language, readOnly]);

    // სინქრონიზაცია გარე value-თან
    useEffect(() => {
        if (viewRef.current) {
            const currentValue = viewRef.current.state.doc.toString();
            if (currentValue !== value) {
                viewRef.current.dispatch({
                    changes: { from: 0, to: currentValue.length, insert: value }
                });
            }
        }
    }, [value]);

    return (
        <div className="rounded-xl overflow-hidden border border-dark-700" style={{ height }}>
            <div ref={editorRef} className="h-full" />
        </div>
    );
}
