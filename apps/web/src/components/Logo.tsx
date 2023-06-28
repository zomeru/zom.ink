import React from "react";

import { APP_NAME_LOGO } from "~/constants";

export const Logo = () => {
  return (
    <h1 className="text-primary-200 font-black uppercase">
      <span className="text-4xl">{APP_NAME_LOGO.name}</span>
      <span className="text-2xl">{APP_NAME_LOGO.domain}</span>
    </h1>
  );
};
