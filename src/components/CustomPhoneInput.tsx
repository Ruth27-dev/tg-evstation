import React from "react";
import { View, Text } from "react-native";
import { Controller } from "react-hook-form";
import CountryPhoneInput from "./CountryPhoneInput";
import { Colors } from "@/theme";
import { Country } from "@/utils/countries";

interface Props {
  control: any;
  name: string;
  errors?: any;
  onCountryChange?: (country: Country) => void;
}

const CustomPhoneInput: React.FC<Props> = ({
  control,
  name,
  errors,
  onCountryChange,
}) => {
  return (
    <View style={{ width: "100%" }}>
      <Controller
        control={control}
        name={name}
        rules={{
          required: "ត្រូវការលេខទូរស័ព្ទ",
          minLength: {
            value: 8,
            message: "លេខតូចពេក",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <CountryPhoneInput
            value={value}
            onChange={onChange}
            onCountryChange={onCountryChange}
          />
        )}
      />

      {errors?.[name] && (
        <Text style={{ color: Colors.red, marginTop: 5 }}>
          {errors[name]?.message}
        </Text>
      )}
    </View>
  );
};

export default CustomPhoneInput;
