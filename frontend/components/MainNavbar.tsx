import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

const MainNavbar = () => {
  const router = useRouter();
  return (
    <div className="p-3">
      <Button 
      className="text-white font-bold p-2 cursor-pointer"
      onClick={() => router.push('/')}
      >AIWrapper</Button>
    </div>
  );
};

export default MainNavbar;
