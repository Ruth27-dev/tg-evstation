import React, { useRef, useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '@/theme';
import { screenSizes } from '@/constants/GeneralConstants';
import { SlideShow } from '@/types';

const { width } = Dimensions.get('window');
interface PromotionSliderProps {
    promotions: SlideShow[];
    activeSlide: number;
    onSlideChange: (index: number) => void;
}
const PromotionSlider: React.FC<PromotionSliderProps> = ({ promotions, activeSlide, onSlideChange }) => {
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextSlide = (activeSlide + 1) % promotions.length;
            scrollRef.current?.scrollTo({
                x: nextSlide * (width - 40),
                animated: true,
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [activeSlide, promotions.length]);

    return (
        <View style={styles.promotionSection}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
                    onSlideChange(slideIndex);
                }}
                style={styles.promotionSlider}
            >
                {promotions?.map((promo) => (
                    <LinearGradient
                        key={promo.id}
                        colors={[Colors.backGroundColor, Colors.backGroundColor]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.promoCard}
                    >
                        <View style={styles.promoContent}>
                            <Image 
                                source={{uri: promo?.image}} 
                                style={styles.promoImage}
                            />
                        </View>
                    </LinearGradient>
                ))}
            </ScrollView>
            <View style={styles.pagination}>
                {promotions.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeSlide && styles.paginationDotActive
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

export default PromotionSlider;

const styles = StyleSheet.create({
    promotionSection: {
        marginBottom: 20,
    },
    promotionSlider: {
        marginBottom: 12,
    },
    promoCard: {
        width: width - 42,
        marginRight: 0,
        borderRadius: 10,
        minHeight: screenSizes.height * 0.25,
        position: 'relative',
        overflow: 'hidden',
    },
    promoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        width: '100%',
        height: screenSizes.height * 0.25,
    },
    promoImage: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    paginationDotActive: {
        width: 24,
        backgroundColor: Colors.secondaryColor,
    },
});
