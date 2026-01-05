interface PayWithVolrButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export default function PayWithVolrButton({
  onClick,
  isLoading = false,
}: PayWithVolrButtonProps) {
  return (
    <button
      className="bg-gradient-to-br from-blue-900 to-blue-500 text-white border-0 py-5 px-8 text-lg font-bold rounded-2xl cursor-pointer w-full transition-all duration-300 tracking-wide shadow-[0_8px_20px_rgba(30,58,138,0.3)] flex items-center justify-center gap-3 mb-6 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(30,58,138,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform duration-300 hover:scale-110"
          >
            <path
              d="M17.5 8.33334V6.66668C17.5 5.78262 17.5 5.34059 17.3183 5.00803C17.1586 4.71596 16.9107 4.46799 16.6186 4.30833C16.286 4.12668 15.844 4.12668 14.96 4.12668H5.04C4.15595 4.12668 3.71392 4.12668 3.38136 4.30833C3.08929 4.46799 2.84133 4.71596 2.68166 5.00803C2.5 5.34059 2.5 5.78262 2.5 6.66668V13.3333C2.5 14.2174 2.5 14.6594 2.68166 14.992C2.84133 15.284 3.08929 15.532 3.38136 15.6917C3.71392 15.8733 4.15595 15.8733 5.04 15.8733H8.33333M14.1667 17.5L15.8333 15.8333L14.1667 14.1667M15 11.6667C15 13.5076 13.5076 15 11.6667 15H10.8333M11.6667 8.33334H5M7.5 11.6667H5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Pay with Crypto</span>
        </>
      )}
    </button>
  );
}
