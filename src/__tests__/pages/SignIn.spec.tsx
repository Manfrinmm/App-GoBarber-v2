import "react-native";
import React from "react";
import { render } from "react-native-testing-library";

import SignIn from "../../pages/SignIn";

jest.mock("@react-navigation/native", () => {
  return { useNavigation: jest.fn() };
});

describe("SignIn page", () => {
  it("renders correctly", () => {
    const { getByPlaceholder } = render(<SignIn />);

    expect(getByPlaceholder("Digite seu e-mail")).toBeTruthy();
    expect(getByPlaceholder("Digite sua senha")).toBeTruthy();
  });
});
