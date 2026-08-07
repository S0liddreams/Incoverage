import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

interface Report {
  id: string;
  name: string;
  date: string;
  type: string;
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  status: "processed" | "processing" | "failed";
  thumbnail?: string;
  source: "camera" | "gallery" | "document";
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Blood Test Results",
    date: "10 Mar 2026",
    type: "Blood Panel",
    summary:
      "Your blood test results show normal ranges for most markers. Cholesterol levels are slightly elevated.",
    keyFindings: [
      "Total Cholesterol: 210 mg/dL (High)",
      "Hemoglobin: 14.5 g/dL (Normal)",
      "White Blood Cells: 7.5 x 10^3/µL (Normal)",
      "Platelets: 250 x 10^3/µL (Normal)",
    ],
    recommendations: [
      "Consider dietary changes to reduce cholesterol",
      "Schedule follow-up in 3 months",
      "Increase physical activity",
    ],
    status: "processed",
    source: "document",
  },
  {
    id: "2",
    name: "Chest X-Ray",
    date: "15 Feb 2026",
    type: "Radiology",
    summary:
      "Chest X-ray shows normal heart size and clear lung fields. No signs of infection or masses detected.",
    keyFindings: [
      "Lungs: Clear, no infiltrates",
      "Heart: Normal size and shape",
      "No pleural effusion",
      "No fractures detected",
    ],
    recommendations: [
      "No immediate action needed",
      "Routine follow-up in 6 months",
    ],
    status: "processed",
    source: "document",
  },
];

export default function AIReportReader() {
  const navigation = useNavigation();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Request camera permissions
  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Please grant camera and gallery permissions to use this feature.",
        );
        return false;
      }
      return true;
    }
    return true;
  };

  // Process image with AI (mock function)
  const processImageWithAI = async (
    imageUri: string,
    source: "camera" | "gallery",
  ): Promise<Report> => {
    // Simulate AI processing with progress
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setProcessingProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);

          // Mock AI analysis result
          const mockResult: Report = {
            id: (reports.length + 1).toString(),
            name: source === "camera" ? "Photo Capture" : "Uploaded Image",
            date: new Date().toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            type: "Medical Image",
            summary:
              "Image analysis complete. Our AI has detected the following patterns and values from your medical document. Please consult your healthcare provider for clinical interpretation.",
            keyFindings: [
              "All standard markers appear within normal ranges",
              "No critical abnormalities detected",
              "Results consistent with healthy baseline",
            ],
            recommendations: [
              "Share these results with your healthcare provider",
              "Schedule follow-up if symptoms persist",
              "No urgent action required based on AI analysis",
            ],
            status: "processed",
            thumbnail: imageUri,
            source: source,
          };
          resolve(mockResult);
        }
      }, 200);
    });
  };

  // Handle camera capture
  const handleCameraCapture = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setIsProcessing(true);
      setProcessingProgress(0);

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const processedReport = await processImageWithAI(imageUri, "camera");
        setReports([processedReport, ...reports]);

        Alert.alert(
          "✅ Image Processed!",
          "Your medical image has been analyzed by our AI. The results are ready to view.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture image. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  // Handle gallery selection
  const handleGalleryPick = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      setIsProcessing(true);
      setProcessingProgress(0);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const processedReport = await processImageWithAI(imageUri, "gallery");
        setReports([processedReport, ...reports]);

        Alert.alert(
          "✅ Image Processed!",
          "Your medical image has been analyzed by our AI. The results are ready to view.",
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select image. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  // Handle document upload (PDF, etc.)
  const handleDocumentUpload = async () => {
    try {
      setIsProcessing(true);
      setProcessingProgress(0);

      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "text/*"],
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        // Simulate processing
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setProcessingProgress(progress);
          if (progress >= 100) {
            clearInterval(interval);

            const newReport: Report = {
              id: (reports.length + 1).toString(),
              name: result.name || "Medical Document",
              date: new Date().toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              type: "Medical Document",
              summary:
                "Document analysis complete. Our AI has extracted and analyzed the medical information from this document.",
              keyFindings: [
                "All standard markers within normal ranges",
                "No critical values detected",
                "Results consistent with previous records",
              ],
              recommendations: [
                "Continue with current treatment plan",
                "Routine follow-up recommended",
                "No urgent action required",
              ],
              status: "processed",
              source: "document",
            };
            setReports([newReport, ...reports]);
            setIsProcessing(false);
            Alert.alert(
              "✅ Document Processed!",
              "Your document has been successfully analyzed by AI.",
            );
          }
        }, 200);
      }
    } catch (error) {
      setIsProcessing(false);
      Alert.alert("Error", "Failed to upload document. Please try again.");
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleCloseDetail = () => {
    setSelectedReport(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "#219653";
      case "processing":
        return "#d97706";
      case "failed":
        return "#dc2626";
      default:
        return "#8a9eb0";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processed":
        return "checkmark-circle";
      case "processing":
        return "time";
      case "failed":
        return "warning";
      default:
        return "document-text";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "camera":
        return "camera";
      case "gallery":
        return "images";
      default:
        return "document-text";
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#0b3b5c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Report Reader</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Upload Options */}
        <LinearGradient
          colors={["#0b3b5c", "#146c8f"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.uploadSection}
        >
          <View style={styles.uploadIconContainer}>
            <Icon name="scan" size={32} color="white" />
          </View>
          <Text style={styles.uploadTitle}>Scan or Upload Medical Reports</Text>
          <Text style={styles.uploadSubtitle}>
            Take a photo or upload an image of your lab results, prescriptions,
            or medical documents
          </Text>

          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.processingText}>
                Analyzing image... {processingProgress}%
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${processingProgress}%` },
                  ]}
                />
              </View>
            </View>
          ) : (
            <View style={styles.uploadButtons}>
              <TouchableOpacity
                style={[styles.uploadButton, styles.cameraButton]}
                onPress={handleCameraCapture}
                activeOpacity={0.7}
              >
                <Icon name="camera" size={24} color="white" />
                <Text style={styles.uploadButtonText}>Take Photo</Text>
                <Text style={styles.uploadButtonSubtext}>Fast & easy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, styles.galleryButton]}
                onPress={handleGalleryPick}
                activeOpacity={0.7}
              >
                <Icon name="images" size={24} color="white" />
                <Text style={styles.uploadButtonText}>Choose Image</Text>
                <Text style={styles.uploadButtonSubtext}>From gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.uploadButton, styles.documentButton]}
                onPress={handleDocumentUpload}
                activeOpacity={0.7}
              >
                <Icon name="document-text" size={24} color="white" />
                <Text style={styles.uploadButtonText}>Upload PDF</Text>
                <Text style={styles.uploadButtonSubtext}>Documents</Text>
              </TouchableOpacity>
            </View>
          )}
        </LinearGradient>

        {/* Quick Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>
            <Icon name="bulb" size={16} color="#d97706" /> Quick Tips
          </Text>
          <View style={styles.tipItem}>
            <Icon name="checkmark-circle" size={16} color="#219653" />
            <Text style={styles.tipText}>
              Take a clear photo with good lighting
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="checkmark-circle" size={16} color="#219653" />
            <Text style={styles.tipText}>Include all text in the frame</Text>
          </View>
          <View style={styles.tipItem}>
            <Icon name="checkmark-circle" size={16} color="#219653" />
            <Text style={styles.tipText}>Supported formats: JPG, PNG, PDF</Text>
          </View>
        </View>

        {/* Reports List */}
        {reports.length > 0 && (
          <View style={styles.reportsSection}>
            <Text style={styles.sectionLabel}>YOUR REPORTS</Text>
            {reports.map((report) => (
              <TouchableOpacity
                key={report.id}
                style={styles.reportCard}
                onPress={() => handleViewReport(report)}
                activeOpacity={0.7}
              >
                <View style={styles.reportHeader}>
                  <View style={styles.reportTypeContainer}>
                    <Icon
                      name={getStatusIcon(report.status)}
                      size={18}
                      color={getStatusColor(report.status)}
                    />
                    <Text style={styles.reportName}>{report.name}</Text>
                  </View>
                  <View
                    style={[
                      styles.reportStatus,
                      { backgroundColor: getStatusColor(report.status) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.reportStatusText,
                        { color: getStatusColor(report.status) },
                      ]}
                    >
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.reportMeta}>
                  <Text style={styles.reportDate}>
                    <Icon name="calendar-outline" size={14} color="#8a9eb0" />{" "}
                    {report.date}
                  </Text>
                  <Text style={styles.reportType}>
                    <Icon
                      name={getSourceIcon(report.source)}
                      size={14}
                      color="#8a9eb0"
                    />{" "}
                    {report.source.charAt(0).toUpperCase() +
                      report.source.slice(1)}
                  </Text>
                </View>

                {report.thumbnail && (
                  <View style={styles.thumbnailContainer}>
                    <Image
                      source={{ uri: report.thumbnail }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {report.status === "processed" && (
                  <Text style={styles.reportSummary} numberOfLines={2}>
                    {report.summary}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Report Detail Modal */}
      {selectedReport && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedReport.name}</Text>
              <TouchableOpacity onPress={handleCloseDetail}>
                <Icon name="close" size={24} color="#6a7f92" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Preview Image */}
              {selectedReport.thumbnail && (
                <View style={styles.modalImageContainer}>
                  <Image
                    source={{ uri: selectedReport.thumbnail }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                  <View style={styles.modalImageBadge}>
                    <Icon
                      name={getSourceIcon(selectedReport.source)}
                      size={14}
                      color="white"
                    />
                    <Text style={styles.modalImageBadgeText}>
                      {selectedReport.source.charAt(0).toUpperCase() +
                        selectedReport.source.slice(1)}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.modalMeta}>
                <Text style={styles.modalDate}>
                  <Icon name="calendar-outline" size={16} color="#8a9eb0" />{" "}
                  {selectedReport.date}
                </Text>
                <Text style={styles.modalType}>
                  <Icon name="folder-outline" size={16} color="#8a9eb0" />{" "}
                  {selectedReport.type}
                </Text>
              </View>

              <Text style={styles.modalSectionTitle}>AI Summary</Text>
              <View style={styles.modalSummaryCard}>
                <Text style={styles.modalSummaryText}>
                  {selectedReport.summary}
                </Text>
              </View>

              <Text style={styles.modalSectionTitle}>Key Findings</Text>
              {selectedReport.keyFindings.map((finding, index) => (
                <View key={index} style={styles.findingItem}>
                  <Icon name="chevron-forward" size={16} color="#0b3b5c" />
                  <Text style={styles.findingText}>{finding}</Text>
                </View>
              ))}

              <Text style={styles.modalSectionTitle}>Recommendations</Text>
              {selectedReport.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Icon name="checkmark-circle" size={16} color="#219653" />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleCloseDetail}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f7fc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eef4f9",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  uploadSection: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: 16,
  },
  uploadButtons: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  uploadButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  cameraButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  galleryButton: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  documentButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  uploadButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "700",
  },
  uploadButtonSubtext: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 10,
  },
  processingContainer: {
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
  },
  processingText: {
    color: "white",
    fontSize: 14,
    marginTop: 8,
    fontWeight: "600",
  },
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6fcf97",
    borderRadius: 3,
  },
  tipsSection: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0b1a2e",
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 3,
  },
  tipText: {
    fontSize: 13,
    color: "#4a5f72",
  },
  reportsSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#8a9eb0",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 22,
  },
  reportCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 10,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  reportTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reportName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  reportStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reportStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  reportMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 6,
  },
  reportDate: {
    fontSize: 13,
    color: "#8a9eb0",
  },
  reportType: {
    fontSize: 13,
    color: "#8a9eb0",
  },
  thumbnailContainer: {
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f3f7fc",
  },
  thumbnail: {
    width: "100%",
    height: 120,
  },
  reportSummary: {
    fontSize: 13,
    color: "#4a5f72",
    lineHeight: 20,
    marginTop: 4,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0b1a2e",
    flex: 1,
  },
  modalImageContainer: {
    position: "relative",
    backgroundColor: "#f3f7fc",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  modalImage: {
    width: "100%",
    height: 200,
  },
  modalImageBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  modalImageBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },
  modalMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  modalDate: {
    fontSize: 14,
    color: "#8a9eb0",
  },
  modalType: {
    fontSize: 14,
    color: "#8a9eb0",
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0b1a2e",
    marginTop: 12,
    marginBottom: 8,
  },
  modalSummaryCard: {
    backgroundColor: "#f3f7fc",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eef4f9",
  },
  modalSummaryText: {
    fontSize: 14,
    color: "#0b1a2e",
    lineHeight: 22,
  },
  findingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  findingText: {
    fontSize: 14,
    color: "#4a5f72",
    flex: 1,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  recommendationText: {
    fontSize: 14,
    color: "#4a5f72",
    flex: 1,
  },
  doneButton: {
    backgroundColor: "#0b3b5c",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  doneButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
