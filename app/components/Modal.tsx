import { Dialog } from '@reach/dialog';

interface ModalProps {
  className?: string;
  children: React.ReactElement;
  isOpen: boolean;
  onClose: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

export default function Modal({ className = '', children, isOpen, onClose, ...rest }: ModalProps) {
  return (
    <Dialog
      className={`bg-white rounded-2xl p-8 shadow-card w-72 sm:w-80 ${className}`}
      isOpen={isOpen} onDismiss={onClose} {...rest}>
      {children}
    </Dialog>
  );
}
