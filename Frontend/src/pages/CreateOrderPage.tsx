import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid, Paper, Typography, IconButton, TextField, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchCustomers } from '../redux/slices/customersSlice';
import { fetchProducts } from '../redux/slices/productsSlice';
import { createOrder } from '../redux/slices/ordersSlice';
import AlertSnackbar from '../components/common/AlertSnackbar';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { inr } from '../utils/format';

interface OrderRow {
  id: string;
  productId: string;
  quantity: number;
}

function CreateOrderPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: customers, loading: customersLoading } = useAppSelector((state) => state.customers);
  const { items: products, loading: productsLoading } = useAppSelector((state) => state.products);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [rows, setRows] = useState<OrderRow[]>([{ id: 'row-1', productId: '', quantity: 1 }]);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
  }, [dispatch]);

  const loading = customersLoading || productsLoading;

  const productById = useMemo(() => new Map(products.map((product) => [product.id, product])), [products]);

  const rowsWithTotals = useMemo(
    () =>
      rows.map((row) => {
        const product = productById.get(row.productId);
        const price = product?.price ?? 0;
        return {
          ...row,
          name: product?.name ?? '',
          price,
          subtotal: price * row.quantity,
        };
      }),
    [rows, productById]
  );

  const subtotal = rowsWithTotals.reduce((sum, row) => sum + row.subtotal, 0);
  const tax = +(subtotal * 0.18).toFixed(2);
  const total = subtotal + tax;

  const addRow = () => {
    setRows((prev) => [...prev, { id: `row-${prev.length + 1}`, productId: '', quantity: 1 }]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const updateRow = (id: string, updates: Partial<OrderRow>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...updates } : row)));
  };

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      setToast({ open: true, message: 'Please select a customer.', severity: 'error' });
      return;
    }

    const validRows = rowsWithTotals.filter((row) => row.productId && row.quantity > 0);
    if (validRows.length === 0) {
      setToast({ open: true, message: 'Please add at least one product to the order.', severity: 'error' });
      return;
    }

    try {
      await dispatch(
        createOrder({
          customerId: selectedCustomer,
          items: validRows.map((row) => ({ productId: row.productId, quantity: row.quantity })),
        })
      ).unwrap();
      setToast({ open: true, message: 'Order created successfully.', severity: 'success' });
      setTimeout(() => navigate('/orders'), 500);
    } catch (err: any) {
      const message = err?.response?.data?.message ?? err?.message ?? 'Failed to create order.';
      setToast({ open: true, message, severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Create Order
      </Typography>
      <Typography color="text.secondary" paragraph>
        Add order details, choose a customer, and select products with quantities.
      </Typography>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                select
                fullWidth
                label="Select Customer"
                value={selectedCustomer}
                onChange={(event) => setSelectedCustomer(event.target.value)}
                size="small"
              >
                <MenuItem value="">
                  <em>Select customer</em>
                </MenuItem>
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {rowsWithTotals.map((row, index) => (
            <Grid container spacing={2} alignItems="center" key={row.id} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={5}>
                <TextField
                  select
                  fullWidth
                  label={`Product ${index + 1}`}
                  value={row.productId}
                  size="small"
                  onChange={(event) => updateRow(row.id, { productId: event.target.value })}
                >
                  <MenuItem value="">
                    <em>Select product</em>
                  </MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  size="small"
                  inputProps={{ min: 1 }}
                  value={row.quantity}
                  onChange={(event) => updateRow(row.id, { quantity: Number(event.target.value) || 1 })}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  label="Subtotal"
                  value={inr(row.subtotal)}
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton color="error" onClick={() => removeRow(row.id)} disabled={rows.length === 1}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Box display="flex" justifyContent="flex-end" sx={{ mb: 3 }}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={addRow}>
              Add Product
            </Button>
          </Box>

          <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#fafafa' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography variant="h6">{inr(subtotal)}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary">Tax (18%)</Typography>
                <Typography variant="h6">{inr(tax)}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary">Total</Typography>
                <Typography variant="h6">{inr(total)}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => navigate('/orders')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit Order
            </Button>
          </Box>
        </Paper>
      )}

      <AlertSnackbar open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast((prev) => ({ ...prev, open: false }))} />
    </Box>
  );
}

export default CreateOrderPage;
