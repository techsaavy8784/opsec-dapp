import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Purchase from "./purchase"

const Validators = () => (
  <Tabs defaultValue="runnig">
    <TabsList className="grid w-full grid-cols-3">
      <TabsTrigger value="runnig">Running Validator</TabsTrigger>
      <TabsTrigger value="pending">Pending Validator</TabsTrigger>
      <TabsTrigger value="purchase">Purchase Validator Nodes</TabsTrigger>
    </TabsList>
    <TabsContent value="runnig">
      <div className="mt-8">
        <p className="mt-24">Running Validator</p>
        <hr className="my-4" />
      </div>
    </TabsContent>
    <TabsContent value="pending">
      <div className="mt-8">
        <p className="mt-24">Pending Validator</p>
        <hr className="my-4" />
      </div>
    </TabsContent>
    <TabsContent value="purchase">
      <Purchase />
    </TabsContent>
  </Tabs>
)

export default Validators
