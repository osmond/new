import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useApptileWindowDims, Icon, navigateToScreen } from 'apptile-core';
import moment from 'moment';
import OverviewCards from './components/OverviewCards';
import WaterUsageCharts from './components/WaterUsageCharts';
import HealthTrendsCharts from './components/HealthTrendsCharts';
import CareInsights from './components/CareInsights';
import TimeRangeSelector from './components/TimeRangeSelector';
import { generateMockCareHistory, calculatePlantHealth, getPlantAnalytics } from './utils/analyticsUtils';
import styles from './styles';

export default function AnalyticsDashboard({
  showWaterUsageCharts,
  showHealthTrends,
  showCareInsights,
  defaultTimeRange,
  enableGoalTracking,
  primaryColor,
  secondaryColor,
  backgroundColor
}) {
  const { width, height } = useApptileWindowDims();
  const dispatch = useDispatch();
  
  const [selectedTimeRange, setSelectedTimeRange] = useState(defaultTimeRange);
  const [selectedPlantId, setSelectedPlantId] = useState('all');
  
  // Get plant data from global plugin
  const plantData = useSelector(
    state => state.appModel.values.getIn(['plantData', 'value']),
    shallowEqual
  );
  
  const plants = Array.isArray(plantData?.plants) ? plantData.plants : [];
  
  // Process plants and add mock data if needed
  const processedPlants = useMemo(() => {
    return plants.map(plant => {
      // Add mock care history if it doesn't exist or is empty
      if (!plant.careHistory || plant.careHistory.length === 0) {
        plant.careHistory = generateMockCareHistory(plant);
      }
      
      // Calculate health score
      plant.healthScore = calculatePlantHealth(plant);
      
      return plant;
    });
  }, [plants]);
  
  // Get analytics data based on selected filters
  const analyticsData = useMemo(() => {
    return getPlantAnalytics(processedPlants, selectedTimeRange, selectedPlantId);
  }, [processedPlants, selectedTimeRange, selectedPlantId]);
  
  const navigateToHome = () => {
    dispatch(navigateToScreen('Home', {}));
  };
  
  const navigateToPlantDetail = (plantId) => {
    dispatch(navigateToScreen('PlantDetail', { plantId }));
  };
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      showsVerticalScrollIndicator={false}
      nativeID="healthanalytics-ScrollView-MainContainer"
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: primaryColor }]}>
        <TouchableOpacity 
          onPress={navigateToHome}
          style={styles.backButton}
          nativeID="healthanalytics-TouchableOpacity-BackButton"
        >
          <Icon iconType="MaterialIcons" name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plant Health Analytics</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      {/* Time Range Selector */}
      <TimeRangeSelector
        selectedRange={selectedTimeRange}
        onRangeChange={setSelectedTimeRange}
        primaryColor={primaryColor}
      />
      
      {/* Plant Filter */}
      <View style={styles.filterContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.plantFilter}
          nativeID="healthanalytics-ScrollView-PlantFilter"
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedPlantId === 'all' && { backgroundColor: primaryColor }
            ]}
            onPress={() => setSelectedPlantId('all')}
            nativeID="healthanalytics-TouchableOpacity-AllPlantsFilter"
          >
            <Text style={[
              styles.filterChipText,
              selectedPlantId === 'all' && { color: 'white' }
            ]}>All Plants</Text>
          </TouchableOpacity>
          
          {processedPlants.map(plant => (
            <TouchableOpacity
              key={plant.id}
              style={[
                styles.filterChip,
                selectedPlantId === plant.id && { backgroundColor: primaryColor }
              ]}
              onPress={() => setSelectedPlantId(plant.id)}
              nativeID={`healthanalytics-TouchableOpacity-PlantFilter-${plant.id}`}
            >
              <Text style={[
                styles.filterChipText,
                selectedPlantId === plant.id && { color: 'white' }
              ]}>{plant.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.content}>
        {/* Overview Cards */}
        <OverviewCards 
          analyticsData={analyticsData}
          enableGoalTracking={enableGoalTracking}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          onPlantPress={navigateToPlantDetail}
        />
        
        {/* Water Usage Charts */}
        {showWaterUsageCharts && (
          <WaterUsageCharts 
            analyticsData={analyticsData}
            timeRange={selectedTimeRange}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        )}
        
        {/* Health Trends */}
        {showHealthTrends && (
          <HealthTrendsCharts 
            analyticsData={analyticsData}
            timeRange={selectedTimeRange}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onPlantPress={navigateToPlantDetail}
          />
        )}
        
        {/* Care Insights */}
        {showCareInsights && (
          <CareInsights 
            analyticsData={analyticsData}
            plants={processedPlants}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onPlantPress={navigateToPlantDetail}
          />
        )}
      </View>
    </ScrollView>
  );
}