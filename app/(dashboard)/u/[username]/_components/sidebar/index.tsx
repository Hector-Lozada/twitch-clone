import { useCreatorSidebar } from "@/store/use-creator-sidebar"
import { Toggle } from "./toggle"
import { Wrapper } from "./wrapper"
import { Navigation } from "./navigation"

export const Sidebar = () => {
    return(
        <Wrapper>
            <Toggle />
            <Navigation />
        </Wrapper>
    )
}