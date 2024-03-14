import prisma from "@/prisma"
import { NextRequest, NextResponse } from "next/server"

const cache = {
  time: 0,
  price: 0, // $OPSEC price
  ttl: 1000 * 60 * 60 * 5, // 5 mins
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl
  const chainsParam = url.searchParams.get("chains")
  const amountsParam = url.searchParams.get("amounts")

  const chains = chainsParam
    ? decodeURI(String(chainsParam)).split(",").map(Number)
    : []

  const amounts = amountsParam
    ? decodeURI(String(amountsParam)).split(",").map(Number)
    : []

  if (chains.length !== amounts.length) {
    return NextResponse.json({ message: "data invalid" }, { status: 400 })
  }

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

  const blockchains = await prisma.blockchain.findMany()

  const chainMap = Object.fromEntries(
    blockchains.map((chain) => [chain.id, chain]),
  )

  const sum = chains.reduce(
    (sum, chain, i) => sum + chainMap[chain].price * amounts[i],
    0,
  )

  return NextResponse.json(
    (Number(process.env.STAKING_PROFIT_MARGIN) * sum) / cache.price,
  )
}
