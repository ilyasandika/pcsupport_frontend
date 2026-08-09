import {createContext, useContext, useState, type ReactNode} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {CheckCircle2, XCircle, AlertTriangle, Info, type LucideIcon} from "lucide-react";
import { twMerge } from "tailwind-merge";

export type NotificationVariant = "success" | "error" | "warning" | "info";

interface ShowNotificationOptions {
    variant?: NotificationVariant;
    title?: string;
    description?: string;
    onClose?: () => void;
    autoCloseMs?: number;
}

interface INotificationDialogContext {
    showNotification: (options: ShowNotificationOptions) => void;
    hideNotification: () => void;
}

const NotificationDialogContext = createContext<INotificationDialogContext | undefined>(undefined);

const variantConfig: Record<NotificationVariant, {
    icon: LucideIcon;
    iconClass: string;
    bgClass: string;
    defaultTitle: string;
}> = {
    success: {
	icon: CheckCircle2,
	iconClass: "text-green-600",
	bgClass: "bg-green-100",
	defaultTitle: "Berhasil",
    },
    error: {
	icon: XCircle,
	iconClass: "text-red-600",
	bgClass: "bg-red-100",
	defaultTitle: "Terjadi Kesalahan",
    },
    warning: {
	icon: AlertTriangle,
	iconClass: "text-yellow-600",
	bgClass: "bg-yellow-100",
	defaultTitle: "Peringatan",
    },
    info: {
	icon: Info,
	iconClass: "text-blue-600",
	bgClass: "bg-blue-100",
	defaultTitle: "Informasi",
    },
};

export const NotificationDialogProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState<ShowNotificationOptions>({});

    const showNotification = (options: ShowNotificationOptions) => {
	setContent(options);
	setOpen(true);
	if (options.autoCloseMs) {
	    setTimeout(() => handleOpenChange(false), options.autoCloseMs);
	}
    };

    const hideNotification = () => setOpen(false);

    const handleOpenChange = (nextOpen: boolean) => {
	setOpen(nextOpen);
	if (!nextOpen) {
	    content.onClose?.();
	}
    };

    const variant = content.variant ?? "info";
    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
	<NotificationDialogContext.Provider value={{ showNotification, hideNotification }}>
	    {children}
	    <Dialog open={open} onOpenChange={handleOpenChange}>
		{/*<DialogTrigger></DialogTrigger>*/}
		<DialogContent className="sm:max-w-md">
		    <DialogHeader className="items-center text-center">
			<div className={twMerge("flex h-12 w-12 items-center justify-center rounded-full", config.bgClass)}>
			    <Icon className={twMerge("h-6 w-6", config.iconClass)} />
			</div>
			<DialogTitle>{content.title ?? config.defaultTitle}</DialogTitle>
			{content.description && (
			    <DialogDescription>{content.description}</DialogDescription>
			)}
		    </DialogHeader>
		    <DialogFooter className="sm:justify-center">
			<Button onClick={() => handleOpenChange(false)}>OK</Button>
		    </DialogFooter>
		</DialogContent>
	    </Dialog>
	</NotificationDialogContext.Provider>
    );
};

export const useNotificationDialog = () => {
    const ctx = useContext(NotificationDialogContext);
    if (!ctx) {
	throw new Error("useNotificationDialog harus dipakai di dalam NotificationDialogProvider");
    }
    return ctx;
};