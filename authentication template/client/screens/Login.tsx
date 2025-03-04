import React, { useEffect, useRef } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import localStorage from "react-native-expo-localstorage";
import { RootState, useAppDispatch, useAppSelector } from "../store/store";
import { LoginData } from "../services/auth-service";
import { login, reset } from "../store/auth/authSlice";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters"),
  // .required("Password is required"),
});

export const Login = ({ navigation }: any) => {
  const dispatch = useAppDispatch();
  const { user, isError, isSuccess, message } = useAppSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigation, dispatch]);

  const handleRegister = () => {
    navigation.navigate("Register");
  };
  const handleLogin = async ({ email, password }: LoginData) => {
    try {
      const user = { email, password };
      dispatch(login(user)).then(
        (data) =>
          data.meta.requestStatus === "fulfilled" && navigation.navigate("Home")
      );
    } catch (error) {
      console.log("login error :", error);
    }
  };

  if (isError) {
    alert(message);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          handleLogin(values);
          resetForm();
        }}
      >
        {({
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isValid,
          resetForm,
        }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="email"
              keyboardType="email-address"
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={values.email}
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <Button
              title="Login"
              disabled={!isValid}
              onPress={() => {
                handleLogin(values);
                resetForm();
              }}
            />
          </>
        )}
      </Formik>
      <Text style={styles.registerText}>
        Don't have an account?{" "}
        <Text style={styles.registerLink} onPress={handleRegister}>
          Register
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  registerText: {
    marginTop: 10,
    fontSize: 16,
  },
  registerLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red", // You can change the color to your preferred error color
    fontSize: 14, // You can adjust the font size as needed
    marginTop: 5, // Add some spacing from the input field
  },
});
