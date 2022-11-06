import React from "react";
import { View, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { HelperText, Text, TextInput } from "react-native-paper";
import Select2 from "react-select2-native";

const FormSelect = ({ control, name, rules = {}, label, data }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={{ marginVertical: 5, flexDirection: "column" }}>
          <Text>{label}</Text>
          <View
            style={[
              styles.container,
              { borderColor: error ? "red" : "#e8e8e8" },
            ]}
          >
            <Select2
              colorTheme={"black"}
              isSelectSingle
              style={{ height: 50, borderRadius: 5 }}
              popupTitle={"Select " + label}
              title={"Select " + label}
              data={data}
              value={value}
              onSelect={(data) => onChange(data[0])}
            />

            {error && (
              <HelperText type="error">{error.message || "Error"}</HelperText>
            )}
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 5,
  },
});

export default FormSelect;
