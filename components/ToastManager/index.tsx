// src/components/ToastManager.tsx
import { Toaster } from 'sonner';
import React from 'react';

const ToastManager: React.FC = () => {
    return <Toaster position="top-center" richColors />; // 位置和样式可自定义
};

export default ToastManager;