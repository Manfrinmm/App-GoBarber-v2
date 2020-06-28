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
import { useAuth } from "../../hooks/auth";
import getValidationErros from "../../utils/getValidationErros";
import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText,
} from "./styles";

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const passwordRef = useRef<TextInput>(null);

  const navigation = useNavigation();
  const { signIn } = useAuth();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .email("Digite um e-mail válido.")
            .required("O e-mail é obrigatório."),
          password: Yup.string().required("A senha é obrigatório."),
        });

        await schema.validate(data, { abortEarly: false });

        await signIn(data);
        Alert.alert("Deu tudo certo!", "Vida que segue né não?!");
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
          "Erro na autenticação",
          "Ocorreu um erro ao fazer login, cheque as credenciais.",
        );
      }
    },
    [signIn],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Faça seu Logon</Title>
            </View>

            <Form onSubmit={handleSignIn} ref={formRef}>
              <Input
                name="email"
                icon="mail"
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
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
                secureTextEntry
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
                Entrar
              </Button>
            </Form>
            <ForgotPassword>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton
        onPress={() => {
          navigation.navigate("SignUp");
        }}
      >
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar minha conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
