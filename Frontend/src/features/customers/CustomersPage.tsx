import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch } from '@shared/hooks/useAppDispatch';
import { useAppSelector } from '@shared/hooks/useAppSelector';
import { fetchCustomers, createCustomer, updateCustomer } from '@features/customers/customersSlice';
import DataTable, { type Column } from '@shared/components/DataTable';
import ModalForm from '@shared/components/ModalForm';
import FormInput from '@shared/components/FormInput';
import AlertSnackbar from '@shared/components/AlertSnackbar';
import { TableSkeleton } from '@shared/components/PageSkeleton';
import type { Customer } from '@shared/types';

const initialForm = { name: '', email: '', phone: '' };

function CustomersPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.customers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formValues, setFormValues] = useState(initialForm);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const initialLoading = loading && items.length === 0;

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setToast({ open: true, message: error, severity: 'error' });
    }
  }, [error]);

  const columns = useMemo<Column<Customer>[]>(
    () => [
      { field: 'name', headerName: 'Name' },
      { field: 'email', headerName: 'Email' },
      { field: 'phone', headerName: 'Phone' },
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
    setEditingCustomer(null);
    setFormValues(initialForm);
    setModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormValues({ name: customer.name, email: customer.email, phone: customer.phone });
    setModalOpen(true);
  };

const handleSubmit = async () => {
  try {

    if (!formValues.name.trim()) {
      setToast({
        open: true,
        message: 'Customer name is required',
        severity: 'error',
      });
      return;
    }

    if (!formValues.email.trim()) {
      setToast({
        open: true,
        message: 'Email is required',
        severity: 'error',
      });
      return;
    }

    if (editingCustomer) {
      await dispatch(updateCustomer({ id: editingCustomer.id, data: formValues })).unwrap();
      setToast({ open: true, message: 'Customer updated successfully.', severity: 'success' });
    } else {
      await dispatch(createCustomer(formValues)).unwrap();
      setToast({ open: true, message: 'Customer created successfully.', severity: 'success' });
    }

    setModalOpen(false);
  } catch (err) {
    setToast({ open: true, message: 'Could not save customer.', severity: 'error' });
  }
};

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Grid item>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Customers
          </Typography>
          <Typography color="text.secondary">Manage your customer list and contact details.</Typography>
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateModal}>
            Add Customer
          </Button>
        </Grid>
      </Grid>
      {initialLoading ? (
        <TableSkeleton columns={columns.length} />
      ) : (
        <DataTable columns={columns} rows={items} noDataMessage="No customers found." />
      )}
      <ModalForm
        open={modalOpen}
        title={editingCustomer ? 'Edit Customer' : 'Add Customer'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      >
        <FormInput label="Name" name="name" value={formValues.name} onChange={(value) => setFormValues((prev) => ({ ...prev, name: value }))} />
        <FormInput label="Email" name="email" type="email" value={formValues.email} onChange={(value) => setFormValues((prev) => ({ ...prev, email: value }))} />
        <FormInput label="Phone" name="phone" value={formValues.phone} onChange={(value) => setFormValues((prev) => ({ ...prev, phone: value }))} />
      </ModalForm>
      <AlertSnackbar open={toast.open} message={toast.message} severity={toast.severity} onClose={() => setToast((prev) => ({ ...prev, open: false }))} />
    </Box>
  );
}

export default CustomersPage;
