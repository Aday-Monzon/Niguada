import { PropsWithChildren } from "react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="glass-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-2xl font-bold text-slate-900">{title}</h3>
          <button
            type="button"
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
