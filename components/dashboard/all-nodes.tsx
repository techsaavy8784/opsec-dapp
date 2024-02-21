import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FiCloud } from "react-icons/fi"

export function CardNodesAll() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Nodes</CardTitle>
        <CardDescription>Currently running nodes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">10</div>
        <p className="text-xs text-muted-foreground">on 5 blockchains</p>
        <Button className="mt-6 w-full items-center">
          <FiCloud className="mr-2" />
          View
        </Button>
      </CardContent>
    </Card>
  )
}
