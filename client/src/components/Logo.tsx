import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils'
import darkLogo from "/dark-logo.png";
import lightLogo from "/light-logo.png";

interface Props {
    w?: number,
    h?: number,
    className?: string,
}

const Logo = ({ w = 8, h = 8, className }: Props) => {
    return (
        <div>
            <Avatar className={cn(`w-${w} h-${h}`, className)}>
                <AvatarImage src={darkLogo} className='w-full h-full object-contain hidden dark:block' />
                <AvatarImage src={lightLogo} className='w-full h-full object-contain block dark:hidden' />
                <AvatarFallback>Logo</AvatarFallback>
            </Avatar>
        </div>
    )
}

export default Logo