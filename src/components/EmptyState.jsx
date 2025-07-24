import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'apptile-core';

export function EmptyState({ onAddPlant, themeColors }) {
  return (
    <View 
      nativeID={'plantdashboard-View-emptyState'}
      style={styles.container}
    >
      <View 
        nativeID={'plantdashboard-View-emptyIconContainer'}
        style={[
          styles.iconContainer,
          { backgroundColor: themeColors.border }
        ]}
      >
        <Icon
          iconType="MaterialIcons"
          name="local-florist"
          size={48}
          color={themeColors.primary}
        />
      </View>
      
      <Text 
        nativeID={'plantdashboard-Text-emptyTitle'}
        style={[styles.title, { color: themeColors.text }]}
      >
        No Plants Yet
      </Text>
      
      <Text 
        nativeID={'plantdashboard-Text-emptySubtitle'}
        style={[styles.subtitle, { color: themeColors.textSecondary }]}
      >
        Start your plant collection by adding your first plant!
      </Text>
      
      <TouchableOpacity
        nativeID={'plantdashboard-TouchableOpacity-addFirstPlant'}
        style={[
          styles.addButton,
          { backgroundColor: themeColors.primary }
        ]}
        onPress={onAddPlant}
        activeOpacity={0.8}
      >
        <Icon
          iconType="MaterialIcons"
          name="add"
          size={20}
          color="white"
        />
        <Text style={styles.addButtonText}>
          Add Your First Plant
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  }
};
