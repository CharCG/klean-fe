import axios from "axios";
import type {
  ApiResponse,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  User,
  Merchant,
  CreateOrderPayload,
  Order,
  Service,
  Review,
  Report,
  Application,
  MerchantDashboard,
} from "../types";

const http = axios.create({ baseURL: import.meta.env.VITE_API_URL });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export const login = (data: LoginPayload) =>
  http
    .post<ApiResponse<LoginResponse>>("/auth/login", data)
    .then((r) => r.data.data!);

export const register = (data: RegisterPayload) =>
  http
    .post<ApiResponse<User>>("/auth/register", data)
    .then((r) => r.data.data!);

export const getProfile = () =>
  http.get<ApiResponse<User>>("/users/profile").then((r) => r.data.data!);

export const updateProfile = (
  data: Partial<Pick<User, "name" | "phone" | "address">>,
) =>
  http.put<ApiResponse<User>>("/users/profile", data).then((r) => r.data.data!);

export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
}) =>
  http
    .patch<ApiResponse<void>>("/users/profile/password", data)
    .then((r) => r.data);

export const getMerchants = () =>
  http
    .get<ApiResponse<{ merchants: Merchant[] }>>("/merchants")
    .then((r) => r.data.data!);

export const getMerchantById = (id: string) =>
  http.get<ApiResponse<Merchant>>(`/merchants/${id}`).then((r) => r.data.data!);

export const createOrder = (data: CreateOrderPayload) =>
  http
    .post<
      ApiResponse<{
        order: Order;
        payment: { snapToken: string; snapRedirectUrl: string };
      }>
    >("/orders", data)
    .then((r) => r.data.data!);

export const getCustomerOrders = () =>
  http.get<ApiResponse<Order[]>>("/orders/mine").then((r) => r.data.data!);

export const getOrderById = (id: string) =>
  http.get<ApiResponse<Order>>(`/orders/${id}`).then((r) => r.data.data!);

export const confirmOrderReceived = (orderId: string) =>
  http
    .patch<ApiResponse<Order>>(`/orders/${orderId}/confirm`)
    .then((r) => r.data.data!);


export const createReview = (
  orderId: string,
  data: { rating: number; comment: string },
) =>
  http
    .post<ApiResponse<Review>>(`/orders/${orderId}/reviews`, data)
    .then((r) => r.data.data!);

export const createReport = (orderId: string, data: { issue: string }) =>
  http
    .post<ApiResponse<Report>>(`/orders/${orderId}/reports`, data)
    .then((r) => r.data.data!);

export const submitApplication = (
  data: Omit<
    Application,
    "id" | "status" | "userId" | "user" | "createdAt" | "updatedAt"
  >,
) =>
  http
    .post<ApiResponse<Application>>("/applications", data)
    .then((r) => r.data.data!);

export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return http
    .post<ApiResponse<{ url: string }>>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data.data!.url);
};

export const verifyPayment = (orderId: string) =>
  http
    .post<ApiResponse<{ status: string }>>(`/payments/verify/${orderId}`)
    .then((r) => r.data.data!);

export const getMerchantDashboard = () =>
  http
    .get<ApiResponse<MerchantDashboard>>("/merchants/me/dashboard")
    .then((r) => r.data.data!);

export const getMerchantProfile = () =>
  http.get<ApiResponse<Merchant>>("/merchants/me").then((r) => r.data.data!);

export const updateMerchantProfile = (data: Partial<Merchant>) =>
  http
    .put<ApiResponse<Merchant>>("/merchants/me", data)
    .then((r) => r.data.data!);

export const getMerchantOrders = (status?: string) =>
  http
    .get<
      ApiResponse<Order[]>
    >("/orders/merchant", { params: status ? { status } : undefined })
    .then((r) => r.data.data!);

export const updateOrderStatus = (orderId: string, status: string) =>
  http
    .patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status })
    .then((r) => r.data.data!);

export const updateOrderEta = (orderId: string, estimationTime: string) =>
  http
    .patch<ApiResponse<Order>>(`/orders/${orderId}/eta`, { estimationTime })
    .then((r) => r.data.data!);

export const getMerchantServices = () =>
  http.get<ApiResponse<Service[]>>("/services").then((r) => r.data.data!);

export const createService = (data: Omit<Service, "id" | "isAvailable">) =>
  http.post<ApiResponse<Service>>("/services", data).then((r) => r.data.data!);

export const updateService = (id: string, data: Partial<Service>) =>
  http
    .put<ApiResponse<Service>>(`/services/${id}`, data)
    .then((r) => r.data.data!);

export const deleteService = (id: string) =>
  http.delete<ApiResponse<void>>(`/services/${id}`).then((r) => r.data);

export const getApplications = () =>
  http
    .get<ApiResponse<Application[]>>("/applications")
    .then((r) => r.data.data!);

export const getApplicationById = (id: string) =>
  http
    .get<ApiResponse<Application>>(`/applications/${id}`)
    .then((r) => r.data.data!);

export const decideApplication = (
  id: string,
  status: "ACCEPTED" | "REJECTED",
) =>
  http
    .patch<ApiResponse<Application>>(`/applications/${id}`, { status })
    .then((r) => r.data.data!);

export const getReports = () =>
  http.get<ApiResponse<Report[]>>("/reports").then((r) => r.data.data!);

export const resolveReport = (id: string) =>
  http
    .patch<ApiResponse<Report>>(`/reports/${id}`, { status: "RESOLVED" })
    .then((r) => r.data.data!);

export const getReviews = () =>
  http.get<ApiResponse<Review[]>>("/reviews").then((r) => r.data.data!);

export const deleteReview = (id: string) =>
  http.delete<ApiResponse<void>>(`/reviews/${id}`).then((r) => r.data);
