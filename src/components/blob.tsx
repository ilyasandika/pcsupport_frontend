interface BlobProps {
    size?: number;     // Menerima angka dalam satuan pixel (px), contoh: 1000 atau 24
    position: string;// Menerima class posisi Tailwind, contoh: "top-20 left-20" atau "-top-30 -left-45"
    initialColor?: string;
}

export const Blob = ({ size = 24, position, initialColor = "from-slate-300/40" }: BlobProps) => {
    return (
	<div
	    className={`absolute rounded-full pointer-events-none transition-all duration-500 ${position} bg-gradient-to-b ${initialColor} to-transparent`}
	    style={{
		width: `${size}px`,
		height: `${size}px`,
	    }}
	/>
    );
};