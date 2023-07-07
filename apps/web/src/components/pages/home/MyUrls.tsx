import React from "react";
import moment from "moment";
import { AiOutlineClose } from "react-icons/ai";
import { FaRegCopy } from "react-icons/fa";
import Sheet from "react-modal-sheet";
import QRCode from "react-qr-code";

import { removeUrlPrefix } from "@zomink/utilities";

import { useUserUrls } from "~/contexts";
import { copyToClipboard, downloadQRCode } from "~/utils";

interface MyUrlsProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MyUrls = ({ isOpen, setOpen }: MyUrlsProps) => {
  const { urls } = useUserUrls();

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <Sheet.Scroller>
            <div className="flex w-screen flex-col items-center justify-center">
              <div className="relative w-full text-center ">
                <div />
                <h1 className="text-primary-500 text-xl font-semibold sm:text-2xl">
                  Your recent URLs
                </h1>
                <button
                  className="fixed right-[40px] top-[60px] rounded-full border border-neutral-400 bg-white p-2"
                  aria-label="Close button"
                  onClick={onClose}
                >
                  <AiOutlineClose className="h-7 w-7 text-neutral-500" />
                </button>
              </div>
              <div className="w-full space-y-3 px-8 py-5 sm:w-auto">
                {urls.data?.length ? (
                  <>
                    {urls.data?.map((url) => {
                      const momentAgo = moment(url.createdAt).fromNow();
                      const shortUrl = `${process.env.NEXT_PUBLIC_URL}/${url.slug}`;

                      return (
                        <div
                          key={url.id}
                          className="flex flex-col justify-between space-x-0 rounded-md border border-neutral-300 p-4 sm:flex-row sm:space-x-3"
                        >
                          <div className="flex flex-col items-start justify-between overflow-hidden">
                            <div className="flex flex-col items-start">
                              <span className="font-medium">
                                {removeUrlPrefix(shortUrl)}
                              </span>
                              <span className="text-primary-100 w-full truncate text-ellipsis text-sm sm:w-[500px]">
                                {url.url}
                              </span>
                              <span className="text-sm text-neutral-400">
                                Clicks: {url.clickCount}
                              </span>
                              <span className="text-sm text-neutral-400">
                                {momentAgo}
                              </span>
                            </div>

                            <button
                              className="bg-primary-100 mt-1 flex items-center space-x-1 rounded-sm px-2 py-1 text-sm text-white"
                              onClick={() => {
                                copyToClipboard(shortUrl);
                              }}
                            >
                              <FaRegCopy className="h-4 w-4" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <div className="flex w-min flex-row items-end justify-between space-x-2 sm:flex-col sm:items-start sm:space-x-0">
                            <div className="mt-2 w-[70px] p-0 sm:mt-0 sm:w-full sm:p-2">
                              <QRCode
                                id={`qr-code-${url.id}`}
                                value={shortUrl}
                                style={{
                                  background: "white",
                                  height: "100%",
                                  width: "100%",
                                }}
                              />
                            </div>
                            <button
                              className="bg-primary-100 mt-1 flex h-min items-center space-x-1 rounded-sm px-2 py-1 text-sm text-white sm:h-auto"
                              onClick={() => {
                                downloadQRCode(`qr-code-${url.id}`);
                              }}
                            >
                              <FaRegCopy className="h-4 w-4" />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p className="text-infoText text-center">
                    You have not created any URLs yet.
                  </p>
                )}
              </div>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
};
