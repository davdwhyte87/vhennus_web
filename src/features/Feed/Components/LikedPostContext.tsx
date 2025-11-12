import React, { createContext, useContext, useState, useEffect } from 'react';

interface LikedPostsContextType {
    likedPosts: string[];
    toggleLike: (postId: string) => void;
    isLiked: (postId: string) => boolean;
}

const LikedPostsContext = createContext<LikedPostsContextType | undefined>(undefined);

export const LikedPostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [likedPosts, setLikedPosts] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("likedPosts")||"[]";
            if (stored) setLikedPosts(JSON.parse(stored));
        } catch (error) {
            console.error("Error loading liked posts:", error);
        }
    }, []);

    const toggleLike = (postId: string) => {
        setLikedPosts(prev => {
            console.log("Toggling like for post:", postId);
            const newLiked = prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId];
            localStorage.setItem("likedPosts", JSON.stringify(newLiked));
            return newLiked;
        });
    };

    const isLiked = (postId: string) => likedPosts.includes(postId);

    return (
        <LikedPostsContext.Provider value={{ likedPosts, toggleLike, isLiked }}>
            {children}
        </LikedPostsContext.Provider>
    );
};

export const useLikedPosts = () => {
    const context = useContext(LikedPostsContext);
    if (!context) {
        throw new Error("useLikedPosts must be used within LikedPostsProvider");
    }
    return context;
};