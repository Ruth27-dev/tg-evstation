import { CustomFontConstant, FontSize } from "@/constants/GeneralConstants";
import { useTranslation } from "@/hooks/useTranslation";
import { Colors } from "@/theme";
import { countries, Country } from "@/utils/countries";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
interface Props {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (country: Country) => void;
  editable?: boolean;
}

const CountryPhoneInput: React.FC<Props> = ({
  value,
  onChange,
  onCountryChange,
  editable = true,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const insets = useSafeAreaInsets(); 
  const { currentLanguage, t } = useTranslation();
  
  const handleSelect = (country: Country) => {
    setSelectedCountry(country);
    setModalVisible(false);
    onCountryChange?.(country);
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.flagContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.flag}>{selectedCountry.flag}</Text>
          <Text style={styles.dial}>{selectedCountry.dial_code}</Text>
            <View style={styles.arrow}></View>
        </TouchableOpacity>

        {/* Phone Input */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          keyboardType="phone-pad"
          placeholder={t('auth.phoneNumber')}
          placeholderTextColor={Colors.dividerColor}
          selectionColor={Colors.mainColor}
          maxLength={10}
          editable={editable}
        />
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={[styles.modal,{paddingTop:insets.top}]}>
          <Text style={styles.modalTitle}>Select Country</Text>

          <FlatList
            data={countries}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.countryItem}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.flag}>{item.flag}</Text>
                <Text style={styles.countryName}>{item.name}</Text>
                <Text style={styles.countryCode}>{item.dial_code}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.closeBtn}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default CountryPhoneInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 55,
    borderWidth: 1,
    borderColor: Colors.secondaryColor,
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  flagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  flag: {
    fontSize: 26,
  },
  dial: {
    marginLeft: 6,
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
  },
  input: {
    flex: 1,
    fontSize: FontSize.medium,
    fontFamily: CustomFontConstant.EnRegular,
    height: 55
  },
  modal: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  countryItem: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  countryName: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  countryCode: {
    fontSize: 15,
    color: "#555",
  },
  closeBtn: {
    marginTop: 10,
    padding: 15,
    backgroundColor:Colors.mainColor,
    borderRadius: 10,
  },
  closeText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  arrow:{
    height:30,
    backgroundColor:Colors.mainColor,
    width:1,
    marginLeft:10
  }
});
