import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Modal, RefreshControl, ActivityIndicator } from 'react-native';
import BaseComponent from '@/components/BaseComponent';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Notification } from '@/types';
import moment from 'moment';
import { useNotification } from '@/hooks/useNotification';
import Loading from '@/components/Loading';
import NoData from '@/components/NoData';

const NotificationScreen = () => {
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { getNotification, notificationData ,isLoadMoreLoading,isLoading } = useNotification();

    useEffect(() => {
        getNotification(1);
    },[])
    
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await Promise.all([
                getNotification(1),
            ]);
        } catch (error) {
            console.error('Refresh error:', error);
        } finally {
            setRefreshing(false);
        }
    }, [getNotification]);
    const loadMore = useCallback(async () => {
        if (isLoadMoreLoading || !hasMore) return;
        const nextPage = currentPage + 1;
        try {
            const result = await getNotification(nextPage);
            if (result.isLastPage || result.content.length === 0) {
                setHasMore(false);
            } else {
                setCurrentPage(nextPage);
            }
        } catch (error) {
            console.error('Load more error:', error);
            setHasMore(false);
        }
    }, [isLoadMoreLoading, hasMore, currentPage, getNotification]);

    const handleNotificationPress = (notification: Notification) => {
        setSelectedNotification(notification);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setTimeout(() => setSelectedNotification(null), 300);
    };

    const getNotificationIcon = (read: boolean) => {
        return (
            <View style={[styles.iconContainer, { backgroundColor: `${Colors.mainColor}15` }]}>
                <Ionicons name="notifications" size={24} color={Colors.mainColor} />
            </View>
        );
    };

    const renderNotificationItem = useCallback(({ item }: { item: Notification }) => {
        return (
            <TouchableOpacity 
                style={[
                    styles.notificationItem,
                    item.status === "UNREAD" && styles.unreadNotification
                ]}
                activeOpacity={0.7}
                onPress={() => handleNotificationPress(item)}
            >
                {getNotificationIcon(item.status === "UNREAD" ? false : true)}
                
                <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                        {item.status === "UNREAD" && <View style={styles.unreadDot} />}
                    </View>
                    
                    <Text style={styles.notificationMessage} numberOfLines={2}>
                        {item.message}
                    </Text>
                    
                    <Text style={styles.notificationTime}>
                        {moment(item.created_at).fromNow()}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }, []);

    const renderFooter = () => {
        if (!isLoadMoreLoading) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.mainColor} />
                <Text style={styles.loadingText}>Loading more...</Text>
            </View>
        );
    };
    if(isLoading) return <Loading />
    
    return (
        <BaseComponent isBack={true} title="Notifications">
            <View style={styles.container}>
                <FlatList
                    data={notificationData}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[Colors.mainColor]}
                            tintColor={Colors.mainColor}
                        />
                    }
                    ListEmptyComponent={<NoData/>}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={renderFooter}
                />
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {selectedNotification && (
                                <>
                                    <View style={styles.modalHeader}>
                                        {getNotificationIcon(selectedNotification.status === "UNREAD" ? false : true)}
                                        <TouchableOpacity 
                                            style={styles.closeButton}
                                            onPress={closeModal}
                                        >
                                            <Ionicons name="close" size={24} color={Colors.mainColor} />
                                        </TouchableOpacity>
                                    </View>

                                    <ScrollView 
                                        style={styles.modalBody}
                                        showsVerticalScrollIndicator={false}
                                    >
                                        <View style={styles.modalTitleContainer}>
                                            <Text style={styles.modalTitle}>
                                                {selectedNotification.title}
                                            </Text>
                                            {selectedNotification.status === "UNREAD" && (
                                                <View style={styles.modalUnreadBadge}>
                                                    <Text style={styles.modalUnreadText}>New</Text>
                                                </View>
                                            )}
                                        </View>

                                        <View style={styles.modalTimeContainer}>
                                            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                                            <Text style={styles.modalTime}>
                                                {moment(selectedNotification.created_at).format('MMMM D, YYYY • h:mm A')}
                                            </Text>
                                        </View>

                                        <View style={styles.modalDivider} />

                                        <Text style={styles.modalMessage}>
                                            {selectedNotification.message}
                                        </Text>
                                       
                                    </ScrollView>

                                    <TouchableOpacity 
                                        style={styles.modalButton}
                                        onPress={closeModal}
                                    >
                                        <Text style={styles.modalButtonText}>Got it</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </View>
        </BaseComponent>
    );
};

export default NotificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    tabContainer: {
        flexDirection: 'row',
        padding: safePadding,
        gap: 12,
        backgroundColor: Colors.white,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        gap: 8,
    },
    activeTab: {
        backgroundColor: Colors.mainColor,
    },
    tabText: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
        fontWeight: '600',
    },
    activeTabText: {
        color: Colors.white,
        fontFamily: CustomFontConstant.EnBold,
    },
    listContent: {
        padding: safePadding,
        paddingBottom: 100,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    unreadNotification: {
        backgroundColor: '#EFF6FF',
        borderLeftWidth: 4,
        borderLeftColor: Colors.secondaryColor,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    notificationTitle: {
        flex: 1,
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        fontWeight: '700',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.secondaryColor,
        marginLeft: 8,
    },
    notificationMessage: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#6B7280',
        marginBottom: 8,
        lineHeight: 20,
    },
    notificationTime: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: '#6B7280',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        width: '100%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        padding: 20,
        maxHeight: 400,
    },
    modalTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    modalTitle: {
        flex: 1,
        fontSize: FontSize.large,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.mainColor,
        lineHeight: 28,
    },
    modalUnreadBadge: {
        backgroundColor: Colors.secondaryColor,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    modalUnreadText: {
        fontSize: FontSize.small - 2,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
        textTransform: 'uppercase',
    },
    modalTimeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    modalTime: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#9CA3AF',
    },
    modalDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 16,
    },
    modalMessage: {
        fontSize: FontSize.medium,
        fontFamily: CustomFontConstant.EnRegular,
        color: '#4B5563',
        lineHeight: 24,
        marginBottom: 16,
    },
    modalTypeTag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: `${Colors.secondaryColor}15`,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
        marginTop: 8,
    },
    modalTypeText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.secondaryColor,
    },
    modalButton: {
        backgroundColor: Colors.mainColor,
        paddingVertical: 16,
        borderRadius: 12,
        margin: 20,
        marginTop: 0,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: FontSize.medium + 1,
        fontFamily: CustomFontConstant.EnBold,
        color: Colors.white,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    loadingText: {
        fontSize: FontSize.small,
        fontFamily: CustomFontConstant.EnRegular,
        color: Colors.mainColor,
    },
});
