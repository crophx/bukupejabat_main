import React from 'react';

export default function DataAdmin() {
	return (
		<div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 mb-6 space-y-6">
			{/* <header className="flex items-start justify-between">
				<div>
					<h2 className="text-xl font-bold text-slate-900">Data Pegawai</h2>
					<p className="text-sm text-slate-500">Manajemen data pegawai dan unit kerja</p>
				</div>

				<div className="flex items-center gap-3">
					<button className="text-sm px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold">Tambah Pegawai</button>
				</div>
			</header> */}

			{/* <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="bg-white rounded-2xl p-4 shadow-sm border">
					<div className="text-xs text-slate-500">Total Pegawai</div>
					<div className="text-2xl font-bold text-slate-900">1,256</div>
				</div>
				<div className="bg-white rounded-2xl p-4 shadow-sm border">
					<div className="text-xs text-slate-500">Active Today</div>
					<div className="text-2xl font-bold text-slate-900">342</div>
				</div>
				<div className="bg-white rounded-2xl p-4 shadow-sm border">
					<div className="text-xs text-slate-500">New This Month</div>
					<div className="text-2xl font-bold text-slate-900">24</div>
				</div>
			</section> */}

			<section className="bg-white rounded-xl p-4 shadow-md border border-gray-400">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
					<div className="flex items-center gap-2 w-full sm:w-auto">
						<input className="text-sm w-full sm:w-64 px-3 py-1 rounded-xl border border-gray-400" placeholder="Search..." />
						<select className="text-sm px-2 py-1 rounded-xl border border-gray-400">
							<option>All Units</option>
							<option>Unit A</option>
							<option>Unit B</option>
							<option>Unit C</option>
							<option>Unit D</option>
						</select>
						<select className="text-sm px-2 py-1 rounded-xl border border-gray-400">
							<option>All Status</option>
							<option>Active</option>
							<option>Inactive</option>
						</select>
					</div>

					<div className="flex items-center gap-2">
						<button className="text-sm px-3 py-1 rounded-xl bg-white border border-gray-400">Reset</button>
						<button className="text-sm px-3 py-1 rounded-xl bg-slate-100 border border-gray-400">Apply</button>
					</div>
				</div>

				<div className="mt-4 overflow-x-auto">
					<table className="w-full text-sm table-auto">
						<thead className="text-left text-xs text-slate-500 border-b">
							<tr>
								<th className="py-2">Unit Organisasi</th>
								<th className="py-2">Email</th>
								<th className="py-2">Username</th>
								<th className="py-2">Role</th>
								<th className="py-2">Akun dibuat</th>
								<th className="py-2">Aksi</th>
							</tr>
						</thead>
						<tbody>
							{Array.from({ length: 6 }).map((_, i) => (
								<tr key={i} className="hover:bg-slate-50">
									<td className="py-2">Biro Sumber Daya Manusia</td>
									<td className="py-2">jeanskaret@gmail.com</td>
									<td className="py-2">BSDM</td>
									<td className="py-2"><span className="px-2 py-0.5 rounded text-xs bg-emerald-100 text-emerald-700">Admin</span></td>
									<td className="py-2">2025-12-0{6 - i}</td>
									<td className="py-2">
										<div className="flex items-center gap-2">
											<button className="text-xs text-sky-600">Edit</button>
											<button className="text-xs text-red-600">Delete</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className="mt-4 flex items-center justify-between text-xs text-slate-500">
					<div>Showing 6 of 6</div>
					<div className="flex items-center gap-2">
						<button className="px-2 py-1 rounded-xl bg-white border">Prev</button>
						<button className="px-2 py-1 rounded-xl bg-white border">Next</button>
					</div>
				</div>
			</section>
		</div>
	);
}
