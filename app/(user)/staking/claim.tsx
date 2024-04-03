"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useReadContract, useWalletClient } from "wagmi"
import abi from "@/contract/abi.json"
import { Claim } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

const ClaimF: React.FC = () => {
  const { address } = useAccount()

  const { data: ethBalance, refetch: refetchBalance } = useReadContract({
    abi: abi,
    address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
    functionName: "ethBallence",
    args: [address as `0x${string}`],
  })

  const { isPending, data } = useQuery<
    (Claim & {
      lasted_at: any
    })[]
  >({
    queryKey: ["claim-"],
    queryFn: () => fetch("/api/claim").then((res) => res.json()),
  })

  const handleClaim = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: ethBalance }),
    }
    await fetch("/api/claim/add", requestOptions)
  }

  const millisecondsIn24Hours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  const today = new Date()

  return (
    <>
      <div className="m-4 text-slate-500 rounded-lg p-5 flex justify-center items-center bg-white">
        <div className="flex flex-col p-2 w-[70%]">
          <div className="flex justify-between p-1 border-b-2 border-slate-300 mb-3">
            <div>ETH Ballance for Claim: </div>
            <div>{ethBalance as any} ETH</div>
          </div>
          <div className="w-full flex justify-center">
            <Button
              className="bg-[#0eb592] text-white rounded-3xl hover:bg-[#70cdb7]"
              disabled={
                data &&
                today.getTime() - data[0].lasted_at.getTime() <
                  millisecondsIn24Hours &&
                (ethBalance as any) < 0.01
              }
              onClick={() => handleClaim()}
            >
              Claim your reward
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ClaimF
