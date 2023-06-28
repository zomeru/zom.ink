import React, { useRef } from "react";

import { api } from "~/utils/api";
import { Layout } from "~/components";

const Home = () => {
  const utils = api.useContext();
  const url = api.url.create.useMutation({
    async onSuccess(data) {
      console.log("data url", data);
      // await utils.url.all.invalidate();
    },
    onError(err) {
      console.log("ON ERROR", err.message);
    },
  });

  const urlRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  const handleCreate = () => {
    const urlValue = urlRef.current?.value;

    if (urlValue) {
      url.mutate({
        url: urlValue,
        slug: slugRef.current?.value,
      });
    }
  };

  return (
    <Layout>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <h1>Hello world</h1>

        <input
          ref={urlRef}
          placeholder="URL"
          className="rounded-sm border border-gray-300 px-3 py-1 outline-none"
          type="text"
          required
        />
        <input
          ref={slugRef}
          placeholder="Slug (optional)"
          className="rounded-sm border border-gray-300 px-3 py-1 outline-none"
          type="text"
          required
        />
        <button onClick={handleCreate}>Create</button>
      </div>
    </Layout>
  );
};

export default Home;
