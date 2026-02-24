import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiExclamationCircle } from 'react-icons/hi';

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title = 'დადასტურება',
    message,
    onConfirm,
    onCancel
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm"
                        onClick={onCancel}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", duration: 0.3 }}
                        className="relative w-full max-w-sm bg-dark-800 rounded-2xl border border-dark-700 shadow-2xl p-6 overflow-hidden"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <HiExclamationCircle className="w-6 h-6 text-red-400" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                            <p className="text-dark-300 text-sm mb-6">{message}</p>

                            <div className="flex w-full gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 px-4 py-2.5 bg-dark-700 hover:bg-dark-600 text-dark-100 rounded-xl font-medium transition-colors"
                                >
                                    გაუქმება
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                                >
                                    დიახ
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
