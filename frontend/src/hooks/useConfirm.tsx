import React, { useState, useCallback } from 'react';
import { ConfirmModal } from '../components/ConfirmModal';

interface UseConfirmResult {
    confirm: (message: string, title?: string) => Promise<boolean>;
    ConfirmDialog: React.FC;
}

export const useConfirm = (): UseConfirmResult => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [title, setTitle] = useState<string | undefined>();
    const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

    const confirm = useCallback((newMessage: string, newTitle?: string) => {
        return new Promise<boolean>((resolve) => {
            setMessage(newMessage);
            setTitle(newTitle);
            setResolver(() => resolve);
            setIsOpen(true);
        });
    }, []);

    const handleConfirm = useCallback(() => {
        setIsOpen(false);
        if (resolver) resolver(true);
    }, [resolver]);

    const handleCancel = useCallback(() => {
        setIsOpen(false);
        if (resolver) resolver(false);
    }, [resolver]);

    const ConfirmDialog = useCallback(() => (
        <ConfirmModal
            isOpen={isOpen}
            title={title}
            message={message}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    ), [isOpen, title, message, handleConfirm, handleCancel]);

    return { confirm, ConfirmDialog };
};
