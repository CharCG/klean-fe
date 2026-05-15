import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Search, List, User, ShoppingBag, FileText, AlertTriangle, MessageSquare, Settings } from 'lucide-react';
import BottomNav from '../components/common/BottomNav';
import Toast from '../components/common/Toast';
import PageSkeleton from '../components/common/PageSkeleton';

const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

const CustomerHome = lazy(() => import('../pages/customer/Home'));
const Explore = lazy(() => import('../pages/customer/Explore'));
const CustomerOrders = lazy(() => import('../pages/customer/Orders'));
const CustomerOrderDetail = lazy(() => import('../pages/customer/OrderDetail'));
const CustomerProfile = lazy(() => import('../pages/customer/Profile'));
const EditProfile = lazy(() => import('../pages/customer/EditProfile'));
const MerchantDetail = lazy(() => import('../pages/customer/MerchantDetail'));
const Checkout = lazy(() => import('../pages/customer/Checkout'));
const PaymentPage = lazy(() => import('../pages/customer/Payment'));
const WriteReview = lazy(() => import('../pages/customer/WriteReview'));
const RegisterMerchant = lazy(() => import('../pages/customer/RegisterMerchant'));

const MerchantDashboard = lazy(() => import('../pages/merchant/Dashboard'));
const MerchantOrders = lazy(() => import('../pages/merchant/Orders'));
const MerchantOrderDetail = lazy(() => import('../pages/merchant/OrderDetail'));
const MerchantServices = lazy(() => import('../pages/merchant/Services'));
const MerchantProfile = lazy(() => import('../pages/merchant/Profile'));
const EditMerchantProfile = lazy(() => import('../pages/merchant/EditProfile'));

const AdminApplications = lazy(() => import('../pages/admin/Applications'));
const AdminApplicationDetail = lazy(() => import('../pages/admin/ApplicationDetail'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));
const AdminReportDetail = lazy(() => import('../pages/admin/ReportDetail'));
const AdminReviews = lazy(() => import('../pages/admin/Reviews'));
const AdminProfile = lazy(() => import('../pages/admin/Profile'));

const CUSTOMER_NAV = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/explore', label: 'Explore', icon: Search },
  { path: '/orders', label: 'Orders', icon: List },
  { path: '/profile', label: 'Profile', icon: User },
];

const MERCHANT_NAV = [
  { path: '/merchant', label: 'Dashboard', icon: Home },
  { path: '/merchant/orders', label: 'Orders', icon: List },
  { path: '/merchant/services', label: 'Services', icon: ShoppingBag },
  { path: '/merchant/profile', label: 'Profile', icon: User },
];

const ADMIN_NAV = [
  { path: '/admin', label: 'Apps', icon: FileText },
  { path: '/admin/reports', label: 'Reports', icon: AlertTriangle },
  { path: '/admin/reviews', label: 'Reviews', icon: MessageSquare },
  { path: '/admin/profile', label: 'Profile', icon: Settings },
];

function RootLayout() {
  return (
    <div
      className="min-h-screen flex justify-center items-center p-0 md:p-4"
      style={{ backgroundColor: 'var(--color-stroke-medium)' }}
    >
      <div
        className="w-full h-screen md:h-[95vh] max-w-[430px] overflow-hidden relative flex flex-col"
        style={{
          backgroundColor: 'var(--color-card)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        <Toast />
        <div className="flex-1 overflow-hidden relative">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { user, mode, isLoading } = useAuth();

  if (isLoading) return <PageSkeleton />;
  if (!user || !mode) return <Navigate to="/login" replace />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'MERCHANT' && allowedRoles.includes('CUSTOMER')) {
    } else {
       if (user.role === 'CUSTOMER') return <Navigate to="/" replace />;
       if (user.role === 'MERCHANT') return <Navigate to="/merchant" replace />;
       if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    }
  }

  return <Outlet />;
}

function CustomerLayout() {
  return (
    <>
      <Outlet />
      <BottomNav items={CUSTOMER_NAV} />
    </>
  );
}

function MerchantLayout() {
  return (
    <>
      <Outlet />
      <BottomNav items={MERCHANT_NAV} />
    </>
  );
}

function AdminLayout() {
  return (
    <>
      <Outlet />
      <BottomNav items={ADMIN_NAV} />
    </>
  );
}

function PublicRoute() {
  const { user, mode, isLoading } = useAuth();
  if (isLoading) return <PageSkeleton />;
  if (user && mode) {
    if (mode === 'CUSTOMER') return <Navigate to="/" replace />;
    if (mode === 'MERCHANT') return <Navigate to="/merchant" replace />;
    if (mode === 'ADMIN') return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['CUSTOMER']} />,
        children: [
          {
            element: <CustomerLayout />,
            children: [
              { path: '/', element: <CustomerHome /> },
              { path: '/explore', element: <Explore /> },
              { path: '/orders', element: <CustomerOrders /> },
              { path: '/profile', element: <CustomerProfile /> },
            ],
          },
          { path: '/orders/:id', element: <CustomerOrderDetail /> },
          { path: '/merchants/:id', element: <MerchantDetail /> },
          { path: '/checkout', element: <Checkout /> },
          { path: '/payment/:orderId', element: <PaymentPage /> },
          { path: '/review/:orderId', element: <WriteReview /> },
          { path: '/register-merchant', element: <RegisterMerchant /> },
          { path: '/edit-profile', element: <EditProfile /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['MERCHANT']} />,
        children: [
          {
            element: <MerchantLayout />,
            children: [
              { path: '/merchant', element: <MerchantDashboard /> },
              { path: '/merchant/orders', element: <MerchantOrders /> },
              { path: '/merchant/services', element: <MerchantServices /> },
              { path: '/merchant/profile', element: <MerchantProfile /> },
            ],
          },
          { path: '/merchant/orders/:id', element: <MerchantOrderDetail /> },
          { path: '/merchant/edit-profile', element: <EditMerchantProfile /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['ADMIN']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: '/admin', element: <AdminApplications /> },
              { path: '/admin/reports', element: <AdminReports /> },
              { path: '/admin/reviews', element: <AdminReviews /> },
              { path: '/admin/profile', element: <AdminProfile /> },
            ],
          },
          { path: '/admin/applications/:id', element: <AdminApplicationDetail /> },
          { path: '/admin/reports/:id', element: <AdminReportDetail /> },
        ],
      },
      { path: '*', element: <Navigate to="/login" replace /> },
    ],
  },
]);
