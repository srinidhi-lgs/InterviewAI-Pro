import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Note: Register fonts if needed. We'll use standard fonts for simplicity.
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#333333',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5', // Indigo-600
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaBox: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 4,
  },
  metaLabel: {
    fontSize: 9,
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 5,
    color: '#111827',
  },
  scoreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  scoreCard: {
    width: '30%',
    marginRight: '3%',
    marginBottom: 10,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    marginLeft: 10,
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 3,
  },
  questionBlock: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
    breakInside: 'avoid',
  },
  questionLabel: {
    fontSize: 9,
    color: '#4F46E5',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  questionText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: 'bold',
    marginTop: 6,
    marginBottom: 2,
  },
  answerText: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  aiFeedbackText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#047857', // Emerald-700
    backgroundColor: '#ECFDF5',
    padding: 5,
    marginTop: 5,
    borderRadius: 2,
  },
  suggestedText: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#1D4ED8', // Blue-700
    backgroundColor: '#EFF6FF',
    padding: 5,
    marginTop: 5,
    borderRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 9,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 9,
    color: '#9CA3AF',
  }
});

export const InterviewReportDocument = ({ report }: { report: any }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>InterviewAI Pro</Text>
          <Text style={styles.subtitle}>Detailed AI Interview Report</Text>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Role</Text>
            <Text style={styles.metaValue}>{report.jobRole}</Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Interview Type</Text>
            <Text style={styles.metaValue}>{report.interviewType} / {report.difficulty}</Text>
          </View>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{new Date(report.completedAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Duration / Questions</Text>
            <Text style={styles.metaValue}>
              {Math.floor(report.interviewDurationSeconds / 60)}m {report.interviewDurationSeconds % 60}s / {report.questionsAnswered} answered
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Performance Summary</Text>
        
        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Overall Score</Text>
            <Text style={[styles.scoreValue, { color: report.overallScore >= 90 ? '#059669' : report.overallScore >= 75 ? '#2563EB' : report.overallScore >= 60 ? '#D97706' : '#DC2626' }]}>
              {report.overallScore}/100
            </Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Hiring Rec</Text>
            <Text style={styles.scoreValue}>{report.hiringRecommendation}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Technical</Text>
            <Text style={styles.scoreValue}>{report.technicalScore}/100</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Communication</Text>
            <Text style={styles.scoreValue}>{report.communicationScore}/100</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Confidence</Text>
            <Text style={styles.scoreValue}>{report.confidenceScore}/100</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Fluency</Text>
            <Text style={styles.scoreValue}>{report.fluencyScore}/100</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Grammar</Text>
            <Text style={styles.scoreValue}>{report.grammarScore}/100</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Response Quality</Text>
            <Text style={styles.scoreValue}>{report.responseQualityScore}/100</Text>
          </View>
        </View>

        <View style={styles.metaContainer}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Key Strengths</Text>
            <View style={styles.list}>
              {report.strengths?.map((strength: string, i: number) => (
                <Text key={i} style={styles.listItem}>• {strength}</Text>
              ))}
            </View>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Areas for Improvement</Text>
            <View style={styles.list}>
              {report.areasForImprovement?.map((area: string, i: number) => (
                <Text key={i} style={styles.listItem}>• {area}</Text>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Question Analysis</Text>

        {report.questions?.map((q: any, index: number) => (
          <View key={q.id} wrap={false} style={styles.questionBlock}>
            <Text style={styles.questionLabel}>Question {index + 1} • Score: {q.score}/100</Text>
            <Text style={styles.questionText}>{q.question}</Text>
            
            <Text style={styles.answerLabel}>Your Answer:</Text>
            <Text style={styles.answerText}>{q.candidateAnswer}</Text>
            
            <Text style={styles.answerLabel}>AI Feedback:</Text>
            <Text style={styles.aiFeedbackText}>{q.aiFeedback}</Text>
            
            {q.suggestedBetterAnswer && (
              <>
                <Text style={styles.answerLabel}>Suggested Better Answer:</Text>
                <Text style={styles.suggestedText}>{q.suggestedBetterAnswer}</Text>
              </>
            )}
          </View>
        ))}

        <Text style={styles.footer} fixed>
          Generated by InterviewAI Pro • {new Date().toLocaleDateString()}
        </Text>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};
