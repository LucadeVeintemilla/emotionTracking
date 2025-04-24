import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { useSession } from '@/context/SessionContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import { useAuth } from '@/context/AuthContext';

const EMOTION_LABELS = [
  "Enojo",
  "Miedo", 
  "Feliz",
  "Triste",
  "Sorpresa",
  "Neutral"
] as const;

const EMOTION_KEYS = [
  "angrys",
  "fear", 
  "happy",
  "sad", 
  "surprise",
  "neutral"
] as const;

type EmotionKey = typeof EMOTION_KEYS[number];

const commonChartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  barPercentage: 0.5,
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: "#e3e3e3",
    strokeDasharray: "0",
  },
  propsForLabels: {
    fontSize: 12,
    fontWeight: "bold",
  }
};

export default function StatsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSessionStats } = useSession();
  const { students } = useAuth();
  
  type EmotionStats = {
    student_id: string;
    before: Record<string, number>;
    after: Record<string, number>;
    total_frames: number;
  };
  
  const [stats, setStats] = useState<EmotionStats[]>([]);

  useEffect(() => {
    if (id) {
      loadStats();
    }
  }, [id]);

  const loadStats = async () => {
    try {
      const data = await getSessionStats(id);
      setStats(data);
  
      console.log('Stats loaded:', data);
  
      if (Array.isArray(data) && data.length > 0) {
        data.forEach((stat) => {
          const afterRow: Record<string, any> = {
            student: getStudentName(stat.student_id),
            ...stat.after, 
          };
          const beforeRow: Record<string, any> = {
            student: getStudentName(stat.student_id),
            ...stat.before, 
          };
  
          console.log("AFTER", afterRow);
          console.log("BEFORE", beforeRow);
        });
      } else {
        console.log("No stats data to show");
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  
  const getStudentName = (student_id: string) => {
    const student = students.find(s => s.id === student_id);
    return student ? `${student.name} ${student.last_name}` : 'Unknown';
  };

  const calculateTotalStats = (stats: EmotionStats[]) => {
    const initialTotals = EMOTION_KEYS.reduce((acc, key) => ({
      ...acc,
      [key]: 0
    }), {} as Record<EmotionKey, number>);

    return stats.reduce((totals, stat) => ({
      totalBefore: EMOTION_KEYS.reduce((acc, key) => ({
        ...acc,
        [key]: (totals.totalBefore[key] || 0) + (stat.before[key] || 0)
      }), {...initialTotals}),
      totalAfter: EMOTION_KEYS.reduce((acc, key) => ({
        ...acc,
        [key]: (totals.totalAfter[key] || 0) + (stat.after[key] || 0)
      }), {...initialTotals})
    }), { totalBefore: initialTotals, totalAfter: initialTotals });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <ThemedText style={styles.title}>Estadísticas de sesión</ThemedText>

      {/* Gráfico General */}
      {stats.length > 0 && (
        <ThemedView style={styles.statCard}>
          <ThemedText style={[styles.studentName, { textAlign: 'center' }]}>
            Estadísticas Generales
          </ThemedText>
          <View style={styles.chartContainer}>
            <ThemedText style={{ fontWeight: "bold", marginBottom: 4 }}>Before</ThemedText>
            <BarChart
              data={{
                labels: Array.from(EMOTION_LABELS),
                datasets: [{
                  data: EMOTION_KEYS.map(key => calculateTotalStats(stats).totalBefore[key])
                }]
              }}
              width={Dimensions.get('window').width - 40}
              height={110}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              showBarTops={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              chartConfig={{
                ...commonChartConfig,
                color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`
              }}
              style={{
                marginVertical: 4,
                borderRadius: 8,
                paddingRight: 0,
                paddingLeft: 0,
              }}
              withCustomBarColorFromData={false}
              flatColor={true}
            />
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get('window').width - 40,
                marginTop: -8,
                marginBottom: 8,
              }}
            >
              {EMOTION_LABELS.map((label, i) => (
                <View
                  key={label}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <ThemedText style={{ fontSize: 12, textAlign: "center" }}>
                    {label}
                  </ThemedText>
                </View>
              ))}
            </View>
            <ThemedText style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>After</ThemedText>
            <BarChart
              data={{
                labels: Array.from(EMOTION_LABELS),
                datasets: [{
                  data: EMOTION_KEYS.map(key => calculateTotalStats(stats).totalAfter[key])
                }]
              }}
              width={Dimensions.get('window').width - 40}
              height={110}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              showBarTops={false}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              chartConfig={{
                ...commonChartConfig,
                color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`
              }}
              style={{
                marginVertical: 4,
                borderRadius: 8,
                paddingRight: 0,
                paddingLeft: 0,
              }}
              withCustomBarColorFromData={false}
              flatColor={true}
            />
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get('window').width - 40,
                marginTop: -8,
                marginBottom: 8,
              }}
            >
              {EMOTION_LABELS.map((label, i) => (
                <View
                  key={label}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <ThemedText style={{ fontSize: 12, textAlign: "center" }}>
                    {label}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </ThemedView>
      )}

      <ThemedText style={[styles.title, { textAlign: 'center', marginTop: 5, marginBottom :30 ,fontSize: 18 }]}>
        Estadísticas por Estudiante
      </ThemedText>

      {/* Gráficos por estudiante */}
      {stats.map((stat, index) => {
        const beforeValues = EMOTION_KEYS.map((e) => stat.before[e] ?? 0);
        const afterValues = EMOTION_KEYS.map((e) => stat.after[e] ?? 0);
        const hasData = beforeValues.some((v) => v > 0) || afterValues.some((v) => v > 0);

        if (!hasData) {
          return (
            <ThemedView key={index} style={styles.statCard}>
              <ThemedText style={styles.studentName}>
                {getStudentName(stat.student_id)}
              </ThemedText>
              <ThemedText>No emotion data to display.</ThemedText>
            </ThemedView>
          );
        }

        return (
          <ThemedView key={index} style={styles.statCard}>
            <ThemedText style={styles.studentName}>
              {getStudentName(stat.student_id)}
            </ThemedText>
            <View style={styles.chartContainer}>
              <ThemedText style={{ fontWeight: "bold", marginBottom: 4 }}>Before</ThemedText>
              <BarChart
                data={{
                  labels: Array.from(EMOTION_LABELS),
                  datasets: [
                    {
                      data: beforeValues,
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 40}
                height={110}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero
                showBarTops={false}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                chartConfig={{
                  ...commonChartConfig,
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                }}
                style={{
                  marginVertical: 4,
                  borderRadius: 8,
                  paddingRight: 0,
                  paddingLeft: 0,
                }}
                withCustomBarColorFromData={false}
                flatColor={true}
              />
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get('window').width - 40,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                {EMOTION_LABELS.map((label, i) => (
                  <View
                    key={label}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <ThemedText style={{ fontSize: 12, textAlign: "center" }}>
                      {label}
                    </ThemedText>
                  </View>
                ))}
              </View>
              <ThemedText style={{ fontWeight: "bold", marginTop: 8, marginBottom: 4 }}>After</ThemedText>
              <BarChart
                data={{
                  labels: Array.from(EMOTION_LABELS),
                  datasets: [
                    {
                      data: afterValues,
                    },
                  ],
                }}
                width={Dimensions.get('window').width - 40}
                height={110}
                yAxisLabel=""
                yAxisSuffix=""
                fromZero
                showBarTops={false}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                chartConfig={{
                  ...commonChartConfig,
                  color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
                }}
                style={{
                  marginVertical: 4,
                  borderRadius: 8,
                  paddingRight: 0,
                  paddingLeft: 0,
                }}
                withCustomBarColorFromData={false}
                flatColor={true}
              />
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get('window').width - 40,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                {EMOTION_LABELS.map((label, i) => (
                  <View
                    key={label}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    <ThemedText style={{ fontSize: 12, textAlign: "center" }}>
                      {label}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>
          </ThemedView>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  chartContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
});
