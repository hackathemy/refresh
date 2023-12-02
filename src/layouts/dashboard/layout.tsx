import { useCallback, useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { TopBar } from "./top-bar";

const LayoutContainer = styled("div")({
  width: "100%",
});

export const Layout = (props: any) => {
  const { children } = props;
  return (
    <>
      <LayoutContainer>
        <TopBar />
        {children}
      </LayoutContainer>
    </>
  );
};
