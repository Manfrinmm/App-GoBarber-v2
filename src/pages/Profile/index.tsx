import React, { useCallback, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  PermissionsAndroid,
} from "react-native";
import ImagePicker, {
  ImagePickerCustomButtonOptions,
} from "react-native-image-picker";
import Icon from "react-native-vector-icons/Feather";

import { useNavigation } from "@react-navigation/native";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/mobile";
import * as Yup from "yup";

import Button from "../../components/Button";
import Input from "../../components/Input";
import { useAuth } from "../../hooks/auth";
import api from "../../services/api";
import getValidationErros from "../../utils/getValidationErros";
import {
  Container,
  BackButton,
  UserAvatarButton,
  UserAvatar,
  Title,
  LogoutButton,
} from "./styles";

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

interface AvatarPreviewData {
  name?: string;
  type?: string;
  uri: string;
}

const Profile: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<AvatarPreviewData>();

  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailRef = useRef<TextInput>(null);
  const oldPasswordRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("O nome é obrigatório."),
          email: Yup.string()
            .email("Digite um e-mail válido.")
            .required("O e-mail é obrigatório."),
          old_password: Yup.string(),
          password: Yup.string().when("old_password", {
            is: value => !!value.length,
            then: Yup.string().min(
              6,
              "A senha deve conter no mínimo 6 dígitos.",
            ),
          }),
          password_confirmation: Yup.string()
            .when("old_password", {
              is: value => !!value.length,
              then: Yup.string().min(
                6,
                "A senha deve conter no mínimo 6 dígitos.",
              ),
            })
            .oneOf([Yup.ref("password")], "As senhas devem ser iguais"),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put("/profile", formData);

        await updateUser(response.data);

        console.log("avatarPreview", avatarPreview);

        if (avatarPreview?.uri) {
          const dataAvatar = new FormData();
          dataAvatar.append("file", {
            uri: avatarPreview.uri,
          });

          console.log("dataAvatar", dataAvatar);

          const AvatarResponse = await api.put("/users/avatar", dataAvatar);

          console.log("AvatarResponse", AvatarResponse);
          await updateUser(AvatarResponse.data);
        }

        Alert.alert(
          "Perfil atualizado!",
          "Seu perfil foi atualizado.\n\nCurta o momento (～￣▽￣)～",
        );

        navigation.goBack();
      } catch (err) {
        console.log(err);

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
          "Erro na atualização do perfil",
          "Ocorreu um erro ao atualizar seu perfil, tente novamente.",
        );
      }
    },
    [navigation, updateUser, avatarPreview],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleLogout = useCallback(() => {
    signOut();
  }, [signOut]);

  const handleUpdateAvatar = useCallback(async () => {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);

    ImagePicker.showImagePicker(
      {
        title: "Selecione um avatar",
        cancelButtonTitle: "Cancelar",
        allowsEditing: true,
        takePhotoButtonTitle: "Usar camera",
        chooseFromLibraryButtonTitle: "Escolher da galeria",
        customButtons: [
          avatarPreview
            ? { name: "restorePhoto", title: "Restaurar foto" }
            : { name: "removoPhoto", title: "Remover foto" },
        ],
        permissionDenied: {
          title: "Permissão necessária",
          text:
            "É necessário permitir acesso da Câmera e Memória do dispositivo",
          okTitle: "Não permitir",
          reTryTitle: "Ir para as configurações",
        },
        tintColor: "#7159c1",
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.customButton === "restorePhoto") {
          setAvatarPreview(undefined);
        }

        if (response.error) {
          Alert.alert(
            "Erro ao atualizar seu avatar.",
            "Provavelmente pode ser algum problema com permissões.\n\n" +
              "Por favor, verifique as permissões de acesso da Câmera e Memória dessa aplicação.",
          );
        }

        const { fileName: name, type, uri } = response;

        setAvatarPreview({
          name,
          type,
          uri,
        });
      },
    );
  }, [avatarPreview]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar
                source={{
                  uri: avatarPreview?.uri || user.avatar_url,
                }}
              />
            </UserAvatarButton>
            <View>
              <Title>Meu perfil</Title>
            </View>
            <Form onSubmit={handleSubmit} ref={formRef} initialData={user}>
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
                  oldPasswordRef.current?.focus();
                }}
                blurOnSubmit={false}
              />

              <Input
                ref={oldPasswordRef}
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                autoCapitalize="none"
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
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
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordRef.current?.focus();
                }}
                blurOnSubmit={false}
              />
              <Input
                ref={confirmPasswordRef}
                name="password_confirmation"
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
                Confirmar mudanças
              </Button>
              <LogoutButton onPress={handleLogout}>
                Sair da aplicação
              </LogoutButton>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
