import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F4FF] px-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-white px-8 py-10 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mb-2 text-4xl font-bold text-[#8B7CF6]">Pposong</div>

          <p className="text-sm text-gray-400">일상을 공유하는 작은 공간</p>
        </div>

        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
