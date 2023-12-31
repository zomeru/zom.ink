import React from "react";
import { useRouter } from "next/navigation";

export const Banner = () => {
  const router = useRouter();

  return (
    <section className="padding-sides bg-primary-200 my-[60px] w-full sm:my-[80px]">
      <div className="max-width space-y-5 py-[40px] sm:py-[50px]">
        <h2 className="sc-heading text-white">
          More than just a free link shortener
        </h2>
        <div className="flex justify-center">
          <button
            type="button"
            className="btn-white-lg"
            onClick={() => router.push("/auth/signup")}
          >
            Sign up for free
          </button>
        </div>
      </div>
    </section>
  );
};
