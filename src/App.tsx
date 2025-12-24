import { useState, useEffect } from "react";
import PayWithVolrButton from "./components/PayWithVolrButton";
import LoginScreen from "./components/LoginScreen";
import PaymentHistoryModal from "./components/PaymentHistoryModal";
import { useVolrModal, useVolr, useVolrPay, useI18n } from "@volr/react-ui";
import whiteKeyringImg from "./assets/volr-keyring-white-1.jpeg";
import blackKeyringImg from "./assets/volr-keyring-black-1.jpeg";
import whiteKeyringZoomImg from "./assets/volr-keyring-white-zoom.jpeg";
import blackKeyringZoomImg from "./assets/volr-keyring-black-zoom.jpeg";

interface Product {
  id: number;
  name: string;
  color: string;
  colorHex: string;
  price: number;
  description: string;
  image: string;
  zoomImage: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "White Keyring",
    color: "White",
    colorHex: "#FFFFFF",
    price: 1,
    description: "Minimalist elegance in every detail",
    image: whiteKeyringImg,
    zoomImage: whiteKeyringZoomImg,
  },
  {
    id: 2,
    name: "Black Keyring",
    color: "Black",
    colorHex: "#000000",
    price: 1,
    description: "Bold statement, timeless style",
    image: blackKeyringImg,
    zoomImage: blackKeyringZoomImg,
  },
];

function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { open } = useVolrModal();
  const { isLoggedIn, logout } = useVolr();
  const { setLocale } = useI18n();

  const { pay } = useVolrPay();

  // SDK 언어를 영어로 설정
  useEffect(() => {
    setLocale("en");
  }, [setLocale]);

  const handleLogin = () => {
    open();
  };

  const handleLogout = () => {
    logout();
  };

  // 로그인하지 않은 경우 로그인 화면 표시
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const handleMyAccount = () => {
    open();
  };

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (!selectedProduct) return;

    setIsProcessing(true);
    try {
      const payment = await pay({
        amount: selectedProduct.price,
        item: {
          name: selectedProduct.name,
          description: selectedProduct.description,
          image: selectedProduct.zoomImage,
        },
        metadata: {
          item_name: selectedProduct.name,
          item_description: selectedProduct.description,
          product_id: selectedProduct.id.toString(),
          color: selectedProduct.color,
        },
        handlers: {
          onSuccess: (result) => {
            console.log("Payment confirmed!", result.txHash);
            setIsProcessing(false);
            // 결제 성공 후 모달 닫기
            handleCloseModal();
            // 여기에 성공 메시지나 다른 액션 추가 가능
          },
          onError: (error) => {
            console.error("Payment failed:", error.message);
            setIsProcessing(false);
            // 에러 처리 로직 추가 가능
          },
        },
      });

      // 선택사항: 결제 확인 대기
      const result = await payment.wait();
      console.log("Payment result:", result);
    } catch (error) {
      console.error("Error initiating payment:", error);
      setIsProcessing(false);
    }
  };

  const handleCloseModal = () => {
    setShowPayment(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden">
        {/* Simple Background Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Hero Section */}
        <div className="relative z-10 pt-12 md:pt-20 pb-6 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-special-gothic text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Volr Shop
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-blue-100/80 tracking-wide mb-6 md:mb-12">
              Shop with Cryptocurrency
            </p>

            {/* Navigation Buttons - Below Title */}
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button
                onClick={handleMyAccount}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="hidden sm:inline">Account</span>
              </button>

              <button
                onClick={() => setShowHistory(true)}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                <span className="hidden sm:inline">Orders</span>
              </button>

              <button
                onClick={handleLogout}
                className="group bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400/40 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 md:py-16 pb-12 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl text-slate-900 mb-2 md:mb-3 font-bold tracking-tight">
              Keyring Collection
            </h2>
            <p className="text-base md:text-lg text-slate-500 font-normal tracking-wide">
              Choose your style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-product transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] border border-slate-200 relative hover:-translate-y-3 hover:shadow-product-hover hover:border-blue-500"
              >
                <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-blue-900 text-white py-1 px-2.5 md:py-1.5 md:px-3.5 rounded-[1.25rem] text-xs font-semibold tracking-wider uppercase z-10 shadow-md">
                  New
                </div>
                <div className="py-6 px-4 md:py-12 md:px-8 flex items-center justify-center relative bg-slate-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto max-h-[16rem] md:max-h-[24rem] object-contain rounded-xl md:rounded-2xl shadow-lg"
                  />
                </div>
                <div className="p-5 md:p-8">
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <h3 className="text-xl md:text-2xl text-slate-900 font-bold tracking-tight">
                      {product.name}
                    </h3>
                    <span
                      className="w-5 h-5 md:w-6 md:h-6 rounded-full shadow-md flex-shrink-0"
                      style={{
                        backgroundColor: product.colorHex,
                        border:
                          product.color === "White"
                            ? "1px solid #e5e7eb"
                            : "none",
                      }}
                    ></span>
                  </div>
                  <p className="text-slate-500 mb-5 md:mb-7 text-sm md:text-[0.9375rem] leading-relaxed">
                    {product.description}
                  </p>
                  <div className="flex items-end justify-between gap-3 md:gap-4 flex-col sm:flex-row">
                    <div className="flex flex-col gap-1 w-full sm:w-auto">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                        Price
                      </span>
                      <span className="text-2xl md:text-[1.75rem] text-blue-900 font-extrabold tracking-tight">
                        ${product.price}.00 USD
                      </span>
                    </div>
                    <button
                      className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-0 py-3 md:py-3.5 px-6 md:px-7 text-sm md:text-[0.9375rem] font-semibold rounded-xl cursor-pointer transition-all duration-300 flex items-center gap-2 tracking-wide shadow-md whitespace-nowrap hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(30,58,138,0.3)] hover:from-blue-800 hover:to-blue-500 active:translate-y-0 w-full sm:w-auto justify-center"
                      onClick={() => handleBuyClick(product)}
                    >
                      <span>Add to Cart</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          d="M6 12L10 8L6 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      {showPayment && selectedProduct && (
        <div
          className="fixed inset-0 bg-slate-900/75 backdrop-blur-lg flex items-center justify-center z-[1000] p-4 animate-fade-in"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-2xl md:rounded-[2rem] max-w-[35rem] w-full relative animate-slide-up shadow-modal border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-slate-100 border-0 text-2xl text-slate-600 cursor-pointer w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 z-10 hover:bg-slate-200 hover:text-slate-900 hover:rotate-90"
              onClick={handleCloseModal}
            >
              ×
            </button>

            <div className="pt-12 px-5 md:px-10 pb-6 md:pb-10">
              <div className="mb-6 md:mb-8 pr-8 md:pr-8">
                <h2 className="text-2xl md:text-3xl text-slate-900 mb-2 font-bold tracking-tight">
                  Checkout
                </h2>
                <p className="text-sm md:text-[0.9375rem] text-slate-500 font-normal">
                  Pay securely with crypto
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl md:rounded-[1.25rem] p-5 md:p-8 mb-6 md:mb-8 border border-slate-200">
                <div className="flex items-start md:items-center gap-3 md:gap-5 flex-col sm:flex-row">
                  <img
                    src={selectedProduct.zoomImage}
                    alt={selectedProduct.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg md:rounded-xl flex-shrink-0 shadow-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-base md:text-lg mb-1 tracking-tight">
                      {selectedProduct.name}
                    </p>
                    <p className="text-slate-500 text-xs md:text-sm">
                      {selectedProduct.description}
                    </p>
                  </div>
                  <p className="text-xl md:text-2xl font-extrabold text-blue-900 flex-shrink-0 tracking-tight">
                    ${selectedProduct.price}.00 USD
                  </p>
                </div>
              </div>

              <PayWithVolrButton
                onClick={handlePayment}
                isLoading={isProcessing}
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      <PaymentHistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 text-white mt-auto border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-5 md:py-6">
          <div className="text-center text-xs md:text-sm">
            <p className="font-semibold text-slate-300">© 2026 Volr Shop</p>
            <p className="text-slate-500 text-xs mt-1">CES 2026 Demo</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
