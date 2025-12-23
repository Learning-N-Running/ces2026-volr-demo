interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-[20%] right-[30%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 bg-white rounded-3xl shadow-modal border border-slate-200 p-12 max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="font-special-gothic text-5xl font-medium mb-3 tracking-[0.1875rem] bg-gradient-to-br from-blue-900 to-blue-600 bg-clip-text text-transparent">
            Volr Shop
          </h1>
          <p className="text-slate-500 text-lg">Shop with Crypto</p>
        </div>

        <div className="mb-8">
          <svg
            className="w-24 h-24 mx-auto text-blue-900 opacity-80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 mb-8">
          Connect your wallet to start shopping
        </p>

        <button
          onClick={onLogin}
          className="w-full bg-gradient-to-br from-blue-900 to-blue-500 text-white border-0 py-4 px-8 text-lg font-bold rounded-2xl cursor-pointer transition-all duration-300 tracking-wide shadow-[0_8px_20px_rgba(30,58,138,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(30,58,138,0.4)] active:translate-y-0"
        >
          Connect Wallet
        </button>

        <p className="text-xs text-slate-400 mt-6">
          Secure authentication powered by Volr
        </p>
      </div>
    </div>
  );
}
