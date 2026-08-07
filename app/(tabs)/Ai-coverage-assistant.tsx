import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const suggestedQuestions = [
  "What does NHIS cover?",
  "How do I file a claim?",
  "Why was my claim denied?",
  "How to appeal a denial?",
  "What are my rights as a patient?",
];

const mockResponses: Record<string, string> = {
  "What does NHIS cover?":
    "NHIS covers a wide range of services including:\n\n• Outpatient consultations\n• Inpatient care (hospital stays)\n• Maternity services\n• Emergency care\n• Prescribed medications\n• Diagnostic tests\n• Preventive care\n\nCoverage may vary by plan type and HMO.",
  "How do I file a claim?":
    "To file a claim:\n\n1. Visit any NHIS-accredited hospital\n2. Present your NHIS membership card\n3. The hospital will submit the claim on your behalf\n4. You will only pay for any uncovered services\n\nYou can also file directly through your HMO's portal.",
  "Why was my claim denied?":
    "Common reasons for claim denials:\n\n• Procedure not covered by your plan\n• Treatment at non-accredited facility\n• Missing pre-authorization\n• Expired policy\n• Incorrect patient information\n• Service not medically necessary\n\nContact your HMO for specific details.",
  "How to appeal a denial?":
    "Appealing a denial:\n\n1. Review the denial letter carefully\n2. Contact your HMO for explanation\n3. Gather supporting documents\n4. Submit appeal within 30 days\n5. Follow up with NHIS if needed\n\nOur AI can help draft your appeal letter!",
  "What are my rights as a patient?":
    "Your rights as an NHIS patient:\n\n• Right to quality healthcare\n• Right to choose accredited provider\n• Right to information on coverage\n• Right to confidentiality\n• Right to complain/appeal\n• Right to second opinion\n• Right to continuity of care",
};

export default function AICoverageAssistant() {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI Coverage Assistant. Ask me anything about your NHIS coverage, claims, or policies.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(
      () => {
        const response = getAIResponse(inputText.trim());
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
      },
      1000 + Math.random() * 1500,
    );
  };

  const getAIResponse = (question: string): string => {
    // Check for exact match
    for (const [key, value] of Object.entries(mockResponses)) {
      if (question.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    // Default response
    return "I understand you're asking about your NHIS coverage. Let me help you with that.\n\nCould you please clarify your question? I can assist with:\n\n• Coverage details\n• Claims process\n• Denial appeals\n• Patient rights\n• Policy information\n\nJust ask me anything!";
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    // Auto-send after a small delay
    setTimeout(() => handleSend(), 300);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Coverage Assistant</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.chatContainer}>
          <ScrollView
            ref={(ref) => ref?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContainer}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageWrapper,
                  message.isUser
                    ? styles.userMessageWrapper
                    : styles.aiMessageWrapper,
                ]}
              >
                {!message.isUser && (
                  <View style={styles.aiAvatar}>
                    <Icon name="chatbubble" size={16} color="white" />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.isUser ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.isUser
                        ? styles.userMessageText
                        : styles.aiMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      message.isUser ? styles.userTime : styles.aiTime,
                    ]}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </View>
            ))}

            {isLoading && (
              <View style={styles.loadingWrapper}>
                <View style={styles.aiAvatar}>
                  <Icon name="chatbubble" size={16} color="white" />
                </View>
                <View style={styles.loadingBubble}>
                  <View style={styles.loadingDot} />
                  <View style={[styles.loadingDot, styles.loadingDotDelay]} />
                  <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
                </View>
              </View>
            )}
          </ScrollView>

          {/* Suggested Questions */}
          {messages.length < 3 && (
            <View style={styles.suggestedContainer}>
              <Text style={styles.suggestedTitle}>Ask me about:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestedScroll}
              >
                {suggestedQuestions.map((q) => (
                  <TouchableOpacity
                    key={q}
                    style={styles.suggestedChip}
                    onPress={() => handleSuggestedQuestion(q)}
                  >
                    <Text style={styles.suggestedChipText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ask about your coverage..."
                placeholderTextColor="#8a9eb0"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={handleSend}
                disabled={!inputText.trim() || isLoading}
              >
                <Icon
                  name="send"
                  size={20}
                  color={inputText.trim() ? "white" : "#c0c8d4"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eef4f9",
  },
  backButton: {
    padding: 4,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#219653",
  },
  statusText: {
    fontSize: 11,
    color: "#8a9eb0",
    fontWeight: "500",
  },
  keyboardView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  messageWrapper: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  aiMessageWrapper: {
    justifyContent: "flex-start",
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0b3b5c",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: "#0b3b5c",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#eef4f9",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userMessageText: {
    color: "white",
  },
  aiMessageText: {
    color: "#0b1a2e",
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  userTime: {
    color: "rgba(255,255,255,0.6)",
  },
  aiTime: {
    color: "#8a9eb0",
  },
  loadingWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  loadingBubble: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#eef4f9",
    gap: 4,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8a9eb0",
    opacity: 0.6,
  },
  loadingDotDelay: {
    opacity: 0.4,
  },
  loadingDotDelay2: {
    opacity: 0.2,
  },
  suggestedContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  suggestedTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8a9eb0",
    marginBottom: 6,
  },
  suggestedScroll: {
    gap: 8,
    paddingRight: 16,
  },
  suggestedChip: {
    backgroundColor: "white",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e6edf4",
  },
  suggestedChipText: {
    fontSize: 13,
    color: "#0b3b5c",
    fontWeight: "500",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eef4f9",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f3f7fc",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e6edf4",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#0b1a2e",
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0b3b5c",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    backgroundColor: "#eef4f9",
  },
});
