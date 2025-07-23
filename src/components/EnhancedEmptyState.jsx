import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'apptile-core';
import moment from 'moment';

export function IntelligentPlantCard({ 
  plant, 
  onPress, 
  onWater, 
  onFertilize, 
  themeColors, 
  style, 
  careCardStyle,
  index 
}) {
  const isListStyle = style === 'list';
  const isMinimal = careCardStyle === 'minimal';
  const isCompact = careCardStyle === 'compact';
  
  const getSmartWateringText = () => {
    const waterAmount = plant.waterAmount?.ml || 250;
    const waterAmountOz = plant.waterAmount?.oz || 8.5;
    
    switch (plant.status) {
      case 'overdue':
        return {
          text: `WATER NOW with ${waterAmount}ml`,
          subtext: `${plant.daysSinceWatered} days overdue`,
          urgent: true
        };
      case 'due':
        return {
          text: `WATER TODAY with ${waterAmount}ml`,
          subtext: 'Due today',
          urgent: false
        };
      default:
        const daysUntil = plant.wateringInterval - plant.daysSinceWatered;
        return {
          text: `Water with ${waterAmount}ml in ${daysUntil} days`,
          subtext: `Every ${plant.wateringInterval} days`,
          urgent: false
        };
    }
  };
  
  const smartWatering = getSmartWateringText();
  
  const renderProgressRing = () => {
    if (isMinimal) return null;
    
    const progress = Math.min(plant.daysSinceWatered / plant.wateringInterval, 1);
    const circumference = 2 * Math.PI * 20;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - progress);
    
    return (
      <View 
        nativeID={`plantdashboard-View-progressRing-${index}`}
        style={styles.progressRingContainer}
      >
        <View 
          nativeID={`plantdashboard-View-progressCircle-${index}`}
          style={[
            styles.progressCircle,
            { borderColor: plant.statusColor + '30' }
          ]}
        >
          <View 
            nativeID={`plantdashboard-View-progressFill-${index}`}
            style={[
              styles.progressFill,
              { 
                borderColor: plant.statusColor,
                borderWidth: progress * 3
              }
            ]}
          />
        </View>
      </View>
    );
  };
  
  const renderPlantImage = () => {
    return (
      <View 
        nativeID={`plantdashboard-View-imageContainer-${index}`}
        style={styles.imageContainer}
      >
        {plant.image ? (
          <Image
            nativeID={`plantdashboard-Image-plantPhoto-${index}`}
            source={{ uri: plant.image }}
            style={[
              isListStyle ? styles.listImage : styles.cardImage,
              { borderRadius: 8 }
            ]}
            resizeMode="cover"
          />
        ) : (
          <View
            nativeID={`plantdashboard-View-plantIconContainer-${index}`}
            style={[
              isListStyle ? styles.listImage : styles.cardImage,
              {
                backgroundColor: themeColors.border,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center'
              }
            ]}
          >
            <Icon
              iconType="MaterialIcons"
              name="local-florist"
              size={isListStyle ? 24 : 32}
              color={themeColors.primary}
            />
          </View>
        )}
        
        {renderProgressRing()}
        
        {/* Status indicator overlay */}
        <View 
          nativeID={`plantdashboard-View-statusOverlay-${index}`}
          style={[
            styles.statusOverlay,
            { backgroundColor: plant.statusColor }
          ]}
        >
          <Icon
            iconType="MaterialIcons"
            name={plant.status === 'overdue' ? 'priority-high' : plant.status === 'due' ? 'water-drop' : 'check'}
            size={10}
            color="white"
          />
        </View>
      </View>
    );
  };
  
  const renderCareIndicators = () => {
    if (isMinimal) return null;
    
    return (
      <View 
        nativeID={`plantdashboard-View-careIndicators-${index}`}
        style={styles.careIndicators}
      >
        {/* Care difficulty badge */}
        <View 
          nativeID={`plantdashboard-View-difficultyBadge-${index}`}
          style={[
            styles.careBadge,
            { backgroundColor: plant.careDifficulty.color + '20' }
          ]}
        >
          <Text 
            nativeID={`plantdashboard-Text-difficultyText-${index}`}
            style={[
              styles.careBadgeText,
              { color: plant.careDifficulty.color }
            ]}
          >
            {plant.careDifficulty.level}
          </Text>
        </View>
        
        {/* Fertilizer indicator */}
        {plant.fertilizerStatus.isDue && (
          <View 
            nativeID={`plantdashboard-View-fertilizerBadge-${index}`}
            style={[
              styles.careBadge,
              { backgroundColor: themeColors.warning + '20' }
            ]}
          >
            <Icon
              iconType="MaterialIcons"
              name="eco"
              size={10}
              color={themeColors.warning}
            />
            <Text 
              nativeID={`plantdashboard-Text-fertilizerText-${index}`}
              style={[
                styles.careBadgeText,
                { color: themeColors.warning, marginLeft: 2 }
              ]}
            >
              Feed
            </Text>
          </View>
        )}
        
        {/* Light compatibility */}
        {!isCompact && (
          <View 
            nativeID={`plantdashboard-View-lightBadge-${index}`}
            style={[
              styles.careBadge,
              { backgroundColor: getLightColor(plant.lightCompatibility.compatibility) + '20' }
            ]}
          >
            <Icon
              iconType="MaterialIcons"
              name={getLightIcon(plant.lightCompatibility.compatibility)}
              size={10}
              color={getLightColor(plant.lightCompatibility.compatibility)}
            />
          </View>
        )}
      </View>
    );
  };
  
  function getLightColor(compatibility) {
    switch (compatibility) {
      case 'perfect': return '#4CAF50';
      case 'good': return '#FF9800';
      default: return '#F44336';
    }
  }
  
  function getLightIcon(compatibility) {
    switch (compatibility) {
      case 'perfect': return 'wb-sunny';
      case 'good': return 'wb-cloudy';
      default: return 'warning';
    }
  }
  
  const renderQuickActions = () => {
    return (
      <View 
        nativeID={`plantdashboard-View-quickActions-${index}`}
        style={[
          isListStyle ? styles.listActions : styles.cardActions,
          isCompact && { flexDirection: 'row', justifyContent: 'space-between' }
        ]}
      >
        {/* Water button */}
        <TouchableOpacity
          nativeID={`plantdashboard-TouchableOpacity-waterBtn-${index}`}
          style={[
            isListStyle ? styles.listWaterButton : styles.cardWaterButton,
            { backgroundColor: plant.statusColor },
            isCompact && { flex: 1, marginRight: 4 }
          ]}
          onPress={(e) => {
            e.stopPropagation();
            onWater();
          }}
          activeOpacity={0.8}
        >
          <Icon
            iconType="MaterialIcons"
            name="water-drop"
            size={isListStyle ? 16 : 14}
            color="white"
          />
          {!isMinimal && (
            <Text 
              nativeID={`plantdashboard-Text-waterBtnText-${index}`}
              style={[styles.waterButtonText, { color: 'white' }]}
            >
              {isCompact ? 'Water' : `Water ${plant.waterAmount?.ml || 250}ml`}
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Fertilize button */}
        {plant.fertilizerStatus.isDue && !isMinimal && (
          <TouchableOpacity
            nativeID={`plantdashboard-TouchableOpacity-fertilizeBtn-${index}`}
            style={[
              isListStyle ? styles.listFertilizeButton : styles.cardFertilizeButton,
              { backgroundColor: themeColors.warning },
              isCompact && { flex: 1, marginLeft: 4 }
            ]}
            onPress={(e) => {
              e.stopPropagation();
              onFertilize();
            }}
            activeOpacity={0.8}
          >
            <Icon
              iconType="MaterialIcons"
              name="eco"
              size={isListStyle ? 16 : 14}
              color="white"
            />
            <Text 
              nativeID={`plantdashboard-Text-fertilizeBtnText-${index}`}
              style={[styles.fertilizeButtonText, { color: 'white' }]}
            >
              Feed
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  if (isListStyle) {
    return (
      <TouchableOpacity
        nativeID={`plantdashboard-TouchableOpacity-plantCard-${index}`}
        style={[
          styles.listCard,
          {
            backgroundColor: themeColors.surface,
            borderColor: plant.urgencyLevel === 'critical' ? themeColors.error : themeColors.border
          }
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {renderPlantImage()}
        
        <View 
          nativeID={`plantdashboard-View-plantInfo-${index}`}
          style={styles.listInfo}
        >
          <View 
            nativeID={`plantdashboard-View-plantHeader-${index}`}
            style={styles.plantHeader}
          >
            <Text 
              nativeID={`plantdashboard-Text-plantName-${index}`}
              style={[styles.plantName, { color: themeColors.text }]}
              numberOfLines={1}
            >
              {plant.name || 'Unnamed Plant'}
            </Text>
            
            {renderCareIndicators()}
          </View>
          
          <Text 
            nativeID={`plantdashboard-Text-plantSpecies-${index}`}
            style={[styles.plantSpecies, { color: themeColors.textSecondary }]}
            numberOfLines={1}
          >
            {plant.species || 'Unknown Species'}
          </Text>
          
          <View 
            nativeID={`plantdashboard-View-smartStatus-${index}`}
            style={styles.smartStatus}
          >
            <Text 
              nativeID={`plantdashboard-Text-smartWateringText-${index}`}
              style={[
                styles.smartWateringText,
                { 
                  color: smartWatering.urgent ? themeColors.error : plant.statusColor,
                  fontWeight: smartWatering.urgent ? 'bold' : '500'
                }
              ]}
            >
              {smartWatering.text}
            </Text>
            
            {!isMinimal && (
              <Text 
                nativeID={`plantdashboard-Text-smartWateringSubtext-${index}`}
                style={[styles.smartWateringSubtext, { color: themeColors.textSecondary }]}
              >
                {smartWatering.subtext}
              </Text>
            )}
          </View>
        </View>
        
        {renderQuickActions()}
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      nativeID={`plantdashboard-TouchableOpacity-plantCard-${index}`}
      style={[
        styles.card,
        {
          backgroundColor: themeColors.surface,
          borderColor: plant.urgencyLevel === 'critical' ? themeColors.error : themeColors.border,
          borderWidth: plant.urgencyLevel === 'critical' ? 2 : 1
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {renderPlantImage()}
      
      <View 
        nativeID={`plantdashboard-View-cardContent-${index}`}
        style={styles.cardContent}
      >
        <View 
          nativeID={`plantdashboard-View-cardHeader-${index}`}
          style={styles.cardHeader}
        >
          <Text 
            nativeID={`plantdashboard-Text-plantName-${index}`}
            style={[styles.cardPlantName, { color: themeColors.text }]}
            numberOfLines={1}
          >
            {plant.name || 'Unnamed Plant'}
          </Text>
          
          {renderCareIndicators()}
        </View>
        
        <Text 
          nativeID={`plantdashboard-Text-plantSpecies-${index}`}
          style={[styles.cardPlantSpecies, { color: themeColors.textSecondary }]}
          numberOfLines={1}
        >
          {plant.species || 'Unknown'}
        </Text>
        
        <View 
          nativeID={`plantdashboard-View-smartStatusCard-${index}`}
          style={styles.smartStatusCard}
        >
          <Text 
            nativeID={`plantdashboard-Text-smartWateringTextCard-${index}`}
            style={[
              styles.smartWateringTextCard,
              { 
                color: smartWatering.urgent ? themeColors.error : plant.statusColor,
                fontWeight: smartWatering.urgent ? 'bold' : '500'
              }
            ]}
          >
            {smartWatering.text}
          </Text>
          
          {!isMinimal && (
            <Text 
              nativeID={`plantdashboard-Text-smartWateringSubtextCard-${index}`}
              style={[styles.smartWateringSubtextCard, { color: themeColors.textSecondary }]}
            >
              {smartWatering.subtext}
            </Text>
          )}
        </View>
        
        {renderQuickActions()}
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  // Enhanced List styles
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  listImage: {
    width: 70,
    height: 70
  },
  listInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8
  },
  listActions: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 6
  },
  
  // Enhanced Card styles
  card: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden'
  },
  cardImage: {
    width: '100%',
    height: 140
  },
  cardContent: {
    padding: 12
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  cardActions: {
    marginTop: 8
  },
  
  // Image container with progress ring
  imageContainer: {
    position: 'relative'
  },
  progressRingContainer: {
    position: 'absolute',
    top: 8,
    right: 8
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progressFill: {
    width: 24,
    height: 24,
    borderRadius: 12
  },
  statusOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  // Plant info
  plantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1
  },
  cardPlantName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1
  },
  plantSpecies: {
    fontSize: 12,
    marginBottom: 6
  },
  cardPlantSpecies: {
    fontSize: 12,
    marginBottom: 8
  },
  
  // Care indicators
  careIndicators: {
    flexDirection: 'row',
    gap: 4
  },
  careBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  careBadgeText: {
    fontSize: 9,
    fontWeight: '600'
  },
  
  // Smart status
  smartStatus: {
    marginTop: 4
  },
  smartStatusCard: {
    marginBottom: 4
  },
  smartWateringText: {
    fontSize: 12,
    fontWeight: '500'
  },
  smartWateringTextCard: {
    fontSize: 11,
    fontWeight: '500'
  },
  smartWateringSubtext: {
    fontSize: 10,
    marginTop: 1
  },
  smartWateringSubtextCard: {
    fontSize: 9,
    marginTop: 1
  },
  
  // Action buttons
  listWaterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 80
  },
  cardWaterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 4
  },
  listFertilizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    minWidth: 70
  },
  cardFertilizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16
  },
  waterButtonText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4
  },
  fertilizeButtonText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4
  }
};