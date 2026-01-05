import { useEffect, useState, useCallback } from "react";
import { useVolrPay } from "@volr/react-ui";
import type { PaymentResult } from "@volr/react-ui";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentHistoryModal({
  isOpen,
  onClose,
}: PaymentHistoryModalProps) {
  const { getPaymentHistory } = useVolrPay();
  const [payments, setPayments] = useState<PaymentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPaymentHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getPaymentHistory();
      setPayments(result.payments);
      console.log("Payment history:", result.payments);
    } catch (err) {
      setError("Failed to load purchase history");
      console.error("Error loading payment history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [getPaymentHistory]);

  useEffect(() => {
    if (isOpen) {
      loadPaymentHistory();
    }
  }, [isOpen, loadPaymentHistory]);

  const formatAmount = (amount: number | string, decimals: number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    const value = numAmount / Math.pow(10, decimals);
    return value.toFixed(2);
  };

  const formatLATime = (dateString: string | null | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      failed: "bg-red-100 text-red-700 border-red-200",
      cancelled: "bg-slate-100 text-slate-700 border-slate-200",
    };

    const color =
      statusColors[status as keyof typeof statusColors] || statusColors.pending;

    return (
      <span
        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${color} capitalize`}
      >
        {status}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900/75 backdrop-blur-lg flex items-center justify-center z-[1000] p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl md:rounded-[2rem] max-w-4xl w-full relative animate-slide-up shadow-modal border border-slate-200 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 md:px-8 py-5 md:py-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl text-slate-900 font-bold tracking-tight">
                Purchase History
              </h2>
              <p className="text-slate-500 mt-1 text-sm md:text-base">
                View all your past transactions
              </p>
            </div>
            <button
              className="bg-slate-100 border-0 text-slate-600 cursor-pointer w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-slate-200 hover:text-slate-900 hover:rotate-90 flex-shrink-0"
              onClick={onClose}
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 md:py-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500">Loading your purchases...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg
                className="w-16 h-16 text-red-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-slate-900 font-semibold mb-2">{error}</p>
              <button
                onClick={loadPaymentHistory}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Try again
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg
                className="w-20 h-20 text-slate-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No purchases yet
              </h3>
              <p className="text-slate-500">
                Your purchase history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* Product Image */}
                    {payment.itemImage && (
                      <img
                        src={payment.itemImage}
                        alt={payment.itemName || "Product"}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl flex-shrink-0 shadow-lg"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-slate-900">
                              {payment.itemName}
                            </h3>
                            {getStatusBadge(payment.status)}
                          </div>
                          {payment.itemDescription && (
                            <p className="text-sm text-slate-600 mb-3">
                              {payment.itemDescription}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{formatLATime(payment.confirmedAt)}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xl md:text-2xl font-extrabold text-blue-900">
                            $
                            {formatAmount(
                              payment.amount,
                              payment.token.decimals
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {payment.token.symbol}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  {payment.txHash && (
                    <div className="pt-4 border-t border-slate-200">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Transaction:</span>
                        <a
                          href={`https://sepolia.basescan.org/tx/${payment.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-mono text-xs flex items-center gap-1"
                        >
                          {payment.txHash.slice(0, 6)}...
                          {payment.txHash.slice(-4)}
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
