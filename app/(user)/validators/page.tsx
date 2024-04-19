import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Purchase from "./purchase"
import ViewValidatorStatus from "./show/view"

const Validators = () => (
  <Tabs defaultValue="runnig">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="runnig">Running Validator</TabsTrigger>
      <TabsTrigger value="pending">Pending Validator</TabsTrigger>
      <TabsTrigger value="purchase">Purchase Validator Nodes</TabsTrigger>
    </TabsList>
    <TabsContent value="runnig">
      <ViewValidatorStatus status={1} />
    </TabsContent>
    <TabsContent value="pending">
      <ViewValidatorStatus status={2} />
    </TabsContent>
    <TabsContent value="purchase">
      <Purchase />
    </TabsContent>
  </Tabs>
)

export default Validators
