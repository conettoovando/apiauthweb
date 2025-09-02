import React from "react"

type Props = {
    children: React.ReactNode
    className?: string
}

export default function Container({children, className}: Props){
    return (
        <div className={"max-w-screen-xl flex-col mx-auto p-4 w-full " + className}>
            {children}
        </div>
    )
}