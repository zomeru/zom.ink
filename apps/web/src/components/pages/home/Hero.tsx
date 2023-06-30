import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { APP_DESCRIPTION, APP_NAME } from "~/constants";
import { smoothScroll } from "~/utils";

export const Hero = () => {
  const router = useRouter();

  return (
    <section className="padding-sides mt-0 2xl:mt-[35px]">
      <div className="max-width h-auto">
        {/* des & img */}
        <div className="relative flex h-[350px] items-center justify-between sm:h-[400px] xl:h-[500px] ">
          <div className="text-primary-500 space-y-3 sm:space-y-5 xl:space-y-8">
            <h1 className="text-lg sm:text-xl">Link Shortener</h1>
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl 2xl:text-6xl">
              Manage your links in an easy way.
            </h2>
            <h3 className="text-infoText text-sm sm:text-base">
              {APP_DESCRIPTION}
            </h3>
            <div className="flex max-w-[250px] flex-col space-y-3 sm:max-w-full sm:flex-row sm:space-x-3 sm:space-y-0">
              <button
                type="button"
                className="btn-primary-lg"
                onClick={() => router.push("/auth/signup")}
              >
                Get started
              </button>

              <Link
                type="button"
                href="#features"
                className="btn-secondary-lg"
                onClick={smoothScroll}
              >
                Explore features
              </Link>
            </div>
          </div>
          <div className="relative hidden h-full w-full md:block">
            <Image
              className="object-contain"
              placeholder="blur"
              src="/assets/images/hero_image.png"
              fill
              alt={`${APP_NAME} - Hero Analytics Image`}
              blurDataURL="/assets/images/hero_image.png"
              quality={50}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
