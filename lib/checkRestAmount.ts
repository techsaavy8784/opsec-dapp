import prisma from "@/prisma"
import getUSDAmountForETH from "@/lib/getUSDAmountForETH"

const checkRestAmount = async () => {
  const ethUSDRatio = await getUSDAmountForETH(1)

  const inactiveValidators = await prisma.validator.findMany({
    where: {
      purchaseTime: null,
    },
    include: {
      validatorType: true,
    },
  })

  inactiveValidators.map(async (item: any) => {
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
        },
        where: {
          id: item.id,
        },
      })
  })
}

export default checkRestAmount
