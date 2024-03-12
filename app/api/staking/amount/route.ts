import prisma from "@/prisma"
import { NextRequest, NextResponse } from "next/server"

const cache = {
  time: 0,
  price: 0, // $OPSEC price
  ttl: 1000 * 60 * 60 * 5, // 5 mins
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const chain = Number(url.searchParams.get("chain"))

  const blockchain = await prisma.blockchain.findUniqueOrThrow({
    where: {
      id: chain,
    },
  })

  if (cache.time + cache.ttl < Date.now()) {
    cache.price = await fetch(
      "https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=opsec",
      {
        headers: {
          "X-CMC_PRO_API_KEY": String(process.env.COIN_MARKET_CAP_API_KEY),
        },
      },
    )
      .then((res) => res.json())
      .then((res) => res.data.OPSEC[0].quote.USD.price)
    cache.time = Date.now()
  }

  const stakingAmount =
    (Number(process.env.STAKING_PROFIT_MARGIN) * blockchain.price) / cache.price

  return NextResponse.json(stakingAmount)
}
