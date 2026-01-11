import NText from "@/components/global/NText";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CheckCircle, XCircle, TriangleAlert } from "lucide-react-native";
import { screenHeight } from "./Sizes";
import { Colors } from "@/context/ThemeProvider";
import Toast from "react-native-toast-message";

type ToastProps = {
  background?: string;
  color?: string;
  type?: "default" | "success" | "warning" | "error";
};

export const toastConfig = {
  // alertToast: ({
  //   text1 = "No toast message available",
  //   props = {
  //     background: "#666666",
  //     color: "white",
  //     type: "default",
  //   } as ToastProps,
  // }: {
  //   text1?: string;
  //   props?: ToastProps;
  // }) => {
  //   return (
  //     <View style={{ height: screenHeight, backgroundColor: "transparent", width: "100%", justifyContent: "center", alignItems: "center" }}>
  //       <View>
  //         <NText>This will be an alert</NText>
  //       </View>
  //     </View>
  //   );
  // },
  tomatoToast: ({
    text1 = "No toast message available",
    props = {
      background: "#666666",
      color: "white",
      type: "default",
    } as ToastProps,
  }: {
    text1?: string;
    props?: ToastProps;
  }) => {
    return (
      <View
        style={{
          backgroundColor:
            props.type === "success"
              ? "#3bb068"
              : props.type === "warning"
                ? "#E7931C"
                : props.type === "error"
                  ? "#DA4B43"
                  : props.type === "default"
                    ? "#666666"
                    : props.background,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 100,
          paddingHorizontal: 25,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            color: props.color || "white",
            fontSize: 18,
          }}
        >
          {text1}
        </Text>
      </View>
    );
  },
  successToast: ({
    text1 = "Successful!",
    props = {
      background: "#3bb068",
      color: "white",
      type: "success",
    } as ToastProps,
  }: {
    text1?: string;
    props?: ToastProps;
  }) => {
    return (
      <View style={styles.outerContainer}>
        <View style={[styles.toastContainer, { backgroundColor: "#F0EFF0" }]}>
          <View style={[styles.iconContainer, { backgroundColor: "#3bb068" + 30 }]}>
            <CheckCircle color={"#3bb068"} size={40} style={styles.icon} />
          </View>
          <Text style={[styles.text, { color: "#3bb068" }]}>Successful!</Text>
          <Text style={[styles.description]}>{text1}</Text>
          <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor: "#3bb068" }]}
            onPress={() => {
              Toast.hide();
            }}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
  errorToast: ({
    text1 = "Error!",
    props = {
      background: "#DA4B43",
      color: "white",
      type: "error",
    } as ToastProps,
  }: {
    text1?: string;
    props?: ToastProps;
  }) => {
    return (
      <View style={styles.outerContainer}>
        <View style={[styles.toastContainer, { backgroundColor: "#F0EFF0" }]}>
          <View style={[styles.iconContainer, { backgroundColor: "#db2500" + 30 }]}>
            <XCircle color={"#db2500"} size={40} style={styles.icon} />
          </View>
          <Text style={[styles.text, { color: "#db2500" }]}>Error!</Text>
          <Text style={[styles.description]}>{text1}</Text>
          <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor: "#db2500" }]}
            onPress={() => {
              Toast.hide();
            }}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
  warningToast: ({
    text1 = "Warning!",
    props = {
      background: "#E7931C",
      color: "white",
      type: "warning",
    } as ToastProps,
  }: {
    text1?: string;
    props?: ToastProps;
  }) => {
    return (
      <View style={styles.outerContainer}>
        <View style={[styles.toastContainer, { backgroundColor: "#F0EFF0" }]}>
          <View style={[styles.iconContainer, { backgroundColor: "#E7931C" + 30 }]}>
            <TriangleAlert color={"#E7931C"} size={40} style={styles.icon} />
          </View>
          <Text style={[styles.text, { color: "#E7931C" }]}>Warning!</Text>
          <Text style={[styles.description]}>{text1}</Text>
          <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor: "#E7931C" }]}
            onPress={() => {
              Toast.hide();
            }}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  toastContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#666666",
    width: "60%",
    minHeight: 200,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  text: {
    fontSize: 24,
    marginLeft: 10,
    color: Colors.heading,
    fontWeight: "bold",
    marginBottom: -5,
  },
  icon: {},
  outerContainer: {
    height: screenHeight,
    width: "100%",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    height: 65,
    width: 65,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  description: {
    color: Colors.body,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingVertical: 10,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
});
