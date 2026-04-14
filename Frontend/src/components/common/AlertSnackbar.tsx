import { Snackbar, Alert } from '@mui/material';

interface AlertSnackbarProps {
  open: boolean;
  message: string;
  severity?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
}

function AlertSnackbar({ open, message, severity = 'success', onClose }: AlertSnackbarProps) {
  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert elevation={6} variant="filled" onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertSnackbar;
