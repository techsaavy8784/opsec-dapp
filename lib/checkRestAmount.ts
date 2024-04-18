import prisma from "@/prisma"
import getUSDAmountForETH from "@/lib/getUSDAmountForETH"

const checkRestAmount = async () => {
  const ethUSDRatio = await getUSDAmountForETH(1)

  const inactiveValidators = await prisma.validator.findMany({
    where: {
      purchaseTime: null,
    },
    include: {
      validator_types: true,
    },
  })

  inactiveValidators.map(async (item: any) => {
    const usersForThisValidator = await prisma.payment.findMany({
      where: {
        validatorId: item.id,
      },
    })
    const sumCreditUSD = usersForThisValidator.reduce(
      (total, item) => total + item.credit,
      0,
    )
    const sumCreditETH = sumCreditUSD / ethUSDRatio
    if (sumCreditETH >= item.validator_types.price)
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
