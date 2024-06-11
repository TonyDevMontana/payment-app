"use client";
import { Appbar } from "@repo/ui/appbar";
import { signIn, signOut, useSession } from "next-auth/react";

export const AppbarClient = () => {
  const session = useSession();
  return <Appbar user={session.data?.user} signIn={signIn} signOut={signOut} />;
};
