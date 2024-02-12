import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiCloud } from "react-icons/fi"

export function CardNodes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Nodes</CardTitle>
        <CardDescription>Currently running nodes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">5</div>
        <p className="text-xs text-muted-foreground">on 2 blockchains</p>
        <Button className="mt-6 w-full items-center">
          <FiCloud className="mr-2" />
          View
        </Button>
      </CardContent>
    </Card>
  )
}
