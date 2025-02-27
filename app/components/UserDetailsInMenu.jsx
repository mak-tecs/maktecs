"use client"

import { UserCircle2 } from "lucide-react"
import AdminButton from "./AdminButton"
import LogoutButton from "./LogoutButton"
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/lib/firestore/user/read";

export default function UserDetailsInMenu () {
      const  auth  = useAuth();
      const user = auth?.user;
      const { data: userData } = useUser({ uid: user?.uid });

      if(!user) return null;

    return (
        <div className="flex w-full px-5 justify-between items-center gap-2">
        <div className="flex items-center gap-2">
        <UserCircle2 size={14} />
        <span>{userData?.displayName}</span>
        </div>
        <div className="flex items-center gap-2">
        <AdminButton />
        <LogoutButton />
        </div>
      </div>
    )
}