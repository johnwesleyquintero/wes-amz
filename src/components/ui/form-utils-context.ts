import { createContext } from "react";

interface FormFieldContextProps {
  name: string;
}

export const FormFieldContext = createContext<FormFieldContextProps>({
  name: "",
});
export const FormItemContext = createContext<{ id: string }>({ id: "" });
