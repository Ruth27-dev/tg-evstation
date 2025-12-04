import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import BaseComponent from '@/components/BaseComponent';
import { Colors } from '@/theme';
import { CustomFontConstant, FontSize, safePadding } from '@/constants/GeneralConstants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Notification, NotificationType } from '@/types';
import moment from 'moment';

const NotificationScreen = () => {
    const [selectedTab, setSelectedTab] = useState<NotificationType>('normal');

    const mockNotifications: Notification[] = [
        {
            id: '1',
            type: 'normal',
            title: 'Charging Complete',
            message: 'Your vehicle has finished charging at Station A. Total charge: $15.50',
            created_at: new Date('2025-12-04T10:30:00'),
            read: false,
        },
        {
            id: '2',
            type: 'normal',
            title: 'Payment Successful',
            message: 'Your payment of $20.00 has been processed successfully.',
            created_at: new Date('2025-12-04T09:15:00'),
            read: true,
        },
        {
            id: '3',
            type: 'announcement',
            title: 'New Station Opening',
            message: 'We are excited to announce a new charging station opening at Downtown Plaza on December 10th!',
            created_at: new Date('2025-12-03T14:00:00'),
            read: false,
        },
        {
            id: '4',
            type: 'announcement',
            title: 'Maintenance Notice',
            message: 'Station B will undergo scheduled maintenance on December 5th from 2 AM to 6 AM.',
            created_at: new Date('2025-12-03T08:00:00'),
            read: true,
        },
        {
            id: '5',
            type: 'normal',
            title: 'Charging Started',
            message: 'Charging session started at Station C. Current rate: $0.25/kWh',
            created_at: new Date('2025-12-02T16:45:00'),
            read: true,
        },
        {
            id: '6',
            type: 'announcement',
            title: 'Holiday Hours',
            message: 'Our customer support will have limited hours during the holiday season. Please check our website for details.',
            created_at: new Date('2025-12-01T12:00:00'),
            read: false,
        },
    ];

    const filteredNotifications = mockNotifications.filter(
        (notification) => notification.type === selectedTab
    );

    const getNotificationIcon = (type: NotificationType, read: boolean) => {
        if (type === 'announcement') {
            return (
                <View style={[styles.iconContainer, { backgroundColor: `${Colors.secondaryColor}15` }]}>
                    <MaterialCommunityIcons name="bullhorn" size={24} color={Colors.secondaryColor} />
                </View>
            );
        }
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
                    !item.read && styles.unreadNotification
                ]}
                activeOpacity={0.7}
            >
                {getNotificationIcon(item.type, item.read)}
                
                <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle} numberOfLines={1}>
                            {item.title}
                        </Text>
                        {!item.read && <View style={styles.unreadDot} />}
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

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons 
                name={selectedTab === 'announcement' ? 'megaphone-outline' : 'notifications-outline'} 
                size={64} 
                color="#D1D5DB" 
            />
            <Text style={styles.emptyStateText}>
                No {selectedTab === 'announcement' ? 'announcements' : 'notifications'} yet
            </Text>
            <Text style={styles.emptyStateSubtext}>
                {selectedTab === 'announcement' 
                    ? 'Important announcements will appear here'
                    : 'Your activity notifications will appear here'}
            </Text>
        </View>
    );

    return (
        <BaseComponent isBack={true} title="Notifications">
            <View style={styles.container}>
                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            selectedTab === 'normal' && styles.activeTab
                        ]}
                        onPress={() => setSelectedTab('normal')}
                    >
                        <Ionicons 
                            name="notifications" 
                            size={20} 
                            color={selectedTab === 'normal' ? Colors.white : Colors.mainColor} 
                        />
                        <Text style={[
                            styles.tabText,
                            selectedTab === 'normal' && styles.activeTabText
                        ]}>
                            Notifications
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            selectedTab === 'announcement' && styles.activeTab
                        ]}
                        onPress={() => setSelectedTab('announcement')}
                    >
                        <MaterialCommunityIcons 
                            name="bullhorn" 
                            size={20} 
                            color={selectedTab === 'announcement' ? Colors.white : Colors.mainColor} 
                        />
                        <Text style={[
                            styles.tabText,
                            selectedTab === 'announcement' && styles.activeTabText
                        ]}>
                            Announcements
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Notifications List */}
                <FlatList
                    data={filteredNotifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={renderEmptyState}
                />
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
});
