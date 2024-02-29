import { useAccount } from "wagmi"
import { useSession } from "next-auth/react"
import { mainnet } from "wagmi/chains"

const chainId = mainnet.id

const useConnected = () => {
  const { isConnected, chain } = useAccount()
  const { status } = useSession()

  const connected =
    isConnected && status === "authenticated" && chain?.id === chainId

  return { connected, status }
}

export default useConnected
