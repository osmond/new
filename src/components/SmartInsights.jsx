import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'apptile-core';
import moment from 'moment';

export function SmartInsights({ plants, thrivingPlants, totalPlants, themeColors }) {
  // Calculate insights
  const totalWaterUsedWeek = plants.reduce((total, plant) => {
    return total + (plant.waterAmount?.ml || 250) * Math.ceil(7 / (plant.wateringInterval || 7));
  }, 0);
  
  const plantsOnOptimalSchedule = plants.filter(plant => 
    plant.lightCompatibility?.compatibility === 'perfect'
  ).length;
  
  const careStreak = calculateCareStreak(plants);
  const environmentalScore = calculateEnvironmentalScore(plants);
  const seasonalAdjustments = getSeasonalAdjustments();
  
  function calculateCareStreak(plants) {
    // Mock calculation - in real app this would track consecutive days of proper care
    return Math.min(Math.floor(Math.random() * 30) + 1, 28);
  }
  
  function calculateEnvironmentalScore(plants) {
    const totalScore = plants.reduce((sum, plant) => {
      let score = 70; // base score
      if (plant.lightCompatibility?.compatibility === 'perfect') score += 20;
      else if (plant.lightCompatibility?.compatibility === 'good') score += 10;
      if (plant.status === 'upcoming') score += 10;
      return sum + score;
    }, 0);
    
    return plants.length > 0 ? Math.round(totalScore / plants.length) : 0;
  }
  
  function getSeasonalAdjustments() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return { season: 'Spring', suggestion: 'Increase watering frequency' };
    if (month >= 5 && month <= 7) return { season: 'Summer', suggestion: 'Move plants from direct sun' };
    if (month >= 8 && month <= 10) return { season: 'Fall', suggestion: 'Reduce fertilizer frequency' };
    return { season: 'Winter', suggestion: 'Reduce watering frequency' };
  }
  
  const InsightCard = ({ title, value, subtitle, icon, iconColor, trend, trendIcon }) => {
    return (
      <View 
        style={[
          styles.insightCard,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border
          }
        ]}
      >
        <View style={styles.insightHeader}>
          <View 
            style={[
              styles.insightIcon,
              { backgroundColor: iconColor + '20' }
            ]}
          >
            <Icon
              iconType="MaterialIcons"
              name={icon}
              size={18}
              color={iconColor}
            />
          </View>
          
          {trend && (
            <View style={styles.trendContainer}>
              <Icon
                iconType="MaterialIcons"
                name={trendIcon}
                size={12}
                color={trend === 'up' ? themeColors.success : themeColors.error}
              />
              <Text 
                style={[
                  styles.trendText,
                  { color: trend === 'up' ? themeColors.success : themeColors.error }
                ]}
              >
                {trend === 'up' ? '+' : '-'}12%
              </Text>
            </View>
          )}
        </View>
        
        <Text 
          style={[styles.insightValue, { color: themeColors.text }]}
        >
          {value}
        </Text>
        
        <Text 
          style={[styles.insightTitle, { color: themeColors.textSecondary }]}
        >
          {title}
        </Text>
        
        {subtitle && (
          <Text 
            style={[styles.insightSubtitle, { color: iconColor }]}
          >
            {subtitle}
          </Text>
        )}
      </View>
    );
  };
  
  const getThrivingPlantInsight = () => {
    if (thrivingPlants === 0) return "Start optimizing plant locations";
    if (thrivingPlants === totalPlants) return "All plants perfectly placed!";
    return `${totalPlants - thrivingPlants} plants need repositioning`;
  };
  
  const getSpeciesInsight = () => {
    const speciesCount = {};
    plants.forEach(plant => {
      const species = plant.species || 'Unknown';
      speciesCount[species] = (speciesCount[species] || 0) + 1;
    });
    
    const mostCommon = Object.entries(speciesCount)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (mostCommon && mostCommon[1] > 1) {
      return `Your ${mostCommon[0]}s are thriving! Consider propagation.`;
    }
    
    return "Diverse collection! Great variety.";
  };
  
  return (
    <View 
      nativeID={'plantdashboard-View-smartInsights'}
      style={styles.container}
    >
      <View 
        nativeID={'plantdashboard-View-insightsHeader'}
        style={styles.header}
      >
        <Text 
          nativeID={'plantdashboard-Text-insightsTitle'}
          style={[styles.sectionTitle, { color: themeColors.text }]}
        >
          🧠 Smart Insights
        </Text>
      </View>
      
      <View 
        nativeID={'plantdashboard-View-insightsGrid'}
        style={styles.insightsGrid}
      >
        <InsightCard
          title="Plants Thriving"
          value={`${thrivingPlants}/${totalPlants}`}
          subtitle={getThrivingPlantInsight()}
          icon="trending-up"
          iconColor={themeColors.success}
          trend="up"
          trendIcon="arrow-upward"
        />
        
        <InsightCard
          title="Care Streak"
          value={`${careStreak} days`}
          subtitle="Keep it up!"
          icon="local-fire"
          iconColor={careStreak > 7 ? themeColors.warning : themeColors.accent}
          trend={careStreak > 14 ? "up" : null}
          trendIcon="arrow-upward"
        />
        
        <InsightCard
          title="Weekly Water Used"
          value={`${Math.round(totalWaterUsedWeek / 1000 * 10) / 10}L`}
          subtitle={`${totalWaterUsedWeek}ml total`}
          icon="water-drop"
          iconColor={themeColors.secondary}
        />
        
        <InsightCard
          title="Environment Score"
          value={`${environmentalScore}%`}
          subtitle={environmentalScore >= 80 ? "Excellent!" : "Room for improvement"}
          icon="eco"
          iconColor={environmentalScore >= 80 ? themeColors.success : themeColors.warning}
          trend={environmentalScore >= 80 ? "up" : null}
          trendIcon="arrow-upward"
        />
      </View>
      
      {/* Species Insight */}
      <View 
        nativeID={'plantdashboard-View-speciesInsight'}
        style={[
          styles.speciesInsight,
          {
            backgroundColor: themeColors.primary + '10',
            borderColor: themeColors.primary + '30'
          }
        ]}
      >
        <Icon 
          iconType="MaterialIcons" 
          name="psychology" 
          size={16} 
          color={themeColors.primary} 
        />
        <Text 
          nativeID={'plantdashboard-Text-speciesInsightText'}
          style={[
            styles.speciesInsightText,
            { color: themeColors.text }
          ]}
        >
          {getSpeciesInsight()}
        </Text>
      </View>
      
      {/* Seasonal Adjustments */}
      <View 
        nativeID={'plantdashboard-View-seasonalAdjustments'}
        style={[
          styles.seasonalAdjustments,
          {
            backgroundColor: themeColors.accent + '10',
            borderColor: themeColors.accent + '30'
          }
        ]}
      >
        <View style={styles.seasonalHeader}>
          <Icon 
            iconType="MaterialIcons" 
            name="wb-sunny" 
            size={16} 
            color={themeColors.accent} 
          />
          <Text 
            style={[
              styles.seasonalTitle,
              { color: themeColors.accent }
            ]}
          >
            {seasonalAdjustments.season} Tip
          </Text>
        </View>
        <Text 
          nativeID={'plantdashboard-Text-seasonalSuggestion'}
          style={[
            styles.seasonalText,
            { color: themeColors.text }
          ]}
        >
          {seasonalAdjustments.suggestion}
        </Text>
      </View>
    </View>
  );
}

const styles = {
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600'
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  insightCard: {
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
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  trendText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2
  },
  insightValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: '500'
  },
  insightSubtitle: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 2
  },
  speciesInsight: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8
  },
  speciesInsightText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1
  },
  seasonalAdjustments: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1
  },
  seasonalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  seasonalTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6
  },
  seasonalText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 22
  }
};
