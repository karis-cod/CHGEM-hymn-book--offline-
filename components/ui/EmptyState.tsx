// FILE PATH: components/ui/EmptyState.tsx
// PURPOSE: All empty state variants across the app.
// PRD Reference: Section 8.1 (all 8 variants defined here).

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ThemedText from './ThemedText';
import { SPACING, BORDER_RADIUS, TOUCH_TARGET_MIN } from '../../constants/layout';

export type EmptyStateVariant =
  | 'search'
  | 'favourites'
  | 'favourites-full'
  | 'recents'
  | 'category'
  | 'missing-lyrics'
  | 'corpus-error';

export interface EmptyStateProps {
  variant: EmptyStateVariant;
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  colours: {
    textPrimary: string;
    textSecondary: string;
    accentPrimary: string;
    border: string;
  };
}

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function getIcon(variant: EmptyStateVariant): IoniconName {
  switch (variant) {
    case 'search':          return 'search-outline';
    case 'favourites':      return 'heart-outline';
    case 'favourites-full': return 'heart';
    case 'recents':         return 'time-outline';
    case 'category':        return 'folder-outline';
    case 'missing-lyrics':  return 'document-text-outline';
    case 'corpus-error':    return 'warning-outline';
    default:                return 'help-outline';
  }
}

const EmptyState = React.memo(function EmptyState({
  variant,
  title,
  body,
  actionLabel,
  onAction,
  colours,
}: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityRole="text">
      <Ionicons
        name={getIcon(variant)}
        size={48}
        color={colours.textSecondary}
        style={styles.icon}
      />
      <ThemedText
        variant="listTitle"
        colour={colours.textPrimary}
        style={styles.title}
      >
        {title}
      </ThemedText>
      <ThemedText
        variant="body"
        colour={colours.textSecondary}
        style={styles.body}
      >
        {body}
      </ThemedText>
      {actionLabel !== undefined && onAction !== undefined && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            styles.action,
            {
              borderColor: colours.accentPrimary,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <ThemedText variant="uiLabel" colour={colours.accentPrimary}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
});

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  icon: {
    marginBottom: SPACING.md,
    opacity: 0.5,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  body: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  action: {
    borderWidth: 1.5,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    minHeight: TOUCH_TARGET_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
});