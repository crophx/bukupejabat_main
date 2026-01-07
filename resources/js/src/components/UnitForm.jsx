import { useState } from "react";
import React from "react";

export default function UnitForm({ initial = {}, onSave }) {
    const [name, setName] = useState(initial.name || "");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave && onSave({ name });
            }}
            className="grid gap-3"
        >
            <input
                className="text-sm border p-2 rounded rounded-xl"
                placeholder="Nama Unit Kerja"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <div className="flex justify-end mt-2">
                <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white rounded rounded-xl cursor-auto"
                >
                    Simpan
                </button>
            </div>
        </form>
    );
}
