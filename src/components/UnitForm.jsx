import { useState } from 'react';

export default function UnitForm({ initial = {}, onSave }) {
  const [name, setName] = useState(initial.name || '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave && onSave({ name });
      }}
      className="grid gap-3"
    >
      <input className="text-sm border p-2 rounded rounded-xl text-slate-700" placeholder="Nama Unit Kerja" value={name} onChange={(e) => setName(e.target.value)} />
      <h2 className="text-lg font-semibold mb-1 text-slate-700">Jabatan</h2>
      <input className="text-sm border p-2 rounded rounded-xl text-slate-700" placeholder="Nama Jabatan" value={name} onChange={(e) => setName(e.target.value)} />
    </form>

  );
}
