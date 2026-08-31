import { useState } from "react";
import { Sparkles, Calendar, Bot } from "lucide-react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { UserRepository } from "@/data/repositories/user.repository.ts";
import { useNotificationDialog } from "@/context/NotificationDialogContext.tsx";
import { useLoading } from "@/context/LoadingContext.tsx";

interface SyncUserTagsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userId?: number;
	userName?: string;
}

export const SyncUserTagsDialog = ({
	open,
	onOpenChange,
	userId,
	userName,
}: SyncUserTagsDialogProps) => {
	const [period, setPeriod] = useState<string>("");
	const [useAllTime, setUseAllTime] = useState<boolean>(true);
	const { showNotification } = useNotificationDialog();
	const { showLoading, hideLoading } = useLoading();

	const handleSync = async () => {
		if (!userId) return;
		onOpenChange(false);

		const selectedPeriod = !useAllTime && period ? period : undefined;

		try {
			showLoading(
				"Menganalisis Keahlian (AI)",
				selectedPeriod
					? `Gemini AI sedang menganalisis riwayat tiket ${userName || 'engineer'} periode ${selectedPeriod}...`
					: `Gemini AI sedang menganalisis riwayat tiket ${userName || 'engineer'} (semua periode)...`,
				true
			);

			await UserRepository.syncUserTags(userId, selectedPeriod ? { period: selectedPeriod } : undefined);

			showNotification({
				variant: "success",
				title: "Analisis AI Berhasil",
				description: `Tag keahlian & evaluasi performa untuk ${userName || "engineer"} telah berhasil diperbarui.`,
				onClose: () => window.location.reload(),
			});
		} catch (error: any) {
			showNotification({
				variant: "error",
				title: "Gagal Sync Tags AI",
				description: error?.response?.data?.message || "Terjadi kesalahan saat memproses analisis AI.",
			});
		} finally {
			hideLoading();
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-2xl">
				<AlertDialogHeader className="space-y-2">
					<AlertDialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
						<div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
							<Sparkles className="w-5 h-5" />
						</div>
						<span>Sync AI Tags & Review</span>
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
						Gemini AI akan menganalisis riwayat tiket yang diselesaikan oleh{" "}
						<strong className="text-slate-700">{userName || "engineer"}</strong> untuk mengekstrak 3 tag spesialisasi dan 1 paragraf evaluasi performa.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="py-4 space-y-3 border-y border-slate-100 my-2">
					<label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
						<Calendar className="w-3.5 h-3.5 text-slate-500" />
						<span>Pilihan Periode Tiket</span>
					</label>

					<div className="flex flex-col gap-2">
						<label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
							<input
								type="radio"
								name="periodMode"
								checked={useAllTime}
								onChange={() => setUseAllTime(true)}
								className="text-purple-600 focus:ring-purple-500"
							/>
							<span>Semua Riwayat Tiket (Default / Terakhir)</span>
						</label>

						<label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
							<input
								type="radio"
								name="periodMode"
								checked={!useAllTime}
								onChange={() => setUseAllTime(false)}
								className="text-purple-600 focus:ring-purple-500"
							/>
							<span>Pilih Bulan & Tahun Tertentu</span>
						</label>

						{!useAllTime && (
							<div className="pt-1 pl-6">
								<input
									type="month"
									value={period}
									onChange={(e) => setPeriod(e.target.value)}
									className="w-full text-xs font-medium border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 text-slate-800 bg-slate-50/50"
								/>
							</div>
						)}
					</div>
				</div>

				<AlertDialogFooter className="flex items-center gap-2 pt-2">
					<AlertDialogCancel className="text-xs font-medium rounded-lg">
						Batal
					</AlertDialogCancel>
					<Button
						onClick={handleSync}
						className="text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg gap-1.5"
					>
						<Bot className="w-3.5 h-3.5" />
						<span>Mulai Analisis AI</span>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
