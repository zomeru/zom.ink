import React, { useState } from "react";
import Link from "next/link";

import { slugGenerator } from "@zomink/utilities";

import { FAQs } from "~/constants";

export const FAQ = () => {
  const [selectedFAQ, setSelectedFAQ] = useState<string | null>(null);

  const itemRefs = React.useMemo(() => {
    const refs: {
      [key: number]: React.RefObject<HTMLDivElement>;
    } = {};

    FAQs.forEach((_, i) => {
      refs[i] = React.createRef();
    });

    return refs;
  }, []);

  const onFAQClick = (faqId: string) => {
    if (selectedFAQ === faqId) {
      setSelectedFAQ(null);
    } else {
      setSelectedFAQ(() => faqId);
    }
  };

  return (
    <section className="padding-sides my-[60px] sm:my-[80px]">
      <div className="max-width max-w-[1200px] ">
        <h2 className="sc-heading mb-[20px]">Frequently Asked Questions</h2>

        {FAQs.map(({ id, question, answer }, i) => (
          <div key={id} className="text-primary-500">
            <div
              onClick={() => onFAQClick(id)}
              onKeyDown={() => onFAQClick(id)}
              tabIndex={i}
              role="button"
              className={`flex w-full cursor-pointer items-center justify-between border-b border-neutral-300 px-[20px] py-[20px] transition-all duration-300 ease-in-out hover:bg-neutral-300 sm:px-[80px] ${
                selectedFAQ === id && "bg-neutral-300"
              }`}
            >
              <h2 className="w-[90%] text-base font-semibold sm:w-full sm:text-lg">
                {question}
              </h2>
              <div
                className={`text-primary-500 inline-block origin-center text-center text-[30px] leading-[24px] transition-all duration-700 ease-in-out before:content-["+"] sm:text-[40px] ${
                  selectedFAQ === id && "rotate-[134deg]"
                }`}
              />
            </div>
            <div
              ref={itemRefs[i]}
              style={{
                maxHeight:
                  selectedFAQ === id
                    ? `calc(${itemRefs[i]?.current?.scrollHeight}px + 40px)`
                    : `0`,
              }}
              className={`relative space-y-3 overflow-hidden px-[20px] transition-all duration-500 ease-in-out sm:px-[80px] ${
                selectedFAQ === id ? "py-[20px]" : "py-0"
              }`}
            >
              {answer.map(({ text, coloredText, link }) => {
                if (!coloredText) {
                  return (
                    <p
                      key={slugGenerator()}
                      className="text-infoText text-sm sm:text-base"
                    >
                      {text}
                    </p>
                  );
                }

                const newText: string[] = text.split(coloredText);
                const texts: string[] = [
                  newText[0] ?? "",
                  coloredText,
                  newText[1] ?? "",
                ];

                return (
                  <p key={slugGenerator()} className="text-infoText">
                    {texts.map((txt, tIndex) => {
                      if (link && tIndex === 1) {
                        return (
                          <Link
                            key={slugGenerator()}
                            href={link}
                            className="text-primary-200 text-sm sm:text-base"
                          >
                            {txt}
                          </Link>
                        );
                      }

                      return (
                        <span
                          className={`text-sm sm:text-base ${
                            tIndex === 1 && "text-primary-200"
                          }`}
                          key={slugGenerator()}
                        >
                          {txt}
                        </span>
                      );
                    })}
                  </p>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
