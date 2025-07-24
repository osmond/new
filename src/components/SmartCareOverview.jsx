import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'apptile-core';
import moment from 'moment';

export function SmartCareOverview({ 
  plantsNeedingWater, 
  overduePlants, 
  totalWaterNeeded, 
  aiCarePlans,
  themeColors,
  showSeasonalTips 
}) {
  const currentSeason = getCurrentSeason();
  const weeklyForecast = getWeeklyForecast();
  
  function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Fall';
    return 'Winter';
  }
  
  function getWeeklyForecast() {
    // Mock forecast - in real app this would be calculated from plant care schedules
    return {
      today: plantsNeedingWater + overduePlants,
      tomorrow: Math.floor(Math.random() * 3) + 1,
      thisWeek: Math.floor(Math.random() * 8) + 3
    };
  }
  
  const OverviewCard = ({ title, value, subtitle, icon, iconColor, index, showBadge = false, badgeText = '' }) => {
    return (
      <View 
        nativeID={`plantdashboard-View-overviewCard-${index}`}
        style={[
          styles.overviewCard,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border
          }
        ]}
      >
        <View 
          nativeID={`plantdashboard-View-cardHeader-${index}`}
          style={styles.cardHeader}
        >
          <View 
            nativeID={`plantdashboard-View-iconContainer-${index}`}
            style={[
              styles.iconContainer,
              { backgroundColor: iconColor + '20' }
            ]}
          >
            <Icon
              iconType="MaterialIcons"
              name={icon}
              size={16}
              color={iconColor}
            />
          </View>
          
          {showBadge && badgeText && (
            <View 
              nativeID={`plantdashboard-View-badge-${index}`}
              style={[styles.badge, { backgroundColor: themeColors.secondary }]}
            >
              <Text style={styles.badgeText}>{badgeText}</Text>
            </View>
          )}
        </View>
        
        <Text 
          nativeID={`plantdashboard-Text-cardValue-${index}`}
          style={[styles.cardValue, { color: themeColors.text }]}
        >
          {value}
        </Text>
        
        <Text 
          nativeID={`plantdashboard-Text-cardTitle-${index}`}
          style={[styles.cardTitle, { color: themeColors.textSecondary }]}
        >
          {title}
        </Text>
        
        {subtitle && (
          <Text 
            nativeID={`plantdashboard-Text-cardSubtitle-${index}`}
            style={[styles.cardSubtitle, { color: iconColor }]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  };
  
  return (
    <View 
      nativeID={'plantdashboard-View-smartCareOverview'}
      style={styles.container}
    >
      <View 
        nativeID={'plantdashboard-View-overviewHeader'}
        style={styles.overviewHeader}
      >
        <Text 
          nativeID={'plantdashboard-Text-overviewTitle'}
          style={[styles.sectionTitle, { color: themeColors.text }]}
        >
          🤖 Smart Care Overview
        </Text>
        
        {showSeasonalTips && (
          <View 
            nativeID={'plantdashboard-View-seasonalTip'}
            style={[styles.seasonalTip, { backgroundColor: themeColors.accent + '20' }]}
          >
            <Icon 
              iconType="MaterialIcons" 
              name="wb-sunny" 
              size={12} 
              color={themeColors.accent} 
            />
            <Text 
              nativeID={'plantdashboard-Text-seasonalText'}
              style={[styles.seasonalText, { color: themeColors.accent }]}
            >
              {currentSeason} care adjustments available
            </Text>
          </View>
        )}
      </View>
      
      <View 
        nativeID={'plantdashboard-View-overviewGrid'}
        style={styles.overviewGrid}
      >
        <OverviewCard
          title="Need Water Today"
          value={plantsNeedingWater}
          subtitle={totalWaterNeeded > 0 ? `${totalWaterNeeded}ml total` : null}
          icon="water-drop"
          iconColor={plantsNeedingWater > 0 ? themeColors.warning : themeColors.success}
          index={0}
        />
        
        <OverviewCard
          title="Overdue Care"
          value={overduePlants}
          subtitle={overduePlants > 0 ? "Needs attention" : "All caught up"}
          icon="warning"
          iconColor={overduePlants > 0 ? themeColors.error : themeColors.success}
          index={1}
          showBadge={overduePlants > 0}
          badgeText="!"
        />
        
        <OverviewCard
          title="AI Care Plans"
          value={aiCarePlans}
          subtitle="Auto-optimized"
          icon="smart-toy"
          iconColor={themeColors.secondary}
          index={2}
          showBadge={aiCarePlans > 0}
          badgeText="AI"
        />
        
        <OverviewCard
          title="This Week"
          value={weeklyForecast.thisWeek}
          subtitle="Care tasks ahead"
          icon="schedule"
          iconColor={themeColors.primary}
          index={3}
        />
      </View>
    </View>
  );
}

const styles = {
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  seasonalTip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  seasonalText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 4
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  overviewCard: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold'
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '500'
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2
  }
};
