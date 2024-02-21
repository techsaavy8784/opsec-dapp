const tx: Record<
  string,
  {
    userId: number
    amount: number
    tx: string
  }
> = {}

export const getTx = () => tx
