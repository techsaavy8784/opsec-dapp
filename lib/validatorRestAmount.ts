import prisma from "@/prisma"
import getPriceETH from "@/lib/getPriceETH"
import availableServers from "@/app/api/payment/available-servers"

const validatorRestAmount = async (item: any) => {
  const ethUSDRatioPromise = getPriceETH()

  const serversPromise = availableServers()

  const [ethUSDRatio, servers] = await Promise.all([
    ethUSDRatioPromise,
    serversPromise,
  ])

  const sumCreditUSD = await prisma.payment.aggregate({
    where: {
      validatorId: item.id,
    },
    _sum: {
      credit: true,
    },
  })
  const sumCreditETH = Number(sumCreditUSD._sum.credit ?? 0) / ethUSDRatio
  if (sumCreditETH >= item.validatorType.price)
    await prisma.validator.update({
      data: {
        purchaseTime: new Date(),
        serverId: servers[Math.floor(Math.random() * servers.length)].id,
      },
      where: {
        id: item.id,
      },
    })
}

export default validatorRestAmount
