"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

type Props = {
  value: number
  className?: string
}

export const TreasuryCard = ({ value, className }: Props) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Treasury</CardTitle>
        <CardDescription>Total value locked</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold blur-[5px]">
          {value.toLocaleString()}
        </p>
      </CardContent>
    </Card>
  )
}
