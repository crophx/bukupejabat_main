import UnitForm from '../components/UnitForm';

export default function UnitKerja() {
  const handleSave = (data) => {
    console.log('Simpan unit kerja:', data);
    alert('Unit Kerja disimpan (demo): ' + (data.name || '—'));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
        <h3 className="text-lg font-semibold mb-4">Unit Kerja</h3>
        <UnitForm onSave={handleSave} />
      </div>
    </div>
  );
}
