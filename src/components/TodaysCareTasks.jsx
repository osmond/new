import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'apptile-core';
import moment from 'moment';

export function TodaysCareTasks({ 
  plants, 
  isExpanded, 
  onToggle, 
  onBatchWatering, 
  totalWaterNeeded, 
  themeColors 
}) {
  // Sort plants by urgency
  const sortedPlants = plants.sort((a, b) => {
    const urgencyOrder = { 'critical': 3, 'high': 2, 'medium': 1, 'low': 0 };
    return urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel];
  });
  
  // Calculate total estimated time (assuming 2 minutes per plant)
  const estimatedTime = plants.length * 2;
  
  const getUrgencyColor = (urgencyLevel) => {
    switch (urgencyLevel) {
      case 'critical': return themeColors.error;
      case 'high': return '#FF5722';
      case 'medium': return themeColors.warning;
      default: return themeColors.primary;
    }
  };
  
  const getUrgencyIcon = (urgencyLevel) => {
    switch (urgencyLevel) {
      case 'critical': return 'priority-high';
      case 'high': return 'warning';
      case 'medium': return 'schedule';
      default: return 'water-drop';
    }
  };
  
  const TaskItem = ({ plant, index }) => {
    const urgencyColor = getUrgencyColor(plant.urgencyLevel);
    
    return (
      <View 
        nativeID={`plantdashboard-View-taskItem-${index}`}
        style={[
          styles.taskItem,
          {
            backgroundColor: themeColors.surface,
            borderLeftColor: urgencyColor
          }
        ]}
      >
        <View 
          nativeID={`plantdashboard-View-taskIcon-${index}`}
          style={[
            styles.taskIcon,
            { backgroundColor: urgencyColor + '20' }
          ]}
        >
          <Icon
            iconType="MaterialIcons"
            name={getUrgencyIcon(plant.urgencyLevel)}
            size={16}
            color={urgencyColor}
          />
        </View>
        
        <View 
          nativeID={`plantdashboard-View-taskInfo-${index}`}
          style={styles.taskInfo}
        >
          <Text 
            nativeID={`plantdashboard-Text-taskPlantName-${index}`}
            style={[styles.taskPlantName, { color: themeColors.text }]}
          >
            {plant.name || 'Unnamed Plant'}
          </Text>
          
          <Text 
            nativeID={`plantdashboard-Text-taskDescription-${index}`}
            style={[styles.taskDescription, { color: urgencyColor }]}
          >
            Water with {plant.waterAmount?.ml || 250}ml
            {plant.urgencyLevel === 'critical' && ' • URGENT'}
            {plant.fertilizerStatus?.isDue && ' • Feed needed'}
          </Text>
          
          {plant.location && (
            <Text 
              nativeID={`plantdashboard-Text-taskLocation-${index}`}
              style={[styles.taskLocation, { color: themeColors.textSecondary }]}
            >
              📍 {plant.location}
            </Text>
          )}
        </View>
        
        <View 
          nativeID={`plantdashboard-View-taskMeta-${index}`}
          style={styles.taskMeta}
        >
          <Text 
            nativeID={`plantdashboard-Text-taskTime-${index}`}
            style={[styles.taskTime, { color: themeColors.textSecondary }]}
          >
            ~2 min
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <View 
      nativeID={'plantdashboard-View-todaysCareTasks'}
      style={styles.container}
    >
      <TouchableOpacity
        nativeID={'plantdashboard-TouchableOpacity-tasksHeader'}
        style={[
          styles.tasksHeader,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border
          }
        ]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View 
          nativeID={'plantdashboard-View-headerLeft'}
          style={styles.headerLeft}
        >
          <View 
            nativeID={'plantdashboard-View-headerIcon'}
            style={[
              styles.headerIcon,
              { backgroundColor: themeColors.warning + '20' }
            ]}
          >
            <Icon
              iconType="MaterialIcons"
              name="today"
              size={20}
              color={themeColors.warning}
            />
          </View>
          
          <View nativeID={'plantdashboard-View-headerText'}>
            <Text 
              nativeID={'plantdashboard-Text-tasksTitle'}
              style={[styles.tasksTitle, { color: themeColors.text }]}
            >
              Today's Care Tasks ({plants.length})
            </Text>
            
            <Text 
              nativeID={'plantdashboard-Text-tasksSubtitle'}
              style={[styles.tasksSubtitle, { color: themeColors.textSecondary }]}
            >
              ~{estimatedTime} min • {Math.round(totalWaterNeeded / 1000 * 10) / 10}L water needed
            </Text>
          </View>
        </View>
        
        <View 
          nativeID={'plantdashboard-View-headerRight'}
          style={styles.headerRight}
        >
          {onBatchWatering && (
            <TouchableOpacity
              nativeID={'plantdashboard-TouchableOpacity-batchWaterBtn'}
              style={[
                styles.batchWaterButton,
                { backgroundColor: themeColors.primary }
              ]}
              onPress={(e) => {
                e.stopPropagation();
                onBatchWatering();
              }}
              activeOpacity={0.8}
            >
              <Icon
                iconType="MaterialIcons"
                name="water-drop"
                size={14}
                color="white"
              />
              <Text 
                nativeID={'plantdashboard-Text-batchWaterText'}
                style={styles.batchWaterText}
              >
                Water All
              </Text>
            </TouchableOpacity>
          )}
          
          <Icon
            iconType="MaterialIcons"
            name={isExpanded ? 'expand-less' : 'expand-more'}
            size={24}
            color={themeColors.textSecondary}
          />
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <View 
          nativeID={'plantdashboard-View-tasksList'}
          style={[
            styles.tasksList,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border
            }
          ]}
        >
          {sortedPlants.map((plant, index) => (
            <TaskItem key={plant.id} plant={plant} index={index} />
          ))}
          
          {/* Care efficiency tip */}
          <View 
            nativeID={'plantdashboard-View-efficiencyTip'}
            style={[
              styles.efficiencyTip,
              {
                backgroundColor: themeColors.primary + '10',
                borderColor: themeColors.primary + '30'
              }
            ]}
          >
            <Icon 
              iconType="MaterialIcons" 
              name="lightbulb-outline" 
              size={14} 
              color={themeColors.primary} 
            />
            <Text 
              nativeID={'plantdashboard-Text-efficiencyText'}
              style={[
                styles.efficiencyText,
                { color: themeColors.text }
              ]}
            >
              💡 Group plants by location for efficient care rounds
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = {
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  tasksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  tasksTitle: {
    fontSize: 16,
    fontWeight: '600'
  },
  tasksSubtitle: {
    fontSize: 12,
    marginTop: 2
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  batchWaterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20
  },
  batchWaterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4
  },
  tasksList: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden'
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderLeftWidth: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#0000001A'
  },
  taskIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  taskInfo: {
    flex: 1
  },
  taskPlantName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2
  },
  taskDescription: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2
  },
  taskLocation: {
    fontSize: 11
  },
  taskMeta: {
    alignItems: 'flex-end'
  },
  taskTime: {
    fontSize: 10,
    fontWeight: '500'
  },
  efficiencyTip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    margin: 8,
    borderRadius: 8
  },
  efficiencyText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 6,
    flex: 1
  }
};