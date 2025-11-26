import {useState, useRef, useCallback} from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import {Controller} from 'react-hook-form';
import { CustomFontConstant, FontSize } from '../constants/GeneralConstants';
import { Colors } from '../theme';

type CustomInputTextProps = {
  placeHolderText?: string;
  isPassword?: boolean;
  labelText?: string;
  isRightIcon?: boolean;
  isLeftIcon?: boolean;
  onChangeTextValue?: (text: string) => void;
  renderRightIcon?: React.ReactNode;
  renderLeftIcon?: React.ReactNode;
  keyboardType?:
    | 'default'
    | 'email-address'
    | 'numeric'
    | 'phone-pad'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search';
  control?: any;
  name: string;
  errors?: any;
  required?: boolean;
  editable?: boolean;
};

function CustomInputText(props: CustomInputTextProps) {
  const textFieldRef = useRef<TextInput | null>(null);

  const {
    placeHolderText,
    isPassword,
    labelText,
    isRightIcon,
    renderRightIcon,
    keyboardType,
    control,
    name,
    errors,
    required,
    isLeftIcon,
    renderLeftIcon
  } = props;
  return (
    <>
      <View
        style={[
          styles.inputContainer,
          {backgroundColor:Colors.white,borderColor: errors?.[name] ? Colors.red : Colors.secondaryColor,},
        ]}>
        {isLeftIcon && (
          <View style={[styles.iconContainer,{marginRight: 10,marginLeft:0}]}>{renderLeftIcon}</View>
        )}
        <Controller
          control={control}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              ref={textFieldRef}
              style={[
                styles.input,
                {
                  borderColor: errors?.[name] ? Colors.red : Colors.white,
                  flex: 1,
                  color: Colors.mainColor,
                },
              ]}
              onChangeText={text => {
                onChange(text);
                if (props.onChangeTextValue) {
                  props.onChangeTextValue(text);
                }
              }}
              onBlur={onBlur}
              value={value}
              placeholder={placeHolderText || ''}
              secureTextEntry={isPassword}
              placeholderTextColor={Colors.dividerColor}
              selectionColor={Colors.mainColor}
              keyboardType={keyboardType}
              autoCapitalize="none"
              editable={props.editable !== false}
            />
          )}
          name={name}
        />
        {errors?.[name] && <Text style={{ color: Colors.red }}>{errors?.[name]?.message}</Text>}
        {isRightIcon && (
          <View style={styles.iconContainer}>{renderRightIcon}</View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dividerColor,
    borderRadius: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  input: {
    height: 55,
    borderRadius: 10,
    backgroundColor: Colors.white,
    fontFamily: CustomFontConstant.Khmer,
    fontSize: FontSize.medium,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default CustomInputText;
