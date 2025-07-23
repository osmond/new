import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useApptileWindowDims, navigateToScreen, Icon } from 'apptile-core';
import { SmartCareOverview } from './SmartCareOverview';
import { IntelligentPlantCard } from './IntelligentPlantCard';
import { SmartInsights } from './SmartInsights';
import { TodaysCareTasks } from './TodaysCareTasks';
import { EnhancedEmptyState } from './EnhancedEmptyState';
import { styles } from './styles';
import moment from 'moment';

export function ReactComponent({ model }) {
  const id = model.get('id');
  const { width, height } = useApptileWindowDims();
  const dispatch = useDispatch();
  
  // Get props from model
  const showQuickStats = model.get('showQuickStats') !== false; // default true
  const plantsPerRow = parseInt(model.get('plantsPerRow')) || 2;
  const cardStyle = model.get('cardStyle') || 'card';
  const showCarePlanInsights = model.get('showCarePlanInsights') !== false;
  const enableBatchWatering = model.get('enableBatchWatering') !== false;
  const showSeasonalTips = model.get('showSeasonalTips') !== false;
  const careCardStyle = model.get('careCardStyle') || 'detailed';
  
  // State for expandable sections
  const [showTodaysTasks, setShowTodaysTasks] = useState(false);
  
  // Get plant data from global plugin
  const plantData = useSelector(
    state => state.appModel.values.getIn(['plantData', 'value']),
    shallowEqual
  );
  
  const plants = Array.isArray(plantData?.plants) ? plantData.plants : [];
  const theme = plantData?.theme || 'light';
  const isDarkMode = theme === 'dark';
  
  // Enhanced plant analysis with care plan data
  const plantsWithEnhancedStatus = plants.map(plant => {
    const lastWatered = new Date(plant.lastWatered || plant.dateAdded);
    const today = new Date();
    const daysSinceWatered = Math.floor((today - lastWatered) / (1000 * 60 * 60 * 24));
    
    // Use care plan watering interval or fallback to wateringFrequency
    const wateringInterval = plant.carePlan?.wateringInterval || plant.wateringFrequency || 7;
    const waterAmount = plant.carePlan?.waterAmount || { ml: 250, oz: 8.5 };
    
    let status = 'upcoming';
    let statusColor = '#4CAF50'; // green
    let urgencyLevel = 'low';
    
    if (daysSinceWatered >= wateringInterval) {
      status = 'overdue';
      statusColor = '#F44336'; // red
      urgencyLevel = daysSinceWatered >= wateringInterval + 2 ? 'critical' : 'high';
    } else if (daysSinceWatered >= wateringInterval - 1) {
      status = 'due';
      statusColor = '#FF9800'; // orange
      urgencyLevel = 'medium';
    }
    
    // Calculate care difficulty
    const careDifficulty = getCareDifficulty(plant.species);
    
    // Check fertilizer status
    const fertilizerStatus = getFertilizerStatus(plant);
    
    // Light requirement compatibility
    const lightCompatibility = getLightCompatibility(plant);
    
    return {
      ...plant,
      daysSinceWatered,
      wateringInterval,
      waterAmount,
      status,
      statusColor,
      urgencyLevel,
      careDifficulty,
      fertilizerStatus,
      lightCompatibility
    };
  });
  
  // Helper functions
  function getCareDifficulty(species) {
    const easyPlants = ['pothos', 'snake plant', 'spider plant', 'philodendron'];
    const hardPlants = ['fiddle leaf fig', 'orchid', 'bonsai', 'calathea'];
    
    if (easyPlants.some(plant => species?.toLowerCase().includes(plant))) {
      return { level: 'Easy', color: '#4CAF50' };
    } else if (hardPlants.some(plant => species?.toLowerCase().includes(plant))) {
      return { level: 'Hard', color: '#F44336' };
    }
    return { level: 'Medium', color: '#FF9800' };
  }
  
  function getFertilizerStatus(plant) {
    const lastFertilized = plant.lastFertilized ? new Date(plant.lastFertilized) : null;
    const fertilizerFreq = plant.carePlan?.fertilizingFrequency || 'monthly';
    
    if (!lastFertilized) {
      return { status: 'never', daysUntilDue: 0, isDue: true };
    }
    
    const daysSinceFertilized = Math.floor((new Date() - lastFertilized) / (1000 * 60 * 60 * 24));
    const intervalDays = fertilizerFreq === 'weekly' ? 7 : fertilizerFreq === 'monthly' ? 30 : 90;
    
    return {
      status: daysSinceFertilized >= intervalDays ? 'due' : 'upcoming',
      daysUntilDue: Math.max(0, intervalDays - daysSinceFertilized),
      isDue: daysSinceFertilized >= intervalDays
    };
  }
  
  function getLightCompatibility(plant) {
    const lightReq = plant.carePlan?.lightRequirements || 'medium';
    const currentLight = plant.lightCondition || 'medium';
    
    const compatibility = lightReq === currentLight ? 'perfect' : 
                         Math.abs(getLightLevel(lightReq) - getLightLevel(currentLight)) === 1 ? 'good' : 'poor';
    
    return { compatibility, required: lightReq, current: currentLight };
  }
  
  function getLightLevel(light) {
    const levels = { 'low': 1, 'medium': 2, 'high': 3, 'bright': 4 };
    return levels[light] || 2;
  }
  
  // Calculate smart metrics
  const totalPlants = plants.length;
  const aiCarePlans = plants.filter(p => p.carePlan?.autoGenerated).length;
  const plantsNeedingWaterToday = plantsWithEnhancedStatus.filter(p => p.status === 'due').length;
  const overduePlants = plantsWithEnhancedStatus.filter(p => p.status === 'overdue').length;
  const thrivingPlants = plantsWithEnhancedStatus.filter(p => p.lightCompatibility.compatibility === 'perfect').length;
  
  // Calculate total water needed today
  const totalWaterNeeded = plantsWithEnhancedStatus
    .filter(p => p.status === 'due' || p.status === 'overdue')
    .reduce((total, plant) => total + (plant.waterAmount?.ml || 250), 0);
  
  // Handle batch watering
  const handleBatchWatering = () => {
    const plantsToWater = plantsWithEnhancedStatus.filter(p => p.status === 'due' || p.status === 'overdue');
    
    const updatedPlants = plants.map(plant => {
      if (plantsToWater.some(p => p.id === plant.id)) {
        return { ...plant, lastWatered: new Date().toISOString() };
      }
      return plant;
    });
    
    dispatch({
      type: 'PLUGIN_MODEL_UPDATE',
      payload: {
        changesets: [{
          selector: ['plantData', 'value'],
          newValue: {
            ...plantData,
            plants: updatedPlants
          }
        }],
        runOnUpdate: true
      },
    });
    
    toast?.show(`🌱 Watered ${plantsToWater.length} plants with ${totalWaterNeeded}ml total!`, {
      type: 'success',
      placement: 'top',
      duration: 3000
    });
  };
  
  // Handle individual watering
  const handleWaterPlant = (plantId) => {
    const plant = plantsWithEnhancedStatus.find(p => p.id === plantId);
    const updatedPlants = plants.map(p => 
      p.id === plantId 
        ? { ...p, lastWatered: new Date().toISOString() }
        : p
    );
    
    dispatch({
      type: 'PLUGIN_MODEL_UPDATE',
      payload: {
        changesets: [{
          selector: ['plantData', 'value'],
          newValue: {
            ...plantData,
            plants: updatedPlants
          }
        }],
        runOnUpdate: true
      },
    });
    
    toast?.show(`💧 ${plant?.name} watered with ${plant?.waterAmount?.ml || 250}ml!`, {
      type: 'success',
      placement: 'top',
      duration: 2000
    });
  };
  
  // Handle fertilizing
  const handleFertilizePlant = (plantId) => {
    const plant = plants.find(p => p.id === plantId);
    const updatedPlants = plants.map(p => 
      p.id === plantId 
        ? { ...p, lastFertilized: new Date().toISOString() }
        : p
    );
    
    dispatch({
      type: 'PLUGIN_MODEL_UPDATE',
      payload: {
        changesets: [{
          selector: ['plantData', 'value'],
          newValue: {
            ...plantData,
            plants: updatedPlants
          }
        }],
        runOnUpdate: true
      },
    });
    
    toast?.show(`🌱 ${plant?.name} fertilized!`, {
      type: 'success',
      placement: 'top',
      duration: 2000
    });
  };
  
  // Navigation handlers
  const handlePlantPress = (plant) => {
    dispatch(navigateToScreen('PlantDetail', { plantId: plant.id }));
  };
  
  const handleAddPlant = () => {
    dispatch(navigateToScreen('AddPlant', {}));
  };
  
  const handleSettings = () => {
    dispatch(navigateToScreen('Settings', {}));
  };
  
  const handleCareTips = () => {
    dispatch(navigateToScreen('CareTips', {}));
  };
  
  const themeColors = {
    background: isDarkMode ? '#121212' : '#F5F5F5',
    surface: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    primary: '#4CAF50',
    secondary: '#2196F3',
    accent: '#FF9800',
    text: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#B0B0B0' : '#666666',
    border: isDarkMode ? '#333333' : '#E0E0E0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336'
  };
  
  return (
    <View
      nativeID={'rootElement-' + id}
      style={[
        styles.container,
        {
          width,
          height,
          backgroundColor: themeColors.background,
          flex: 'none'
        }
      ]}
    >
      {/* Enhanced Header */}
      <View 
        nativeID={'plantdashboard-View-header'}
        style={[
          styles.header,
          { backgroundColor: themeColors.surface, borderBottomColor: themeColors.border }
        ]}
      >
        <View nativeID={'plantdashboard-View-headerLeft'}>
          <Text 
            nativeID={'plantdashboard-Text-title'}
            style={[styles.headerTitle, { color: themeColors.text }]}
          >
            My Plants
          </Text>
          {aiCarePlans > 0 && (
            <View 
              nativeID={'plantdashboard-View-aiIndicator'}
              style={styles.aiIndicator}
            >
              <Icon iconType="MaterialIcons" name="smart-toy" size={12} color={themeColors.secondary} />
              <Text style={[styles.aiIndicatorText, { color: themeColors.secondary }]}>
                {aiCarePlans} AI Care Plans Active
              </Text>
            </View>
          )}
        </View>
        
        <View 
          nativeID={'plantdashboard-View-headerActions'}
          style={styles.headerActions}
        >
          <TouchableOpacity
            nativeID={'plantdashboard-TouchableOpacity-careTipsBtn'}
            style={[styles.headerButton, { backgroundColor: themeColors.border }]}
            onPress={handleCareTips}
            activeOpacity={0.7}
          >
            <Icon 
              iconType="MaterialIcons" 
              name="lightbulb-outline" 
              size={20} 
              color={themeColors.text} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            nativeID={'plantdashboard-TouchableOpacity-settingsBtn'}
            style={[styles.headerButton, { backgroundColor: themeColors.border }]}
            onPress={handleSettings}
            activeOpacity={0.7}
          >
            <Icon 
              iconType="MaterialIcons" 
              name="settings" 
              size={20} 
              color={themeColors.text} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        nativeID={'plantdashboard-ScrollView-content'}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {plants.length > 0 ? (
          <>
            {/* Smart Care Overview */}
            <SmartCareOverview 
              plantsNeedingWater={plantsNeedingWaterToday}
              overduePlants={overduePlants}
              totalWaterNeeded={totalWaterNeeded}
              aiCarePlans={aiCarePlans}
              themeColors={themeColors}
              showSeasonalTips={showSeasonalTips}
            />
            
            {/* Today's Care Tasks */}
            {(plantsNeedingWaterToday > 0 || overduePlants > 0) && (
              <TodaysCareTasks 
                plants={plantsWithEnhancedStatus.filter(p => p.status === 'due' || p.status === 'overdue')}
                isExpanded={showTodaysTasks}
                onToggle={() => setShowTodaysTasks(!showTodaysTasks)}
                onBatchWatering={enableBatchWatering ? handleBatchWatering : null}
                totalWaterNeeded={totalWaterNeeded}
                themeColors={themeColors}
              />
            )}
            
            {/* Smart Insights */}
            {showCarePlanInsights && (
              <SmartInsights 
                plants={plantsWithEnhancedStatus}
                thrivingPlants={thrivingPlants}
                totalPlants={totalPlants}
                themeColors={themeColors}
              />
            )}
            
            {/* Enhanced Plants Grid/List */}
            <View 
              nativeID={'plantdashboard-View-plantsContainer'}
              style={styles.plantsContainer}
            >
              <Text 
                nativeID={'plantdashboard-Text-plantsTitle'}
                style={[styles.sectionTitle, { color: themeColors.text }]}
              >
                Your Plants ({totalPlants})
              </Text>
              
              {cardStyle === 'list' ? (
                // Enhanced List view
                <View nativeID={'plantdashboard-View-plantsList'}>
                  {plantsWithEnhancedStatus.map((plant, index) => (
                    <IntelligentPlantCard
                      key={plant.id}
                      plant={plant}
                      onPress={() => handlePlantPress(plant)}
                      onWater={() => handleWaterPlant(plant.id)}
                      onFertilize={() => handleFertilizePlant(plant.id)}
                      themeColors={themeColors}
                      style="list"
                      careCardStyle={careCardStyle}
                      index={index}
                    />
                  ))}
                </View>
              ) : (
                // Enhanced Grid view
                <View 
                  nativeID={'plantdashboard-View-plantsGrid'}
                  style={[styles.plantsGrid, { width: width - 32 }]}
                >
                  {plantsWithEnhancedStatus.map((plant, index) => (
                    <View
                      key={plant.id}
                      style={{
                        width: `${100 / plantsPerRow}%`,
                        paddingHorizontal: 4,
                        marginBottom: 12
                      }}
                    >
                      <IntelligentPlantCard
                        plant={plant}
                        onPress={() => handlePlantPress(plant)}
                        onWater={() => handleWaterPlant(plant.id)}
                        onFertilize={() => handleFertilizePlant(plant.id)}
                        themeColors={themeColors}
                        style="card"
                        careCardStyle={careCardStyle}
                        index={index}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        ) : (
          <EnhancedEmptyState 
            onAddPlant={handleAddPlant} 
            themeColors={themeColors}
          />
        )}
        
        {/* Bottom padding for floating button */}
        <View style={{ height: 100 }} />
      </ScrollView>
      
      {/* Enhanced Floating Add Button */}
      <TouchableOpacity
        nativeID={'plantdashboard-TouchableOpacity-floatingAddBtn'}
        style={[
          styles.floatingButton,
          { backgroundColor: themeColors.primary }
        ]}
        onPress={handleAddPlant}
        activeOpacity={0.8}
      >
        <Icon 
          iconType="MaterialIcons" 
          name="add" 
          size={28} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );
}

export const WidgetConfig = {
  showQuickStats: '',
  plantsPerRow: '',
  cardStyle: '',
  showCarePlanInsights: '',
  enableBatchWatering: '',
  showSeasonalTips: '',
  careCardStyle: ''
};

export const WidgetEditors = {
  basic: [
    {
      targets: ['plantdashboard-View-plantsContainer'],
      type: 'checkbox',
      name: 'showQuickStats',
      props: {
        label: 'Show Quick Stats'
      }
    },
    {
      targets: ['plantdashboard-View-plantsGrid'],
      type: 'rangeSliderInput',
      name: 'plantsPerRow',
      defaultValue: 2,
      props: {
        label: 'Plants per Row',
        minRange: 1,
        maxRange: 4,
        step: 1
      }
    },
    {
      targets: ['plantdashboard-View-plantsContainer'],
      type: 'radioGroup',
      name: 'cardStyle',
      props: {
        label: 'Display Style',
        options: [
          { text: 'Card View', value: 'card' },
          { text: 'List View', value: 'list' }
        ]
      }
    },
    {
      targets: ['plantdashboard-View-header'],
      type: 'checkbox',
      name: 'showCarePlanInsights',
      props: {
        label: 'Show AI Care Insights'
      }
    },
    {
      targets: ['plantdashboard-View-header'],
      type: 'checkbox',
      name: 'enableBatchWatering',
      props: {
        label: 'Enable Batch Watering'
      }
    },
    {
      targets: ['plantdashboard-View-header'],
      type: 'checkbox',
      name: 'showSeasonalTips',
      props: {
        label: 'Show Seasonal Tips'
      }
    },
    {
      targets: ['plantdashboard-View-plantsContainer'],
      type: 'radioGroup',
      name: 'careCardStyle',
      props: {
        label: 'Care Info Detail Level',
        options: [
          { text: 'Minimal', value: 'minimal' },
          { text: 'Detailed', value: 'detailed' },
          { text: 'Compact', value: 'compact' }
        ]
      }
    }
  ]
};

export const PropertySettings = {};

export const WrapperTileConfig = {
  name: 'Smart Plant Dashboard',
  defaultProps: {
    showQuickStats: true,
    plantsPerRow: 2,
    cardStyle: 'card',
    showCarePlanInsights: true,
    enableBatchWatering: true,
    showSeasonalTips: true,
    careCardStyle: 'detailed'
  },
};