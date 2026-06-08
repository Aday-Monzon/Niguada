import { Button } from "./Button";
import { Modal } from "./Modal";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  busy = false,
  onConfirm,
  onClose
}: ConfirmDialogProps) => {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <div className="space-y-6">
        <p className="text-sm leading-6 text-zinc-600">{description}</p>

        <div className="flex justify-end gap-3 border-t border-zinc-100 pt-5">
          <Button type="button" variant="ghost" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="danger"
            busy={busy}
            busyLabel="Eliminando..."
            onClick={() => {
              void onConfirm();
            }}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
