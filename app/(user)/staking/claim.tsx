"use client"

import { Button } from "@/components/ui/button"
import { useAccount, useReadContract } from "wagmi"
import { formatUnits } from "viem"
import abi from "@/contract/abi.json"
import { Claim } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { CovalentClient } from "@covalenthq/client-sdk"
const client = new CovalentClient(
  process.env.NEXT_PUBLIC_COVALENT_API_KEY as string,
)

const OPSEC_DECIMALS = 18
const ETH_DECIMALS = 18

const ClaimF: React.FC = () => {
  const { address } = useAccount()
  const [opsecAllBalance, setOpsecAllBalance] = useState<number>(0)
  const [isLoadingForOpSecAll, setIsLoadingForOpSecAll] =
    useState<boolean>(false)

  const {
    data: ethBalance,
    isLoading: isLoadingForEth,
    refetch: refetchBalance,
  } = useReadContract({
    abi: abi,
    address: process.env.NEXT_PUBLIC_STAKING_CONTRACT as `0x${string}`,
    functionName: "ethBallence",
    args: [address as `0x${string}`],
  })

  const {
    data: opsecBalance,
    isLoading: isLoadingForOpSec,
    refetch: refetchMyBalance,
  } = useReadContract({
    abi: abi,
    address: process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  })

  useEffect(() => {
    const holdersAllBalance = async () => {
      try {
        let sum: number = 0
        setIsLoadingForOpSecAll(true)
        for await (const resp of client.BalanceService.getTokenHoldersV2ForTokenAddress(
          "eth-mainnet",
          process.env.NEXT_PUBLIC_OPSEC_TOKEN_ADDRESS as `0x${string}`,
          { pageSize: 1000 },
        )) {
          sum =
            sum +
            Number(formatUnits(resp.balance as bigint, resp.contract_decimals))
        }

        setOpsecAllBalance(sum)
        setIsLoadingForOpSecAll(false)
      } catch (error) {
        console.log("Error")
      }
    }
    holdersAllBalance()
  }, [])

  const { isPending, data } = useQuery<
    (Claim & {
      lasted_at: any
    })[]
  >({
    queryKey: ["claim-list"],
    queryFn: () => fetch("/api/claim").then((res) => res.json()),
  })

  const handleClaim = async () => {
    if (!isLoadingForEth && !isLoadingForOpSec && !isLoadingForOpSecAll) {
      if (ethBalance !== undefined && ethBalance !== null) {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount:
              Number(formatUnits(ethBalance as bigint, ETH_DECIMALS)) *
              (Number(formatUnits(opsecBalance as bigint, OPSEC_DECIMALS)) /
                opsecAllBalance),
          }),
        }
        await fetch("/api/claim/add", requestOptions)
      }
    }
  }

  const millisecondsIn24Hours = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  const today = new Date()

  if (
    ethBalance === undefined ||
    opsecBalance === undefined ||
    isLoadingForOpSecAll
  ) {
    return (
      <>
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="m-4 text-slate-500 rounded-lg p-5 flex justify-center items-center bg-white">
        <div className="flex flex-col p-2 w-[70%]">
          <div className="flex justify-between p-1 border-b-2 border-slate-300 mb-3">
            <div>ETH Ballance for Claim: </div>
            <div>
              {Number(formatUnits(ethBalance as bigint, ETH_DECIMALS)) *
                (Number(formatUnits(opsecBalance as bigint, OPSEC_DECIMALS)) /
                  opsecAllBalance)}{" "}
              ETH
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Button
              className="bg-[#0eb592] text-white rounded-3xl hover:bg-[#70cdb7]"
              disabled={
                !data ||
                (data && data?.length === 0) ||
                (data &&
                  data?.length !== 0 &&
                  today.getTime() - data[0].lasted_at.getTime() <
                    millisecondsIn24Hours) ||
                Number(formatUnits(ethBalance as bigint, ETH_DECIMALS)) < 0.01
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
