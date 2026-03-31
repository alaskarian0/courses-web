"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  isLoading?: boolean;
}

const variantConfig = {
  default: {
    icon: Info,
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    confirmVariant: "default" as const,
  },
  destructive: {
    icon: XCircle,
    iconBg: "bg-red-50 dark:bg-red-950/30",
    iconColor: "text-red-600 dark:text-red-400",
    confirmVariant: "destructive" as const,
  },
  success: {
    icon: CheckCircle,
    iconBg: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-600 dark:text-green-400",
    confirmVariant: "default" as const,
  },
  warning: {
    icon: AlertCircle,
    iconBg: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    confirmVariant: "default" as const,
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    confirmVariant: "default" as const,
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  variant = "default",
  isLoading = false,
}: ConfirmModalProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-card p-0 gap-0 overflow-hidden" dir="rtl" showCloseButton={false}>

        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconBg}`}>
              <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
            </div>
            <DialogTitle className="text-base font-semibold leading-tight">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <DialogDescription className="text-sm text-right leading-relaxed">
            {message}
          </DialogDescription>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={config.confirmVariant}
              className="flex-1"
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? "جاري التحميل..." : confirmText}
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}

// Hook for easier usage
export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive" | "success" | "warning" | "info";
  }>({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const openConfirm = (options: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive" | "success" | "warning" | "info";
  }) => {
    setConfig(options);
    setIsOpen(true);
  };

  const closeConfirm = () => {
    setIsOpen(false);
  };

  const ConfirmModalComponent = (props?: { isLoading?: boolean }) => (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeConfirm}
      onConfirm={config.onConfirm}
      title={config.title}
      message={config.message}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
      variant={config.variant}
      isLoading={props?.isLoading}
    />
  );

  return {
    openConfirm,
    closeConfirm,
    ConfirmModal: ConfirmModalComponent,
    isOpen,
  };
}