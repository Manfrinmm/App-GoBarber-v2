import React, { useCallback, useRef } from "react";
import {
  View,
  Image,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useNavigation } from "@react-navigation/native";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import * as Yup from "yup";

import logoImg from "../../assets/logo.png";
import Button from "../../components/Button";
import Input from "../../components/Input";
import api from "../../services/api";
import getValidationErros from "../../utils/getValidationErros";
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  BackToSignIn,
  BackToSignInText,
} from "./styles";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}
const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("O nome é obrigatório."),
          email: Yup.string()
            .email("Digite um e-mail válido.")
            .required("O e-mail é obrigatório."),
          password: Yup.string().min(
            6,
            "A senha deve conter no mínimo 6 dígitos.",
          ),
        });

        await schema.validate(data, { abortEarly: false });

        await api.post("/users", data);
        Alert.alert(
          "Cadastro realizado!",
          `Seu cadastro foi feito, você já pode fazer o login.
Curta o momento (～￣▽￣)～`,
        );
        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          Alert.alert(
            "Erro no formulário",
            "Preencha os dados de forma correta.",
          );

          return;
        }
        Alert.alert(
          "Erro no cadastro",
          "Ocorreu um erro ao fazer o cadastro, cheque os dados.",
        );
      }
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form onSubmit={handleSignUp} ref={formRef}>
              <Input
                name="name"
                icon="user"
                placeholder="Digite seu nome"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  emailRef.current?.focus();
                }}
                blurOnSubmit={false}
              />

              <Input
                ref={emailRef}
                name="email"
                icon="mail"
                placeholder="Digite seu e-mail"
                returnKeyType="next"
                keyboardType="email-address"
                autoCapitalize="none"
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
                blurOnSubmit={false}
              />
              <Input
                ref={passwordRef}
                name="password"
                icon="lock"
                placeholder="Digite sua senha"
                autoCapitalize="none"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Cadastrar
              </Button>
            </Form>

            <ForgotPassword>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignIn;
