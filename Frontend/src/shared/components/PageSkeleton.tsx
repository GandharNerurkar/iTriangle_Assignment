import { Box, Grid, Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

export function TableSkeleton({ columns, rows = 8 }: TableSkeletonProps) {
  return (
    <TableContainer component={Paper} elevation={2}>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width={index === 0 ? 120 : 90} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <TableCell key={columnIndex}>
                  <Skeleton variant="text" width={`${columnIndex === 0 ? 70 : 55}%`} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Paper elevation={0} className="summary-card" sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="rounded" width={54} height={54} />
              <Box flex={1}>
                <Skeleton variant="text" width="45%" />
                <Skeleton variant="text" width="32%" height={42} />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export function OrderFormSkeleton() {
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Skeleton variant="rounded" height={40} />
        </Grid>
      </Grid>

      {Array.from({ length: 3 }).map((_, index) => (
        <Grid container spacing={2} alignItems="center" key={index} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={5}>
            <Skeleton variant="rounded" height={40} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Skeleton variant="rounded" height={40} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Skeleton variant="rounded" height={40} />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Skeleton variant="circular" width={40} height={40} />
          </Grid>
        </Grid>
      ))}

      <Box display="flex" justifyContent="flex-end" sx={{ mb: 3 }}>
        <Skeleton variant="rounded" width={130} height={36} />
      </Box>

      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fafafa' }}>
        <Grid container spacing={2}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Skeleton variant="text" width="45%" />
              <Skeleton variant="text" width="60%" height={32} />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Box display="flex" justifyContent="flex-end" gap={2}>
        <Skeleton variant="rounded" width={80} height={36} />
        <Skeleton variant="rounded" width={120} height={36} />
      </Box>
    </Paper>
  );
}
