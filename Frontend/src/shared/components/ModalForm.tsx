import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import type { ReactNode } from 'react';

interface ModalFormProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
  submitLabel?: string;
}

function ModalForm({ open, title, onClose, onSubmit, children, submitLabel = 'Save' }: ModalFormProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ display: 'grid', gap: 2, mt: 1 }}>
          {children}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalForm;
