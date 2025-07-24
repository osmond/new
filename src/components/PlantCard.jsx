import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'apptile-core';
import moment from 'moment';

export function PlantCard({ plant, onPress, onWater, themeColors, style, index }) {
  const isListStyle = style === 'list';
  
  const getStatusText = () => {
    switch (plant.status) {
      case 'overdue':
        return `${plant.daysSinceWatered} days overdue`;
      case 'due':
        return 'Due today';
      default:
        return `Next: ${plant.wateringFrequency - plant.daysSinceWatered} days`;
    }
  };
  
  const renderPlantImage = () => {
    if (plant.image) {
      return (
        <Image
          nativeID={`plantdashboard-Image-plantPhoto-${index}`}
          source={{ uri: plant.image }}
          style={[
            isListStyle ? styles.listImage : styles.cardImage,
            { borderRadius: 8 }
          ]}
          resizeMode="cover"
        />
      );
    } else {
      return (
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
      );
    }
  };
  
  if (isListStyle) {
    return (
      <TouchableOpacity
        nativeID={`plantdashboard-TouchableOpacity-plantCard-${index}`}
        style={[
          styles.listCard,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border
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
          <Text 
            nativeID={`plantdashboard-Text-plantName-${index}`}
            style={[styles.plantName, { color: themeColors.text }]}
            numberOfLines={1}
          >
            {plant.name || 'Unnamed Plant'}
          </Text>
          
          <Text 
            nativeID={`plantdashboard-Text-plantSpecies-${index}`}
            style={[styles.plantSpecies, { color: themeColors.textSecondary }]}
            numberOfLines={1}
          >
            {plant.species || 'Unknown Species'}
          </Text>
          
          <View 
            nativeID={`plantdashboard-View-statusRow-${index}`}
            style={styles.statusRow}
          >
            <View 
              nativeID={`plantdashboard-View-statusIndicator-${index}`}
              style={[
                styles.statusDot,
                { backgroundColor: plant.statusColor }
              ]}
            />
            <Text 
              nativeID={`plantdashboard-Text-statusText-${index}`}
              style={[styles.statusText, { color: plant.statusColor }]}
            >
              {getStatusText()}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          nativeID={`plantdashboard-TouchableOpacity-waterBtn-${index}`}
          style={[
            styles.waterButton,
            { backgroundColor: themeColors.primary }
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
            size={18}
            color="white"
          />
        </TouchableOpacity>
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
          borderColor: themeColors.border
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
        <Text 
          nativeID={`plantdashboard-Text-plantName-${index}`}
          style={[styles.cardPlantName, { color: themeColors.text }]}
          numberOfLines={1}
        >
          {plant.name || 'Unnamed Plant'}
        </Text>
        
        <Text 
          nativeID={`plantdashboard-Text-plantSpecies-${index}`}
          style={[styles.cardPlantSpecies, { color: themeColors.textSecondary }]}
          numberOfLines={1}
        >
          {plant.species || 'Unknown'}
        </Text>
        
        <View 
          nativeID={`plantdashboard-View-statusContainer-${index}`}
          style={styles.cardStatusContainer}
        >
          <View 
            nativeID={`plantdashboard-View-statusIndicator-${index}`}
            style={[
              styles.statusDot,
              { backgroundColor: plant.statusColor }
            ]}
          />
          <Text 
            nativeID={`plantdashboard-Text-statusText-${index}`}
            style={[styles.cardStatusText, { color: plant.statusColor }]}
          >
            {getStatusText()}
          </Text>
        </View>
        
        <TouchableOpacity
          nativeID={`plantdashboard-TouchableOpacity-waterBtn-${index}`}
          style={[
            styles.cardWaterButton,
            { backgroundColor: themeColors.primary }
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
            size={16}
            color="white"
          />
          <Text style={[styles.waterButtonText, { color: 'white' }]}>
            Water
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  // List styles
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  listImage: {
    width: 60,
    height: 60
  },
  listInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8
  },
  
  // Card styles
  card: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden'
  },
  cardImage: {
    width: '100%',
    height: 120
  },
  cardContent: {
    padding: 12
  },
  cardPlantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2
  },
  cardPlantSpecies: {
    fontSize: 12,
    marginBottom: 8
  },
  cardStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  cardStatusText: {
    fontSize: 11,
    fontWeight: '500'
  },
  cardWaterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'stretch'
  },
  
  // Shared styles
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2
  },
  plantSpecies: {
    fontSize: 12,
    marginBottom: 4
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500'
  },
  waterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  waterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4
  }
};
