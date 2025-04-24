import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, ActivityIndicator } from 'react-native';
import { useSession } from '@/context/SessionContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams } from 'expo-router';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useAuth } from '@/context/AuthContext';

export default function StatsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getSessionStats } = useSession();
    const { students, loadStudents } = useAuth();
    type EmotionStats = {
        student_id: string;
        before: Record<string, number>;
        after: Record<string, number>;
    };

    const [stats, setStats] = useState<EmotionStats[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const emotion_types = ['happy', 'sad', 'angry', 'surprised', 'neutral'];

    useEffect(() => {
        const initializeData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                await loadStudents();
                if (id) {
                    const data = await getSessionStats(id);
                    setStats(data);

                    
                    const table = data.map(stat => {
                        const row: Record<string, any> = {
                            student: getStudentName(stat.student_id),
                        };
                        for (const emotion of emotion_types) {
                            row[emotion] = stat.after[emotion] || 0;
                        }
                        return row;
                    });
                    
                    console.log("Tabla de emociones AFTER por estudiante:");
                    console.table(table);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                setError('Failed to load data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, [id, loadStudents]);

    const getStudentName = (student_id: string) => {
        const student = students.find(s => s.id === student_id);
        return student ? `${student.name} ${student.last_name}` : 'Unknown';
    };

    if (isLoading) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </ThemedView>
        );
    }

    if (error) {
        return (
            <ThemedView style={[styles.container, styles.centerContent]}>
                <ThemedText>{error}</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
        >
            <ThemedText style={styles.title}>Estadísticas de sesión</ThemedText>

            {stats.map((stat, index) => (
                <ThemedView key={index} style={styles.statCard}>
                    <ThemedText style={styles.studentName}>
                        {getStudentName(stat.student_id)}
                    </ThemedText>

                    <View style={styles.chartContainer}>
                        <BarChart
                            data={{
                                labels: emotion_types,
                                datasets: [
                                    {
                                        data: emotion_types.map(emotion => stat.before[emotion] || 0),
                                        color: (opacity = 1) => `rgba(71, 130, 218, ${opacity})`
                                    },
                                    {
                                        data: emotion_types.map(emotion => stat.after[emotion] || 0),
                                        color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`
                                    }
                                ]
                            }}
                            width={Dimensions.get('window').width - 40}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                backgroundColor: '#ffffff',
                                backgroundGradientFrom: '#ffffff',
                                backgroundGradientTo: '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                barPercentage: 0.8
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16
                            }}
                            showValuesOnTopOfBars={true}
                            fromZero={true}
                            withInnerLines={true}
                            segments={4}
                        />
                    </View>

                </ThemedView>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    statCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
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
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
