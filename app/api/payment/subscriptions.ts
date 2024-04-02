const subscriptions: [number, number][] = [
  [1, 1],
  [6, 5.5],
  [12, 10],
]

export const stakingRewardAmount = (stakingAmount: number) => {
  const stakingMap = [
    [1000, 2],
    [10000, 9],
    [50000, 15],
    [100000, 24],
    [200000, 36],
    [500000, 48],
    [1000000, 60],
    [Infinity, 75],
  ]

  for (const [staking, amount] of stakingMap) {
    if (stakingAmount <= staking) {
      return amount
    }
  }

  return 75
}

export default subscriptions
