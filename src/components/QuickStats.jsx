import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'apptile-core';

export function QuickStats({ plants, themeColors }) {
  const totalPlants = plants.length;
  const overdueCount = plants.filter(p => p.status === 'overdue').length;
  const dueCount = plants.filter(p => p.status === 'due').length;
  const upcomingCount = plants.filter(p => p.status === 'upcoming').length;
  
  const StatCard = ({ title, count, icon, iconColor, index }) => {
    return (
      <View 
        nativeID={`plantdashboard-View-statCard-${index}`}
        style={[
          styles.statCard,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border
          }
        ]}
      >
        <View 
          nativeID={`plantdashboard-View-statIcon-${index}`}
          style={[
            styles.statIconContainer,
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
        
        <Text 
          nativeID={`plantdashboard-Text-statCount-${index}`}
          style={[styles.statCount, { color: themeColors.text }]}
        >
          {count}
        </Text>
        
        <Text 
          nativeID={`plantdashboard-Text-statTitle-${index}`}
          style={[styles.statTitle, { color: themeColors.textSecondary }]}
        >
          {title}
        </Text>
      </View>
    );
  };
  
  return (
    <View 
      nativeID={'plantdashboard-View-quickStats'}
      style={styles.container}
    >
      <Text 
        nativeID={'plantdashboard-Text-statsTitle'}
        style={[styles.sectionTitle, { color: themeColors.text }]}
      >
        Quick Stats
      </Text>
      
      <View 
        nativeID={'plantdashboard-View-statsGrid'}
        style={styles.statsGrid}
      >
        <StatCard
          title="Total Plants"
          count={totalPlants}
          icon="local-florist"
          iconColor={themeColors.primary}
          index={0}
        />
        
        <StatCard
          title="Need Water"
          count={overdueCount + dueCount}
          icon="water-drop"
          iconColor={overdueCount > 0 ? '#F44336' : '#FF9800'}
          index={1}
        />
        
        <StatCard
          title="Overdue"
          count={overdueCount}
          icon="warning"
          iconColor="#F44336"
          index={2}
        />
        
        <StatCard
          title="Upcoming"
          count={upcomingCount}
          icon="schedule"
          iconColor="#4CAF50"
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  statCard: {
    width: '48%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  statCount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center'
  }
};
