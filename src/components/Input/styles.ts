import FeatherIcon from "react-native-vector-icons/Feather";

import styled, { css } from "styled-components/native";

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 16px;
  background: #232129;
  border: 2px solid #232129;

  border-radius: 10px;
  margin-bottom: 8px;

  flex-direction: row;
  align-items: center;

  ${props =>
    props.isErrored &&
    css`
      border: 2px solid #c50000;
    `}

  ${props =>
    props.isFocused &&
    css`
      border: 2px solid #f99000;
    `}
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: #fff;
  font-size: 16px;
  font-family: "RobotoSlab-Regular";
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;
