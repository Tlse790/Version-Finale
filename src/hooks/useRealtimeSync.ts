// client/src/hooks/useRealtimeSync.ts
import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/useAppStore';

interface RealtimeSyncOptions {
  pillar: 'hydration' | 'nutrition' | 'sleep' | 'workout';
  onUpdate?: (payload: any) => void;
  onInsert?: (payload: any) => void;
  onDelete?: (payload: any) => void;
}

export const useRealtimeSync = ({ pillar, onUpdate, onInsert, onDelete }: RealtimeSyncOptions) => {
  const channelRef = useRef<any>(null);
  const { appStoreUser } = useAppStore();

  useEffect(() => {
    if (!appStoreUser?.id) return;

    // Table mapping for each pillar
    const tableMap = {
      hydration: 'hydration_logs',
      nutrition: 'meals',
      sleep: 'sleep_sessions',
      workout: 'workout_sessions'
    };

    const table = tableMap[pillar];
    const channelName = `${pillar}-${appStoreUser.id}`;

    // Create channel
    channelRef.current = supabase.channel(channelName)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table,
          filter: `user_id=eq.${appStoreUser.id}`
        },
        (payload) => {
          console.log(`📡 Realtime update for ${pillar}:`, payload);
          
          // Add userId to payload for identification
          const userId = (payload.new && typeof payload.new === 'object' && 'user_id' in payload.new) ? payload.new.user_id :
                         (payload.old && typeof payload.old === 'object' && 'user_id' in payload.old) ? payload.old.user_id : undefined;
          const enrichedPayload = {
            ...payload,
            userId
          };

          switch (payload.eventType) {
            case 'INSERT':
              onInsert?.(enrichedPayload);
              onUpdate?.(enrichedPayload);
              break;
            case 'UPDATE':
              onUpdate?.(enrichedPayload);
              break;
            case 'DELETE':
              onDelete?.(enrichedPayload);
              onUpdate?.(enrichedPayload);
              break;
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [appStoreUser?.id, pillar, onUpdate, onInsert, onDelete]);

  return {
    isConnected: !!channelRef.current
  };
};
