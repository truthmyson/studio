
"use client"

import { useFont } from "@/hooks/use-font"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { CaseSensitive } from "lucide-react"

export function FontSettings() {
    const { font, setFont } = useFont()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                   <CaseSensitive className="h-[1.2rem] w-[1.2rem]"/>
                   <span className="sr-only">Change Font</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={font} onValueChange={setFont}>
                    <DropdownMenuRadioItem value="inter">Inter</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="pt-sans">PT Sans</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="roboto">Roboto</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
