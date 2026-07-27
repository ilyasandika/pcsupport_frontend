import { useState, useEffect } from 'react';

export function useTimeSinceRefresh() {
    // Simpan waktu saat pertama kali halaman dimuat (refresh)
    const [startTime] = useState(() => Date.now());

    // State untuk menyimpan total detik yang sudah berlalu
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
	// Jalankan interval untuk mengupdate selisih waktu
	const interval = setInterval(() => {
	    const now = Date.now();
	    const diffInSeconds = Math.floor((now - startTime) / 1000);
	    setElapsedSeconds(diffInSeconds);
	}, 1000); // Update setiap 1 detik agar perubahannya langsung terlihat

	// Cleanup interval saat komponen di-unmount (best practice)
	return () => clearInterval(interval);
    }, [startTime]);

    // Kalkulasi menit dan sisa detik
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    return { minutes, seconds, totalSeconds: elapsedSeconds };
}