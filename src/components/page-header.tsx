
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, Settings, ClipboardList, Users, Video, LogOut, LogIn, UserPlus, UserCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface PageHeaderProps {
  currentPageNumber: number;
  totalPages: number;
  onToggleThumbnailSidebar: () => void;
}

export default function PageHeader({
  currentPageNumber,
  totalPages,
  onToggleThumbnailSidebar,
}: PageHeaderProps) {
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      toast({ variant: "destructive", title: "Logout Failed", description: "Could not log you out. Please try again." });
    }
  };
  
  const getInitials = (email?: string | null) => {
    if (!email) return 'U';
    const parts = email.split('@')[0];
    return parts.substring(0, 2).toUpperCase();
  }

  return (
    <header className="bg-background shadow-sm p-3 flex items-center justify-between sticky top-0 z-10 border-b">
      <div className="flex items-center gap-2">
        <div className="bg-card p-1.5 rounded-xl shadow-md flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <ChevronLeft className="h-5 w-5 text-foreground/80" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <Settings className="h-5 w-5 text-foreground/80" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <ClipboardList className="h-5 w-5 text-foreground/80" />
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        className="text-lg font-semibold text-foreground p-1 h-auto hover:bg-accent"
        onClick={onToggleThumbnailSidebar}
      >
        {currentPageNumber}/{totalPages}
      </Button>

      <div className="flex items-center gap-2">
        <div className="bg-card p-1.5 rounded-xl shadow-md flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <Users className="h-5 w-5 text-foreground/80" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
            <Video className="h-5 w-5 text-foreground/80" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent" disabled={loading}>
                {loading ? (
                   <UserCircle2 className="h-5 w-5 text-foreground/80 animate-pulse" />
                ) : user ? (
                  <Avatar className="h-7 w-7">
                    {/* Add user.photoURL if available */}
                    {/* <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} /> */}
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <UserCircle2 className="h-5 w-5 text-foreground/80" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    My Account
                    {user.email && <p className="text-xs font-normal text-muted-foreground truncate">{user.email}</p>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                 <>
                  <DropdownMenuLabel>Guest</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/auth/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Log In</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/auth/signup">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
