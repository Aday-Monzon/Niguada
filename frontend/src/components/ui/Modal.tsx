import { PropsWithChildren } from "react";
import { X } from "lucide-react";

type ModalProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
}>;

export const Modal = ({ open, title, onClose, children }: ModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-slate-950/10"
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-6 py-5">
          <div>
            <h3 id="modal-title" className="font-display text-xl font-semibold text-zinc-950">
              {title}
            </h3>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" strokeWidth={1.9} />
          </button>
        </div>
        <div className="max-h-[calc(90vh-5rem)] overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  );
};
