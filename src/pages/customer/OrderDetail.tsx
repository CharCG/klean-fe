import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../../services/api";
import TopBar from "../../components/common/TopBar";
import Button from "../../components/common/Button";
import OrderStatusBadge from "../../components/common/OrderStatusBadge";
import ErrorState from "../../components/common/ErrorState";
import PageSkeleton from "../../components/common/PageSkeleton";
import StepTimeline from "../../components/common/StepTimeline";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatOrderId } from "../../utils/formatId";
import { formatDate } from "../../utils/formatDate";
import { useToast } from "../../context/ToastContext";
import {
  AlertTriangle,
  Star,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock4,
  Package,
  Clock,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import axios from "axios";

export default function CustomerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [showReportForm, setShowReportForm] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => api.getOrderById(id!),
    enabled: !!id,
  });

  const reportMutation = useMutation({
    mutationFn: (issue: string) => api.createReport(id!, { issue }),
    onSuccess: () => {
      showToast("Report submitted successfully", "success");
      setShowReportForm(false);
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    },
    onError: (err) => {
      showToast(
        axios.isAxiosError(err) ? (err.response?.data?.message ?? "Failed to submit report") : "Something went wrong",
        "error",
      );
    },
  });

  const confirmMutation = useMutation({
    mutationFn: () => api.confirmOrderReceived(id!),
    onSuccess: () => {
      showToast("Order marked as completed! Thank you.", "success");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["customerOrders"] });
    },
    onError: (err) => {
      showToast(
        axios.isAxiosError(err) ? (err.response?.data?.message ?? "Failed to confirm") : "Something went wrong",
        "error",
      );
    },
  });

  const handleReport = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const issue = new FormData(e.currentTarget).get("issue") as string;
    if (issue.trim()) reportMutation.mutate(issue);
  };

  if (isLoading) return <PageSkeleton />;
  if (isError || !order) return <ErrorState onRetry={refetch} />;

  const paymentStatus = order.payment && "status" in order.payment ? order.payment.status : undefined;
  const snapToken = order.payment && "snapToken" in order.payment ? order.payment.snapToken : undefined;

  const handlePay = () => {
    if (!snapToken || !window.snap) return;
    setIsPaying(true);
    const historyLengthBefore = window.history.length;

    const clearSnapHistory = (callback: () => void) => {
      const snapEntries = window.history.length - historyLengthBefore;
      if (snapEntries > 0) {
        window.history.go(-snapEntries);
        setTimeout(callback, 100);
      } else {
        callback();
      }
    };

    window.snap.pay(snapToken, {
      onSuccess: async () => {
        try {
          await api.verifyPayment(id!);
          queryClient.invalidateQueries({ queryKey: ["order", id] });
          queryClient.invalidateQueries({ queryKey: ["customerOrders"] });
          showToast("Payment successful!", "success");
        } finally {
          setIsPaying(false);
          clearSnapHistory(() => navigate(`/orders/${id}`, { replace: true }));
        }
      },
      onPending: async () => {
        try {
          await api.verifyPayment(id!);
          queryClient.invalidateQueries({ queryKey: ["order", id] });
        } finally {
          setIsPaying(false);
          clearSnapHistory(() => navigate(`/orders/${id}`, { replace: true }));
        }
      },
      onError: () => {
        showToast("Payment failed. Please try again.", "error");
        setIsPaying(false);
      },
      onClose: () => {
        setIsPaying(false);
      },
    });
  };

  const orderSteps = [
    { status: "CREATED", label: "Order Created", icon: <Package size={16} /> },
    { status: "PROCESSING", label: "Processing", icon: <Clock size={16} /> },
    { status: "FINISHED", label: "Ready/Delivering", icon: <Truck size={16} /> },
    { status: "COMPLETED", label: "Completed", icon: <CheckCircle size={16} /> },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: "var(--color-bg)" }}>
      <TopBar title="Order Details" showBack onBack={() => navigate('/orders', { replace: true })} />
      <div className="p-6 space-y-5">
        {/* Payment Success Banner */}
        {paymentStatus === "PAID" && (
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, var(--color-success-light) 0%, rgba(34,197,94,0.05) 100%)",
              border: "1px solid var(--color-success)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--color-success)", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}
            >
              <CheckCircle2 size={20} color="var(--color-card)" />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--color-success)" }}>
                Payment Successful
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                Your order is confirmed and being processed by the merchant.
              </p>
            </div>
          </div>
        )}

        {/* Awaiting Payment Notice */}
        {paymentStatus === "PENDING" && !snapToken && (
          <div
            className="rounded-xl p-4 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(234,179,8,0.08) 0%, rgba(234,179,8,0.02) 100%)",
              border: "1px solid rgba(234,179,8,0.5)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(234,179,8,0.15)" }}
            >
              <Clock4 size={20} style={{ color: "var(--color-warning)" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--color-warning)" }}>
                Awaiting Payment
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                Payment is pending. Please complete your payment.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div
          className="rounded-xl p-5 flex items-center justify-between"
          style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
        >
          <div>
            <span className="text-xs font-medium" style={{ color: "var(--color-text-tertiary)" }}>
              {formatOrderId(order.id)}
            </span>
            <h2 className="font-semibold text-lg mt-1" style={{ color: "var(--color-text)" }}>
              {order.merchant?.name || "Merchant"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
              {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Pay Now Button */}
        {paymentStatus === "PENDING" && snapToken && (
          <button
            onClick={handlePay}
            disabled={isPaying}
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer disabled:opacity-70 text-white"
            style={{
              backgroundColor: "var(--color-primary)",
              boxShadow: isPaying ? "none" : "0 4px 12px rgba(var(--color-primary-rgb),0.35)",
              border: "none",
            }}
          >
            <CreditCard size={16} />
            {isPaying ? "Opening payment..." : "Pay Now"}
          </button>
        )}

        {/* Items */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
        >
          <h3
            className="font-semibold text-sm mb-3 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-stroke)" }}
          >
            Order Items
          </h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span style={{ color: "var(--color-text)" }}>
                  {item.quantity}x {item.name}
                </span>
                <span className="font-medium" style={{ color: "var(--color-text)" }}>
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
            {order.fulfillment === "DELIVERY" && (
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--color-text-secondary)" }}>Delivery Fee</span>
                <span className="font-medium" style={{ color: "var(--color-text)" }}>
                  {formatCurrency(15000)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-3 mt-2" style={{ borderTop: "1px solid var(--color-stroke)" }}>
              <span className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                Total
              </span>
              <span className="font-semibold text-sm" style={{ color: "var(--color-primary)" }}>
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {["CREATED", "PROCESSING", "FINISHED", "COMPLETED"].includes(order.status) && (
          <StepTimeline currentStatus={order.status} steps={orderSteps} />
        )}

        {/* Delivery Info */}
        <div
          className="rounded-xl p-5 space-y-2 text-sm"
          style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
        >
          <h3
            className="font-semibold text-sm mb-3 pb-2"
            style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-stroke)" }}
          >
            Delivery Info
          </h3>
          <p>
            <span style={{ color: "var(--color-text-secondary)" }}>Fulfillment:</span>{" "}
            <span className="font-medium" style={{ color: "var(--color-text)" }}>
              {order.fulfillment}
            </span>
          </p>
          <p>
            <span style={{ color: "var(--color-text-secondary)" }}>ETA:</span>{" "}
            <span className="font-medium" style={{ color: "var(--color-text)" }}>
              {order.estimationTime}
            </span>
          </p>
          {order.notes && (
            <p>
              <span style={{ color: "var(--color-text-secondary)" }}>Notes:</span>{" "}
              <span className="font-medium" style={{ color: "var(--color-text)" }}>
                {order.notes}
              </span>
            </p>
          )}
        </div>

        {/* Order Received — customer confirms delivery before COMPLETED */}
        {order.status === "FINISHED" && (
          <div
            className="rounded-xl p-4"
            style={{
              background: "linear-gradient(135deg, var(--color-warning-light) 0%, rgba(245,158,11,0.03) 100%)",
              border: "1px solid var(--color-warning)",
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-warning)" }}>
              Your order is ready / on its way!
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--color-text-secondary)" }}>
              Once you receive your laundry, press the button below to mark it as completed.
            </p>
            <Button
              onClick={() => confirmMutation.mutate()}
              isLoading={confirmMutation.isPending}
              variant="primary"
              fullWidth
              className="!bg-warning !border-warning"
              style={{ backgroundColor: "var(--color-warning)", boxShadow: "0 4px 12px rgba(245,158,11,0.35)" }}
            >
              <CheckCircle2 size={16} className="mr-2" />
              Order Received
            </Button>
          </div>
        )}

        {/* Review */}
        {order.status === "COMPLETED" && !order.review && (
          <Button onClick={() => navigate(`/review/${id}`)} variant="secondary" fullWidth>
            <Star size={16} className="mr-2" /> Write Review
          </Button>
        )}

        {order.review && (
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
          >
            <h3
              className="font-semibold text-sm mb-3 pb-2"
              style={{ color: "var(--color-text)", borderBottom: "1px solid var(--color-stroke)" }}
            >
              Your Review
            </h3>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={16}
                  className={s <= order.review!.rating ? "fill-yellow-500 text-yellow-500" : ""}
                  style={{ color: s > order.review!.rating ? "var(--color-stroke-medium)" : undefined }}
                />
              ))}
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              "{order.review.comment}"
            </p>
          </div>
        )}

        {/* Report */}
        {order.status === "COMPLETED" && !order.report && !showReportForm && (
          <Button
            onClick={() => setShowReportForm(true)}
            variant="outline"
            fullWidth
            className="!text-danger !border-danger/30 hover:!bg-danger/5"
          >
            <AlertTriangle size={16} /> Report Issue
          </Button>
        )}

        {showReportForm && (
          <form
            onSubmit={handleReport}
            className="rounded-xl p-5 space-y-4"
            style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
          >
            <h3 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
              Describe the issue
            </h3>
            <textarea
              name="issue"
              required
              rows={4}
              className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-stroke)",
                color: "var(--color-text)",
              }}
              placeholder="Tell us what happened..."
            />
            <div className="flex gap-3">
              <Button type="button" onClick={() => setShowReportForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button type="submit" isLoading={reportMutation.isPending} variant="danger" className="flex-1">
                Submit
              </Button>
            </div>
          </form>
        )}

        {order.report && (
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-stroke)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} style={{ color: "var(--color-danger)" }} />
              <h3 className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                Reported Issue
              </h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              {order.report.issue}
            </p>
            <span
              className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase mt-2 inline-block"
              style={{
                backgroundColor:
                  order.report.status === "OPEN" ? "var(--color-danger-light)" : "var(--color-success-light)",
                color: order.report.status === "OPEN" ? "var(--color-danger)" : "var(--color-success)",
                border: `1px solid ${order.report.status === "OPEN" ? "var(--color-danger)" : "var(--color-success)"}`,
              }}
            >
              {order.report.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
