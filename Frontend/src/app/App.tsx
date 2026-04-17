import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ViewInArOutlinedIcon from '@mui/icons-material/ViewInArOutlined';
import { Box, Stack, Typography } from '@mui/material';
import { NavLink, Route, Routes } from 'react-router-dom';
import DashboardPage from '@features/dashboard/DashboardPage';
import CustomersPage from '@features/customers/CustomersPage';
import ProductsPage from '@features/products/ProductsPage';
import OrdersPage from '@features/orders/OrdersPage';
import CreateOrderPage from '@features/orders/CreateOrderPage';

const navItems = [
  { path: '/', label: 'Dashboard', icon: DashboardRoundedIcon },
  { path: '/customers', label: 'Customers', icon: PeopleOutlineRoundedIcon },
  { path: '/products', label: 'Products', icon: ViewInArOutlinedIcon },
  { path: '/orders', label: 'Orders', icon: ShoppingCartOutlinedIcon },
  { path: '/orders/create', label: 'New Order', icon: AddRoundedIcon },
];

function App() {
  return (
    <Box className="app-shell">
      <Box component="aside" className="sidebar">
        <Box className="sidebar__brand">
          <Box className="sidebar__brand-icon">
            <Inventory2OutlinedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography className="sidebar__brand-text">MiniERP</Typography>
        </Box>

        <Stack component="nav" className="sidebar__nav" spacing={1}>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                }
              >
                <Icon className="sidebar__link-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </Stack>

        <Typography className="sidebar__footer">MiniERP</Typography>
      </Box>

      <Box component="main" className="app-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/create" element={<CreateOrderPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
