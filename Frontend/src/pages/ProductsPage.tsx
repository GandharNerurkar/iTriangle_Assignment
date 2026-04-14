import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchProducts, createProduct, updateProduct } from '../redux/slices/productsSlice';
import type { Product } from '../types';
import DataTable, { type Column } from '../components/common/DataTable';
import ModalForm from '../components/common/ModalForm';
import FormInput from '../components/common/FormInput';
import AlertSnackbar from '../components/common/AlertSnackbar';
import LoadingIndicator from '../components/common/LoadingIndicator';

const initialForm = { name: '', price: 0, stock: 0 };

function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.products);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formValues, setFormValues] = useState(initialForm);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setToast({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const columns = useMemo<Column<Product>[]>(
    () => [
      { field: 'name', headerName: 'Product' },
      { field: 'price', headerName: 'Price', renderCell: (row) => `₹${row.price.toFixed(2)}` },
      { field: 'stock', headerName: 'Stock' },
      {
        field: 'id',
        headerName: 'Actions',
        renderCell: (row) => (
          <IconButton color="primary" onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
        ),
      },
    ],
    []
  );

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormValues(initialForm);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormValues({ name: product.name, price: product.price, stock: product.stock });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct.id, data: formValues })).unwrap();
        setToast({ open: true, message: 'Product updated successfully.', severity: 'success' });
      } else {
        await dispatch(createProduct(formValues)).unwrap();
        setToast({ open: true, message: 'Product created successfully.', severity: 'success' });
      }
      setModalOpen(false);
    } catch (err) {
      setToast({ open: true, message: 'Could not save product.', severity: 'error' });
    }
  };

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Products
          </Typography>
          <Typography color="text.secondary">Create and update products for order creation.</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal}>
            Add Product
          </Button>
        </Grid>
      </Grid>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <DataTable columns={columns} rows={items} noDataMessage="No products found." />
      )}
      <ModalForm
        open={modalOpen}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <FormInput label="Product Name" name="name" value={formValues.name} onChange={(value) => setFormValues((prev) => ({ ...prev, name: value }))} />
        <FormInput label="Price" name="price" type="number" value={formValues.price} onChange={(value) => setFormValues((prev) => ({ ...prev, price: Number(value) }))} />
        <FormInput label="Stock" name="stock" type="number" value={formValues.stock} onChange={(value) => setFormValues((prev) => ({ ...prev, stock: Number(value) }))} />
      </ModalForm>
      <AlertSnackbar open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast((prev) => ({ ...prev, open: false }))} />
    </Box>
  );
}

export default ProductsPage;
