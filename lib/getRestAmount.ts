import prisma from "@/prisma"
import getUSDAmountForETH from "@/lib/getUSDAmountForETH"

const getRestAmount = async (validatorId: number) => {
  const ethUSDRatio = await getUSDAmountForETH(1)

  const validator = await prisma.validator.findUnique({
    where: {
      id: validatorId,
    },
    include: {
      validator_types: true,
    },
  })

  const usersForThisValidator = await prisma.payment.findMany({
    where: {
      validatorId: validatorId,
    },
  })
  const sumCreditUSD = usersForThisValidator.reduce(
    (total, item) => total + item.credit,
    0,
  )
  const sumCreditETH = sumCreditUSD / ethUSDRatio
  if (sumCreditETH >= validator!.validator_types.price) {
    await prisma.validator.update({
      data: {
        purchaseTime: new Date(),
      },
      where: {
        id: validator!.id,
      },
    })
    return null
  } else {
    return validator!.validator_types.price - sumCreditETH
  }
}

export default getRestAmount
