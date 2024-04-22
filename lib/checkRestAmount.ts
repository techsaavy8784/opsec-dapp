import prisma from "@/prisma"
import validatorRestAmount from "./validatorRestAmount"

const checkRestAmount = async () => {
  const inactiveValidators = await prisma.validator.findMany({
    where: {
      purchaseTime: null,
    },
    include: {
      validatorType: true,
    },
  })

  inactiveValidators.forEach(async (item: any) => {
    await validatorRestAmount(item)
  })
}

export default checkRestAmount
