import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Chidi Okonkwo",
    email: "chidi.okonkwo@email.com",
    phone: "+234 803 456 7890",
    address: "Lagos, Nigeria",
    dateOfBirth: "15/06/1990",
    gender: "Male",
    policyNumber: "NHIS/2021/0048291",
    hmo: "Hygeia HMO Ltd",
  });

  const [tempData, setTempData] = useState(userData);

  const handleSave = () => {
    setUserData(tempData);
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleCancel = () => {
    setTempData(userData);
    setIsEditing(false);
  };

  const ProfileField = ({ label, value, field, editable = true }: any) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing && editable ? (
        <TextInput
          style={styles.fieldInput}
          value={tempData[field]}
          onChangeText={(text) => setTempData({ ...tempData, [field]: text })}
          placeholderTextColor="#8a9eb0"
        />
      ) : (
        <Text style={styles.fieldValue}>{value || "Not provided"}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#0b3b5c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
              setTempData(userData);
            }
          }}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Avatar */}
        <View style={styles.avatarSection}>
          <LinearGradient
            colors={["#0b3b5c", "#146c8f"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarLarge}
          >
            <Text style={styles.avatarLargeText}>
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          </LinearGradient>
          {isEditing && (
            <TouchableOpacity style={styles.changePhotoButton}>
              <Icon name="camera" size={16} color="white" />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldsCard}>
          <ProfileField
            label="Full Name"
            value={userData.name}
            field="name"
            editable={isEditing}
          />
          <ProfileField
            label="Email Address"
            value={userData.email}
            field="email"
            editable={isEditing}
          />
          <ProfileField
            label="Phone Number"
            value={userData.phone}
            field="phone"
            editable={isEditing}
          />
          <ProfileField
            label="Address"
            value={userData.address}
            field="address"
            editable={isEditing}
          />
          <ProfileField
            label="Date of Birth"
            value={userData.dateOfBirth}
            field="dateOfBirth"
            editable={isEditing}
          />
          <ProfileField
            label="Gender"
            value={userData.gender}
            field="gender"
            editable={isEditing}
          />
        </View>

        {/* Policy Information */}
        <Text style={styles.sectionLabel}>POLICY INFORMATION</Text>
        <View style={styles.fieldsCard}>
          <ProfileField
            label="Policy Number"
            value={userData.policyNumber}
            field="policyNumber"
            editable={false}
          />
          <ProfileField
            label="Assigned HMO"
            value={userData.hmo}
            field="hmo"
            editable={false}
          />
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel Changes</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footerSpace} />
      </ScrollView>
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
    fontSize: 20,
    fontWeight: "700",
    color: "#0b1a2e",
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#0b3b5c",
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0b3b5c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarLargeText: {
    color: "white",
    fontSize: 36,
    fontWeight: "800",
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#eef4f9",
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0b3b5c",
  },
  fieldsCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#eef4f9",
    marginBottom: 16,
  },
  fieldContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f5f8",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8a9eb0",
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0b1a2e",
  },
  fieldInput: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0b1a2e",
    borderWidth: 1,
    borderColor: "#e6edf4",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#8a9eb0",
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 22,
  },
  cancelButton: {
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#dc2626",
    alignItems: "center",
    marginBottom: 16,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#dc2626",
  },
  footerSpace: {
    height: 24,
  },
});
