import {
    type ColumnDef,
    type ColumnFiltersState,
    createColumnHelper,
    getCoreRowModel, getFilteredRowModel, getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {useMemo, useState} from "react";
import Table from "./table.tsx";

export const TicketTable = () =>  {
    type Ticket = {
	fullNumber: string,
	asset?: {
	    id: number,
	    serialNumber: string,
	    assetTag: string,
	    hostname: string,
	    category: string,
	    brand: string,
	    model: string,
	}
	engineer?: {
	    id: number,
	    username: string,
	    email: string,
	    role: string,
	}
	user?: {
	    employeeId: number,
	    nik: string,
	    name: string,
	    userNonEmployee?: string,
	}
	createdBy: {
	    id: number,
	    username: string,
	    email: string,
	    role: string,
	}
	location: string,
	problem: string,
	status: string,
	solution?: string,
	startAt: string,
	solvedAt?: string,
	remarks?: string,
    }


    const dummyTickets = useMemo<Ticket[]> (()=>
	[
	    { location: 'Tanjung Enim', fullNumber: "TCK-2026-001", asset: { id: 101, serialNumber: "SN-NX12345", assetTag: "AST-LAP-001", hostname: "HO-LAP-JOHN", category: "Laptop", brand: "Lenovo", model: "ThinkPad X1 Carbon" }, engineer: { id: 1, username: "budi.tech", email: "budi.tech@company.com", role: "IT Support Engineer" }, user: { nik: '141414', employeeId: 20210501, name: "John Doe" }, createdBy: { id: 1, username: "budi.tech", email: "budi.tech@company.com", role: "IT Support Engineer" }, problem: "Laptop tidak bisa masuk ke Windows, stuck di logo Lenovo.", status: "Solved", solution: "Melakukan install ulang OS dan restore data dari cloud backup.", startAt: "2026-06-01T08:30:00Z", solvedAt: "2026-06-01T11:00:00Z", remarks: "User puas karena data aman." },
	    { location: 'Tanjung Enim', fullNumber: "TCK-2026-002", asset: { id: 102, serialNumber: "SN-PC67890", assetTag: "AST-DESK-042", hostname: "BO-PC-ALICE", category: "Desktop", brand: "Dell", model: "OptiPlex 7090" }, engineer: { id: 2, username: "siti.admin", email: "siti.admin@company.com", role: "Network Engineer" }, user: { nik: '141414', employeeId: 990011, name: "Alice Smith", userNonEmployee: "Internship Marketing" }, createdBy: { id: 51, username: "siti.admin", email: "siti.admin@company.com", role: "Network Engineer" }, problem: "PC tidak bisa terkoneksi ke internet lewat kabel LAN.", status: "In Progress", startAt: "2026-06-02T09:15:00Z" },
	    { location: 'Tanjung Enim', fullNumber: "TCK-2026-003", asset: { id: 103, serialNumber: "SN-PRNT1122", assetTag: "AST-PRN-005", hostname: "HO-PRN-HR", category: "Printer", brand: "HP", model: "LaserJet Pro M404dn" }, engineer: { id: 1, username: "budi.tech", email: "budi.tech@company.com", role: "IT Support Engineer" }, user: { nik: '141414', employeeId: 20190812, name: "Clara Azahra" }, createdBy: { id: 52, username: "clara.hr", email: "clara.hr@company.com", role: "HR Specialist" }, problem: "Printer mengalami paper jam berulang kali saat mencetak dokumen duplex.", status: "Solved", solution: "Membersihan roller penarik kertas dan mengganti paper tray yang longgar.", startAt: "2026-06-02T14:00:00Z", solvedAt: "2026-06-02T15:30:00Z", remarks: "Sparepart paper tray diganti dengan yang baru." },
	    { location: 'Tanjung Enim', fullNumber: "TCK-2026-004", user: { nik: '141414', employeeId: 20190812, name: "Clara Azahra" }, createdBy: { id: 52, username: "clara.hr", email: "clara.hr@company.com", role: "HR Specialist" }, problem: "Aplikasi internal HRIS tidak bisa diakses, muncul error 500 internal server error.", status: "Open", startAt: "2026-06-03T07:00:00Z" },
	    { location: 'Tanjung Enim', fullNumber: "TCK-2026-005", asset: { id: 104, serialNumber: "SN-AP99887", assetTag: "AST-NET-012", hostname: "AP-LT2-NORTH", category: "Networking", brand: "Cisco", model: "Catalyst 9115" }, engineer: { id: 2, username: "siti.admin", email: "siti.admin@company.com", role: "Network Engineer" }, user: { nik: '141414', employeeId: 111111, name: "System Infrastructure" }, createdBy: { id: 99, username: "system.monitor", email: "noreply-monitor@company.com", role: "System Alert" }, problem: "Access Point di Lantai 2 area Utara terdeteksi down / unreachable.", status: "Solved", solution: "Melakukan restart port PoE pada core switch lantai 2.", startAt: "2026-06-03T10:00:00Z", solvedAt: "2026-06-03T10:15:00Z", remarks: "Otomatis solved setelah port di-sh/no-sh." },
	    { location: 'Tanjung Enim', fullNumber: "TCK-2026-006", asset: { id: 105, serialNumber: "SN-MBX5544", assetTag: "AST-LAP-089", hostname: "HO-LAP-DAVID", category: "Laptop", brand: "Apple", model: "MacBook Pro M2" }, engineer: { id: 3, username: "kevin.ops", email: "kevin.ops@company.com", role: "IT Ops Lead" }, user: { nik: '141414', employeeId: 990054, name: "David Miller", userNonEmployee: "Consultant" }, createdBy: { id: 55, username: "david.miller", email: "david.miller@company.com", role: "Manager Sales" }, problem: "Layar MacBook berkedip (flickering) setelah tersenggol meja.", status: "Pending", startAt: "2026-06-03T13:45:00Z", remarks: "Menunggu estimasi perbaikan dari pihak Authorized Apple Service Center." },
	    { location: 'Tanjung Enim', fullNumber: "TCK-2026-007", asset: { id: 106, serialNumber: "SN-MON0011", assetTag: "AST-MON-102", hostname: "BO-MON-DESIGN", category: "Monitor", brand: "ASUS", model: "ProArt PA278QV" }, engineer: { id: 1, username: "budi.tech", email: "budi.tech@company.com", role: "IT Support Engineer" }, user: { nik: '141414', employeeId: 20230211, name: "Grace Natalia" }, createdBy: { id: 56, username: "grace.art", email: "grace.art@company.com", role: "UI/UX Designer" }, problem: "Akurasi warna monitor berubah kekuningan, sudah coba kalibrasi manual tetap gagal.", status: "Solved", solution: "Mengganti kabel HDMI bawaan dengan kabel DisplayPort yang baru.", startAt: "2026-06-04T08:00:00Z", solvedAt: "2026-06-04T09:00:00Z" },
	    { location: 'Tanjung Enim', fullNumber: "TCK-2026-008", asset: { id: 107, serialNumber: "SN-SVR9999", assetTag: "AST-SVR-001", hostname: "HO-SVR-PROD", category: "Server", brand: "HPE", model: "ProLiant DL380 Gen10" }, engineer: { id: 3, username: "kevin.ops", email: "kevin.ops@company.com", role: "IT Ops Lead" }, user: { nik: '141414', employeeId: 20150101, name: "Kevin Sanjaya" }, createdBy: { id: 3, username: "kevin.ops", email: "kevin.ops@company.com", role: "IT Ops Lead" }, problem: "Hardisk Bay 4 menyala lampu amber (indikasi Predictive Failure).", status: "In Progress", startAt: "2026-06-04T10:30:00Z", remarks: "Sedang proses rebuild setelah dilakukan hot-swap HDD baru." },
	    { location: 'Tanjung Enim', fullNumber: "TCK-2026-009", user: { nik: '141414', employeeId: 990321, name: "Ian Wijaya", userNonEmployee: "Outsource Vendor" }, createdBy: { id: 58, username: "ian.sales", email: "ian.sales@company.com", role: "Staff Sales" }, problem: "Lupa password akun email korporat dan gagal login setelah 3 kali mencoba.", status: "Solved", engineer: { id: 1, username: "budi.tech", email: "budi.tech@company.com", role: "IT Support Engineer" }, solution: "Melakukan reset password via Active Directory dan mengirimkan password temporary.", startAt: "2026-06-04T11:15:00Z", solvedAt: "2026-06-04T11:25:00Z" },
	    { location: 'Tanjung Enim', fullNumber: "TCK-2026-010", asset: { id: 108, serialNumber: "SN-TAB5566", assetTag: "AST-TAB-003", hostname: "BO-TAB-WH1", category: "Tablet", brand: "Samsung", model: "Galaxy Tab Active4 Pro" }, user: { nik: '141414', employeeId: 20221102, name: "Bobby Pratama" }, createdBy: { id: 60, username: "bobby.wh", email: "bobby.wh@company.com", role: "Warehouse Operator" }, problem: "Aplikasi scanner barcode bawaan tablet sering crash saat scan barang masuk.", status: "Open", startAt: "2026-06-04T14:00:00Z" }
	], []);

    const columnHelper = createColumnHelper<Ticket>();


    // B. Definisi Kolom Menggunakan Column Helper
    const columns: ColumnDef<Ticket, any>[] = useMemo(
	() => [
	    columnHelper.accessor('fullNumber', {
		header: 'Ticket Number',
	    }),
	    columnHelper.accessor(row => row.asset?.assetTag, {
		id: 'assetTag',
		header: 'Asset Tag',
	    }),
	    columnHelper.accessor(row => {
		if (!row.user) return '';
		const status = row.user.userNonEmployee ? row.user.userNonEmployee : 'PIC';
		return `${row.user.name} ${status}`;
	    }, {
		id: 'user',
		header: 'User',
		cell: (info) => {
		    const user = info.row.original.user
		    if (!user) return <span> - </span>
		    return (
			<div>
			    <div className="font-semibold">{`${user.name} (${user.userNonEmployee ? user.userNonEmployee : 'PIC'})`}</div>
			    <div className="text-xs text-gray-500">{`NIK: ${user.nik ? user.nik : '-'}`}</div>
			</div>
		    )
		}
	    }),
	    columnHelper.accessor('location', {
		header: 'Location'
	    }),
	    columnHelper.accessor(row => row.asset?.category, {
		id: 'category',
		header: 'Category',
	    }),

	    columnHelper.accessor('problem', {
		header: 'Problem'
	    }),

	    columnHelper.accessor(row => row.createdBy?.username, {
		header: 'Created By'
	    }),

	    columnHelper.accessor( 'startAt', {
		header: 'Start At',
		cell: (info) => {
		    const rawValue = info.getValue();
		    if (!rawValue) return '-';
		    const rawDate = new Date(rawValue);
		    return rawDate.toLocaleTimeString('en-UK', {
			day: 'numeric',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Asia/Jakarta'
		    });
		}
	    }),

	    columnHelper.accessor( 'solvedAt', {
		header: 'Solved At',
		cell: (info) => {
		    const rawValue = info.getValue();
		    if (!rawValue) return '-';
		    const rawDate = new Date(rawValue);
		    return rawDate.toLocaleTimeString('en-UK', {
			day: 'numeric',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Asia/Jakarta'
		    });
		}
	    }),

	    columnHelper.accessor(row => row.engineer?.username, {
		header: 'Engineer'
	    }),

	    columnHelper.accessor('status', {
		header: 'Status'
	    }),

	    columnHelper.accessor('solution', {
		header: 'Solution'
	    }),

	    // Contoh display column untuk tombol aksi (tidak ng-link ke data)
	    columnHelper.display({
		id: 'actions',
		header: 'Aksi',
		cell: (info) => (
		    <button
			onClick={() => alert(`Mengedit Aset: ${info.row.original.asset?.assetTag}`)}
			className="text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
		    >
			Edit
		    </button>
		),
	    }),
	],
	[]
    );

// C. State Kontrol TanStack Table
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });

// D. Inisialisasi Table Instance Utama
    const table = useReactTable<Ticket>({
	data : dummyTickets,
	columns,
	state: {
	    columnFilters,
	    pagination,
	},
	onColumnFiltersChange: setColumnFilters,
	onPaginationChange: setPagination,
	getCoreRowModel: getCoreRowModel(),
	getFilteredRowModel: getFilteredRowModel(),
	getPaginationRowModel: getPaginationRowModel(),
    });

// E. Render Halaman
    return (<Table table={table} />)

}