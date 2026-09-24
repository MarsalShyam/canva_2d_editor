import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-md bg-[#252526] border border-[#3e3e42] rounded-xl shadow-2xl overflow-hidden text-[#cccccc]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#333333] bg-[#1e1e1e]">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className={`w-5 h-5 ${isDestructive ? 'text-amber-400' : 'text-blue-400'}`} />
                <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
              </div>
              <button
                onClick={onCancel}
                className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#333333] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-xs text-gray-300 leading-relaxed">{message}</p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 bg-[#1e1e1e] border-t border-[#333333]">
              <button
                onClick={onCancel}
                className="px-4 py-1.5 rounded-md text-xs font-medium text-gray-300 hover:text-white hover:bg-[#333333] transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-1.5 rounded-md text-xs font-medium text-white transition-colors ${
                  isDestructive
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
