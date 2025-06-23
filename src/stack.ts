import { StackClientApp } from "@stackframe/react";
import { useNavigate } from "react-router-dom";

export const stackClientApp = new StackClientApp({
  // You should store these in environment variables
  projectId: "3e1eff89-692b-4d29-8405-53f50f35757e",
  publishableClientKey: "pck_e3b95kqwhswbtcryqebvdkqc17vdzr16gy5gbv1d0krn0",
  tokenStore: "cookie",
  redirectMethod: {
    useNavigate,
  },
});
