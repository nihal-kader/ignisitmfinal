import React from "react";
import { View, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { HelperText, Text, TextInput } from "react-native-paper";

const FormInput = ({ control, name, rules = {}, label, secureTextEntry }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <View
          style={[styles.container, { borderColor: error ? "red" : "#e8e8e8" }]}
        >
          <TextInput
            mode="outlined"
            outlineColor={error && "red"}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            label={label}
            secureTextEntry={secureTextEntry}
          />
          {error && (
            <HelperText type="error">{error.message || "Error"}</HelperText>
          )}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 5,
  },
});

export default FormInput;
