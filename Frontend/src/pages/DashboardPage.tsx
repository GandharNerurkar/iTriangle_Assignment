import { useEffect } from 'react';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import { Box, Grid, Typography } from '@mui/material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchCustomers } from '../redux/slices/customersSlice';
import { fetchProducts } from '../redux/slices/productsSlice';
import { fetchOrders } from '../redux/slices/ordersSlice';
import SummaryCard from '../components/common/SummaryCard';
import LoadingIndicator from '../components/common/LoadingIndicator';

function DashboardPage() {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers);
  const products = useAppSelector((state) => state.products);
  const orders = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchCustomers());
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const loading = customers.loading || products.loading || orders.loading;
  const revenue = orders.items.reduce((total, order) => total + order.total, 0);

  return (
    <Box className="dashboard-page">
      <Typography className="dashboard-page__title" variant="h4" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Typography className="dashboard-page__subtitle" color="text.secondary" paragraph>
        Overview of your business metrics
      </Typography>

      {loading ? (
        <LoadingIndicator />
      ) : (
        <Grid container spacing={3}>
  <Grid item xs={12} sm={6}>
    <SummaryCard
      label="Total Customers"
      value={customers.items.length}
      icon={<PeopleOutlineRoundedIcon />}
      iconColor="#0b6bda"
      iconBackground="#e8f1ff"
    />
  </Grid>

  <Grid item xs={12} sm={6}>
    <SummaryCard
      label="Total Products"
      value={products.items.length}
      icon={<ViewInArOutlinedIcon />}
      iconColor="#11a63a"
      iconBackground="#e7f5ea"
    />
  </Grid>

  <Grid item xs={12} sm={6}>
    <SummaryCard
      label="Total Orders"
      value={orders.items.length}
      icon={<ShoppingCartOutlinedIcon />}
      iconColor="#e39500"
      iconBackground="#fdf2df"
    />
  </Grid>

  <Grid item xs={12} sm={6}>
    <SummaryCard
      label="Revenue"
      value={`₹${revenue.toFixed(2)}`} 
      icon={<TrendingUpRoundedIcon />}
      iconColor="#1485cc"
      iconBackground="#e4f3fb"
    />
  </Grid>
</Grid>
      )}
    </Box>
  );
}

export default DashboardPage;
