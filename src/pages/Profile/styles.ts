import styled from "styled-components/native";

import Button from "../../components/Button";

export const Container = styled.View`
  flex: 1;

  justify-content: flex-start;

  padding: 0 30px 40px;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: 40px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin-top: 32px;
`;

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: "RobotoSlab-Medium";
  margin: 24px 0;
`;

export const LogoutButton = styled(Button)`
  margin-top: 16px;
  background: #cc3000;
  color: #f4ede8;
`;
