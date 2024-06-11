import { Button } from "./button";

export const Appbar = ({ user, signIn, signOut }: any) => {
  return (
    <div className='flex justify-between border border-b p-2 items-center'>
      <div className='text-xl'>PayTM</div>
      <Button onClick={user ? signOut : signIn}>
        {`${user ? "LogOut" : "LogIn"}`}
      </Button>
    </div>
  );
};
