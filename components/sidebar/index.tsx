"use client"

import Image from "next/image"
import Link from "next/link"
// import { usePathname } from "next/navigation"
import React from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Badge } from "../ui/badge"

const Sidebar = ({ isOpen }: { isOpen?: boolean }) => {
  //   const pathName = usePathname()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const open = isOpen ? "open" : ""

  return (
    <div className="w-64 p-4 sticky top-0">
      <div className="flex gap-3 items-center mb-5">
        <Image
          src="/icons/logo.svg"
          alt="logo"
          width={39}
          height={38}
          className={`max-md:overflow-hidden transition-all`}
        />
        <div
          className={`flex flex-col py-1 max-md:overflow-hidden transition-all`}
        >
          <h1 className="text-[16px] font-[600] leading-6 text-white">OpSec</h1>
          <h1 className="text-[16px] font-[600] leading-6 text-white">
            Node Managment
          </h1>
        </div>
      </div>
      <NavigationMenu orientation="vertical" className="flex-col text-lg">
        <NavigationMenuList className="text-lg">
          <NavigationMenuItem>
            <Link href="/dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/marketplace" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Marketplace
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/treasury" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Treasury
                <Badge className="ml-2" variant={"secondary"}>
                  Coming Soon
                </Badge>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/nodes" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Nodes
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/validators" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Validators
                <Badge className="ml-2" variant={"secondary"}>
                  Coming Soon
                </Badge>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/billing" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Billing
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export { Sidebar }
