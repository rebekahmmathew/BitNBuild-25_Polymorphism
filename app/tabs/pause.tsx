import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useSubscription } from '@/context/SubscriptionContext';
import { router } from 'expo-router';

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function PausePlanScreen() {
  const { pauseSubscription } = useSubscription();
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(addDays(new Date(), 1));
  const [donate, setDonate] = useState<boolean>(false);

  const dateRange = useMemo(() => {
    const dates: string[] = [];
    const cur = new Date(start);
    while (cur <= end) {
      dates.push(new Date(cur).toISOString().slice(0, 10));
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  }, [start, end]);

  const canConfirm = start <= end;

  const quickRanges = [
    { label: 'Today', days: 0 },
    { label: '2 days', days: 1 },
    { label: '3 days', days: 2 },
    { label: '1 week', days: 6 },
  ];

  const adjustRange = (days: number) => {
    const s = new Date();
    const e = addDays(s, days);
    setStart(s);
    setEnd(e);
  };

  const changeStartBy = (delta: number) => setStart(addDays(start, delta));
  const changeEndBy = (delta: number) => setEnd(addDays(end, delta));

  const onConfirm = async () => {
    if (!canConfirm) return;
    await pauseSubscription(dateRange, donate);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Pause Plan</Text>
        <Text style={styles.subtitle}>Choose a date range to pause your meals</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Date Range</Text>
          <View style={styles.rowBetween}>
            <View style={styles.rangeBox}>
              <Text style={styles.rangeLabel}>Start</Text>
              <Text style={styles.rangeValue}>{formatDate(start)}</Text>
              <View style={styles.adjustRow}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => changeStartBy(-1)}><Text style={styles.adjustText}>-1d</Text></TouchableOpacity>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => changeStartBy(1)}><Text style={styles.adjustText}>+1d</Text></TouchableOpacity>
              </View>
            </View>
            <View style={styles.rangeBox}>
              <Text style={styles.rangeLabel}>End</Text>
              <Text style={styles.rangeValue}>{formatDate(end)}</Text>
              <View style={styles.adjustRow}>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => changeEndBy(-1)}><Text style={styles.adjustText}>-1d</Text></TouchableOpacity>
                <TouchableOpacity style={styles.adjustBtn} onPress={() => changeEndBy(1)}><Text style={styles.adjustText}>+1d</Text></TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.quickRow}>
            {quickRanges.map(q => (
              <TouchableOpacity key={q.label} style={styles.quickBtn} onPress={() => adjustRange(q.days)}>
                <Text style={styles.quickText}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.helper}>Total days: {dateRange.length}</Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Donate skipped meals?</Text>
          <Text style={styles.helper}>We will donate the skipped meals to our partner organizations feeding the hungry.</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity style={[styles.toggleBtn, donate && styles.toggleActive]} onPress={() => setDonate(true)}>
              <Text style={[styles.toggleText, donate && styles.toggleTextActive]}>Donate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toggleBtn, !donate && styles.toggleActive]} onPress={() => setDonate(false)}>
              <Text style={[styles.toggleText, !donate && styles.toggleTextActive]}>Don’t Donate</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Button title="Confirm Pause" onPress={onConfirm} disabled={!canConfirm} />
        <View style={{ height: 16 }} />
        <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#374151', marginTop: 16 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  card: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  rangeBox: { flex: 1, backgroundColor: '#FFF7ED', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#FED7AA' },
  rangeLabel: { fontSize: 12, color: '#9A3412', marginBottom: 4 },
  rangeValue: { fontSize: 16, fontWeight: '600', color: '#F97316', marginBottom: 8 },
  adjustRow: { flexDirection: 'row', gap: 8 },
  adjustBtn: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FED7AA', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  adjustText: { color: '#F97316', fontWeight: '600' },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  quickBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  quickText: { color: '#374151', fontWeight: '500' },
  helper: { fontSize: 12, color: '#6B7280', marginTop: 8 },
  toggleRow: { flexDirection: 'row', gap: 8 },
  toggleBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  toggleActive: { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' },
  toggleText: { color: '#6B7280', fontWeight: '600' },
  toggleTextActive: { color: '#F97316' },
});


