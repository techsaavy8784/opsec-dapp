import { useAccount } from "wagmi"
import { useSession } from "next-auth/react"
import { chain as c } from "@/contract/client"

const useConnected = () => {
  const { isConnected, chain } = useAccount()
  const { status } = useSession()

  const connected =
    isConnected && status === "authenticated" && chain?.id === c.id

  return { connected, status }
}

export default useConnected
