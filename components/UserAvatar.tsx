import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";

const UserAvatar = ({ id, name, imageUrl, className = "w-9 h-9" , fallbackClassName}:
    {
        id: string;
        name: string,
        imageUrl?: string | null,
        className?: string,
        fallbackClassName?: string 
    }
) => {
    const initials = name.split('').map((word: string) => word[0]).join('').toUpperCase().slice(0,2)
    return (
        <Link href={ROUTES.PROFILE(id)}>
            <Avatar className={className}>
                {
                    imageUrl ? (
                        <Image src={imageUrl} alt="name" className="object-cover" width={36} height={36} quality={100}></Image>
                    ):
                    (
                        <AvatarFallback className={cn("primary-gradient font-space-grotesk font-bold tracking-wider text-white", fallbackClassName)}>
                            {initials}
                        </AvatarFallback>
                    )
                }
            </Avatar>
        </Link>
    )
}

export default UserAvatar;