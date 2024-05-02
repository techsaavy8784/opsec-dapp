import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Purchase from "./purchase"
import Claim from "./claim"
import ValidatorList from "./validator-list"

const Validators = () => (
  <Tabs defaultValue="runnig">
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="runnig">Running</TabsTrigger>
      <TabsTrigger value="purchase">Purchase</TabsTrigger>
      <TabsTrigger value="claim">Claim Rewards</TabsTrigger>
    </TabsList>
    <div className="mt-6">
      <TabsContent value="runnig">
        <ValidatorList />
      </TabsContent>
      <TabsContent value="purchase">
        <Purchase />
      </TabsContent>
      <TabsContent value="claim">
        <Claim />
      </TabsContent>
    </div>
  </Tabs>
)

export default Validators
