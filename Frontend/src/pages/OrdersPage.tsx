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
import { Modal, Paper } from '@mui/material';
import { orderService } from '../services/orderService';

function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
const [openModal, setOpenModal] = useState(false);
const [loadingOrder, setLoadingOrder] = useState(false);
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

const handleRowClick = async (row: Order) => {
  try {
    setOpenModal(true); // open modal first
    setLoadingOrder(true);

    const fullOrder = await orderService.detail(row.id); // API call

    setSelectedOrder(fullOrder);
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingOrder(false);
  }
};

const handleClose = () => {
  setOpenModal(false);
};

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
  {/* <DataTable
    columns={columns}
    rows={paginatedRows} 
    noDataMessage="No orders found."
  /> */}
  <DataTable
  columns={columns}
  rows={paginatedRows}
  noDataMessage="No orders found."
  onRowClick={handleRowClick} 
/>


  <Box display="flex" justifyContent="center" mt={2}>
    <Pagination
      count={Math.ceil(items.length / rowsPerPage)}
      page={page}
      onChange={(_, value) => setPage(value)}
      color="primary"
    />
  </Box>

  <Modal open={openModal} onClose={handleClose}>
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    sx={{ height: '100vh' }}
    onClick={handleClose}
  >
    <Paper sx={{ p: 3, width: 500, maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
      
      {loadingOrder ? (
        <LoadingIndicator />
      ) : selectedOrder ? (
        <>
          <Typography variant="h6">
            Order #{selectedOrder.id}
          </Typography>

          <Typography>
            Customer: {selectedOrder.customerName}
          </Typography>

          <Box mt={2}>
            <Typography variant="subtitle1">Items</Typography>

            {selectedOrder.items?.length ? (
              selectedOrder.items.map((item) => (
                <Box
                  key={item.productId}
                  display="flex"
                  justifyContent="space-between"
                  mt={1}
                >
                  <Typography>{item.name}</Typography>
                  <Typography>
                    {item.quantity} × ₹{item.price.toFixed(2)}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No items found</Typography>
            )}
          </Box>

          <Box mt={2}>
            <Typography>Subtotal: ₹{selectedOrder.subtotal}</Typography>
            <Typography>Tax: ₹{selectedOrder.tax}</Typography>
            <Typography fontWeight={700}>
              Total: ₹{selectedOrder.total}
            </Typography>
          </Box>
        </>
      ) : null}

    </Paper>
  </Box>
</Modal>
</>
      )}
    </Box>
  );
}

export default OrdersPage;
