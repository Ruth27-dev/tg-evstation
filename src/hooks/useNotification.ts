import { fetchNitification } from "@/services/useApi";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useState } from "react";

export const useNotification = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadMoreLoading, setIsLoadMoreLoading] = useState<boolean>(false);
    const { notificationData, setNotificationData } = useNotificationStore();

    const getNotification = async (page: number = 1) => {
        try {
            if (page === 1) {
                setIsLoading(true);
            } else {
                setIsLoadMoreLoading(true);
            }
            const data = {
                page: page,
                size: 10,
            }
            const response = await fetchNitification(data);
            if (response?.data?.code === '000') {
                const newContent = response?.data?.data.content || [];
                const isLastPage = response?.data?.data.last || false;
                
                if (page === 1) {
                    setNotificationData(newContent);
                } else {
                    const currentNotifications = notificationData || [];
                    const existingIds = new Set(currentNotifications.map((t: any) => t.id));
                    const uniqueNewContent = newContent.filter((t: any) => !existingIds.has(t.id));
                    setNotificationData([...currentNotifications, ...uniqueNewContent]);
                }
                
                return {
                    content: newContent,
                    isLastPage,
                    totalPages: response?.data?.data.total_pages || 0,
                    totalElements: response?.data?.data.total_elements || 0
                };
            } else {
                if (page === 1) {
                    setNotificationData([]);
                }
                return { content: [], isLastPage: true, totalPages: 0, totalElements: 0 };
            }
        } catch (error: any) {
            if (page === 1) {
                setNotificationData([]);
            }
            return { content: [], isLastPage: true, totalPages: 0, totalElements: 0 };
        } finally {
            setIsLoading(false);
            setIsLoadMoreLoading(false);
        }
    }
    

    return {
        isLoading,
        isLoadMoreLoading,
        getNotification,
        notificationData
    };
}

