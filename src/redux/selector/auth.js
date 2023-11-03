import { useSelector } from "react-redux";

export const useAuthSelector = () => {
  return useSelector((state) => state.auth)
}

