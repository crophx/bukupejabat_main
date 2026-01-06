import EmployeeForm from '../components/EmployeeForm';

export default function TambahPegawai() {
  const handleSave = (data) => {
    console.log('Tambah pegawai:', data);
    alert('Pegawai disimpan (demo): ' + (data.name || '—'));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
        <h3 className="text-lg font-semibold mb-4 text-slate-500">Tambah Pegawai</h3>
        <EmployeeForm onSave={handleSave} />
      </div>
    </div>
  );
}
