import { Box, CircularProgress } from '@mui/material';

function LoadingIndicator() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="220px">
      <CircularProgress />
    </Box>
  );
}

export default LoadingIndicator;
