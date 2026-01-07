import React from "react";
import Modal from "./Modal";

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    message = "Are you sure?",
}) {
    if (!open) return null;

    return (
        <Modal open={open} onClose={onClose} title="Konfirmasi">
            <p className="mb-4 text-sm text-slate-700">{message}</p>
            <div className="flex justify-end gap-2">
                <button onClick={onClose} className="px-3 py-1 rounded border">
                    Batal
                </button>
                <button
                    onClick={() => {
                        onConfirm && onConfirm();
                        onClose && onClose();
                    }}
                    className="px-3 py-1 rounded bg-red-600 text-white"
                >
                    Hapus
                </button>
            </div>
        </Modal>
    );
}
