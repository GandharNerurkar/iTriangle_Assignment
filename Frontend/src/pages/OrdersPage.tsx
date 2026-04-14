import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchOrders } from '../redux/slices/ordersSlice';
import DataTable, { type Column } from '../components/common/DataTable';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { formatDate } from '../utils/format';
import type { Order } from '../types';
import { Pagination } from '@mui/material';

function OrdersPage() {
  const [page, setPage] = useState(1);
const rowsPerPage = 10;
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const columns = useMemo<Column<Order>[]>(
    () => [
      { field: 'id', headerName: 'Order ID' },
      { field: 'customerName', headerName: 'Customer' },
      {
        field: 'total',
        headerName: 'Total Amount',
        renderCell: (row) => `₹${row.total.toFixed(2)}`,
      },
      {
        field: 'createdAt',
        headerName: 'Date',
        renderCell: (row) => formatDate(row.createdAt),
      },
    ],
    []
  );

  const paginatedRows = useMemo(() => {
  const start = (page - 1) * rowsPerPage;
  return items.slice(start, start + rowsPerPage);
}, [items, page]);

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Orders
          </Typography>
          <Typography color="text.secondary">Review order history and order totals.</Typography>
        </Grid>
        <Grid item>
          <Button component={RouterLink} to="/orders/create" variant="contained" startIcon={<AddIcon />}>
            Create Order
          </Button>
        </Grid>
      </Grid>
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
  <DataTable
    columns={columns}
    rows={paginatedRows} // ✅ use paginated rows
    noDataMessage="No orders found."
  />


  <Box display="flex" justifyContent="center" mt={2}>
    <Pagination
      count={Math.ceil(items.length / rowsPerPage)}
      page={page}
      onChange={(_, value) => setPage(value)}
      color="primary"
    />
  </Box>
</>
      )}
    </Box>
  );
}

export default OrdersPage;
